import { useState, useEffect, useCallback } from "react";
import type { FlashcardStatistics, UseFlashcardStatisticsResult } from "../types/dashboard";
import type { FlashcardListResponseDto, FlashcardDto } from "../../types";
import { FlashcardSource } from "../../types";

// Rozszerzony typ FlashcardDto uwzględniający pole source, które może nie być obecne w oryginalnym FlashcardDto
interface FlashcardWithSource extends FlashcardDto {
  source?: FlashcardSource | string;
}

export const useFlashcardStatistics = (): UseFlashcardStatisticsResult => {
  const [statistics, setStatistics] = useState<FlashcardStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/flashcards', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Wystąpił błąd podczas pobierania statystyk');
      }

      const data: FlashcardListResponseDto = await response.json();
      
      // Używamy tylko danych z API
      const flashcardsWithSource = data.flashcards as FlashcardWithSource[];
      
      // Poprawiona logika sprawdzania źródeł oparta na string values z enum FlashcardSource
      const aiGeneratedCount = flashcardsWithSource.filter(f => {
        const source = f.source?.toString();
        return source === "ai-full" || source === "ai-edited";
      }).length;

      const manualCount = flashcardsWithSource.filter(f => {
        const source = f.source?.toString();
        return source === "manual";
      }).length;
      
      // Jeśli suma nie zgadza się z całkowitą liczbą, przypisz brakujące do ręcznych
      const totalFlashcards = flashcardsWithSource.length;
      const unaccountedFlashcards = totalFlashcards - (aiGeneratedCount + manualCount);
      
      const adjustedManualCount = manualCount + unaccountedFlashcards;
      
      // W rzeczywistej implementacji "flashcardsToReview" byłoby obliczane na podstawie 
      // algorytmu powtórek, tutaj używamy dummy data
      const toReviewCount = Math.floor(totalFlashcards * 0.3);
      
      setStatistics({
        totalFlashcards: totalFlashcards,
        aiGeneratedFlashcards: aiGeneratedCount,
        manualFlashcards: adjustedManualCount,
        flashcardsToReview: toReviewCount
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nieznany błąd'));
      console.error('Błąd podczas pobierania statystyk:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Funkcja do ręcznego odświeżania statystyk
  const refreshStatistics = () => {
    fetchStatistics();
  };

  return { statistics, loading, error, refreshStatistics };
}; 