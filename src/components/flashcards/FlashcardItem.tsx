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
  // Funkcja zwracająca skróconą treść, jeśli fiszka nie jest rozwinięta
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text || text.length <= maxLength || flashcard.isExpanded) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{truncateText(flashcard.front, 50)}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="prose prose-sm max-w-none">
          <p>{truncateText(flashcard.back, 150)}</p>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleExpand}
          className="text-xs"
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
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onEdit}
            title="Edytuj fiszkę"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edytuj</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:bg-destructive/10" 
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