import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CreateFlashcardDto,
  FlashcardDto,
  FlashcardEntity,
  FlashcardListResponseDto,
  FlashcardQueryParams,
  PaginationDto
} from "../../types";
import { FlashcardSource } from "../../types";
import { createFlashcardSchema, flashcardQuerySchema, updateFlashcardSchema } from "../schemas/flashcard.schemas";
import { z } from 'zod';

/**
 * Serwis do zarządzania fiszkami
 */
export class FlashcardService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Tworzy nową fiszkę manualnie
   * @param userId ID użytkownika
   * @param data Dane fiszki
   * @returns Utworzona fiszka
   */
  async createFlashcard(userId: string, data: CreateFlashcardDto): Promise<FlashcardDto> {
    // Walidacja danych wejściowych
    const validatedData = createFlashcardSchema.parse(data);

    // Zapisanie fiszki w bazie danych
    const { data: flashcard, error } = await this.supabase
      .from("flashcards")
      .insert({
        ...validatedData,
        user_id: userId,
        source: FlashcardSource.MANUAL
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas tworzenia fiszki: ${error.message}`);
    }

    return flashcard as FlashcardDto;
  }

  /**
   * Pobiera listę fiszek użytkownika z opcjonalną paginacją, sortowaniem i filtrowaniem
   * @param userId ID użytkownika
   * @param queryParams Parametry zapytania
   * @returns Lista fiszek z informacjami o paginacji
   */
  async getFlashcards(
    userId: string,
    queryParams: FlashcardQueryParams
  ): Promise<FlashcardListResponseDto> {
    // Walidacja i ustawienie domyślnych wartości dla parametrów zapytania
    const { page, limit, sort_by, filter } = flashcardQuerySchema.parse(queryParams);

    // Budowanie zapytania
    let query = this.supabase
      .from("flashcards")
      .select("id, front, back, user_id, created_at, updated_at, source")
      .eq("user_id", userId);

    // Dodawanie filtrowania po źródle, jeśli podano
    if (filter?.source) {
      query = query.eq("source", filter.source);
    }

    // Zapytanie o łączną liczbę fiszek dla paginacji
    let countQuery = this.supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
      
    if (filter?.source) {
      countQuery = countQuery.eq("source", filter.source);
    }
    
    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Błąd podczas pobierania liczby fiszek: ${countError.message}`);
    }

    // Dodanie sortowania i paginacji
    const { data: flashcards, error } = await query
      .order(sort_by as keyof FlashcardEntity, { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Błąd podczas pobierania fiszek: ${error.message}`);
    }

    // Przygotowanie informacji o paginacji
    const pagination: PaginationDto = {
      page,
      limit,
      total: count || 0
    };

    return {
      flashcards: flashcards as FlashcardDto[],
      pagination
    };
  }

  /**
   * Pobiera fiszkę na podstawie ID i ID użytkownika
   * @param id - ID fiszki do pobrania
   * @param userId - ID zalogowanego użytkownika
   * @returns Obiekt fiszki lub null jeśli nie znaleziono
   */
  async getFlashcardById(id: number, userId: string): Promise<FlashcardDto | null> {
    const { data, error } = await this.supabase
      .from('flashcards')
      .select('id, front, back, user_id, created_at, updated_at, source')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Nie znaleziono fiszki
      }
      throw error;
    }

    return data as FlashcardDto;
  }

  /**
   * Aktualizuje istniejącą fiszkę
   * @param id ID fiszki do zaktualizowania
   * @param userId ID użytkownika
   * @param data Dane do aktualizacji
   * @returns Zaktualizowana fiszka lub null jeśli nie znaleziono
   */
  async updateFlashcard(id: number, userId: string, data: any): Promise<FlashcardDto | null> {
    // Walidacja danych wejściowych
    const validatedData = updateFlashcardSchema.parse(data);

    // Sprawdzenie czy fiszka istnieje i należy do użytkownika
    const flashcard = await this.getFlashcardById(id, userId);
    if (!flashcard) {
      return null;
    }

    // Aktualizacja fiszki w bazie danych
    const { data: updatedFlashcard, error } = await this.supabase
      .from("flashcards")
      .update(validatedData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas aktualizacji fiszki: ${error.message}`);
    }

    return updatedFlashcard as FlashcardDto;
  }

  /**
   * Usuwa fiszkę
   * @param id ID fiszki do usunięcia
   * @param userId ID użytkownika
   * @returns true jeśli usunięto, false jeśli nie znaleziono
   */
  async deleteFlashcard(id: number, userId: string): Promise<boolean> {
    // Sprawdzenie czy fiszka istnieje i należy do użytkownika
    const flashcard = await this.getFlashcardById(id, userId);
    if (!flashcard) {
      return false;
    }

    // Usunięcie fiszki z bazy danych
    const { error } = await this.supabase
      .from("flashcards")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Błąd podczas usuwania fiszki: ${error.message}`);
    }

    return true;
  }
} 