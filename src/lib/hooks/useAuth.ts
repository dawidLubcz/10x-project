import { useState, useCallback } from 'react';
import type { UserDto, LoginResponseDto } from '@/types';

// Typ błędu dla symulowanych odpowiedzi
interface MockError {
  message: string;
}

// Funkcja symulująca autentykację (do momentu skonfigurowania rzeczywistego Supabase)
const mockAuth = {
  signInWithPassword: async ({ email }: { email: string; password: string }) => {
    // Symulacja opóźnienia zapytania
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: {
        user: {
          id: 'mock-user-id',
          email,
          created_at: new Date().toISOString()
        },
        session: {
          access_token: 'mock-access-token'
        }
      },
      error: null as MockError | null
    };
  },
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { error: null as MockError | null };
  }
};

interface AuthCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const register = useCallback(async ({ email, password }: AuthCredentials) => {
    try {
      setError(null);
      setLoading(true);
      
      // Wykonanie zapytania do API zamiast używania mocka
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      // Obsługa błędów
      if (!response.ok) {
        const errorMessage = data.error || 'Wystąpił błąd podczas rejestracji';
        setError(errorMessage);
        return null;
      }
      
      // Sukces rejestracji
      const userData: UserDto = {
        id: data.id,
        email: data.email,
        created_at: data.created_at
      };
      
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Wystąpił nieoczekiwany błąd podczas rejestracji');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const login = useCallback(async ({ email, password }: AuthCredentials) => {
    try {
      setError(null);
      setLoading(true);
      
      // Używamy rzeczywistego endpointu API zamiast mocka
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      // Obsługa błędów
      if (!response.ok) {
        const errorMessage = data.message || 'Wystąpił błąd podczas logowania';
        setError(errorMessage);
        return null;
      }
      
      // Zapisanie tokenu do localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        
        // Zapisanie tokenu również jako ciasteczko
        document.cookie = `auth_token=${data.token}; path=/; max-age=2592000; SameSite=Strict`;
      }
      
      // Zapisanie danych użytkownika
      if (data.user) {
        setUser(data.user);
        
        // Opcjonalnie możemy zapisać podstawowe dane użytkownika
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_email', data.user.email);
      }
      
      return data as LoginResponseDto;
    } catch (err) {
      console.error('Error during login:', err);
      setError('Wystąpił nieoczekiwany błąd podczas logowania');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Używamy mocka zamiast faktycznego supabase do momentu konfiguracji
      const { error } = await mockAuth.signOut();
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      // Czyszczenie danych z localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      
      setUser(null);
      return true;
    } catch (err) {
      console.error('Error during logout:', err);
      setError('Wystąpił nieoczekiwany błąd podczas wylogowywania');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };
} 