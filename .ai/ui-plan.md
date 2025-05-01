# Architektura UI dla 10xProject

## 1. Przegląd struktury UI

Aplikacja 10xProject zostanie zbudowana jako minimalistyczny, intuicyjny interfejs składający się z 5 głównych widoków. Wykorzysta komponenty Shadcn/ui osadzone w Astro z interaktywnymi częściami obsługiwanymi przez React. Struktura nawigacji będzie oparta na górnym pasku nawigacyjnym dostępnym na wszystkich stronach po zalogowaniu. Architektura koncentruje się na szybkim i efektywnym przepływie od wprowadzenia tekstu do generowania i zarządzania fiszkami, zgodnie z głównym celem produktu - oszczędzaniem czasu użytkownika.

## 2. Lista widoków

### Ekran uwierzytelniania
- **Ścieżka**: `/auth`
- **Główny cel**: Umożliwienie użytkownikowi zalogowania się lub zarejestrowania
- **Kluczowe informacje**:
  - Prosty formularz logowania (email, hasło)
  - Prosty formularz rejestracji (email, hasło)
  - Komunikaty o błędach walidacji
- **Kluczowe komponenty**:
  - Karta z zakładkami Logowanie/Rejestracja
  - Pola formularza z walidacją
  - Przyciski akcji (Zaloguj/Zarejestruj)
- **Względy UX/dostępność/bezpieczeństwo**:
  - Wyraźne komunikaty błędów
  - Walidacja w czasie rzeczywistym
  - Bezpieczne przechowywanie tokenów JWT

### Dashboard
- **Ścieżka**: `/`
- **Główny cel**: Punkt nawigacyjny i przegląd statystyk
- **Kluczowe informacje**:
  - Liczba posiadanych fiszek
  - Szybki dostęp do głównych funkcji
- **Kluczowe komponenty**:
  - Karta statystyk
  - Przyciski/karty nawigacyjne do głównych funkcji
- **Względy UX/dostępność/bezpieczeństwo**:
  - Intuicyjny układ z dużymi, czytelnymi przyciskami
  - Wyraźna hierarchia informacji

### Widok generowania fiszek
- **Ścieżka**: `/generate`
- **Główny cel**: Generowanie fiszek przez AI na podstawie wprowadzonego tekstu
- **Kluczowe informacje**:
  - Pole tekstowe z licznikiem znaków
  - Status generowania
  - Lista propozycji fiszek
- **Kluczowe komponenty**:
  - Pole tekstowe z licznikiem (max 100 znaków)
  - Przycisk "Generuj"
  - Komunikat statusu "Generowanie..."
  - Karty propozycji fiszek z przyciskami Akceptuj/Edytuj/Odrzuć
- **Względy UX/dostępność/bezpieczeństwo**:
  - Walidacja limitu znaków w czasie rzeczywistym
  - Wyraźny status operacji
  - Pojedyncza, czytelna lista propozycji

### Lista fiszek
- **Ścieżka**: `/flashcards`
- **Główny cel**: Zarządzanie istniejącymi fiszkami
- **Kluczowe informacje**:
  - Lista fiszek z pytaniem i odpowiedzią
  - Opcje edycji i usunięcia
  - Paginacja
- **Kluczowe komponenty**:
  - Karty fiszek pokazujące obie strony (pytanie/odpowiedź)
  - Przyciski edycji i usunięcia
  - Paginacja (10 fiszek na stronę)
- **Względy UX/dostępność/bezpieczeństwo**:
  - Czytelny układ fiszek
  - Potwierdzenie przed usunięciem
  - Wyraźna paginacja

### Panel użytkownika
- **Ścieżka**: `/profile`
- **Główny cel**: Zarządzanie kontem użytkownika
- **Kluczowe informacje**:
  - Formularz zmiany hasła
  - Opcja wylogowania
- **Kluczowe komponenty**:
  - Formularz zmiany hasła
  - Przycisk wylogowania
- **Względy UX/dostępność/bezpieczeństwo**:
  - Walidacja siły hasła
  - Potwierdzenie operacji
  - Bezpieczne zarządzanie sesją

## 3. Mapa podróży użytkownika

### Główny przepływ użytkownika

1. **Logowanie/Rejestracja**
   - Użytkownik wchodzi na stronę logowania
   - Wprowadza dane lub rejestruje nowe konto
   - Po uwierzytelnieniu zostaje przekierowany do widoku generowania fiszek

2. **Generowanie fiszek z AI**
   - Użytkownik wprowadza tekst źródłowy (do 100 znaków)
   - System waliduje długość tekstu
   - Użytkownik klika "Generuj"
   - System wyświetla komunikat "Generowanie..."
   - Po zakończeniu system prezentuje listę propozycji fiszek

3. **Zarządzanie propozycjami fiszek**
   - Dla każdej propozycji użytkownik może:
     - Zaakceptować fiszkę (dodanie do kolekcji)
     - Edytować fiszkę (otwarcie modalu, wprowadzenie zmian, zapisanie)
     - Odrzucić fiszkę (usunięcie propozycji)

4. **Przeglądanie i zarządzanie kolekcją**
   - Użytkownik przechodzi do listy fiszek
   - Przegląda swoje fiszki (10 na stronę)
   - Może edytować fiszkę (otwarcie modalu edycji)
   - Może usunąć fiszkę (z potwierdzeniem)

5. **Zarządzanie kontem**
   - Użytkownik przechodzi do panelu użytkownika
   - Może zmienić hasło
   - Może się wylogować

## 4. Układ i struktura nawigacji

### Struktura nawigacji

1. **Górny pasek nawigacyjny** (dostępny na wszystkich stronach po zalogowaniu)
   - Logo/Nazwa aplikacji (link do dashboardu)
   - Link do generowania fiszek
   - Link do listy fiszek
   - Link do panelu użytkownika

2. **Hierarchia stron**:
   - Ekran uwierzytelniania (przed zalogowaniem)
   - Dashboard (główna strona po zalogowaniu)
     - Generowanie fiszek
     - Lista fiszek
     - Panel użytkownika

3. **Modalne okna dialogowe**:
   - Modal edycji fiszki (dostępny z widoku generowania i listy fiszek)
   - Modal potwierdzenia usunięcia (dostępny z listy fiszek)

4. **Powiadomienia**:
   - Toast z informacjami o powodzeniu/niepowodzeniu operacji

## 5. Kluczowe komponenty

### Komponenty formularzy
- **Pole tekstowe z licznikiem**: Używane przy wprowadzaniu tekstu do generowania i edycji fiszek, pokazuje liczbę pozostałych znaków, walidacja w czasie rzeczywistym.
- **Formularz logowania/rejestracji**: Zestaw pól z walidacją i przyciskiem akcji.
- **Formularz zmiany hasła**: Pola na stare i nowe hasło z walidacją siły hasła.

### Komponenty prezentacji danych
- **Karta fiszki**: Wyświetla pytanie i odpowiedź, przyciski akcji (edycja, usunięcie).
- **Karta propozycji AI**: Wyświetla wygenerowane pytanie i odpowiedź, przyciski akcji (akceptuj, edytuj, odrzuć).
- **Karta statystyk**: Pokazuje liczbę fiszek i inne podstawowe statystyki.

### Komponenty nawigacji
- **Górny pasek nawigacyjny**: Zapewnia dostęp do głównych sekcji aplikacji.
- **Paginacja**: Umożliwia przechodzenie między stronami listy fiszek.

### Komponenty informacyjne
- **Toast**: Wyświetla informacje o powodzeniu/niepowodzeniu operacji.
- **Komunikat statusu**: Informuje o trwających operacjach (np. "Generowanie...").
- **Dialog potwierdzenia**: Zapobiega przypadkowym akcjom (np. usunięcie fiszki).

### Modalne komponenty
- **Modal edycji**: Umożliwia edycję pytania i odpowiedzi z walidacją.
- **Modal potwierdzenia**: Wymaga potwierdzenia przed wykonaniem nieodwracalnych akcji.

Wszystkie komponenty będą wykorzystywać bibliotekę Shadcn/ui dla spójnego wyglądu i zachowania, z Tailwind CSS dla stylowania i responsywności. 