# API Endpoint Implementation Plan: Flashcard Generation via AI

## 1. Przegląd punktu końcowego
Implementacja dwóch endpointów API do generowania i zarządzania fiszkami tworzonymi przez AI:
1. Inicjacja generowania fiszek - pozwala użytkownikom na przesłanie tekstu do przetworzenia przez AI
2. Zarządzanie wygenerowanymi fiszkami - umożliwia akceptację, edycję lub odrzucenie wygenerowanych fiszek

## 2. Szczegóły żądania

### 2.1. Inicjacja generowania fiszek
- **Metoda HTTP:** POST
- **URL:** `/api/generations`
- **Parametry:**
  - **Wymagane:** Brak (dane w body)
- **Request Body:**
  ```json
  {
    "inputText": "string (max 100 znaków)"
  }
  ```

### 2.2. Zarządzanie wygenerowanymi fiszkami
- **Metoda HTTP:** PATCH
- **URL:** `/api/generations/{generationId}/flashcards/{flashcardId}`
- **Parametry:**
  - **Wymagane:** 
    - `generationId` (w URL)
    - `flashcardId` (w URL)
  - **Opcjonalne:** Brak (dane w body)
- **Request Body:**
  ```json
  {
    "action": "accept" | "reject" | "edit",
    "front": "string (wymagane dla 'edit')",
    "back": "string (wymagane dla 'edit')"
  }
  ```

## 3. Wykorzystywane typy
- **InitiateGenerationDto**: Struktura żądania generacji fiszek
- **GenerationResponseDto**: Struktura odpowiedzi z wygenerowanymi fiszkami
- **GeneratedFlashcardDto**: Struktura pojedynczej fiszki
- **UpdateGeneratedFlashcardDto**: Struktura żądania aktualizacji fiszki
- **GeneratedFlashcardAction**: Enum akcji (accept, reject, edit)

## 4. Szczegóły odpowiedzi

### 4.1. Inicjacja generowania fiszek
- **Status Code:** 201 Created
- **Response Body:**
  ```json
  {
    "generationId": "number",
    "flashcards": [
      {
        "front": "string (max 1000 znaków)",
        "back": "string (max 1000 znaków)",
        "source": "ai-full"
      }
    ]
  }
  ```

### 4.2. Zarządzanie wygenerowanymi fiszkami
- **Status Code:** 200 OK
- **Response Body:** 
  - Dla akcji "accept"/"edit": Zaktualizowany obiekt fiszki
  - Dla akcji "reject": Komunikat potwierdzający

## 5. Przepływ danych

### 5.1. Inicjacja generowania fiszek
1. Walidacja danych wejściowych (długość tekstu)
2. Autoryzacja użytkownika przez middleware Astro
3. Generowanie hasha tekstu źródłowego
4. Wywołanie usługi AI (przez OpenRouter.ai) do generowania fiszek
5. Zapisanie wyników generacji w bazie danych Supabase
6. Zwrócenie wygenerowanych fiszek użytkownikowi

### 5.2. Zarządzanie wygenerowanymi fiszkami
1. Walidacja danych wejściowych (akcja, opcjonalne pola dla edycji)
2. Autoryzacja użytkownika
3. Pobranie danych generacji i fiszki z bazy danych
4. Weryfikacja właściciela zasobu
5. Wykonanie odpowiedniej akcji (akceptacja, edycja, odrzucenie)
6. Aktualizacja statystyk generacji
7. Zwrócenie odpowiednich danych użytkownikowi

## 6. Względy bezpieczeństwa
1. **Autoryzacja:** Użycie middleware Astro do weryfikacji tokenu JWT z Supabase
2. **Walidacja danych wejściowych:** Wykorzystanie Zod do walidacji struktur DTO
3. **Weryfikacja właściciela zasobu:** Sprawdzanie czy żądający użytkownik jest właścicielem zasobu
4. **Sanityzacja danych:** Oczyszczanie tekstów wejściowych i wyjściowych z potencjalnie niebezpiecznych znaczników
5. **Rate limiting:** Ograniczenie liczby żądań do AI dla poszczególnych użytkowników

## 7. Obsługa błędów
1. **400 Bad Request:**
   - Tekst wejściowy przekracza 100 znaków
   - Brakujące wymagane pola
   - Nieprawidłowa akcja
   - Brakujące pola `front` i `back` dla akcji "edit"
2. **401 Unauthorized:**
   - Brak tokenu JWT
   - Wygaśnięty token JWT
3. **404 Not Found:**
   - Nie znaleziono generacji o podanym ID
   - Nie znaleziono fiszki o podanym ID
4. **500 Internal Server Error:**
   - Błąd komunikacji z API AI
   - Błąd zapisu do bazy danych
   - Nieoczekiwane wyjątki

## 8. Rozważania dotyczące wydajności
1. **Optymalizacja zapytań do bazy danych:**
   - Indeksowanie kolumn `id` w tabelach `generations` i `flashcards`
   - Użycie joinów zamiast wielu zapytań
2. **Cachowanie:**
   - Rozważenie cachowania wyników generacji dla powtarzających się tekstów wejściowych
3. **Obsługa błędów AI:**
   - Implementacja mechanizmu retry dla nieudanych żądań do API AI
4. **Ograniczenie rozmiaru odpowiedzi:**
   - Limity wielkości generowanych fiszek (max 1000 znaków)

## 9. Etapy wdrożenia

### 9.1. Endpoint inicjacji generowania fiszek
1. Utworzenie schematu Zod dla walidacji `InitiateGenerationDto`
2. Utworzenie pliku `src/pages/api/generations.ts` z obsługą metody POST
3. Implementacja serwisu `AIGenerationService` w `src/lib/services/ai-generation.service.ts`
4. Implementacja metody generowania fiszek z wykorzystaniem OpenRouter.ai
5. Implementacja zapisu wyników generacji do Supabase
6. Dodanie obsługi błędów i walidacji
7. Implementacja testów jednostkowych i integracyjnych

### 9.2. Endpoint zarządzania wygenerowanymi fiszkami
1. Utworzenie schematu Zod dla walidacji `UpdateGeneratedFlashcardDto`
2. Utworzenie pliku `src/pages/api/generations/[generationId]/flashcards/[flashcardId].ts`
3. Implementacja metody PATCH do obsługi akcji
4. Rozszerzenie `AIGenerationService` o metody aktualizacji fiszek
5. Implementacja logiki dla każdej akcji (accept, reject, edit)
6. Dodanie aktualizacji statystyk generacji
7. Dodanie obsługi błędów i walidacji
8. Implementacja testów jednostkowych i integracyjnych

### 9.3. Dokumentacja
1. Aktualizacja dokumentacji API (Swagger/OpenAPI)
2. Dodanie przykładów użycia w dokumentacji
3. Opis kodów błędów i ich przyczyn 