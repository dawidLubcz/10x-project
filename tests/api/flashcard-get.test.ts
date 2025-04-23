import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../src/pages/api/flashcards/[id]';

// Test gdy TEST_USER_ID ma wartość
vi.mock('../../src/pages/api/flashcards/[id]', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    // TEST_USER_ID już jest zdefiniowane jako stała
  };
});

describe('GET /api/flashcards/:id', () => {
  let mockContext: any;

  beforeEach(() => {
    // Mock dla kontekstu Astro
    mockContext = {
      params: { id: '1' },
      locals: {
        supabase: {
          from: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn(),
          auth: {
            getSession: vi.fn().mockResolvedValue({
              data: { session: null }
            })
          }
        }
      },
      request: new Request('http://localhost/api/flashcards/1')
    };
  });

  it('should return 200 with flashcard data when found (with TEST_USER_ID)', async () => {
    // Arrange
    const mockFlashcard = {
      id: 1,
      front: 'Test front',
      back: 'Test back',
      user_id: 'a5a661c1-13ed-4116-8a65-9fe8dd3f0341',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };

    mockContext.locals.supabase.single.mockResolvedValue({ data: mockFlashcard, error: null });

    // Act
    const response = await GET(mockContext);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual(mockFlashcard);
  });

  it('should return 404 when flashcard is not found', async () => {
    // Arrange
    mockContext.locals.supabase.single.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116' }
    });

    // Act
    const response = await GET(mockContext);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(404);
    expect(data.error.code).toBe('NOT_FOUND');
  });

  it('should return 400 when ID is invalid', async () => {
    // Arrange
    mockContext.params.id = 'invalid';

    // Act
    const response = await GET(mockContext);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 500 on unexpected database error', async () => {
    // Arrange
    mockContext.locals.supabase.single.mockResolvedValue({
      data: null,
      error: { code: 'UNKNOWN', message: 'Database error' }
    });

    // Act
    const response = await GET(mockContext);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.error.code).toBe('SERVER_ERROR');
  });

  // Na obecnym etapie, gdy użyty jest testowy ID,
  // zawsze będziemy mieć dostęp do danych (jeśli istnieją).
  // W przyszłości, gdy autoryzacja będzie w pełni funkcjonalna,
  // można dodać test dla scenariusza 401 Unauthorized
}); 