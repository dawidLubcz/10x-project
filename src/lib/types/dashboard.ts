import type { FlashcardDto } from "../../types";

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
  linkTo: string | null;
  variant?: 'default' | 'primary' | 'secondary';
  disabled?: boolean;
  tooltip?: string;
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
  refreshStatistics: () => void;
}

// Hook useQuickCreateFlashcard response
export interface UseQuickCreateFlashcardResult {
  createFlashcard: (data: QuickCreateFormData) => Promise<FlashcardDto | null>;
  loading: boolean;
  error: Error | null;
  success: boolean;
} 