import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FlashcardService } from '../../services/flashcard.service';
import { FlashcardSource } from '../../../types';

// Mock dla SupabaseClient
const createMockSupabase = () => {
  const mockData = {
    flashcards: [
      {
        id: 1,
        front: 'Pytanie 1',
        back: 'Odpowiedź 1',
        user_id: 'user123',
        source: FlashcardSource.MANUAL,
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-01-01T12:00:00Z'
      },
      {
        id: 2,
        front: 'Pytanie 2',
        back: 'Odpowiedź 2',
        user_id: 'user123',
        source: FlashcardSource.AI_FULL,
        created_at: '2023-01-02T12:00:00Z',
        updated_at: '2023-01-02T12:00:00Z'
      }
    ]
  };

  return {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockImplementation(() => {
      return {
        data: mockData.flashcards,
        error: null
      };
    }),
    single: vi.fn().mockImplementation(() => {
      return {
        data: mockData.flashcards[0],
        error: null
      };
    }),
    count: 2
  };
};

describe('FlashcardService', () => {
  let flashcardService: FlashcardService;
  let mockSupabase: ReturnType<typeof createMockSupabase>;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    flashcardService = new FlashcardService(mockSupabase as any);
  });

  describe('createFlashcard', () => {
    it('should create a new flashcard', async () => {
      const userId = 'user123';
      const flashcardData = {
        front: 'Nowe pytanie',
        back: 'Nowa odpowiedź',
        source: FlashcardSource.MANUAL
      };

      const result = await flashcardService.createFlashcard(userId, flashcardData);

      expect(mockSupabase.from).toHaveBeenCalledWith('flashcards');
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        ...flashcardData,
        user_id: userId,
        source: FlashcardSource.MANUAL
      });
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(Number),
        front: expect.any(String),
        back: expect.any(String),
        user_id: expect.any(String)
      }));
    });

    it('should throw an error if database operation fails', async () => {
      const userId = 'user123';
      const flashcardData = {
        front: 'Nowe pytanie',
        back: 'Nowa odpowiedź',
        source: FlashcardSource.MANUAL
      };

      // Override the mock to simulate an error
      mockSupabase.single.mockImplementationOnce(() => {
        return {
          data: null,
          error: { message: 'Database error' }
        };
      });

      await expect(flashcardService.createFlashcard(userId, flashcardData))
        .rejects
        .toThrow('Błąd podczas tworzenia fiszki: Database error');
    });
  });

  describe('getFlashcards', () => {
    it('should retrieve flashcards with default query parameters', async () => {
      const userId = 'user123';
      const queryParams = {};

      // Mock the count query
      mockSupabase.select.mockImplementationOnce(() => {
        return {
          count: 2,
          error: null
        };
      });

      const result = await flashcardService.getFlashcards(userId, queryParams);

      expect(mockSupabase.from).toHaveBeenCalledWith('flashcards');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', userId);
      expect(mockSupabase.order).toHaveBeenCalled();
      expect(mockSupabase.range).toHaveBeenCalled();
      
      expect(result).toEqual({
        flashcards: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            front: expect.any(String),
            back: expect.any(String),
            user_id: expect.any(String)
          })
        ]),
        pagination: {
          page: 1,
          limit: 20,
          total: 2
        }
      });
    });

    it('should apply filter by source when provided', async () => {
      const userId = 'user123';
      const queryParams = {
        filter: {
          source: FlashcardSource.MANUAL
        }
      };

      // Mock the count query
      mockSupabase.select.mockImplementationOnce(() => {
        return {
          count: 1,
          error: null
        };
      });

      await flashcardService.getFlashcards(userId, queryParams);

      expect(mockSupabase.eq).toHaveBeenCalledWith('source', FlashcardSource.MANUAL);
    });

    it('should throw an error if count query fails', async () => {
      const userId = 'user123';
      const queryParams = {};

      // Override the mock to simulate an error
      mockSupabase.select.mockImplementationOnce(() => {
        return {
          count: null,
          error: { message: 'Count query failed' }
        };
      });

      await expect(flashcardService.getFlashcards(userId, queryParams))
        .rejects
        .toThrow('Błąd podczas pobierania liczby fiszek: Count query failed');
    });

    it('should throw an error if flashcards query fails', async () => {
      const userId = 'user123';
      const queryParams = {};

      // Override the count query mock to succeed
      mockSupabase.select.mockImplementationOnce(() => {
        return {
          count: 2,
          error: null
        };
      });

      // Override the range mock to simulate an error
      mockSupabase.range.mockImplementationOnce(() => {
        return {
          data: null,
          error: { message: 'Flashcards query failed' }
        };
      });

      await expect(flashcardService.getFlashcards(userId, queryParams))
        .rejects
        .toThrow('Błąd podczas pobierania fiszek: Flashcards query failed');
    });
  });

  describe('getFlashcardById', () => {
    let mockSupabase: any;
    let service: FlashcardService;

    beforeEach(() => {
      // Mock dla klienta Supabase
      mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn()
      };

      service = new FlashcardService(mockSupabase);
    });

    it('should return flashcard when found', async () => {
      // Arrange
      const mockFlashcard = {
        id: 1,
        front: 'Test front',
        back: 'Test back',
        user_id: 'user-123',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockSupabase.single.mockResolvedValue({ data: mockFlashcard, error: null });

      // Act
      const result = await service.getFlashcardById(1, 'user-123');

      // Assert
      expect(result).toEqual(mockFlashcard);
      expect(mockSupabase.from).toHaveBeenCalledWith('flashcards');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 1);
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('should return null when flashcard not found', async () => {
      // Arrange
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }
      });

      // Act
      const result = await service.getFlashcardById(999, 'user-123');

      // Assert
      expect(result).toBeNull();
    });

    it('should throw error on database failure', async () => {
      // Arrange
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { code: 'OTHER_ERROR', message: 'Database error' }
      });

      // Act & Assert
      await expect(service.getFlashcardById(1, 'user-123')).rejects.toThrow();
    });
  });
}); 