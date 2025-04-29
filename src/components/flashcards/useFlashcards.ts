import { useState, useCallback, useEffect } from 'react';
import type { 
  FlashcardDto, 
  FlashcardQueryParams, 
  PaginationDto, 
  UpdateFlashcardDto,
  FlashcardListResponseDto 
} from '../../types';
import type { 
  FlashcardViewModel, 
  FlashcardsState, 
  FlashcardsActions 
} from './types';
import { toast } from '@/components/ui/sonner';

/**
 * Hook zarządzający stanem widoku fiszek i komunikacją z API
 */
export const useFlashcards = (): FlashcardsState & FlashcardsActions => {
  // Stan komponentu
  const [flashcards, setFlashcards] = useState<FlashcardViewModel[]>([]);
  const [pagination, setPagination] = useState<PaginationDto>({ page: 1, limit: 10, total: 0 });
  const [queryParams, setQueryParams] = useState<FlashcardQueryParams>({ page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardDto | null>(null);
  const [deletingFlashcardId, setDeletingFlashcardId] = useState<number | null>(null);

  /**
   * Pobieranie listy fiszek z API
   */
  const fetchFlashcards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryString = new URLSearchParams();
      if (queryParams.page) queryString.append('page', queryParams.page.toString());
      if (queryParams.limit) queryString.append('limit', queryParams.limit.toString());
      if (queryParams.sort_by) queryString.append('sort_by', queryParams.sort_by);
      if (queryParams.filter?.source) queryString.append('filter[source]', queryParams.filter.source);
      
      console.log('Fetching flashcards with params:', queryParams);
      console.log('API URL:', `/api/flashcards?${queryString.toString()}`);
      
      const response = await fetch(`/api/flashcards?${queryString.toString()}`);
      
      if (!response.ok) {
        // Sprawdź czy to błąd autoryzacji
        if (response.status === 401) {
          throw new Error('Sesja wygasła. Zaloguj się ponownie.');
        }
        throw new Error('Nie udało się pobrać fiszek');
      }
      
      const data: FlashcardListResponseDto = await response.json();
      console.log('Received flashcards data:', data);
      
      // Mapowanie na ViewModel
      const viewModels = data.flashcards.map(flashcard => ({
        ...flashcard,
        isExpanded: false
      }));
      
      setFlashcards(viewModels);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  /**
   * Aktualizacja filtrów wyszukiwania
   */
  const handleFilterChange = useCallback((filters: Partial<FlashcardQueryParams>) => {
    console.log('Updating filters with:', filters);
    setQueryParams(prevParams => {
      const newParams = {
        ...prevParams,
        ...filters,
        // Reset do pierwszej strony po zmianie filtrów
        page: 1
      };
      console.log('New query params:', newParams);
      return newParams;
    });
  }, []);

  /**
   * Zmiana strony paginacji
   */
  const handlePageChange = useCallback((page: number) => {
    console.log('Changing page to:', page);
    setQueryParams(prevParams => ({
      ...prevParams,
      page
    }));
  }, []);

  /**
   * Rozwijanie/zwijanie fiszki
   */
  const handleToggleExpand = useCallback((id: number) => {
    setFlashcards(prevFlashcards => 
      prevFlashcards.map(flashcard => 
        flashcard.id === id 
          ? { ...flashcard, isExpanded: !flashcard.isExpanded } 
          : flashcard
      )
    );
  }, []);

  /**
   * Inicjowanie edycji fiszki
   */
  const handleEditFlashcard = useCallback((flashcard: FlashcardDto | null) => {
    setEditingFlashcard(flashcard);
  }, []);

  /**
   * Zapisywanie zmian w fiszce
   */
  const handleSaveFlashcard = useCallback(async (data: UpdateFlashcardDto) => {
    if (!editingFlashcard) return;
    
    try {
      const response = await fetch(`/api/flashcards/${editingFlashcard.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesja wygasła. Zaloguj się ponownie.');
        }
        throw new Error('Nie udało się zaktualizować fiszki');
      }
      
      // Odświeżenie listy fiszek
      await fetchFlashcards();
      
      // Zamknięcie modalu
      setEditingFlashcard(null);
      
      // Powiadomienie o sukcesie
      toast.success('Fiszka została zaktualizowana');
    } catch (error) {
      // Powiadomienie o błędzie
      toast.error(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
      throw error;
    }
  }, [editingFlashcard, fetchFlashcards]);

  /**
   * Inicjowanie usuwania fiszki
   */
  const handleDeleteFlashcard = useCallback((id: number | null) => {
    setDeletingFlashcardId(id);
  }, []);

  /**
   * Potwierdzenie usunięcia fiszki
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingFlashcardId) return;
    
    try {
      const response = await fetch(`/api/flashcards/${deletingFlashcardId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesja wygasła. Zaloguj się ponownie.');
        }
        throw new Error('Nie udało się usunąć fiszki');
      }
      
      // Odświeżenie listy fiszek
      await fetchFlashcards();
      
      // Zamknięcie modalu
      setDeletingFlashcardId(null);
      
      // Powiadomienie o sukcesie
      toast.success('Fiszka została usunięta');
    } catch (error) {
      // Powiadomienie o błędzie
      toast.error(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
      throw error;
    }
  }, [deletingFlashcardId, fetchFlashcards]);

  // Pobieranie fiszek przy pierwszym renderowaniu i zmianie filtrów
  useEffect(() => {
    console.log('queryParams changed, fetching flashcards');
    fetchFlashcards();
  }, [fetchFlashcards]);

  // Funkcja do manualnego odświeżenia listy fiszek
  const refreshFlashcards = useCallback(() => fetchFlashcards(), [fetchFlashcards]);

  return {
    // Stan
    flashcards,
    pagination,
    queryParams,
    isLoading,
    error,
    editingFlashcard,
    deletingFlashcardId,
    
    // Akcje
    handleFilterChange,
    handlePageChange,
    handleToggleExpand,
    handleEditFlashcard,
    handleSaveFlashcard,
    handleDeleteFlashcard,
    handleConfirmDelete,
    refreshFlashcards
  };
}; 