# API Endpoint Implementation Plan: User Registration

## 1. Przegląd punktu końcowego
Endpoint do rejestracji nowych użytkowników w aplikacji 10xProject. Przyjmuje dane uwierzytelniające użytkownika i tworzy nowe konto przy użyciu Supabase Auth.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: `/api/users/register`
- Parametry:
  - Wymagane: email, password
  - Opcjonalne: brak
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## 3. Wykorzystywane typy
- `RegisterUserDto`: Typ reprezentujący dane wejściowe (email, password)
- `UserDto`: Typ reprezentujący odpowiedź (id, email, created_at)

## 4. Szczegóły odpowiedzi
- Success (201 Created):
  ```json
  {
    "id": "UUID",
    "email": "string",
    "created_at": "timestamp"
  }
  ```
- Error (400 Bad Request):
  ```json
  {
    "error": "Validation error message"
  }
  ```
- Error (409 Conflict):
  ```json
  {
    "error": "User with this email already exists"
  }
  ```

## 5. Przepływ danych
1. Endpoint odbiera dane rejestracyjne
2. Dane są walidowane przy użyciu Zod
3. Zapytanie do Supabase sprawdza czy użytkownik już istnieje
4. Jeśli nie, Supabase Auth API tworzy nowego użytkownika
5. Endpoint zwraca dane użytkownika w formacie UserDto

## 6. Względy bezpieczeństwa
- Hasła nigdy nie są przechowywane w postaci plaintext
- Supabase Auth automatycznie hashuje hasła
- Walidacja email i hasła przed wysłaniem do bazy danych
- Ograniczenie liczby prób rejestracji z jednego IP (rate limiting)
- Serwer powinien zwracać ogólne komunikaty błędów, aby uniknąć wycieków informacji

## 7. Obsługa błędów
- Brak wymaganych pól lub nieprawidłowy format: 400 Bad Request
- Email już istnieje w bazie: 409 Conflict
- Problemy z usługą Supabase: 500 Internal Server Error
- Zbyt słabe hasło (nie spełnia wymogów): 400 Bad Request
- Nieprawidłowy format email: 400 Bad Request

## 8. Rozważania dotyczące wydajności
- Minimalizacja dodatkowych zapytań do bazy danych
- Optymalne wykorzystanie indeksów bazy danych (email posiada indeks UNIQUE)
- Asynchroniczna obsługa żądań

## 9. Etapy wdrożenia
1. Utwórz plik `src/pages/api/users/register.ts`
2. Zaimplementuj schemat walidacji Zod dla `RegisterUserDto`
3. Uzyskaj instancję klienta Supabase z kontekstu Astro: `const supabase = context.locals.supabase`
4. Zaimplementuj walidację danych wejściowych
5. Sprawdź czy użytkownik o podanym adresie email już istnieje
6. Zarejestruj użytkownika używając Supabase Auth API
7. Zwróć odpowiedź zgodnie ze schematem `UserDto`
8. Dodaj testy jednostkowe
9. Dodaj dokumentację w formacie komentarzy JSDoc

## 10. Przykładowa implementacja
```typescript
import { z } from 'zod';
import type { APIRoute } from 'astro';
import type { RegisterUserDto, UserDto } from '../../../types';

// Walidacja danych wejściowych
const registerUserSchema = z.object({
  email: z.string().email('Nieprawidłowy format adresu email'),
  password: z.string().min(8, 'Hasło musi zawierać co najmniej 8 znaków')
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parsowanie JSON z żądania
    const rawData = await request.json();
    
    // Walidacja danych wejściowych
    const parseResult = registerUserSchema.safeParse(rawData);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: parseResult.error.format() }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { email, password } = parseResult.data;
    const supabase = locals.supabase;
    
    // Sprawdzenie, czy użytkownik już istnieje
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Rejestracja użytkownika
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Przygotowanie odpowiedzi
    const userData: UserDto = {
      id: authData.user?.id || '',
      email: authData.user?.email || '',
      created_at: authData.user?.created_at || new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(userData),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
``` 