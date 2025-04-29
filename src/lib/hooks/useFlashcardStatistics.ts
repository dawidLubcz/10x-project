import { useState, useEffect } from "react";
import type { FlashcardStatistics, UseFlashcardStatisticsResult } from "../types/dashboard";
import type { FlashcardListResponseDto, FlashcardDto } from "../../types";
import { FlashcardSource } from "../../types";

// Rozszerzony typ FlashcardDto uwzględniający pole source, które może nie być obecne w oryginalnym FlashcardDto
interface FlashcardWithSource extends FlashcardDto {
  source?: FlashcardSource;
}

export const useFlashcardStatistics = (): UseFlashcardStatisticsResult => {
  const [statistics, setStatistics] = useState<FlashcardStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/flashcards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Wystąpił błąd podczas pobierania statystyk');
        }

        const data: FlashcardListResponseDto = await response.json();

        // Przetwarzanie odpowiedzi na statystyki
        // To jest uproszczona implementacja, która zakłada, że backend nie zwraca
        // bezpośrednio statystyk, więc wyliczamy je na podstawie listy fiszek
        const flashcardsWithSource = data.flashcards as FlashcardWithSource[];
        
        const aiGeneratedCount = flashcardsWithSource.filter(f => 
          f.source === FlashcardSource.AI_FULL || f.source === FlashcardSource.AI_EDITED
        ).length;

        const manualCount = flashcardsWithSource.filter(f => 
          f.source === FlashcardSource.MANUAL
        ).length;
        
        // W rzeczywistej implementacji "flashcardsToReview" byłoby obliczane na podstawie 
        // algorytmu powtórek, tutaj używamy dummy data
        const toReviewCount = Math.floor(data.flashcards.length * 0.3);
        
        setStatistics({
          totalFlashcards: data.flashcards.length,
          aiGeneratedFlashcards: aiGeneratedCount,
          manualFlashcards: manualCount,
          flashcardsToReview: toReviewCount
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Nieznany błąd'));
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return { statistics, loading, error };
}; 