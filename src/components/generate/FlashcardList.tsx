import type { GenerationViewModel } from '../types/generateView';
import { FlashcardItem } from './FlashcardItem';

interface FlashcardListProps {
  generation: GenerationViewModel;
  onAccept: (flashcardId: number) => void;
  onReject: (flashcardId: number) => void;
  onEdit: (flashcardId: number) => void;
}

export const FlashcardList = ({
  generation,
  onAccept,
  onReject,
  onEdit
}: FlashcardListProps) => {
  const { flashcards, stats } = generation;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-6 justify-between py-4 px-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg text-gray-800 dark:text-gray-200">{stats.total}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Łącznie fiszek</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg text-green-600 dark:text-green-500">{stats.accepted}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Zaakceptowane</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg text-red-500">{stats.rejected}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Odrzucone</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg text-blue-600 dark:text-blue-400">{stats.pending}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Oczekujące</span>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {flashcards.map((flashcard) => (
          <FlashcardItem
            key={flashcard.id}
            flashcard={flashcard}
            onAccept={() => onAccept(flashcard.id)}
            onReject={() => onReject(flashcard.id)}
            onEdit={() => onEdit(flashcard.id)}
          />
        ))}
      </div>
    </div>
  );
}; 