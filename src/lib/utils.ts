import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to conditionally join class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Funkcje narzędziowe do obsługi tokenów i uwierzytelniania
 */

/**
 * Wyodrębnia token uwierzytelniający z nagłówka Cookie
 * @param cookieHeader - Wartość nagłówka Cookie
 * @param cookieName - Nazwa cookie do wyodrębnienia (domyślnie 'auth_token')
 * @returns Wartość tokenu lub null jeśli nie znaleziono
 */
export function extractTokenFromCookie(cookieHeader: string | null, cookieName: string = 'auth_token'): string | null {
  if (!cookieHeader) {
    return null;
  }
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const authCookie = cookies.find(c => c.startsWith(`${cookieName}=`));
  
  if (authCookie) {
    return authCookie.split('=')[1];
  }
  
  return null;
}

/**
 * Weryfikuje czy token jest obecny i zwraca informację czy użytkownik jest uwierzytelniony
 * @param token - Token uwierzytelniający
 * @returns Czy użytkownik jest uwierzytelniony
 */
export function isAuthenticated(token: string | null): boolean {
  return !!token;
}

/**
 * Przygotowuje nagłówki autoryzacyjne dla zapytań do API
 * @param token - Token uwierzytelniający
 * @returns Obiekt z nagłówkami uwierzytelniającymi
 */
export function getAuthHeaders(token: string | null): Record<string, string> {
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
}
