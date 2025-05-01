# API Endpoint Implementation Plan: User Login

## 1. Przegląd punktu końcowego
Endpoint `/api/users/login` umożliwia uwierzytelnienie użytkownika poprzez weryfikację danych logowania i zwrócenie tokenu JWT. Poprawnie zaimplementowany endpoint powinien być zgodny ze standardami bezpieczeństwa i wymaganiami aplikacji 10xProject.

## 2. Szczegóły żądania
- **Metoda HTTP**: POST
- **Struktura URL**: `/api/users/login`
- **Parametry**:
  - **Wymagane**: Brak (dane przesyłane w ciele żądania)
  - **Opcjonalne**: Brak
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## 3. Wykorzystywane typy
- **LoginRequestDto** - DTO zawierające dane logowania (email, password)
- **LoginResponseDto** - DTO zawierające token JWT oraz dane użytkownika
- **UserDto** - DTO zawierające podstawowe dane użytkownika (id, email)

## 4. Szczegóły odpowiedzi
- **Sukces (200 OK)**:
  ```json
  {
    "token": "JWT token",
    "user": {
      "id": "UUID",
      "email": "string"
    }
  }
  ```
- **Kody błędów**:
  - 400 Bad Request - nieprawidłowe dane wejściowe
  - 401 Unauthorized - nieprawidłowe dane uwierzytelniające

## 5. Przepływ danych
1. Endpoint otrzymuje żądanie POST z danymi logowania
2. Dane wejściowe są walidowane przy użyciu Zod
3. Serwis autoryzacyjny weryfikuje dane logowania za pomocą Supabase
4. W przypadku poprawnej weryfikacji:
   - Generowany jest token JWT
   - Pobierane są podstawowe dane użytkownika
   - Zwracana jest odpowiedź zawierająca token i dane użytkownika
5. W przypadku niepowodzenia:
   - Zwracany jest odpowiedni kod błędu (400/401)

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Wykorzystanie mechanizmów uwierzytelniania Supabase
- **Autoryzacja**: Nie dotyczy tego endpointu (tylko uwierzytelnianie)
- **Walidacja danych**: 
  - Sprawdzenie poprawności formatu email
  - Sprawdzenie obecności hasła
- **Ochrona przed atakami**:
  - Limitowanie prób logowania (rate limiting)
  - Bezpieczne przechowywanie haseł (przez Supabase)
  - Implementacja nagłówków bezpieczeństwa
- **Ochrona tokenu JWT**:
  - Ustawienie odpowiedniego czasu wygaśnięcia
  - Używanie bezpiecznych algorytmów szyfrowania

## 7. Obsługa błędów
- **400 Bad Request**:
  - Brak wymaganych pól (email/password)
  - Nieprawidłowy format email
- **401 Unauthorized**:
  - Nieprawidłowy email lub hasło
  - Konto użytkownika nie zostało potwierdzone
- **500 Internal Server Error**:
  - Problemy z połączeniem z bazą danych
  - Nieoczekiwane błędy serwera

## 8. Rozważania dotyczące wydajności
- Zoptymalizowane zapytania do bazy danych Supabase
- Cachowanie informacji o użytkowniku (jeśli stosowne)
- Śledzenie metryki czasu odpowiedzi dla wykrywania potencjalnych problemów

## 9. Etapy wdrożenia
1. **Utworzenie serwisu autoryzacyjnego** (src/lib/services/auth.service.ts):
   - Implementacja metody login przyjmującej LoginRequestDto
   - Integracja z Supabase dla weryfikacji danych logowania
   - Generowanie tokenu JWT
   - Zwracanie LoginResponseDto

2. **Implementacja schematu walidacji** (src/lib/schemas/login.schema.ts):
   - Utworzenie schematu Zod dla LoginRequestDto
   - Definiowanie reguł walidacji dla email i password

3. **Implementacja endpointu** (src/pages/api/users/login.ts):
   - Ustawienie metody POST
   - Walidacja danych wejściowych
   - Wywołanie serwisu autoryzacyjnego
   - Obsługa odpowiedzi i błędów
   - Ustawienie prerender = false

4. **Testy jednostkowe**:
   - Testy serwisu autoryzacyjnego
   - Testy walidacji
   - Testy endpointu

5. **Testy integracyjne**:
   - Testy end-to-end logowania użytkownika
   - Testy obsługi błędów

6. **Dokumentacja**:
   - Aktualizacja dokumentacji API
   - Dodanie przykładów użycia 