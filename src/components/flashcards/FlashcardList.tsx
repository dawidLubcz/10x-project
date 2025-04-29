import React from 'react';
import { useFlashcards } from './useFlashcards';
import { FlashcardGrid } from './FlashcardGrid';
import { FlashcardFilters } from './FlashcardFilters';
import { Pagination } from './Pagination';
import { FlashcardEditModal } from './FlashcardEditModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * Główny komponent zarządzający widokiem listy fiszek
 */
export const FlashcardList: React.FC = () => {
  const {
    flashcards,
    pagination,
    queryParams,
    isLoading,
    error,
    editingFlashcard,
    deletingFlashcardId,
    handleFilterChange,
    handlePageChange,
    handleToggleExpand,
    handleEditFlashcard,
    handleSaveFlashcard,
    handleDeleteFlashcard,
    handleConfirmDelete,
    refreshFlashcards
  } = useFlashcards();

  // Jeśli trwa ładowanie, pokaż wskaźnik ładowania
  if (isLoading && flashcards.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Ładowanie fiszek...</span>
      </div>
    );
  }

  // Jeśli wystąpił błąd, pokaż komunikat o błędzie
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-destructive">Wystąpił błąd</h2>
        <p className="mt-2">{error}</p>
        <Button 
          onClick={refreshFlashcards} 
          variant="outline" 
          className="mt-4"
        >
          Spróbuj ponownie
        </Button>
      </div>
    );
  }

  // Jeśli nie ma fiszek, pokaż komunikat o braku fiszek
  if (!isLoading && flashcards.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/50">
        <h2 className="text-xl font-semibold mb-4">Nie masz jeszcze żadnych fiszek</h2>
        <p className="mb-6">Utwórz swoją pierwszą fiszkę lub wygeneruj fiszki przy pomocy AI</p>
        <Button asChild>
          <a href="/create-flashcard">Utwórz fiszkę</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Liczba fiszek i filtry */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <p className="text-muted-foreground">
          Znaleziono <span className="font-medium">{pagination.total}</span> fiszek
        </p>
        <FlashcardFilters 
          currentFilters={queryParams} 
          onFilterChange={handleFilterChange} 
        />
      </div>

      {/* Siatka fiszek */}
      <FlashcardGrid
        flashcards={flashcards}
        isLoading={isLoading}
        onEdit={handleEditFlashcard}
        onDelete={handleDeleteFlashcard}
        onToggleExpand={handleToggleExpand}
      />

      {/* Paginacja */}
      {pagination.total > pagination.limit && (
        <div className="mt-6 flex justify-center">
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}

      {/* Modal edycji fiszki */}
      <FlashcardEditModal
        flashcard={editingFlashcard}
        isOpen={!!editingFlashcard}
        onClose={() => handleEditFlashcard(null)}
        onSave={handleSaveFlashcard}
      />

      {/* Modal potwierdzenia usunięcia */}
      <DeleteConfirmationModal
        flashcardId={deletingFlashcardId}
        isOpen={!!deletingFlashcardId}
        onClose={() => handleDeleteFlashcard(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}; 