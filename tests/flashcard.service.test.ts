import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlashcardService } from '../src/lib/services/flashcard.service';

describe('FlashcardService', () => {
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

  describe('getFlashcardById', () => {
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