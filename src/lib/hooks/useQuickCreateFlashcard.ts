import { useState } from "react";
import type { QuickCreateFormData, UseQuickCreateFlashcardResult } from "../types/dashboard";
import { FlashcardSource, type CreateFlashcardDto, type FlashcardDto } from "../../types";

export const useQuickCreateFlashcard = (): UseQuickCreateFlashcardResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createFlashcard = async (data: QuickCreateFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const requestData: CreateFlashcardDto = {
        front: data.front,
        back: data.back,
        source: FlashcardSource.MANUAL
      };
      
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Wystąpił błąd podczas tworzenia fiszki');
      }
      
      const flashcard: FlashcardDto = await response.json();
      setSuccess(true);
      
      return flashcard;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nieznany błąd'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createFlashcard, loading, error, success };
}; 