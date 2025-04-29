import type { ReactNode } from "react";
import type { FlashcardSource } from "../../types";

// Statystyki fiszek (ViewModel)
export interface FlashcardStatistics {
  totalFlashcards: number;
  aiGeneratedFlashcards: number;
  manualFlashcards: number;
  flashcardsToReview: number;
}

// Props dla komponentu ActionCard
export interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  linkTo: string;
  variant?: 'default' | 'primary' | 'secondary';
}

// Props dla komponentu ActionCardGrid
export interface ActionCardGridProps {
  actions: ActionCardProps[];
}

// Dane formularza szybkiego tworzenia fiszki
export interface QuickCreateFormData {
  front: string;  // max 200 znaków
  back: string;   // max 500 znaków
}

// Hook useFlashcardStatistics response
export interface UseFlashcardStatisticsResult {
  statistics: FlashcardStatistics | null;
  loading: boolean;
  error: Error | null;
}

// Hook useQuickCreateFlashcard response
export interface UseQuickCreateFlashcardResult {
  createFlashcard: (data: QuickCreateFormData) => Promise<any>;
  loading: boolean;
  error: Error | null;
  success: boolean;
} 