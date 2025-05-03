import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../src/pages/api/generations';
import { AIGenerationService } from '../../src/lib/services/ai-generation.service';
import { FlashcardSource } from '../../src/types';
import type { GeneratedFlashcardDto, GenerationResponseDto } from '../../src/types';

describe('POST /api/generations', () => {
  it('should return 401 if no token is provided', async () => {
    // Given: a context with no Authorization header and no Cookie header,
    // and a supabase client that returns no user/session
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } })
      }
    };
    const context = {
      request: new Request('http://localhost/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input_text: 'Valid input text' })
      }),
      locals: { supabase: fakeSupabase }
    };

    // When: POST is called
    const response = await POST(context as any);

    // Then: response status should be 401 with an 'Unauthorized' error
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('should return 400 if input text is empty', async () => {
    // Given: a context with valid auth but empty input text
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } })
      }
    };
    const context = {
      request: new Request('http://localhost/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ input_text: '' })
      }),
      locals: { supabase: fakeSupabase }
    };

    // When: POST is called
    const response = await POST(context as any);

    // Then: response status should be 400 with validation error
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid input');
    expect(body.details.input_text._errors).toContain('Input text cannot be empty');
  });

  it('should return 400 if input text exceeds maximum length', async () => {
    // Given: a context with valid auth but input text exceeding 10000 characters
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } })
      }
    };
    const longText = 'a'.repeat(10001);
    const context = {
      request: new Request('http://localhost/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ input_text: longText })
      }),
      locals: { supabase: fakeSupabase }
    };

    // When: POST is called
    const response = await POST(context as any);

    // Then: response status should be 400 with validation error
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid input');
    expect(body.details.input_text._errors).toContain('Input text must be 10000 characters or less');
  });

  it('should successfully generate flashcards with valid input', async () => {
    // Given: a context with valid auth and input text
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } })
      }
    };
    const validInput = 'Valid input text for flashcard generation';
    const context = {
      request: new Request('http://localhost/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ input_text: validInput })
      }),
      locals: { supabase: fakeSupabase },
      env: {
        OPENROUTER_API_KEY: 'test-api-key'
      }
    };

    // And: mock AIGenerationService to return generated flashcards
    const mockGeneratedData: GenerationResponseDto = {
      generation_id: 123,
      flashcards: [
        { front: 'Question 1', back: 'Answer 1', source: FlashcardSource.AI_FULL } as GeneratedFlashcardDto,
        { front: 'Question 2', back: 'Answer 2', source: FlashcardSource.AI_FULL } as GeneratedFlashcardDto
      ]
    };
    const generateFlashcardsSpy = vi.spyOn(AIGenerationService.prototype, 'generateFlashcards')
      .mockResolvedValue(mockGeneratedData);

    // When: POST is called
    const response = await POST(context as any);

    // Then: response status should be 200 with generated flashcards
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockGeneratedData);
    expect(generateFlashcardsSpy).toHaveBeenCalledWith(validInput, 'test-user');

    generateFlashcardsSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should handle AI service errors gracefully', async () => {
    // Given: a context with valid auth and input text,
    // but AI service throws an error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } })
      }
    };
    const validInput = 'Valid input text';
    const context = {
      request: new Request('http://localhost/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ input_text: validInput })
      }),
      locals: { supabase: fakeSupabase },
      env: {
        OPENROUTER_API_KEY: 'test-api-key'
      }
    };

    // And: mock AIGenerationService to throw an error
    const generateFlashcardsSpy = vi.spyOn(AIGenerationService.prototype, 'generateFlashcards')
      .mockRejectedValue(new Error('AI service error'));

    // When: POST is called
    const response = await POST(context as any);

    // Then: response status should be 500 with error message
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Failed to generate flashcards');
    expect(body.message).toBe('AI service error');

    generateFlashcardsSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should accept token from cookie when header is missing', async () => {
    // Given: a context with auth token in cookie but not in header
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'cookie-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } })
      }
    };
    const validInput = 'Valid input text';
    const context = {
      request: new Request('http://localhost/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'auth_token=valid-cookie-token'
        },
        body: JSON.stringify({ input_text: validInput })
      }),
      locals: { supabase: fakeSupabase },
      env: {
        OPENROUTER_API_KEY: 'test-api-key'
      }
    };

    // And: mock AIGenerationService to return generated flashcards
    const mockGeneratedData: GenerationResponseDto = {
      generation_id: 456,
      flashcards: [{ front: 'Question', back: 'Answer', source: FlashcardSource.AI_FULL } as GeneratedFlashcardDto]
    };
    const generateFlashcardsSpy = vi.spyOn(AIGenerationService.prototype, 'generateFlashcards')
      .mockResolvedValue(mockGeneratedData);

    // When: POST is called
    const response = await POST(context as any);

    // Then: response status should be 200 with generated flashcards
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockGeneratedData);
    expect(generateFlashcardsSpy).toHaveBeenCalledWith(validInput, 'cookie-user');

    generateFlashcardsSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
}); 