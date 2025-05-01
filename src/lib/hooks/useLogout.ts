import { useState } from "react";

/**
 * Custom hook do obsługi wylogowywania użytkownika
 * @returns Obiekt z funkcją wylogowania i stanami powiązanymi z procesem
 */
export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      setError(null);
      
      const response = await fetch('/api/users/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Nie udało się wylogować');
      }
      
      // Czyszczenie localStorage/cookies
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      
      // Usuwanie ciasteczka
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
      
      // Przekierowanie do strony logowania
      window.location.href = '/auth';
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
      // Nawet jeśli wystąpi błąd, próbujemy wylogować lokalnie
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      
      // Usuwanie ciasteczka nawet przy błędzie
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
      
      window.location.href = '/auth';
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut, error };
} 