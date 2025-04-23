# API Endpoint Implementation Plan: Flashcards API

## 1. Przegląd punktu końcowego

Implementacja dwóch endpointów REST API dla zarządzania fiszkami:
- `POST /api/flashcards` - Tworzenie nowej fiszki manualnie
- `GET /api/flashcards` - Pobieranie listy fiszek z opcjonalną paginacją, sortowaniem i filtrowaniem

Endpoints będą używać Supabase jako backend i będą implementowane w Astro z wykorzystaniem TypeScript.

## 2. Szczegóły żądania

### POST /api/flashcards

- **Metoda HTTP:** POST
- **Struktura URL:** `/api/flashcards`
- **Parametry:** Brak
- **Request Body:**
  ```typescript
  {
    front: string, // max 200 znaków
    back: string,  // max 500 znaków
    source: "manual"
  }
  ```

### GET /api/flashcards

- **Metoda HTTP:** GET
- **Struktura URL:** `/api/flashcards`
- **Parametry:**
  - Opcjonalne:
    - `page`: number - Numer strony do pobrania
    - `limit`: number - Limit wyników na stronę
    - `sort_by`: string - Pole do sortowania (dozwolone: id, front, back, created_at, updated_at)
    - `filter[source]`: string - Filtrowanie po źródle (manual, ai-full, ai-edited)
- **Request Body:** Brak

## 3. Wykorzystywane typy

```typescript
// Typy z src/types.ts
import type {
  CreateFlashcardDto,
  FlashcardDto,
  FlashcardListResponseDto,
  FlashcardQueryParams,
  PaginationDto,
  FlashcardEntity
} from "../types";

// Nowe typy do walidacji
import { z } from "zod";

// Schemat walidacji dla tworzenia fiszki
export const createFlashcardSchema = z.object({
  front: z.string().max(200, "Front nie może przekraczać 200 znaków"),
  back: z.string().max(500, "Back nie może przekraczać 500 znaków"),
  source: z.literal("manual")
});

// Schemat walidacji dla parametrów query
export const flashcardQuerySchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
  sort_by: z.enum(["id", "front", "back", "created_at", "updated_at"]).optional(),
  filter: z.object({
    source: z.enum(["manual", "ai-full", "ai-edited"]).optional()
  }).optional()
});
```

## 4. Szczegóły odpowiedzi

### POST /api/flashcards

- **Kod sukcesu:** 201 Created
- **Response Body:**
  ```typescript
  {
    id: number,
    front: string,
    back: string,
    user_id: string, // UUID
    created_at: string, // timestamp
    updated_at: string  // timestamp
  }
  ```

- **Kody błędów:**
  - 400 Bad Request (błąd walidacji)
  - 401 Unauthorized (brak autoryzacji)
  - 500 Internal Server Error (błąd serwera)

### GET /api/flashcards

- **Kod sukcesu:** 200 OK
- **Response Body:**
  ```typescript
  {
    flashcards: [
      {
        id: number,
        front: string,
        back: string,
        user_id: string, // UUID
        created_at: string, // timestamp
        updated_at: string  // timestamp
      },
      // więcej fiszek
    ],
    pagination: {
      page: number,
      limit: number,
      total: number
    }
  }
  ```

- **Kody błędów:**
  - 400 Bad Request (nieprawidłowe parametry)
  - 401 Unauthorized (brak autoryzacji)
  - 500 Internal Server Error (błąd serwera)

## 5. Przepływ danych

### POST /api/flashcards

1. Żądanie trafia do endpointu `/api/flashcards`
2. Middleware Astro sprawdza autentykację
3. Dane są walidowane przy użyciu Zod
4. Pobieranie ID użytkownika z kontekstu Supabase
5. Dane są zapisywane w tabeli `flashcards` przy użyciu klienta Supabase
6. Zwracany jest nowo utworzony obiekt fiszki

### GET /api/flashcards

1. Żądanie trafia do endpointu `/api/flashcards` z opcjonalnymi parametrami query
2. Middleware Astro sprawdza autentykację
3. Parametry query są walidowane przy użyciu Zod
4. Pobieranie ID użytkownika z kontekstu Supabase
5. Budowanie zapytania Supabase z uwzględnieniem:
   - Filtrowania po user_id (zawsze)
   - Dodatkowego filtrowania (jeśli podano)
   - Sortowania (domyślnie: created_at DESC)
   - Paginacji (domyślnie: page=1, limit=20)
6. Wykonanie zapytania count dla obliczenia paginacji
7. Zwrócenie listy fiszek wraz z informacjami o paginacji

## 6. Względy bezpieczeństwa

1. **Autentykacja**:
   - Wykorzystanie middleware Astro do sprawdzania autentykacji
   - Używanie Supabase do weryfikacji tokenu JWT
   - Dostęp do klienta Supabase przez `context.locals.supabase`

2. **Autoryzacja**:
   - Implementacja Row Level Security (RLS) w Supabase:
     ```sql
     CREATE POLICY "Użytkownicy mogą czytać własne fiszki"
     ON public.flashcards FOR SELECT
     USING (auth.uid() = user_id);

     CREATE POLICY "Użytkownicy mogą tworzyć własne fiszki"
     ON public.flashcards FOR INSERT
     WITH CHECK (auth.uid() = user_id);
     ```

3. **Walidacja danych**:
   - Rygorystyczna walidacja wszystkich danych wejściowych przy użyciu Zod
   - Ograniczenie długości pól zgodnie ze specyfikacją
   - Weryfikacja poprawności typów danych

4. **Ochrona przed atakami**:
   - Supabase automatycznie zabezpiecza przed SQL Injection
   - Walidacja zapobiega atakom XSS przez ograniczenie długości pól
   - Używanie prepared statements w zapytaniach do bazy danych

## 7. Obsługa błędów

### Typy błędów i odpowiednie statusy HTTP:

1. **Błędy walidacji (400 Bad Request)**:
   - Nieprawidłowa długość pól
   - Brak wymaganych pól
   - Nieprawidłowy format danych
   - Nieprawidłowe parametry query

2. **Błędy autentykacji (401 Unauthorized)**:
   - Brak tokenu JWT
   - Nieprawidłowy token JWT
   - Wygaśnięty token JWT

3. **Błędy autoryzacji (403 Forbidden)**:
   - Próba dostępu do zasobów innego użytkownika

4. **Błędy serwera (500 Internal Server Error)**:
   - Problemy z bazą danych
   - Nieoczekiwane wyjątki
   - Błędy komunikacji z Supabase

### Struktura odpowiedzi błędów:

```typescript
{
  error: {
    code: string,     // Kod błędu (np. "VALIDATION_ERROR")
    message: string,  // Komunikat błędu dla użytkownika
    details?: any     // Opcjonalne szczegóły błędu (np. błędy walidacji)
  }
}
```

## 8. Rozważania dotyczące wydajności

1. **Indeksowanie**:
   - Indeks na kolumnie `user_id` w tabeli `flashcards` już istnieje
   - Indeks na kolumnie `created_at` dla efektywnego sortowania

2. **Paginacja**:
   - Domyślny limit wyników na stronę: 20
   - Maksymalny limit wyników na stronę: 100

3. **Cachowanie**:
   - Dodanie nagłówków cache-control dla odpowiedzi GET
   - Potencjalne wykorzystanie Astro do cachowania statycznych danych

4. **Optymalizacja zapytań**:
   - Wykorzystanie `.select()` dla określonych kolumn zamiast pobierania wszystkich
   - Użycie `.count()` w oddzielnym zapytaniu dla paginacji

## 9. Etapy wdrożenia

### 1. Przygotowanie struktury plików:

```
/src
  /pages
    /api
      /flashcards
        index.ts       # Implementacja GET i POST
  /lib
    /flashcards
      service.ts      # Logika biznesowa
      schemas.ts      # Schematy walidacji Zod
  /db
    supabase.client.ts # Klient Supabase
```

### 2. Implementacja schematów walidacji

Utworzenie pliku `/src/lib/flashcards/schemas.ts` z definicjami schematów Zod.

### 3. Implementacja serwisu

Utworzenie pliku `/src/lib/flashcards/service.ts` z logiką dla:
- Tworzenia fiszek
- Pobierania fiszek z filtrowaniem, sortowaniem i paginacją

### 4. Implementacja endpointów API

Utworzenie pliku `/src/pages/api/flashcards/index.ts` z obsługą:
- POST dla tworzenia fiszek
- GET dla pobierania fiszek

### 5. Testy jednostkowe

Testy dla:
- Walidacji danych wejściowych
- Logiki biznesowej
- Integracji z Supabase

### 6. Testy integracyjne

Testy endpoints API z wykorzystaniem narzędzi takich jak Postman lub supertest.

### 7. Dokumentacja API

Utworzenie dokumentacji API w formacie OpenAPI/Swagger.

### 8. Wdrożenie

Wdrożenie zmian w środowisku produkcyjnym z wykorzystaniem CI/CD. 