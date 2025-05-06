import type { 
  FlashcardDto, 
  FlashcardQueryParams, 
  PaginationDto, 
  UpdateFlashcardDto
} from "../../types";

// ViewModel dla listy fiszek
export interface FlashcardViewModel extends FlashcardDto {
  isExpanded: boolean;
}

// Props dla komponentu FlashcardFilters
export interface FlashcardFiltersProps {
  currentFilters: FlashcardQueryParams;
  onFilterChange: (filters: Partial<FlashcardQueryParams>) => void;
}

// Props dla komponentu FlashcardGrid
export interface FlashcardGridProps {
  flashcards: FlashcardViewModel[];
  isLoading: boolean;
  onEdit: (flashcard: FlashcardDto) => void;
  onDelete: (id: number) => void;
  onToggleExpand: (id: number) => void;
}

// Props dla komponentu FlashcardItem
export interface FlashcardItemProps {
  flashcard: FlashcardViewModel;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
}

// Props dla komponentu Pagination
export interface PaginationProps {
  pagination: PaginationDto;
  onPageChange: (page: number) => void;
}

// Props dla komponentu FlashcardEditModal
export interface FlashcardEditModalProps {
  flashcard: FlashcardDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateFlashcardDto) => Promise<void>;
}

// Props dla komponentu DeleteConfirmationModal
export interface DeleteConfirmationModalProps {
  flashcardId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

// Model dla formularza edycji fiszki
export interface FlashcardFormData {
  front: string;
  back: string;
  frontError?: string;
  backError?: string;
}

// Stan widoku fiszek zwracany przez hook useFlashcards
export interface FlashcardsState {
  flashcards: FlashcardViewModel[];
  pagination: PaginationDto;
  queryParams: FlashcardQueryParams;
  isLoading: boolean;
  error: string | null;
  editingFlashcard: FlashcardDto | null;
  deletingFlashcardId: number | null;
}

// Akcje dostępne dla widoku fiszek
export interface FlashcardsActions {
  handleFilterChange: (filters: Partial<FlashcardQueryParams>) => void;
  handlePageChange: (page: number) => void;
  handleToggleExpand: (id: number) => void;
  handleEditFlashcard: (flashcard: FlashcardDto) => void;
  handleSaveFlashcard: (data: UpdateFlashcardDto) => Promise<void>;
  handleDeleteFlashcard: (id: number) => void;
  handleConfirmDelete: () => Promise<void>;
  refreshFlashcards: () => Promise<void>;
} 