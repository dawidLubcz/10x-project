import { describe, expect, it } from 'vitest';
import { createFlashcardSchema, flashcardQuerySchema } from '../../schemas/flashcard.schemas';
import { FlashcardSource } from '../../../types';

describe('createFlashcardSchema', () => {
  it('should validate valid flashcard data', () => {
    const validData = {
      front: 'Pytanie testowe',
      back: 'Odpowiedź testowa',
      source: FlashcardSource.MANUAL
    };

    const result = createFlashcardSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject front with more than 200 characters', () => {
    const invalidData = {
      front: 'a'.repeat(201),
      back: 'Odpowiedź testowa',
      source: FlashcardSource.MANUAL
    };

    const result = createFlashcardSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Front nie może przekraczać 200 znaków');
    }
  });

  it('should reject back with more than 500 characters', () => {
    const invalidData = {
      front: 'Pytanie testowe',
      back: 'a'.repeat(501),
      source: FlashcardSource.MANUAL
    };

    const result = createFlashcardSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Back nie może przekraczać 500 znaków');
    }
  });

  it('should reject non-manual source', () => {
    const invalidData = {
      front: 'Pytanie testowe',
      back: 'Odpowiedź testowa',
      source: FlashcardSource.AI_FULL
    };

    const result = createFlashcardSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const invalidData = {
      front: 'Pytanie testowe'
    };

    const result = createFlashcardSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('flashcardQuerySchema', () => {
  it('should use default values for optional parameters', () => {
    const validData = {};

    const result = flashcardQuerySchema.parse(validData);
    expect(result).toEqual({
      page: 1,
      limit: 20,
      sort_by: 'created_at'
    });
  });

  it('should validate and transform valid query parameters', () => {
    const validData = {
      page: '2',
      limit: '10',
      sort_by: 'front',
      filter: {
        source: FlashcardSource.MANUAL
      }
    };

    const result = flashcardQuerySchema.parse(validData);
    expect(result).toEqual({
      page: 2,
      limit: 10,
      sort_by: 'front',
      filter: {
        source: FlashcardSource.MANUAL
      }
    });
  });

  it('should reject negative page number', () => {
    const invalidData = {
      page: -1
    };

    const result = flashcardQuerySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject limit exceeding maximum value', () => {
    const invalidData = {
      limit: 101
    };

    const result = flashcardQuerySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid sort_by field', () => {
    const invalidData = {
      sort_by: 'nonexistent_field'
    };

    const result = flashcardQuerySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid source filter value', () => {
    const invalidData = {
      filter: {
        source: 'invalid_source'
      }
    };

    const result = flashcardQuerySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
}); 