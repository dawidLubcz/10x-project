import { useState } from "react";

interface DeleteAccountRequest {
  confirmationText: string;
}

/**
 * Custom hook do obsługi usuwania konta użytkownika
 * @returns Obiekt z funkcjami i stanami do obsługi usuwania konta
 */
export function useAccountDeletion() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const openConfirmation = () => setShowConfirmation(true);
  const closeConfirmation = () => setShowConfirmation(false);

  const deleteAccount = async (data: DeleteAccountRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Nie udało się usunąć konta');
      }
      
      // Czyszczenie danych lokalnych
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      
      // Przekierowanie do strony logowania po pomyślnym usunięciu konta
      window.location.href = '/auth';
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    deleteAccount, 
    isSubmitting, 
    error, 
    showConfirmation, 
    openConfirmation, 
    closeConfirmation 
  };
} 