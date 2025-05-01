# Plan implementacji widoku autentykacji

## 1. Przegląd
Widok autentykacji stanowi punkt wejścia do aplikacji 10xProject dla niezalogowanych użytkowników. Umożliwia logowanie istniejących użytkowników oraz rejestrację nowych. Interfejs składa się z karty z zakładkami zawierającej formularze logowania i rejestracji, wraz z walidacją w czasie rzeczywistym i obsługą błędów.

## 2. Routing widoku
- Ścieżka: `/auth`
- Przekierowania:
  - Po udanym logowaniu lub rejestracji → `/` (dashboard)
  - Próba dostępu do `/auth` przez zalogowanego użytkownika → `/` (dashboard)

## 3. Struktura komponentów
```
AuthLayout (Astro)
└── AuthPage (Astro)
    └── AuthTabs (React)
        ├── LoginForm (React)
        │   ├── InputField (email)
        │   ├── PasswordInput (password)
        │   └── FormErrorMessage
        └── RegisterForm (React)
            ├── InputField (email)
            ├── PasswordInput (password)
            ├── PasswordStrengthIndicator
            └── FormErrorMessage
```

## 4. Szczegóły komponentów

### AuthLayout (Astro)
- Opis komponentu: Bazowy layout dla stron autentykacji zawierający logo, nagłówek i stopkę.
- Główne elementy: Container z logo aplikacji, slot dla zawartości, stopka.
- Obsługiwane interakcje: Brak (statyczny komponent).
- Obsługiwana walidacja: Brak.
- Typy: Brak specyficznych typów (komponent Astro).
- Propsy: `title?: string` - opcjonalny tytuł strony.

### AuthPage (Astro)
- Opis komponentu: Strona widoku autentykacji ładująca komponent AuthTabs.
- Główne elementy: Card z biblioteki Shadcn/ui zawierająca komponent AuthTabs.
- Obsługiwane interakcje: Przekazywanie początkowej aktywnej zakładki.
- Obsługiwana walidacja: Sprawdzanie statusu autentykacji na poziomie SSR.
- Typy: Brak specyficznych typów (komponent Astro).
- Propsy: Brak (renderowany jako strona).

### AuthTabs (React)
- Opis komponentu: Komponent z zakładkami przełączającymi między formularzami logowania i rejestracji.
- Główne elementy: Komponenty Tabs i TabsContent z biblioteki Shadcn/ui.
- Obsługiwane interakcje: Zmiana aktywnej zakładki.
- Obsługiwana walidacja: Brak.
- Typy: AuthTabsProps.
- Propsy: `defaultTab?: "login" | "register"` - domyślnie aktywna zakładka.

### LoginForm (React)
- Opis komponentu: Formularz logowania z polami email i hasło.
- Główne elementy: Form, InputField, PasswordInput, Button, FormErrorMessage.
- Obsługiwane interakcje: 
  - Wypełnianie pól formularza
  - Przełączanie widoczności hasła
  - Wysyłanie formularza
- Obsługiwana walidacja:
  - Email: poprawny format adresu email
  - Hasło: wymagane
- Typy: LoginFormState, LoginRequestDto, LoginResponseDto.
- Propsy: `onSuccess?: () => void` - opcjonalny callback wywoływany po udanym logowaniu.

### RegisterForm (React)
- Opis komponentu: Formularz rejestracji z polami email, hasło i wskaźnikiem siły hasła.
- Główne elementy: Form, InputField, PasswordInput, PasswordStrengthIndicator, Button, FormErrorMessage.
- Obsługiwane interakcje:
  - Wypełnianie pól formularza
  - Przełączanie widoczności hasła
  - Wysyłanie formularza
- Obsługiwana walidacja:
  - Email: poprawny format adresu email
  - Hasło: min. 8 znaków, duża litera, cyfra, znak specjalny
- Typy: RegisterFormState, RegisterUserDto, UserDto.
- Propsy: `onSuccess?: () => void` - opcjonalny callback wywoływany po udanej rejestracji.

### InputField (React)
- Opis komponentu: Reużywalny komponent pola formularza z etykietą i obsługą błędów.
- Główne elementy: Input, Label, ErrorMessage z biblioteki Shadcn/ui.
- Obsługiwane interakcje: Wprowadzanie danych, focus, blur.
- Obsługiwana walidacja: Przekazywana z zewnątrz.
- Typy: InputFieldProps.
- Propsy: 
  - `id: string` - identyfikator pola
  - `name: string` - nazwa pola
  - `type: string` - typ pola (text, email, etc.)
  - `value: string` - wartość pola
  - `label: string` - etykieta pola
  - `placeholder?: string` - podpowiedź
  - `error?: string` - komunikat błędu
  - `disabled?: boolean` - czy pole jest zablokowane
  - `required?: boolean` - czy pole jest wymagane
  - `onChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - handler zmiany wartości
  - `onBlur?: () => void` - handler utraty fokusu

### PasswordInput (React)
- Opis komponentu: Specjalizowane pole do wprowadzania hasła z możliwością przełączania widoczności.
- Główne elementy: InputField, Button z ikoną oka.
- Obsługiwane interakcje: Wprowadzanie hasła, przełączanie widoczności hasła.
- Obsługiwana walidacja: Opcjonalnie siła hasła.
- Typy: PasswordInputProps.
- Propsy: 
  - `id: string` - identyfikator pola
  - `name: string` - nazwa pola
  - `value: string` - wartość pola
  - `label: string` - etykieta pola
  - `placeholder?: string` - podpowiedź
  - `error?: string` - komunikat błędu
  - `disabled?: boolean` - czy pole jest zablokowane
  - `required?: boolean` - czy pole jest wymagane
  - `showStrengthIndicator?: boolean` - czy pokazywać wskaźnik siły hasła
  - `onChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - handler zmiany wartości
  - `onBlur?: () => void` - handler utraty fokusu

### PasswordStrengthIndicator (React)
- Opis komponentu: Wskaźnik siły hasła z wizualną reprezentacją i wskazówkami.
- Główne elementy: Progress bar, lista wskazówek.
- Obsługiwane interakcje: Brak bezpośrednich interakcji.
- Obsługiwana walidacja: Ocena siły hasła.
- Typy: PasswordStrengthIndicatorProps.
- Propsy: `password: string` - hasło do oceny.

### FormErrorMessage (React)
- Opis komponentu: Wyświetla ogólny błąd formularza.
- Główne elementy: Alert z biblioteki Shadcn/ui.
- Obsługiwane interakcje: Brak bezpośrednich interakcji.
- Obsługiwana walidacja: Brak.
- Typy: FormErrorMessageProps.
- Propsy: `error: string | null` - treść błędu.

## 5. Typy

### Podstawowe typy
```typescript
// Wykorzystujemy istniejące typy z src/types.ts
import type { 
  RegisterUserDto, 
  UserDto, 
  LoginRequestDto, 
  LoginResponseDto 
} from '@/types';
```

### Nowe typy

```typescript
// src/components/auth/types.ts

export interface AuthTabsProps {
  defaultTab?: "login" | "register";
}

export interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  value: string;
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export interface PasswordInputProps extends Omit<InputFieldProps, 'type'> {
  showStrengthIndicator?: boolean;
}

export interface FormErrorMessageProps {
  error: string | null;
}

export interface PasswordStrengthIndicatorProps {
  password: string;
}

export interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  validationErrors: {
    email?: string;
    password?: string;
  };
}

export interface RegisterFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  validationErrors: {
    email?: string;
    password?: string;
  };
}
```

## 6. Zarządzanie stanem

### Hook useAuth
```typescript
// src/lib/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/db/supabase';
import type { 
  RegisterUserDto, 
  UserDto, 
  LoginRequestDto, 
  LoginResponseDto 
} from '@/types';

export function useAuth() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const register = useCallback(async (data: RegisterUserDto): Promise<UserDto | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });
      
      if (authError) {
        setError(mapAuthError(authError));
        return null;
      }
      
      if (authData?.user) {
        const userData: UserDto = {
          id: authData.user.id,
          email: authData.user.email || '',
          created_at: authData.user.created_at || new Date().toISOString()
        };
        setUser(userData);
        return userData;
      }
      
      return null;
    } catch (err) {
      setError('Wystąpił nieoczekiwany błąd podczas rejestracji.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const login = useCallback(async (data: LoginRequestDto): Promise<LoginResponseDto | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (authError) {
        setError(mapAuthError(authError));
        return null;
      }
      
      if (authData?.user && authData?.session) {
        const userData: UserDto = {
          id: authData.user.id,
          email: authData.user.email || '',
          created_at: authData.user.created_at || new Date().toISOString()
        };
        
        const response: LoginResponseDto = {
          token: authData.session.access_token,
          user: userData
        };
        
        setUser(userData);
        return response;
      }
      
      return null;
    } catch (err) {
      setError('Wystąpił nieoczekiwany błąd podczas logowania.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      setError('Wystąpił błąd podczas wylogowywania.');
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

function mapAuthError(error: any): string {
  const errorMap: Record<string, string> = {
    'invalid_credentials': 'Nieprawidłowy email lub hasło.',
    'user_already_exists': 'Użytkownik o podanym adresie email już istnieje.',
    'email_not_confirmed': 'Adres email nie został potwierdzony.',
  };
  
  return errorMap[error.message] || 'Wystąpił błąd podczas operacji autentykacji.';
}
```

### Hook useForm
```typescript
// src/lib/hooks/useForm.ts
import { useState, useCallback } from 'react';

export function useForm<T extends Record<string, any>>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const validate = useCallback((validators: Record<keyof T, (value: any) => string | null>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    
    for (const field in validators) {
      const error = validators[field](values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  }, [values]);
  
  const handleSubmit = useCallback((validators: Record<keyof T, (value: any) => string | null>, onSubmit: (values: T) => Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (isSubmitting) return;
      
      setIsSubmitting(true);
      
      if (validate(validators)) {
        await onSubmit(values);
      }
      
      setIsSubmitting(false);
    };
  }, [isSubmitting, validate, values]);
  
  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);
  
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    validate,
    handleSubmit,
    reset,
    setValues
  };
}
```

### Hook usePasswordStrength
```typescript
// src/lib/hooks/usePasswordStrength.ts
import { useMemo } from 'react';

export interface PasswordStrength {
  score: number; // 0-100
  label: string; // "słabe", "średnie", "silne"
  color: string; // klasa Tailwind dla koloru
  suggestions: string[]; // sugestie poprawy
}

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    let score = 0;
    const suggestions: string[] = [];
    
    if (!password) {
      return {
        score: 0,
        label: 'brak',
        color: 'bg-gray-300',
        suggestions: ['Wprowadź hasło']
      };
    }
    
    // Długość hasła
    if (password.length < 8) {
      suggestions.push('Hasło powinno mieć co najmniej 8 znaków');
    } else {
      score += 20;
    }
    
    // Duża litera
    if (!/[A-Z]/.test(password)) {
      suggestions.push('Dodaj co najmniej jedną dużą literę');
    } else {
      score += 20;
    }
    
    // Mała litera
    if (!/[a-z]/.test(password)) {
      suggestions.push('Dodaj co najmniej jedną małą literę');
    } else {
      score += 20;
    }
    
    // Cyfra
    if (!/[0-9]/.test(password)) {
      suggestions.push('Dodaj co najmniej jedną cyfrę');
    } else {
      score += 20;
    }
    
    // Znak specjalny
    if (!/[^A-Za-z0-9]/.test(password)) {
      suggestions.push('Dodaj co najmniej jeden znak specjalny');
    } else {
      score += 20;
    }
    
    // Określenie etykiety i koloru na podstawie wyniku
    let label: string;
    let color: string;
    
    if (score < 40) {
      label = 'słabe';
      color = 'bg-red-500';
    } else if (score < 80) {
      label = 'średnie';
      color = 'bg-yellow-500';
    } else {
      label = 'silne';
      color = 'bg-green-500';
    }
    
    return { score, label, color, suggestions };
  }, [password]);
}
```

## 7. Integracja API
Integracja z Supabase Auth API poprzez klienta Supabase.

### Inicjalizacja klienta Supabase
```typescript
// src/db/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

### Endpoint logowania
- URL: `/api/users/login`
- Metoda: POST
- Request: LoginRequestDto
- Response: LoginResponseDto
- Błędy: 400 Bad Request, 401 Unauthorized

```typescript
// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro';
import { supabase } from '@/db/supabase';
import { loginSchema } from '@/lib/validators/auth';
import type { LoginRequestDto, LoginResponseDto } from '@/types';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Walidacja danych wejściowych
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowe dane wejściowe', details: result.error.format() }),
        { status: 400 }
      );
    }
    
    const { email, password } = result.data as LoginRequestDto;
    
    // Logowanie przez Supabase
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 401 }
      );
    }
    
    // Formatowanie odpowiedzi
    const response: LoginResponseDto = {
      token: authData.session.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        created_at: authData.user.created_at
      }
    };
    
    return new Response(
      JSON.stringify(response),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Wystąpił błąd podczas przetwarzania żądania.' }),
      { status: 500 }
    );
  }
};
```

### Endpoint rejestracji
- URL: `/api/users/register`
- Metoda: POST
- Request: RegisterUserDto
- Response: UserDto
- Błędy: 400 Bad Request, 409 Conflict

```typescript
// src/pages/api/auth/register.ts
import type { APIRoute } from 'astro';
import { supabase } from '@/db/supabase';
import { registerSchema } from '@/lib/validators/auth';
import type { RegisterUserDto, UserDto } from '@/types';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Walidacja danych wejściowych
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowe dane wejściowe', details: result.error.format() }),
        { status: 400 }
      );
    }
    
    const { email, password } = result.data as RegisterUserDto;
    
    // Rejestracja przez Supabase
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        return new Response(
          JSON.stringify({ error: 'Użytkownik o podanym adresie email już istnieje.' }),
          { status: 409 }
        );
      }
      
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      );
    }
    
    // Formatowanie odpowiedzi
    const response: UserDto = {
      id: authData.user?.id || '',
      email: authData.user?.email || '',
      created_at: authData.user?.created_at || ''
    };
    
    return new Response(
      JSON.stringify(response),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Wystąpił błąd podczas przetwarzania żądania.' }),
      { status: 500 }
    );
  }
};
```

## 8. Interakcje użytkownika

### 1. Przełączanie zakładek
- **Akcja**: Użytkownik klika zakładkę "Logowanie" lub "Rejestracja"
- **Rezultat**: Zmiana aktywnej zakładki i wyświetlenie odpowiedniego formularza

### 2. Wypełnianie formularza logowania
- **Akcja**: Użytkownik wprowadza email i hasło
- **Rezultat**: Walidacja pól w czasie rzeczywistym, wyświetlanie komunikatów o błędach

### 3. Wysłanie formularza logowania
- **Akcja**: Użytkownik klika przycisk "Zaloguj"
- **Rezultat**:
  - W przypadku sukcesu: przekierowanie do dashboardu
  - W przypadku błędu: wyświetlenie komunikatu o błędzie

### 4. Wypełnianie formularza rejestracji
- **Akcja**: Użytkownik wprowadza email i hasło
- **Rezultat**: 
  - Walidacja pól w czasie rzeczywistym
  - Wyświetlenie wskaźnika siły hasła
  - Pokazanie sugestii poprawy hasła

### 5. Wysłanie formularza rejestracji
- **Akcja**: Użytkownik klika przycisk "Zarejestruj"
- **Rezultat**:
  - W przypadku sukcesu: przekierowanie do dashboardu lub na stronę weryfikacji email
  - W przypadku błędu: wyświetlenie komunikatu o błędzie

### 6. Przełączanie widoczności hasła
- **Akcja**: Użytkownik klika ikonę oka w polu hasła
- **Rezultat**: Zmiana typu pola między "password" a "text"

## 9. Warunki i walidacja

### Walidacja formularza logowania
- **Email**:
  - Wymagane pole
  - Poprawny format adresu email (`example@domain.com`)
- **Hasło**:
  - Wymagane pole

### Walidacja formularza rejestracji
- **Email**:
  - Wymagane pole
  - Poprawny format adresu email (`example@domain.com`)
  - Unikalność adresu (sprawdzana na poziomie API)
- **Hasło**:
  - Wymagane pole
  - Minimalna długość: 8 znaków
  - Zawiera co najmniej jedną dużą literę
  - Zawiera co najmniej jedną cyfrę
  - Zawiera co najmniej jeden znak specjalny

### Walidatory
```typescript
// src/lib/validators/auth.ts
import { z } from 'zod';
import type { RegisterUserDto, LoginRequestDto } from '@/types';

export const registerSchema = z.object({
  email: z.string()
    .min(1, 'Email jest wymagany')
    .email('Niepoprawny format adresu email'),
  password: z.string()
    .min(8, 'Hasło musi mieć co najmniej 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną dużą literę')
    .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
    .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać co najmniej jeden znak specjalny')
}) satisfies z.ZodType<RegisterUserDto>;

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email jest wymagany')
    .email('Niepoprawny format adresu email'),
  password: z.string().min(1, 'Hasło jest wymagane')
}) satisfies z.ZodType<LoginRequestDto>;
```

## 10. Obsługa błędów

### Błędy walidacji formularza
- Wyświetlanie komunikatów pod odpowiednimi polami
- Blokowanie wysłania formularza w przypadku błędów walidacji

### Błędy API
- **Logowanie**:
  - 401 Unauthorized: "Nieprawidłowy email lub hasło"
  - 400 Bad Request: "Nieprawidłowe dane wejściowe"
  - 500 Internal Server Error: "Wystąpił błąd podczas przetwarzania żądania"
- **Rejestracja**:
  - 409 Conflict: "Użytkownik o podanym adresie email już istnieje"
  - 400 Bad Request: "Nieprawidłowe dane wejściowe"
  - 500 Internal Server Error: "Wystąpił błąd podczas przetwarzania żądania"

### Prezentacja błędów
- Błędy walidacji formularza: pod odpowiednimi polami
- Błędy API: na górze formularza w komponencie FormErrorMessage

## 11. Kroki implementacji

1. **Przygotowanie struktury plików**:
   - Utwórz katalog `/src/components/auth`
   - Utwórz plik `/src/layouts/AuthLayout.astro`
   - Utwórz plik `/src/pages/auth/index.astro`

2. **Implementacja typów**:
   - Utwórz plik `/src/components/auth/types.ts` z definicjami typów

3. **Implementacja walidatorów**:
   - Utwórz plik `/src/lib/validators/auth.ts` z schematami walidacji Zod

4. **Implementacja hooków**:
   - Utwórz plik `/src/lib/hooks/useForm.ts`
   - Utwórz plik `/src/lib/hooks/useAuth.ts`
   - Utwórz plik `/src/lib/hooks/usePasswordStrength.ts`

5. **Implementacja komponentów pomocniczych**:
   - Zaimplementuj `/src/components/auth/InputField.tsx`
   - Zaimplementuj `/src/components/auth/PasswordInput.tsx`
   - Zaimplementuj `/src/components/auth/FormErrorMessage.tsx`
   - Zaimplementuj `/src/components/auth/PasswordStrengthIndicator.tsx`

6. **Implementacja formularzy**:
   - Zaimplementuj `/src/components/auth/LoginForm.tsx`
   - Zaimplementuj `/src/components/auth/RegisterForm.tsx`

7. **Implementacja zakładek**:
   - Zaimplementuj `/src/components/auth/AuthTabs.tsx`

8. **Implementacja endpointów API**:
   - Zaimplementuj `/src/pages/api/auth/login.ts`
   - Zaimplementuj `/src/pages/api/auth/register.ts`

9. **Implementacja layoutu i strony**:
   - Zaimplementuj `/src/layouts/AuthLayout.astro`
   - Zaimplementuj `/src/pages/auth/index.astro`

10. **Implementacja middleware**:
    - Rozszerz `/src/middleware/index.ts` o obsługę zabezpieczania stron

11. **Testowanie**:
    - Testowanie formularza logowania
    - Testowanie formularza rejestracji
    - Testowanie walidacji
    - Testowanie przekierowań
    - Testowanie obsługi błędów

12. **Finalizacja**:
    - Implementacja brakujących funkcjonalności
    - Ostateczne poprawki stylistyczne
    - Dokumentacja komponentów 