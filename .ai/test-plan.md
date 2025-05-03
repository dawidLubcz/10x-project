# Plan Testów dla Projektu 10xProject

## 1. Wprowadzenie i cele testowania

### 1.1 Cel dokumentu
Niniejszy dokument przedstawia kompleksowy plan testów dla aplikacji 10xProject, webowej platformy do automatycznego generowania i zarządzania fiszkami edukacyjnymi przy pomocy sztucznej inteligencji. Plan określa zakres, podejście, zasoby i harmonogram działań testowych niezbędnych do zapewnienia wysokiej jakości aplikacji.

### 1.2 Cele testowania
- Weryfikacja zgodności aplikacji z wymaganiami funkcjonalnymi i niefunkcjonalnymi
- Identyfikacja defektów i błędów w możliwie wczesnej fazie rozwoju
- Potwierdzenie, że użytkownicy mogą efektywnie korzystać z wszystkich funkcjonalności systemu
- Zapewnienie stabilności i bezpieczeństwa usługi, szczególnie w obszarze autentykacji i komunikacji z zewnętrznymi API
- Walidacja poprawności integracji z usługami Supabase i OpenRouter.ai

## 2. Zakres testów

### 2.1 Elementy podlegające testowaniu
- **System autentykacji użytkowników**
  - Rejestracja użytkowników
  - Logowanie i wylogowywanie
  - Zarządzanie kontem użytkownika
  - Obsługa sesji

- **Generator fiszek oparty na AI**
  - Przyjmowanie i walidacja tekstu wejściowego
  - Komunikacja z API OpenRouter.ai
  - Generacja fiszek w formacie pytanie-odpowiedź
  - Obsługa błędów podczas generacji

- **Zarządzanie fiszkami**
  - Tworzenie manualne fiszek
  - Edycja istniejących fiszek
  - Usuwanie fiszek
  - Przeglądanie, filtrowanie i sortowanie kolekcji fiszek

- **Integracja z algorytmem powtórek**
  - Planowanie sesji powtórek
  - Śledzenie postępu nauki

- **Interfejs użytkownika**
  - Responsywność i dostępność na różnych urządzeniach
  - Poprawność działania komponentów React/Astro
  - Walidacja formularzy

### 2.2 Elementy niepodlegające testowaniu
- Hosting i konfiguracja DigitalOcean
- Infrastruktura CI/CD (Github Actions)
- Wydajność i skalowanie bazy danych powyżej standardowego obciążenia
- Zaawansowane testy bezpieczeństwa (pentesty)
- Testy współdzielenia fiszek między użytkownikami (funkcja poza MVP)

## 3. Typy testów do przeprowadzenia

### 3.1 Testy jednostkowe
**Opis**: Testy weryfikujące poprawność działania pojedynczych komponentów, funkcji i klas.

**Zakres**:
- Serwisy i helpery (src/lib/)
- Walidatory danych (src/lib/validators/)
- Hooki React (src/lib/hooks/)
- Komponenty UI (src/components/)

**Narzędzia**: 
- Vitest dla testów jednostkowych
- React Testing Library dla komponentów

### 3.2 Testy integracyjne
**Opis**: Testy sprawdzające współpracę między różnymi modułami aplikacji.

**Zakres**:
- Komunikacja między frontendem a API Astro
- Integracja z Supabase (autentykacja, baza danych)
- Integracja z OpenRouter.ai

**Narzędzia**:
- Vitest do testów integracyjnych
- Mock Supabase do testowania bez rzeczywistej bazy danych
- Mock OpenRouter.ai do symulacji odpowiedzi API

### 3.3 Testy API
**Opis**: Testy weryfikujące poprawność endpoint'ów API w aplikacji.

**Zakres**:
- Wszystkie endpointy w src/pages/api/
- Weryfikacja odpowiedzi, kodów HTTP i formatów danych
- Obsługa błędów i wyjątków

**Narzędzia**:
- Supertest lub equivalent dla Astro
- MSW (Mock Service Worker) do symulacji API

### 3.4 Testy E2E (End-to-End)
**Opis**: Testy sprawdzające pełny przepływ pracy użytkownika przez aplikację.

**Zakres**:
- Rejestracja i logowanie
- Generowanie fiszek przez AI
- Zarządzanie fiszkami (tworzenie, edycja, usuwanie)
- Sesje nauki z algorytmem powtórek

**Narzędzia**:
- Playwright do testów e2e

### 3.5 Testy UI/UX
**Opis**: Testy sprawdzające interfejs użytkownika i doświadczenie użytkownika.

**Zakres**:
- Responsywność na różnych urządzeniach
- Dostępność (WCAG)
- Poprawność działania komponentów UI
- Wygląd i spójność wizualna

**Narzędzia**:
- Playwright do testów wizualnych
- Axe do testów dostępności

### 3.6 Testy wydajnościowe
**Opis**: Podstawowe testy sprawdzające wydajność najważniejszych funkcji aplikacji.

**Zakres**:
- Czas odpowiedzi API
- Czas generowania fiszek przez AI
- Wydajność renderowania stron z dużą ilością fiszek

**Narzędzia**:
- Lighthouse do analizy wydajności strony
- Własne narzędzia do pomiaru czasów odpowiedzi

## 4. Szczegółowe scenariusze testowe

### 4.1 Autentykacja użytkowników

#### TC-001: Rejestracja nowego użytkownika
1. Nawigacja do strony rejestracji
2. Wprowadzenie poprawnego adresu email i hasła
3. Wysłanie formularza rejestracji
4. Weryfikacja sukcesu rejestracji i przekierowania
5. Sprawdzenie możliwości logowania na nowo utworzone konto

#### TC-002: Walidacja formularza rejestracji
1. Nawigacja do strony rejestracji
2. Wprowadzenie niepoprawnych danych (np. nieprawidłowy format email, słabe hasło)
3. Weryfikacja komunikatów błędów
4. Sprawdzenie, że rejestracja nie jest możliwa z nieprawidłowymi danymi

#### TC-003: Logowanie użytkownika
1. Nawigacja do strony logowania
2. Wprowadzenie poprawnych danych logowania
3. Weryfikacja sukcesu logowania i przekierowania
4. Sprawdzenie dostępu do funkcji wymagających logowania

#### TC-004: Wylogowanie użytkownika
1. Zalogowanie się do systemu
2. Kliknięcie opcji wylogowania
3. Weryfikacja pomyślnego wylogowania
4. Sprawdzenie braku dostępu do funkcji wymagających logowania

#### TC-005: Zarządzanie kontem użytkownika
1. Zalogowanie się do systemu
2. Nawigacja do ustawień konta
3. Zmiana hasła i weryfikacja zmiany
4. Próba usunięcia konta i sprawdzenie potwierdzenia
5. Potwierdzenie usunięcia konta i weryfikacja braku możliwości ponownego logowania

### 4.2 Generator fiszek AI

#### TC-006: Generowanie fiszek z poprawnego tekstu
1. Zalogowanie się do systemu
2. Nawigacja do strony generowania fiszek
3. Wprowadzenie tekstu źródłowego (do 100 znaków)
4. Inicjacja procesu generowania
5. Weryfikacja wyświetlenia wygenerowanych fiszek do akceptacji

#### TC-007: Walidacja tekstu wejściowego
1. Zalogowanie się do systemu
2. Nawigacja do strony generowania fiszek
3. Wprowadzenie tekstu dłuższego niż 100 znaków
4. Weryfikacja komunikatu o błędzie
5. Sprawdzenie, że generowanie nie zostaje rozpoczęte

#### TC-008: Akceptacja wygenerowanych fiszek
1. Zalogowanie się do systemu
2. Nawigacja do strony generowania fiszek
3. Wygenerowanie fiszek z poprawnego tekstu
4. Akceptacja wybranych fiszek
5. Weryfikacja dodania zaakceptowanych fiszek do kolekcji użytkownika

#### TC-009: Edycja wygenerowanych fiszek przed akceptacją
1. Zalogowanie się do systemu
2. Nawigacja do strony generowania fiszek
3. Wygenerowanie fiszek z poprawnego tekstu
4. Edycja wybranej fiszki (pytanie i odpowiedź)
5. Akceptacja zedytowanej fiszki
6. Weryfikacja dodania zedytowanej fiszki do kolekcji użytkownika

#### TC-010: Odrzucenie wygenerowanych fiszek
1. Zalogowanie się do systemu
2. Nawigacja do strony generowania fiszek
3. Wygenerowanie fiszek z poprawnego tekstu
4. Odrzucenie wybranej fiszki
5. Weryfikacja, że odrzucona fiszka nie została dodana do kolekcji

### 4.3 Zarządzanie fiszkami

#### TC-011: Manualne tworzenie fiszki
1. Zalogowanie się do systemu
2. Nawigacja do formularza tworzenia fiszki
3. Wprowadzenie poprawnych danych fiszki (pytanie i odpowiedź)
4. Wysłanie formularza
5. Weryfikacja dodania fiszki do kolekcji użytkownika

#### TC-012: Walidacja formularza tworzenia fiszki
1. Zalogowanie się do systemu
2. Nawigacja do formularza tworzenia fiszki
3. Wprowadzenie niepoprawnych danych (np. pytanie lub odpowiedź przekraczająca limit znaków)
4. Weryfikacja komunikatów błędów
5. Sprawdzenie, że fiszka nie zostaje utworzona z nieprawidłowymi danymi

#### TC-013: Przeglądanie kolekcji fiszek
1. Zalogowanie się do systemu
2. Nawigacja do strony kolekcji fiszek
3. Weryfikacja wyświetlenia listy fiszek użytkownika
4. Sprawdzenie możliwości rozwinięcia fiszki, aby zobaczyć pełną treść
5. Weryfikacja informacji o liczbie fiszek w kolekcji

#### TC-014: Filtrowanie i sortowanie fiszek
1. Zalogowanie się do systemu
2. Nawigacja do strony kolekcji fiszek
3. Zastosowanie filtrów (np. według źródła fiszki)
4. Zastosowanie sortowania (np. według daty utworzenia)
5. Weryfikacja poprawności wyświetlonych wyników

#### TC-015: Edycja istniejącej fiszki
1. Zalogowanie się do systemu
2. Nawigacja do strony kolekcji fiszek
3. Wybór fiszki do edycji
4. Modyfikacja pytania i/lub odpowiedzi
5. Zapisanie zmian
6. Weryfikacja aktualizacji fiszki w kolekcji

#### TC-016: Usuwanie fiszki
1. Zalogowanie się do systemu
2. Nawigacja do strony kolekcji fiszek
3. Wybór fiszki do usunięcia
4. Potwierdzenie chęci usunięcia
5. Weryfikacja usunięcia fiszki z kolekcji

### 4.4 Algorytm powtórek

#### TC-017: Rozpoczęcie sesji nauki
1. Zalogowanie się do systemu
2. Nawigacja do strony sesji nauki
3. Inicjacja sesji nauki
4. Weryfikacja wyświetlenia fiszek zgodnie z algorytmem
5. Sprawdzenie możliwości oznaczenia znajomości odpowiedzi

#### TC-018: Dostosowanie harmonogramu powtórek
1. Zalogowanie się do systemu
2. Nawigacja do strony sesji nauki
3. Przejście przez kilka fiszek z różnymi odpowiedziami (znane/nieznane)
4. Weryfikacja dostosowania harmonogramu powtórek
5. Sprawdzenie, że fiszki oznaczone jako "nieznane" pojawiają się częściej

#### TC-019: Przerwanie i wznowienie sesji nauki
1. Zalogowanie się do systemu
2. Nawigacja do strony sesji nauki
3. Inicjacja sesji nauki
4. Przerwanie sesji w trakcie
5. Weryfikacja możliwości wznowienia sesji od miejsca przerwania

## 5. Środowisko testowe

### 5.1 Środowisko lokalne deweloperskie
**Cel**: Szybkie testowanie podczas rozwoju i testy jednostkowe.

**Konfiguracja**:
- System operacyjny: Windows/macOS/Linux
- Node.js v20+
- Astro 5
- Lokalna instancja Supabase
- Klucze API dla OpenRouter.ai (środowisko deweloperskie)

### 5.2 Środowisko testowe integracyjne
**Cel**: Przeprowadzanie testów integracyjnych i e2e.

**Konfiguracja**:
- Dedykowana instancja aplikacji
- Dedykowana instancja Supabase
- Konfiguracja identyczna z produkcyjną, ale w izolowanym środowisku
- Klucze API dla OpenRouter.ai (środowisko testowe)

### 5.3 Środowisko przedprodukcyjne
**Cel**: Finalne testy przed wdrożeniem na produkcję.

**Konfiguracja**:
- Identyczna z produkcyjną
- Dostęp ograniczony do zespołu testowego
- Pełna integracja z usługami zewnętrznymi

## 6. Narzędzia do testowania

### 6.1 Narzędzia do testów automatycznych
- **Vitest**: Framework do testów jednostkowych i integracyjnych
- **React Testing Library**: Testowanie komponentów React
- **Playwright**: Testy E2E i testy wizualne
- **MSW (Mock Service Worker)**: Mockowanie API
- **Lighthouse**: Analiza wydajności
- **Axe**: Testy dostępności

### 6.2 Narzędzia do testów manualnych
- **Postman/Insomnia**: Testowanie REST API
- **Chrome DevTools**: Debugowanie i analiza frontendu
- **Supabase Studio**: Zarządzanie i monitorowanie bazy danych
- **OpenRouter.ai Dashboard**: Monitorowanie wykorzystania API AI

### 6.3 Narzędzia do zarządzania testami
- **GitHub Issues**: Śledzenie błędów i zadań
- **GitHub Projects/Kanban**: Zarządzanie procesem testowym
- **GitHub Actions**: Automatyzacja CI/CD

## 7. Harmonogram testów

### 7.1 Faza 1: Przygotowanie (Tydzień 1)
- Konfiguracja środowisk testowych
- Przygotowanie przypadków testowych
- Implementacja testów jednostkowych dla istniejących komponentów

### 7.2 Faza 2: Testy rozwojowe (Tydzień 2-3)
- Testy jednostkowe nowych komponentów
- Testy integracyjne podstawowych funkcjonalności
- Iteracyjne poprawki błędów

### 7.3 Faza 3: Testy integracyjne (Tydzień 4)
- Kompleksowe testy integracyjne
- Testy API
- Rozpoczęcie testów E2E

### 7.4 Faza 4: Testy akceptacyjne (Tydzień 5)
- Testy E2E wszystkich funkcjonalności
- Testy wydajnościowe
- Testy dostępności i UX

### 7.5 Faza 5: Testy pre-release (Przed wdrożeniem)
- Finalne testy regresji
- Weryfikacja poprawek krytycznych błędów
- Go/No-Go decyzja o wdrożeniu

## 8. Kryteria akceptacji testów

### 8.1 Kryteria ilościowe
- 90% pokrycia kodu testami jednostkowymi dla krytycznych modułów (autentykacja, generacja fiszek, zarządzanie fiszkami)
- 100% wykonania testów E2E dla kluczowych ścieżek użytkownika
- 0 krytycznych błędów w raportach testów
- Maksymalny czas odpowiedzi API: 500ms (95 percentyl)
- Lighthouse score minimum 85/100 dla wydajności

### 8.2 Kryteria jakościowe
- Wszystkie kryteria akceptacji z historyjek użytkownika są spełnione
- Intuicyjny interfejs użytkownika potwierdzony przez testy UX
- Brak błędów dostępności WCAG AA
- Zgodność z wymaganiami bezpieczeństwa (zwłaszcza dla autentykacji)

## 9. Role i odpowiedzialności

### 9.1 Zespół testowy
- **QA Lead**: Koordynacja całego procesu testowania, raportowanie do Project Managera
- **QA Engineer**: Implementacja testów automatycznych, wykonywanie testów manualnych
- **Developer Testing**: Testy jednostkowe, wsparcie w testach integracyjnych
- **UX Tester**: Testy interfejsu użytkownika i doświadczenia użytkownika

### 9.2 Pozostałe role
- **Project Manager**: Priorytetyzacja testów, zarządzanie harmonogramem
- **Product Owner**: Walidacja funkcjonalności, zatwierdzanie kryteriów akceptacji
- **Deweloperzy**: Implementacja poprawek, testy jednostkowe, wsparcie w testach

## 10. Procedury raportowania błędów

### 10.1 Proces raportowania błędów
1. Identyfikacja błędu podczas testów
2. Dokumentacja błędu (opis, kroki reprodukcji, środowisko, dowody)
3. Kategoryzacja błędu (krytyczność, priorytet)
4. Utworzenie zgłoszenia w GitHub Issues
5. Przypisanie błędu do odpowiedzialnej osoby
6. Śledzenie statusu błędu do czasu rozwiązania
7. Weryfikacja poprawki
8. Zamknięcie zgłoszenia

### 10.2 Kategoryzacja błędów
- **Krytyczny**: Uniemożliwia korzystanie z podstawowych funkcji aplikacji
- **Wysoki**: Znacząco utrudnia korzystanie z aplikacji, ale istnieją obejścia
- **Średni**: Wpływa na doświadczenie użytkownika, ale nie blokuje głównych funkcjonalności
- **Niski**: Drobne błędy, które nie wpływają znacząco na korzystanie z aplikacji

### 10.3 Szablon zgłoszenia błędu
```
Tytuł: [Komponent/Moduł] Krótki opis problemu

Priorytet: [Krytyczny/Wysoki/Średni/Niski]
Środowisko: [Lokalne/Testowe/Przedprodukcyjne]
Wersja aplikacji: [Numer wersji/commit]
Przeglądarka/Urządzenie: [Informacje o środowisku testowym]

Opis:
Szczegółowy opis problemu

Kroki reprodukcji:
1. ...
2. ...
3. ...

Aktualny rezultat:
Co się dzieje obecnie

Oczekiwany rezultat:
Co powinno się dziać

Załączniki:
[Zrzuty ekranu, filmy, logi]

Dodatkowe informacje:
[Inne istotne informacje]
```

## 11. Strategie zarządzania ryzykiem testowym

### 11.1 Identyfikacja ryzyk
- Nieprzewidywalność wyników generacji AI
- Problemy z integracją z zewnętrznymi usługami (Supabase, OpenRouter.ai)
- Ograniczenia wydajnościowe podczas skalowania
- Błędy w algorytmie powtórek wpływające na efektywność nauki

### 11.2 Działania zapobiegawcze
- Rozbudowane scenariusze testowe dla generacji AI z różnorodnymi danymi wejściowymi
- Monitoring integracji z usługami zewnętrznymi, testy z mockowanymi odpowiedziami
- Testy wydajnościowe z symulacją obciążenia
- Dokładna weryfikacja algorytmu powtórek na różnych scenariuszach

### 11.3 Plany awaryjne
- Procedury rollback dla wdrożeń produkcyjnych
- Alternatywne przepływy użytkownika w przypadku niedostępności usług zewnętrznych
- Limity i mechanizmy throttlingu do zarządzania obciążeniem

---

Dokument przygotowany przez: [Imię i Nazwisko QA Lead]  
Data: [Data utworzenia]  
Wersja: 1.0 