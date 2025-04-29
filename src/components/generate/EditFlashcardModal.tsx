import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { FlashcardViewModel, EditFlashcardData } from '../types/generateView';

interface EditFlashcardModalProps {
  flashcard: FlashcardViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditFlashcardData) => void;
}

export const EditFlashcardModal = ({
  flashcard,
  isOpen,
  onClose,
  onSave
}: EditFlashcardModalProps) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const MAX_TOTAL_LENGTH = 1000;

  // Reset form when flashcard changes
  useEffect(() => {
    if (flashcard) {
      setFront(flashcard.front);
      setBack(flashcard.back);
    } else {
      setFront('');
      setBack('');
    }
  }, [flashcard]);

  // Validate inputs
  useEffect(() => {
    if (!front.trim() || !back.trim()) {
      setIsValid(false);
      setError('Pytanie i odpowiedź nie mogą być puste');
    } else if ((front.length + back.length) > MAX_TOTAL_LENGTH) {
      setIsValid(false);
      setError(`Łączna długość pytania i odpowiedzi nie może przekraczać ${MAX_TOTAL_LENGTH} znaków`);
    } else {
      setIsValid(true);
      setError(null);
    }
  }, [front, back]);

  const handleSave = () => {
    if (isValid && !flashcard?.isProcessing) {
      onSave({ front, back });
    }
  };

  const charsRemaining = MAX_TOTAL_LENGTH - (front.length + back.length);
  const isOverLimit = charsRemaining < 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edytuj fiszkę</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="front">Pytanie</Label>
            <Textarea
              id="front"
              value={front}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFront(e.target.value)}
              placeholder="Wprowadź pytanie"
              className={`min-h-20 ${isOverLimit ? 'border-destructive' : ''}`}
              disabled={flashcard?.isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="back">Odpowiedź</Label>
            <Textarea
              id="back"
              value={back}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBack(e.target.value)}
              placeholder="Wprowadź odpowiedź"
              className={`min-h-20 ${isOverLimit ? 'border-destructive' : ''}`}
              disabled={flashcard?.isProcessing}
            />
          </div>
          
          <div className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
            Pozostało znaków: {charsRemaining}
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={flashcard?.isProcessing}
          >
            Anuluj
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isValid || flashcard?.isProcessing}
          >
            {flashcard?.isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              'Zapisz'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 