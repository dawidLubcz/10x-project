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

  // Handle cancel
  const handleCancel = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  // Obsługa potwierdzenia usunięcia
  const handleConfirm = async () => {
    if (!flashcardId) return;
    
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error('Błąd podczas usuwania fiszki:', error);
      // Ensure we close the modal even if there's an error
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz usunąć tę fiszkę?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta operacja jest nieodwracalna. Fiszka zostanie trwale usunięta z Twojej kolekcji.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Anuluj
          </AlertDialogCancel>
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