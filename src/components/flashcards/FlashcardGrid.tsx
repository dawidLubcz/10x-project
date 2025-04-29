import React from 'react';
import { FlashcardItem } from './FlashcardItem';
import { Loader2 } from 'lucide-react';
import type { FlashcardGridProps } from './types';
import type { FlashcardDto } from '../../types';

/**
 * Komponent wyświetlający siatkę fiszek
 */
export const FlashcardGrid: React.FC<FlashcardGridProps> = ({
  flashcards,
  isLoading,
  onEdit,
  onDelete,
  onToggleExpand,
}) => {
  return (
    <div className="relative">
      {/* Wskaźnik ładowania przy odświeżaniu */}
      {isLoading && flashcards.length > 0 && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Siatka fiszek */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((flashcard) => (
          <FlashcardItem
            key={flashcard.id}
            flashcard={flashcard}
            onEdit={() => onEdit(flashcard)}
            onDelete={() => onDelete(flashcard.id)}
            onToggleExpand={() => onToggleExpand(flashcard.id)}
          />
        ))}
      </div>
    </div>
  );
}; 