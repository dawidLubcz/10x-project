# Dokument wymagań produktu (PRD) - 10xProject

## 1. Przegląd produktu

10xProject to aplikacja webowa umożliwiająca użytkownikom szybkie tworzenie wysokiej jakości fiszek edukacyjnych przy pomocy sztucznej inteligencji. Aplikacja rozwiązuje problem czasochłonności manualnego tworzenia fiszek, co często zniechęca do korzystania z efektywnej metody nauki jaką jest spaced repetition.

Główne funkcje produktu:
- Generowanie fiszek przez AI na podstawie wprowadzonego tekstu
- Manualne tworzenie fiszek
- Zarządzanie fiszkami (przeglądanie, edycja, usuwanie)
- System kont użytkowników do przechowywania fiszek
- Integracja z gotowym algorytmem powtórek

Grupa docelowa:
- Studenci różnych kierunków
- Profesjonaliści poszukujący efektywnych narzędzi do nauki i rozwoju

## 2. Problem użytkownika

Spaced repetition jest naukowo udowodnioną metodą efektywnej nauki, jednak tworzenie wysokiej jakości fiszek jest czasochłonne. Użytkownicy często rezygnują z tej metody nauki ze względu na:

- Zbyt dużo czasu poświęcanego na tworzenie fiszek zamiast na samą naukę
- Trudności w formułowaniu pytań i odpowiedzi, które skutecznie testują wiedzę
- Brak satysfakcji z procesu tworzenia fiszek
- Niską jakość pospiesznie stworzonych fiszek, co zmniejsza efektywność nauki

10xProject rozwiązuje te problemy poprzez automatyzację procesu tworzenia fiszek przy zachowaniu wysokiej jakości materiałów edukacyjnych.

## 3. Wymagania funkcjonalne

### 3.1 Generowanie fiszek przez AI
- System przyjmuje tekst źródłowy o długości do 100 znaków
- AI analizuje tekst i generuje fiszki w formacie pytanie-odpowiedź w języku polskim
- Generowane fiszki mają maksymalną długość 1000 znaków
- Wygenerowane fiszki trafiają na listę oczekujących do akceptacji

### 3.2 Manualne tworzenie fiszek
- Interfejs z formularzem do ręcznego tworzenia fiszek
- Pola na pytanie i odpowiedź
- Walidacja limitów znaków (max 1000 znaków na fiszkę)
- Automatyczne zapisywanie fiszek w bazie danych

### 3.3 Zarządzanie fiszkami
- Przeglądanie wszystkich fiszek użytkownika
- Edycja istniejących fiszek
- Usuwanie fiszek
- Filtrowanie i sortowanie fiszek

### 3.4 System kont użytkownika
- Rejestracja nowych użytkowników
- Logowanie do systemu
- Przechowywanie fiszek przypisanych do konkretnego użytkownika
- Zarządzanie własnym kontem (zmiana hasła, usunięcie konta)

### 3.5 Integracja z algorytmem powtórek
- Wykorzystanie gotowego algorytmu powtórek
- Planowanie sesji powtórek dla użytkownika
- Śledzenie postępu nauki

## 4. Granice produktu

MVP nie będzie zawierać:
- Własnego, zaawansowanego algorytmu powtórek (jak SuperMemo, Anki)
- Importu wielu formatów (PDF, DOCX, itp.)
- Współdzielenia zestawów fiszek między użytkownikami
- Integracji z innymi platformami edukacyjnymi
- Aplikacji mobilnych (na początek tylko wersja webowa)
- Moderacji treści generowanych przez AI
- Systemu raportowania błędów i statystyk
- Limitów dla użytkowników

Ograniczenia techniczne:
- Język polski dla generowanych fiszek
- Format fiszek: tylko pytanie i odpowiedź (bez dodatkowych pól)
- Maksymalnie 100 znaków dla tekstu wejściowego
- Maksymalnie 1000 znaków dla całej fiszki
- Dane przechowywane w Supabase (konta użytkowników i fiszki)
- Czas realizacji MVP: 5 dni

## 5. Historyjki użytkowników

### US-001: Rejestracja nowego użytkownika
**Tytuł**: Rejestracja w systemie 10xProject

**Opis**: Jako nowy użytkownik, chcę się zarejestrować w systemie, aby móc korzystać z funkcji tworzenia i przechowywania fiszek.

**Kryteria akceptacji**:
- Użytkownik może utworzyć konto podając adres email i hasło
- System weryfikuje unikalność adresu email
- System weryfikuje siłę hasła
- Po rejestracji użytkownik otrzymuje potwierdzenie utworzenia konta
- Użytkownik może zalogować się po rejestracji

### US-002: Logowanie do systemu
**Tytuł**: Logowanie do systemu 10xProject

**Opis**: Jako zarejestrowany użytkownik, chcę się zalogować do systemu, aby uzyskać dostęp do moich fiszek.

**Kryteria akceptacji**:
- Użytkownik może zalogować się podając adres email i hasło
- System weryfikuje poprawność danych logowania
- W przypadku błędnych danych, system wyświetla odpowiedni komunikat
- Po poprawnym zalogowaniu, użytkownik jest przekierowany do panelu głównego
- Sesja użytkownika jest utrzymywana przez odpowiedni czas

### US-003: Generowanie fiszek przez AI
**Tytuł**: Generowanie fiszek przy pomocy AI

**Opis**: Jako zalogowany użytkownik, chcę wygenerować fiszki na podstawie wprowadzonego przeze mnie tekstu, aby zaoszczędzić czas na tworzeniu materiałów do nauki.

**Kryteria akceptacji**:
- Użytkownik może wprowadzić tekst źródłowy (do 100 znaków)
- System waliduje długość wprowadzonego tekstu
- Po zatwierdzeniu, system generuje zestaw fiszek w formacie pytanie-odpowiedź
- Wygenerowane fiszki są prezentowane użytkownikowi do akceptacji
- Każda fiszka nie przekracza 1000 znaków

### US-004: Akceptacja wygenerowanych fiszek
**Tytuł**: Akceptacja fiszek wygenerowanych przez AI

**Opis**: Jako użytkownik, chcę przejrzeć wygenerowane przez AI fiszki i zaakceptować te, które mi odpowiadają, aby dodać je do mojej kolekcji.

**Kryteria akceptacji**:
- Użytkownik widzi listę fiszek wygenerowanych przez AI
- Dla każdej fiszki użytkownik może wybrać: akceptuj, edytuj lub odrzuć
- Zaakceptowane fiszki są dodawane do kolekcji użytkownika
- Odrzucone fiszki są usuwane
- System informuje o liczbie zaakceptowanych/odrzuconych fiszek

### US-005: Edycja wygenerowanych fiszek
**Tytuł**: Edycja fiszek wygenerowanych przez AI przed akceptacją

**Opis**: Jako użytkownik, chcę edytować fiszki wygenerowane przez AI przed ich akceptacją, aby dostosować je do moich potrzeb.

**Kryteria akceptacji**:
- Użytkownik może edytować pytanie i odpowiedź dla każdej wygenerowanej fiszki
- System waliduje długość edytowanej fiszki (max 1000 znaków)
- Po edycji użytkownik może zaakceptować lub odrzucić fiszkę
- Zaakceptowane fiszki są dodawane do kolekcji użytkownika
- System zachowuje zmiany wprowadzone przez użytkownika

### US-006: Manualne tworzenie fiszek
**Tytuł**: Ręczne tworzenie nowych fiszek

**Opis**: Jako użytkownik, chcę manualnie tworzyć własne fiszki, aby uzupełnić swoją kolekcję o specyficzne materiały.

**Kryteria akceptacji**:
- Użytkownik ma dostęp do formularza tworzenia nowej fiszki
- Formularz zawiera pola: pytanie i odpowiedź
- System waliduje długość fiszki (max 1000 znaków)
- Po zapisaniu, fiszka jest dodawana do kolekcji użytkownika
- Użytkownik otrzymuje potwierdzenie utworzenia fiszki

### US-007: Przeglądanie kolekcji fiszek
**Tytuł**: Przeglądanie własnej kolekcji fiszek

**Opis**: Jako użytkownik, chcę przeglądać swoją kolekcję fiszek, aby mieć wgląd w dostępne materiały do nauki.

**Kryteria akceptacji**:
- Użytkownik widzi listę wszystkich swoich fiszek
- Lista można sortować i filtrować
- Dla każdej fiszki wyświetlane są: pytanie i skrócona odpowiedź
- Użytkownik może rozwinąć fiszkę, aby zobaczyć pełną treść
- System informuje o liczbie fiszek w kolekcji

### US-008: Edycja istniejących fiszek
**Tytuł**: Edycja fiszek w kolekcji

**Opis**: Jako użytkownik, chcę edytować istniejące fiszki w mojej kolekcji, aby aktualizować lub poprawiać ich treść.

**Kryteria akceptacji**:
- Użytkownik może wybrać fiszkę do edycji
- System wyświetla formularz z aktualnymi danymi fiszki
- Użytkownik może edytować pytanie i odpowiedź
- System waliduje długość edytowanej fiszki (max 1000 znaków)
- Po zapisaniu, zmiany są aktualizowane w bazie danych

### US-009: Usuwanie fiszek
**Tytuł**: Usuwanie fiszek z kolekcji

**Opis**: Jako użytkownik, chcę usuwać niepotrzebne fiszki z mojej kolekcji, aby utrzymać porządek w materiałach do nauki.

**Kryteria akceptacji**:
- Użytkownik może wybrać fiszkę do usunięcia
- System prosi o potwierdzenie usunięcia
- Po potwierdzeniu, fiszka jest trwale usuwana z kolekcji
- System informuje o pomyślnym usunięciu fiszki
- Usunięta fiszka nie jest już widoczna w kolekcji użytkownika

### US-010: Korzystanie z algorytmu powtórek
**Tytuł**: Nauka z wykorzystaniem algorytmu powtórek

**Opis**: Jako użytkownik, chcę korzystać z algorytmu powtórek, aby efektywnie uczyć się materiału zawartego w moich fiszkach.

**Kryteria akceptacji**:
- Użytkownik może rozpocząć sesję nauki
- System prezentuje fiszki zgodnie z algorytmem powtórek
- Użytkownik może oznaczyć, czy znał odpowiedź
- System dostosowuje harmonogram powtórek na podstawie odpowiedzi użytkownika
- Użytkownik może przerwać i wznowić sesję nauki

### US-011: Zarządzanie kontem użytkownika
**Tytuł**: Zarządzanie własnym kontem

**Opis**: Jako użytkownik, chcę zarządzać moim kontem, aby aktualizować dane osobowe lub usunąć konto w razie potrzeby.

**Kryteria akceptacji**:
- Użytkownik ma dostęp do ustawień konta
- Użytkownik może zmienić hasło
- Użytkownik może usunąć swoje konto
- Przed usunięciem konta system prosi o potwierdzenie
- Po usunięciu konta, wszystkie dane użytkownika są usuwane z systemu

### US-012: Wylogowanie z systemu
**Tytuł**: Wylogowanie z systemu 10xProject

**Opis**: Jako zalogowany użytkownik, chcę się wylogować z systemu, aby zabezpieczyć moje konto na współdzielonym urządzeniu.

**Kryteria akceptacji**:
- Użytkownik ma dostęp do opcji wylogowania
- Po wylogowaniu, sesja użytkownika jest zakończona
- Po wylogowaniu, użytkownik nie ma dostępu do funkcji wymagających zalogowania
- System przekierowuje użytkownika do strony logowania po wylogowaniu
- Dane sesji są usuwane z przeglądarki użytkownika

## 6. Metryki sukcesu

### 6.1 Metryki ilościowe
- 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkowników bez edycji
- 75% wszystkich fiszek w systemie jest tworzonych z wykorzystaniem AI
- Średni czas utworzenia fiszki (manualnie vs. przez AI)
- Liczba aktywnych użytkowników korzystających z systemu
- Liczba fiszek tworzonych dziennie/tygodniowo przez użytkowników

### 6.2 Metryki jakościowe
- Satysfakcja użytkowników z jakości generowanych fiszek
- Łatwość użycia interfejsu do akceptacji/odrzucania fiszek
- Przydatność fiszek w procesie nauki
- Ogólne zadowolenie z produktu

### 6.3 Sposób pomiaru
- Automatyczne śledzenie statystyk akceptacji/odrzucenia fiszek
- Analiza proporcji fiszek tworzonych manualnie vs. przez AI
- Badanie satysfakcji użytkowników po wdrożeniu MVP
- Zbieranie opinii użytkowników na temat jakości generowanych fiszek 