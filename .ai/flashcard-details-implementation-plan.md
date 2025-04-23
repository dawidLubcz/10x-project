# API Endpoint Implementation Plan: Get a Single Flashcard

## 1. Przegląd punktu końcowego
Endpoint umożliwia pobranie szczegółowych informacji o pojedynczej fiszce na podstawie jej identyfikatora. Dostęp do fiszki jest ograniczony do właściciela (zalogowanego użytkownika), a dane zwracane są w formacie JSON.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** `/api/flashcards/{id}`
- **Parametry:**
  - **Wymagane:** `id` (parametr ścieżki) - identyfikator fiszki
  - **Opcjonalne:** brak

## 3. Wykorzystywane typy
```typescript
// Już zdefiniowane w src/types.ts:
import type { FlashcardDto } from '../types';
```

## 4. Szczegóły odpowiedzi
- **Kod 200 OK:**
  ```typescript
  {
    id: number;
    front: string;
    back: string;
    user_id: string; // UUID
    created_at: string; // timestamp
    updated_at: string; // timestamp
  }
  ```
- **Kod 401 Unauthorized:** Użytkownik nie jest uwierzytelniony
- **Kod 404 Not Found:** Fiszka o podanym ID nie istnieje lub nie należy do użytkownika

## 5. Przepływ danych
1. Odebranie żądania HTTP GET z parametrem ID
2. Ekstrakcja ID z parametru ścieżki
3. Walidacja ID przy użyciu Zod
4. Pobranie zalogowanego użytkownika z kontekstu Astro
5. Użycie klienta Supabase do pobrania fiszki z bazy danych, filtrując po ID i ID użytkownika
6. Sprawdzenie czy fiszka istnieje
7. Konwersja danych do formatu FlashcardDto
8. Zwrócenie odpowiedzi JSON

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie:** Endpoint wymaga zalogowanego użytkownika (JWT token)
- **Autoryzacja:** Fiszka musi należeć do zalogowanego użytkownika (weryfikacja user_id)
- **Walidacja danych:** Parametr ID musi być liczbą całkowitą
- **Zabezpieczenia bazy danych:** Wykorzystanie Row Level Security (RLS) w Supabase jako dodatkowej warstwy ochrony

## 7. Obsługa błędów
- **Nieprawidłowe ID:** Walidacja przy użyciu Zod, zwrócenie 400 Bad Request
- **Brak uwierzytelnienia:** Zwrócenie 401 Unauthorized
- **Fiszka nie istnieje:** Zwrócenie 404 Not Found
- **Fiszka nie należy do użytkownika:** Zwrócenie 404 Not Found (ze względów bezpieczeństwa nie ujawniamy, że fiszka istnieje)
- **Błędy serwera:** Zwrócenie 500 Internal Server Error z odpowiednim logowaniem

## 8. Rozważania dotyczące wydajności
- Endpoint wykorzystuje indeks na kolumnie `id` w tabeli `flashcards`
- Filtrowanie po `user_id` korzysta z indeksu zdefiniowanego w schemacie bazy danych
- Odpowiedzi są zwracane bezpośrednio, bez dodatkowych transformacji danych

## 9. Etapy wdrożenia

1. **Utworzenie serwisu do obsługi fiszek (jeśli nie istnieje):**
   ```typescript
   // src/lib/services/flashcard.service.ts
   import { createClient } from '@supabase/supabase-js';
   import type { FlashcardDto } from '../../types';
   import { z } from 'zod';

   export const idSchema = z.coerce.number().int().positive();

   export class FlashcardService {
     constructor(private supabase: ReturnType<typeof createClient>) {}

     async getFlashcardById(id: number, userId: string): Promise<FlashcardDto | null> {
       const { data, error } = await this.supabase
         .from('flashcards')
         .select('id, front, back, user_id, created_at, updated_at')
         .eq('id', id)
         .eq('user_id', userId)
         .single();

       if (error) {
         if (error.code === 'PGRST116') {
           return null; // Nie znaleziono fiszki
         }
         throw error;
       }

       return data as FlashcardDto;
     }
   }
   ```

2. **Implementacja handlera API w Astro:**
   ```typescript
   // src/pages/api/flashcards/[id].ts
   import type { APIRoute } from 'astro';
   import { FlashcardService, idSchema } from '../../../lib/services/flashcard.service';
   import { ZodError } from 'zod';

   export const GET: APIRoute = async ({ params, locals, request }) => {
     // Sprawdzenie uwierzytelnienia
     const session = locals.session;
     if (!session) {
       return new Response(JSON.stringify({ error: 'Unauthorized' }), {
         status: 401,
         headers: { 'Content-Type': 'application/json' }
       });
     }

     try {
       // Walidacja ID
       const { id } = params;
       const validatedId = idSchema.parse(id);

       // Pobranie fiszki z serwisu
       const flashcardService = new FlashcardService(locals.supabase);
       const flashcard = await flashcardService.getFlashcardById(validatedId, session.user.id);

       // Sprawdzenie czy fiszka istnieje
       if (!flashcard) {
         return new Response(JSON.stringify({ error: 'Flashcard not found' }), {
           status: 404,
           headers: { 'Content-Type': 'application/json' }
         });
       }

       // Zwrócenie danych fiszki
       return new Response(JSON.stringify(flashcard), {
         status: 200,
         headers: { 'Content-Type': 'application/json' }
       });
     } catch (error) {
       // Obsługa błędów walidacji
       if (error instanceof ZodError) {
         return new Response(JSON.stringify({ error: 'Invalid flashcard ID' }), {
           status: 400,
           headers: { 'Content-Type': 'application/json' }
         });
       }

       // Logowanie błędu
       console.error('Error fetching flashcard:', error);

       // Zwrócenie ogólnego błędu serwera
       return new Response(JSON.stringify({ error: 'Internal server error' }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' }
       });
     }
   };

   // Ustawienie eksportu do SSR
   export const prerender = false;
   ```

3. **Dodanie testów jednostkowych:**
   ```typescript
   // tests/flashcard.service.test.ts
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import { FlashcardService } from '../src/lib/services/flashcard.service';

   describe('FlashcardService', () => {
     let mockSupabase: any;
     let service: FlashcardService;

     beforeEach(() => {
       // Mock dla klienta Supabase
       mockSupabase = {
         from: vi.fn().mockReturnThis(),
         select: vi.fn().mockReturnThis(),
         eq: vi.fn().mockReturnThis(),
         single: vi.fn()
       };

       service = new FlashcardService(mockSupabase);
     });

     describe('getFlashcardById', () => {
       it('should return flashcard when found', async () => {
         // Arrange
         const mockFlashcard = {
           id: 1,
           front: 'Test front',
           back: 'Test back',
           user_id: 'user-123',
           created_at: '2023-01-01T00:00:00Z',
           updated_at: '2023-01-01T00:00:00Z'
         };

         mockSupabase.single.mockResolvedValue({ data: mockFlashcard, error: null });

         // Act
         const result = await service.getFlashcardById(1, 'user-123');

         // Assert
         expect(result).toEqual(mockFlashcard);
         expect(mockSupabase.from).toHaveBeenCalledWith('flashcards');
         expect(mockSupabase.eq).toHaveBeenCalledWith('id', 1);
         expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
       });

       it('should return null when flashcard not found', async () => {
         // Arrange
         mockSupabase.single.mockResolvedValue({
           data: null,
           error: { code: 'PGRST116' }
         });

         // Act
         const result = await service.getFlashcardById(999, 'user-123');

         // Assert
         expect(result).toBeNull();
       });

       it('should throw error on database failure', async () => {
         // Arrange
         const dbError = new Error('Database error');
         mockSupabase.single.mockResolvedValue({
           data: null,
           error: { code: 'OTHER_ERROR', message: 'Database error' }
         });

         // Act & Assert
         await expect(service.getFlashcardById(1, 'user-123')).rejects.toThrow();
       });
     });
   });
   ```

4. **Dodanie testów integracyjnych dla endpointu:**
   ```typescript
   // tests/api/flashcard-get.test.ts
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import { GET } from '../src/pages/api/flashcards/[id]';

   describe('GET /api/flashcards/:id', () => {
     let mockContext: any;

     beforeEach(() => {
       // Mock dla kontekstu Astro
       mockContext = {
         params: { id: '1' },
         locals: {
           session: {
             user: { id: 'user-123' }
           },
           supabase: {
             from: vi.fn().mockReturnThis(),
             select: vi.fn().mockReturnThis(),
             eq: vi.fn().mockReturnThis(),
             single: vi.fn()
           }
         },
         request: new Request('http://localhost/api/flashcards/1')
       };
     });

     it('should return 200 with flashcard data when found', async () => {
       // Arrange
       const mockFlashcard = {
         id: 1,
         front: 'Test front',
         back: 'Test back',
         user_id: 'user-123',
         created_at: '2023-01-01T00:00:00Z',
         updated_at: '2023-01-01T00:00:00Z'
       };

       mockContext.locals.supabase.single.mockResolvedValue({ data: mockFlashcard, error: null });

       // Act
       const response = await GET(mockContext);
       const data = await response.json();

       // Assert
       expect(response.status).toBe(200);
       expect(data).toEqual(mockFlashcard);
     });

     it('should return 401 when user is not authenticated', async () => {
       // Arrange
       mockContext.locals.session = null;

       // Act
       const response = await GET(mockContext);
       const data = await response.json();

       // Assert
       expect(response.status).toBe(401);
       expect(data.error).toContain('Unauthorized');
     });

     it('should return 404 when flashcard is not found', async () => {
       // Arrange
       mockContext.locals.supabase.single.mockResolvedValue({
         data: null,
         error: { code: 'PGRST116' }
       });

       // Act
       const response = await GET(mockContext);
       const data = await response.json();

       // Assert
       expect(response.status).toBe(404);
       expect(data.error).toContain('not found');
     });

     it('should return 400 when ID is invalid', async () => {
       // Arrange
       mockContext.params.id = 'invalid';

       // Act
       const response = await GET(mockContext);
       const data = await response.json();

       // Assert
       expect(response.status).toBe(400);
       expect(data.error).toContain('Invalid');
     });
   });
   ```

5. **Aktualizacja dokumentacji API (opcjonalnie):**
   Zaktualizuj plik dokumentacji API, aby zawierał informacje o nowym endpoincie, jego parametrach, wymaganiach dotyczących uwierzytelniania i możliwych odpowiedziach. 