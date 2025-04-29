import React, { useState, useEffect } from 'react';
import * as DialogPrimitive from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FlashcardEditModalProps, FlashcardFormData } from './types';
import type { UpdateFlashcardDto } from '../../types';

/**
 * Modal do edycji fiszki
 */
export const FlashcardEditModal: React.FC<FlashcardEditModalProps> = ({
  flashcard,
  isOpen,
  onClose,
  onSave,
}) => {
  // Stan formularza z walidacją
  const [formData, setFormData] = useState<FlashcardFormData>({
    front: '',
    back: '',
  });
  
  // Stan ładowania podczas zapisywania
  const [isSaving, setIsSaving] = useState(false);
  
  // Aktualizacja formularza gdy zmienia się edytowana fiszka
  useEffect(() => {
    if (flashcard) {
      setFormData({
        front: flashcard.front,
        back: flashcard.back,
      });
    }
  }, [flashcard]);
  
  // Obsługa zmiany pól formularza z walidacją
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Walidacja pól
    let error: string | undefined;
    
    if (value.trim() === '') {
      error = 'To pole jest wymagane';
    } else if (name === 'front' && value.length > 200) {
      error = 'Maksymalna długość pytania to 200 znaków';
    } else if (name === 'back' && value.length > 500) {
      error = 'Maksymalna długość odpowiedzi to 500 znaków';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      [`${name}Error`]: error,
    }));
  };
  
  // Sprawdzenie, czy formularz ma błędy
  const hasErrors = () => {
    return !!(formData.frontError || formData.backError || 
             !formData.front || !formData.back);
  };
  
  // Obsługa zapisywania zmian
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasErrors()) return;
    
    const updateData: UpdateFlashcardDto = {
      front: formData.front,
      back: formData.back,
    };
    
    try {
      setIsSaving(true);
      await onSave(updateData);
      // Modal zamknie się automatycznie po zapisaniu
    } catch (error) {
      console.error('Błąd podczas zapisywania fiszki:', error);
      // Tutaj można dodać obsługę błędu, np. wyświetlenie komunikatu
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <DialogPrimitive.Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogPrimitive.DialogHeader>
            <DialogPrimitive.DialogTitle>Edytuj fiszkę</DialogPrimitive.DialogTitle>
            <DialogPrimitive.DialogDescription>
              Zaktualizuj pytanie i odpowiedź. Naciśnij Zapisz, gdy skończysz.
            </DialogPrimitive.DialogDescription>
          </DialogPrimitive.DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front" className="flex items-center justify-between">
                <span>Pytanie</span>
                <span className="text-xs text-muted-foreground">
                  {formData.front?.length ?? 0}/200
                </span>
              </Label>
              <Textarea
                id="front"
                name="front"
                value={formData.front}
                onChange={handleChange}
                placeholder="Wpisz pytanie dla fiszki..."
                rows={3}
                className={formData.frontError ? "border-destructive" : ""}
              />
              {formData.frontError && (
                <p className="text-sm text-destructive">{formData.frontError}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="back" className="flex items-center justify-between">
                <span>Odpowiedź</span>
                <span className="text-xs text-muted-foreground">
                  {formData.back?.length ?? 0}/500
                </span>
              </Label>
              <Textarea
                id="back"
                name="back"
                value={formData.back}
                onChange={handleChange}
                placeholder="Wpisz odpowiedź dla fiszki..."
                rows={5}
                className={formData.backError ? "border-destructive" : ""}
              />
              {formData.backError && (
                <p className="text-sm text-destructive">{formData.backError}</p>
              )}
            </div>
          </div>
          
          <DialogPrimitive.DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
            >
              Anuluj
            </Button>
            <Button 
              type="submit" 
              disabled={hasErrors() || isSaving}
            >
              {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
          </DialogPrimitive.DialogFooter>
        </form>
      </DialogPrimitive.DialogContent>
    </DialogPrimitive.Dialog>
  );
}; 