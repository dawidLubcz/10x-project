import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  Trash2
} from 'lucide-react';
import type { FlashcardItemProps } from './types';

/**
 * Komponent pojedynczej fiszki
 */
export const FlashcardItem: React.FC<FlashcardItemProps> = ({
  flashcard,
  onEdit,
  onDelete,
  onToggleExpand,
}) => {
  // Sprawdzamy czy tekst jest dłuższy niż maksymalna długość
  const isFrontTruncated = flashcard.front && flashcard.front.length > 50;
  const isBackTruncated = flashcard.back && flashcard.back.length > 150;
  const shouldShowExpandButton = isFrontTruncated || isBackTruncated;

  // Funkcja zwracająca skróconą treść, jeśli fiszka nie jest rozwinięta
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    
    if (flashcard.isExpanded) {
      return text;
    }
    
    if (text.length <= maxLength) {
      return text;
    }
    
    // Zwróć skróconą wersję, zapewniając zakończenie pełnym słowem
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    // Zakończ na ostatniej pełnej spacji, jeśli taka istnieje
    if (lastSpaceIndex > maxLength * 0.8) {
      return `${truncated.substring(0, lastSpaceIndex)}...`;
    }
    
    return `${truncated}...`;
  };

  console.log('Flashcard state:', { 
    id: flashcard.id, 
    isExpanded: flashcard.isExpanded,
    frontLength: flashcard.front?.length,
    backLength: flashcard.back?.length
  });

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {truncateText(flashcard.front, 50)}
        </CardTitle>
      </CardHeader>
      
      <CardContent 
        className={`pb-2 flex-grow transition-all duration-300 overflow-auto text-zinc-800 dark:text-zinc-200
          ${flashcard.isExpanded ? 'max-h-[500px]' : 'max-h-[150px]'}`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>{truncateText(flashcard.back, 150)}</p>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-zinc-200 dark:border-zinc-700 pt-3 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800">
        {shouldShowExpandButton ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleExpand}
            className="text-xs text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {flashcard.isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Zwiń
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Rozwiń
              </>
            )}
          </Button>
        ) : (
          <div></div> // Pusty element, by zachować układ
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700" 
            onClick={onEdit}
            title="Edytuj fiszkę"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edytuj</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:bg-destructive/10 border-zinc-300 dark:border-zinc-700 dark:hover:bg-red-950/30" 
            onClick={onDelete}
            title="Usuń fiszkę"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Usuń</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 