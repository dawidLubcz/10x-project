import { useState, useEffect } from "react";
import type { UserDto } from "@/types";

/**
 * Custom hook do pobierania i przechowywania danych profilu użytkownika
 * @returns Obiekt z danymi profilu, stanem ładowania i ewentualnymi błędami
 */
export function useProfile() {
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Pobierz token uwierzytelniający z localStorage
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          // Przekierowanie do logowania jeśli brak tokenu
          window.location.href = '/auth?redirect=/profile';
          return;
        }
        
        // Dodaj token do nagłówka Authorization
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Przekierowanie do logowania jeśli brak autoryzacji
            window.location.href = '/auth?redirect=/profile';
            return;
          }
          throw new Error('Nie udało się pobrać danych profilu');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nieznany błąd');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error };
} 