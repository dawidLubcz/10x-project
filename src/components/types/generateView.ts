import type { GeneratedFlashcardDto } from '../../types';

// Enumeracja statusów generowania
export enum GenerationStatusType {
  IDLE = 'idle',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  ERROR = 'error'
}

// Stan statusu generowania
export interface GenerationStatusState {
  status: GenerationStatusType;
  message?: string; // Opcjonalny komunikat, np. błędu
}

// Dane formularza wejściowego
export interface InputFormData {
  inputText: string; // Tekst wprowadzony przez użytkownika
}

// ViewModel dla fiszki (rozszerzenie GeneratedFlashcardDto)
export interface FlashcardViewModel extends GeneratedFlashcardDto {
  id: number; // ID fiszki
  isEditing: boolean; // Czy fiszka jest obecnie edytowana
  isProcessing: boolean; // Czy trwa przetwarzanie akcji (akceptacja, odrzucenie)
  status?: 'accepted' | 'rejected' | 'pending'; // Status fiszki
}

// ViewModel dla generacji fiszek
export interface GenerationViewModel {
  id: number; // ID generacji
  flashcards: FlashcardViewModel[]; // Lista wygenerowanych fiszek
  stats: {
    total: number; // Łączna liczba fiszek
    accepted: number; // Liczba zaakceptowanych fiszek
    rejected: number; // Liczba odrzuconych fiszek
    pending: number; // Liczba oczekujących fiszek
  }
}

// Dane edycji fiszki
export interface EditFlashcardData {
  front: string; // Edytowane pytanie
  back: string; // Edytowana odpowiedź
} 