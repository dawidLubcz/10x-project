import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '../../src/pages/api/flashcards';
import { FlashcardService } from '../../src/lib/services/flashcard.service';

// Unit tests for GET /api/flashcards endpoint

describe('GET /api/flashcards', () => {
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
      request: {
        headers: {
          get: (_key: string) => null
        },
        url: 'http://localhost/api/flashcards'
      },
      locals: { supabase: fakeSupabase }
    };

    // When: GET is called
    const response = await GET(context as any);

    // Then: the response should have status 401 with an 'UNAUTHORIZED' error code
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return flashcards successfully with a valid token from header', async () => {
    // Given: a context with a valid Authorization header, a supabase client returning a valid user,
    // and URL query parameters provided
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'unused' } } } })
      }
    };
    const context = {
      request: {
        headers: {
          get: (key: string) => key === 'Authorization' ? 'Bearer valid-token' : null
        },
        url: 'http://localhost/api/flashcards?page=2&limit=5&sort_by=createdAt&filter[source]=api'
      },
      locals: { supabase: fakeSupabase }
    };

    // And: mock FlashcardService.getFlashcards to return a flashcards list object
    const flashcardsMock = {
      flashcards: [
        { id: 1, front: 'Flashcard 1 front', back: 'Flashcard 1 back', user_id: 'test-user-id', created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z', severity: 1 },
        { id: 2, front: 'Flashcard 2 front', back: 'Flashcard 2 back', user_id: 'test-user-id', created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z', severity: 1 }
      ],
      pagination: { page: 2, limit: 5, total: 2 },
      severity: 1
    };
    const getFlashcardsSpy = vi.spyOn(FlashcardService.prototype, 'getFlashcards').mockResolvedValue(flashcardsMock);

    // When: GET is called
    const response = await GET(context as any);

    // Then: response status should be 200 and body should equal the flashcards list object
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(flashcardsMock);
    
    // And: ensure that getFlashcards was called with the correct parameters
    expect(getFlashcardsSpy).toHaveBeenCalledWith('test-user-id', {
      page: 2,
      limit: 5,
      sort_by: 'createdAt',
      filter: { source: 'api' }
    });

    getFlashcardsSpy.mockRestore();
  });

  it('should return flashcards successfully with a valid token from cookie when header is missing', async () => {
    // Given: a context with no Authorization header but with a valid Cookie header,
    // and supabase client returns a valid user based on the token from cookie
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'cookie-user-id' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'unused' } } } })
      }
    };
    const context = {
      request: {
        headers: {
          get: (key: string) => key === 'Cookie' ? 'auth_token=cookie-valid-token' : null
        },
        url: 'http://localhost/api/flashcards'
      },
      locals: { supabase: fakeSupabase }
    };

    // And: mock FlashcardService.getFlashcards to return a flashcards list object
    const flashcardsMock = {
      flashcards: [
        { id: 3, front: 'Flashcard 3 front', back: 'Flashcard 3 back', user_id: 'cookie-user-id', created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z', severity: 1 }
      ],
      pagination: { page: 1, limit: 10, total: 1 },
      severity: 1
    };
    const getFlashcardsSpy = vi.spyOn(FlashcardService.prototype, 'getFlashcards').mockResolvedValue(flashcardsMock);

    // When: GET is called
    const response = await GET(context as any);

    // Then: response status should be 200 and body matches the flashcards list object
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(flashcardsMock);
    
    // And: ensure that getFlashcards was called with default query parameters
    expect(getFlashcardsSpy).toHaveBeenCalledWith('cookie-user-id', {
      page: undefined,
      limit: undefined,
      sort_by: undefined,
      filter: undefined
    });

    getFlashcardsSpy.mockRestore();
  });

  it('should handle validation error from FlashcardService in GET', async () => {
    // Given: valid authentication and a supabase client returning a user,
    // but FlashcardService.getFlashcards throws an error with a message containing 'walidacji'
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'val-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'unused' } } } })
      }
    };
    const context = {
      request: {
        headers: { get: (key: string) => key === 'Authorization' ? 'Bearer valid' : null },
        url: 'http://localhost/api/flashcards'
      },
      locals: { supabase: fakeSupabase }
    };

    // And: mock getFlashcards to throw a validation error
    const getFlashcardsSpy = vi.spyOn(FlashcardService.prototype, 'getFlashcards').mockRejectedValue(new Error('problem walidacji: invalid query'));
    
    // When: GET is called
    const response = await GET(context as any);
    
    // Then: response status should be 400 with error code 'VALIDATION_ERROR'
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe('VALIDATION_ERROR');

    getFlashcardsSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should handle generic error from FlashcardService in GET', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Given: valid authentication and supabase client returning a user,
    // but FlashcardService.getFlashcards throws a generic error
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'generic-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'unused' } } } })
      }
    };
    const context = {
      request: {
        headers: { get: (key: string) => key === 'Authorization' ? 'Bearer valid' : null },
        url: 'http://localhost/api/flashcards'
      },
      locals: { supabase: fakeSupabase }
    };

    // And: mock getFlashcards to throw a generic error
    const getFlashcardsSpy = vi.spyOn(FlashcardService.prototype, 'getFlashcards').mockRejectedValue(new Error('some other error'));
    
    // When: GET is called
    const response = await GET(context as any);
    
    // Then: response status should be 500 with error code 'SERVER_ERROR'
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe('SERVER_ERROR');

    getFlashcardsSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

// Unit tests for POST /api/flashcards endpoint

describe('POST /api/flashcards', () => {
  it('should return 401 if no token is provided', async () => {
    // Given: a context with no token in headers or cookies, and a supabase client that returns no user/session
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null } })
      }
    };
    const context = {
      request: {
        headers: { get: (_key: string) => null },
        json: async () => ({ question: 'What is AI?', answer: 'Artificial Intelligence' }),
        url: 'http://localhost/api/flashcards'
      },
      locals: { supabase: fakeSupabase }
    };

    // When: POST is called
    const response = await POST(context as any);

    // Then: response status should be 401 with an 'UNAUTHORIZED' error code
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('should create a flashcard successfully with valid token and valid body', async () => {
    // Given: a context with a valid Authorization header, a supabase client that returns a valid user,
    // and a valid flashcard JSON body
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'post-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'unused' } } } })
      }
    };
    const flashcardData = { question: 'What is JavaScript?', answer: 'A programming language' };
    const context = {
      request: {
        headers: { get: (key: string) => key === 'Authorization' ? 'Bearer valid-token' : null },
        json: async () => flashcardData,
        url: 'http://localhost/api/flashcards'
      },
      locals: { supabase: fakeSupabase }
    };

    // And: mock FlashcardService.createFlashcard to return the newly created flashcard with complete fields
    const createdFlashcard = {
      id: 100,
      front: flashcardData.question,
      back: flashcardData.answer,
      user_id: 'post-user',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z',
      severity: 1
    };
    const createFlashcardSpy = vi.spyOn(FlashcardService.prototype, 'createFlashcard').mockResolvedValue(createdFlashcard);

    // When: POST is called
    const response = await POST(context as any);

    // Then: response status should be 201 and return the created flashcard
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual(createdFlashcard);
    expect(createFlashcardSpy).toHaveBeenCalledWith('post-user', flashcardData);

    createFlashcardSpy.mockRestore();
  });

  it('should handle validation error from FlashcardService in POST', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Given: a context with valid token and flashcard JSON body,
    // but FlashcardService.createFlashcard throws an error with a message containing 'walidacji'
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'val-post-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'unused' } } } })
      }
    };
    const flashcardData = { question: 'Invalid', answer: 'Invalid' };
    const context = {
      request: {
        headers: { get: (key: string) => key === 'Authorization' ? 'Bearer valid-token' : null },
        json: async () => flashcardData,
        url: 'http://localhost/api/flashcards'
      },
      locals: { supabase: fakeSupabase }
    };

    // And: mock createFlashcard to throw a validation error
    const createFlashcardSpy = vi.spyOn(FlashcardService.prototype, 'createFlashcard').mockRejectedValue(new Error('problem walidacji: invalid flashcard data'));
    
    // When: POST is called
    const response = await POST(context as any);
    
    // Then: response status should be 400 with error code 'VALIDATION_ERROR'
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe('VALIDATION_ERROR');

    createFlashcardSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should handle generic error from FlashcardService in POST', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Given: a context with valid token and flashcard JSON body,
    // but FlashcardService.createFlashcard throws a generic error
    const fakeSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'gen-post-user' } } }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'unused' } } } })
      }
    };
    const flashcardData = { question: 'Error case?', answer: 'Error response' };
    const context = {
      request: {
        headers: { get: (key: string) => key === 'Authorization' ? 'Bearer valid-token' : null },
        json: async () => flashcardData,
        url: 'http://localhost/api/flashcards'
      },
      locals: { supabase: fakeSupabase }
    };

    // And: mock createFlashcard to throw a generic error
    const createFlashcardSpy = vi.spyOn(FlashcardService.prototype, 'createFlashcard').mockRejectedValue(new Error('unexpected error'));
    
    // When: POST is called
    const response = await POST(context as any);
    
    // Then: response status should be 500 with error code 'SERVER_ERROR'
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe('SERVER_ERROR');

    createFlashcardSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
}); 