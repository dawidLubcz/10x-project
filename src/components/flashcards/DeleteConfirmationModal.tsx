import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { DeleteConfirmationModalProps } from './types';

/**
 * Modal potwierdzenia usunięcia fiszki
 */
export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  flashcardId,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Obsługa potwierdzenia usunięcia
  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      // Modal zamknie się automatycznie po usunięciu
    } catch (error) {
      console.error('Błąd podczas usuwania fiszki:', error);
      // Tutaj można dodać obsługę błędu, np. wyświetlenie komunikatu
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz usunąć tę fiszkę?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta operacja jest nieodwracalna. Fiszka zostanie trwale usunięta z Twojej kolekcji.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Anuluj</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? 'Usuwanie...' : 'Usuń fiszkę'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 