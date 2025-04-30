## Planowanie UI
Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu architektury interfejsu użytkownika dla MVP (Minimum Viable Product) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do utworzenia szczegółowej architektury UI, map podróży użytkownika i struktury nawigacji.

Prosimy o uważne zapoznanie się z poniższymi informacjami:

<product_requirements>
@prd.md
</product_requirements>

<tech_stack>
@tech-stack.md
</tech_stack>

<api_plan>
@api-plan.md
</api_plan>

Przeanalizuj dostarczone informacje, koncentrując się na aspektach istotnych dla projektowania interfejsu użytkownika. Rozważ następujące kwestie:

1. Zidentyfikuj kluczowe widoki i ekrany na podstawie wymagań produktu i dostępnych endpointów API.
2. Określ potencjalne przepływy użytkownika i nawigację między widokami, uwzględniając możliwości API.
3. Rozważ komponenty UI i wzorce interakcji, które mogą być konieczne do efektywnej komunikacji z API.
4. Pomyśl o responsywności i dostępności interfejsu.
5. Oceń wymagania bezpieczeństwa i uwierzytelniania w kontekście integracji z API.
6. Rozważ wszelkie konkretne biblioteki UI lub frameworki, które mogą być korzystne dla projektu.
7. Przeanalizuj, jak struktura API wpływa na projekt UI i przepływy danych w aplikacji.

Na podstawie analizy wygeneruj listę pytań i zaleceń. Powinny one dotyczyć wszelkich niejasności, potencjalnych problemów lub obszarów, w których potrzeba więcej informacji, aby stworzyć efektywną architekturę UI. Rozważ pytania dotyczące:

1. Hierarchia i organizacja widoków w odniesieniu do struktury API
2. Przepływy użytkownika i nawigacja wspierane przez dostępne endpointy
3. Responsywność i adaptacja do różnych urządzeń
4. Dostępność i inkluzywność
5. Bezpieczeństwo i autoryzacja na poziomie UI w powiązaniu z mechanizmami API
6. Spójność designu i doświadczenia użytkownika
7. Strategia zarządzania stanem aplikacji i synchronizacji z API
8. Obsługa stanów błędów i wyjątków zwracanych przez API
9. Strategie buforowania i optymalizacji wydajności w komunikacji z API

Dane wyjściowe powinny mieć następującą strukturę:

<ui_architecture_planning_output>
<pytania>
[Wymień tutaj swoje pytania, ponumerowane]
</pytania>

<rekomendacje>
[Wymień tutaj swoje zalecenia, ponumerowane]
</rekomendacje>
</ui_architecture_planning_output>

Pamiętaj, że Twoim celem jest dostarczenie kompleksowej listy pytań i zaleceń, które pomogą w stworzeniu solidnej architektury UI dla MVP, w pełni zintegrowanej z dostępnymi endpointami API. Skoncentruj się na jasności, trafności i dokładności swoich wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.

Kontynuuj ten proces, generując nowe pytania i rekomendacje w oparciu o przekazany kontekst i odpowiedzi użytkownika, dopóki użytkownik wyraźnie nie poprosi o podsumowanie.

Pamiętaj, aby skupić się na jasności, trafności i dokładności wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.

---------------------

Architektura UI dla MVP 10xCards
Struktura główna
Aplikacja będzie składać się z 5 kluczowych widoków, które zapewnią minimalną funkcjonalność wymaganą w PRD:
Ekran uwierzytelniania - prosty formularz logowania/rejestracji bez weryfikacji email czy odzyskiwania hasła
Dashboard - strona główna służąca jako punkt nawigacyjny z podstawową statystyką liczby fiszek
Widok generowania fiszek - główny ekran do wprowadzania tekstu i przeglądania wygenerowanych propozycji
Lista fiszek - widok zarządzania istniejącymi fiszkami z możliwością edycji i usuwania
Panel użytkownika - prosty widok do zmiany hasła i wylogowania
Przepływy użytkownika
Główny przepływ użytkownika to:
Logowanie/rejestracja -> przekierowanie do widoku generowania
Wprowadzenie tekstu (max 100 znaków) -> generowanie propozycji fiszek przez AI
Przeglądanie propozycji z możliwością akceptacji, edycji lub odrzucenia każdej fiszki
Zarządzanie kolekcją fiszek poprzez listę z paginacją (10 elementów na stronę)
Komponenty UI
Aplikacja będzie korzystać z biblioteki komponentów Shadcn/ui, w tym:
Card - do prezentacji fiszek we wszystkich widokach
Dialog - dla modali edycji i potwierdzeń usunięcia
Toast - do komunikatów o statusie operacji
Button - dla wszystkich akcji z odpowiednimi stanami (loading, disabled)
Formularze z walidacją w czasie rzeczywistym
Integracja z API
Użycie React Query do zarządzania stanem i komunikacją z API
Obsługa stanu ładowania podczas generowania fiszek ("Generowanie...")
Jasne komunikaty błędów dla wszystkich operacji API
Przepływ danych dostosowany do endpointów zdefiniowanych w planie API
Zapewnienie właściwej walidacji po stronie klienta zgodnej z ograniczeniami API
Szczegóły implementacyjne dla kluczowych widoków
Generowanie fiszek
Pole tekstowe z licznikiem znaków (max 100) i przyciskiem "Generuj"
Prosty komunikat o statusie podczas generowania
Lista wygenerowanych propozycji z parami pytanie-odpowiedź
Trzy przyciski akcji pod każdą propozycją (Akceptuj, Edytuj, Odrzuć)
Modal edycji z dwoma polami tekstowymi i walidacją
Lista fiszek
Tabela lub karty z pytaniem i odpowiedzią dla każdej fiszki
Przyciski edycji i usuwania przy każdej fiszce
Potwierdzenie przed usunięciem
Prosta paginacja z przyciskami Poprzednia/Następna
10 fiszek na stronę
Panel użytkownika
Prosty formularz zmiany hasła
Przycisk wylogowania
Technologie
Astro 5 dla komponentów statycznych
React 19 dla komponentów interaktywnych
TypeScript 5 dla typowania
Tailwind 4 dla stylowania
Shadcn/ui dla komponentów UI
React Query dla zarządzania stanem i komunikacji z API
</ui_architecture_planning_summary>
<unresolved_issues>
Dokładny wygląd i zawartość dashboardu (poza podstawową statystyką liczby fiszek).
Szczegółowy sposób prezentacji fiszek w widoku listy (np. karty, tabela, czy inny układ).
Szczegóły dotyczące responsywności aplikacji i dostosowania do różnych urządzeń.
Dokładna implementacja komunikatów podczas interakcji z API (poza prostym "Generowanie...").
Szczegółowa strategia zarządzania stanem aplikacji z użyciem React Query.
</unresolved_issues>
</conversation_summary>

### Podsumowanie
{{latest-round-answers}} <- lista odpowiedzi na drugą runde pytań

---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania architektury UI dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:
1. Dokument wymagań produktu (PRD)
2. Informacje o stacku technologicznym
3. Plan API
4. Historia rozmów zawierająca pytania i odpowiedzi
5. Zalecenia dotyczące architektury UI

Twoim zadaniem jest:
1. Podsumować historię konwersacji, koncentrując się na wszystkich decyzjach związanych z planowaniem architektury UI.
2. Dopasować zalecenia modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikować, które zalecenia są istotne w oparciu o dyskusję.
3. Przygotować szczegółowe podsumowanie rozmowy, które obejmuje:
   a. Główne wymagania dotyczące architektury UI
   b. Kluczowe widoki, ekrany i przepływy użytkownika
   c. Strategię integracji z API i zarządzania stanem
   d. Kwestie dotyczące responsywności, dostępności i bezpieczeństwa
   e. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia
4. Sformatować wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika, ponumerowane].
</decisions>
<matched_recommendations>
[Lista najistotniejszych zaleceń dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>
<ui_architecture_planning_summary>
[Podaj szczegółowe podsumowanie rozmowy, w tym elementy wymienione w kroku 3].
</ui_architecture_planning_summary>
<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu planowania architektury UI i integracji z API.

## Generowanie ui-plan

<conversation_summary>
<decisions>
1. MVP będzie miał 5 głównych widoków: ekran uwierzytelniania, dashboard, widok generowania fiszek, listę fiszek z modalem do edycji i przyciskiem usuwania, panel użytkownika.
2. Przepływ użytkownika: logowanie -> przekierowanie do widoku generowania z AI -> wprowadzanie tekstu -> recenzja wygenerowanych fiszek (akceptacja, edycja lub odrzucenie).
3. Na liście fiszek powinny być wyświetlane obie strony fiszki (pytanie i odpowiedź).
4. Panel użytkownika potrzebuje tylko funkcjonalności zmiany hasła.
5. Prosty design bez określonych preferencji kolorystycznych.
6. Dashboard ma służyć jako punkt nawigacyjny z podstawowymi statystykami, jak liczba fiszek.
7. Bez funkcji wyszukiwania.
8. Bez widoku do nauki, tylko tworzenie i zarządzanie fiszkami.
9. Bez grupowania czy kategoryzacji fiszek.
10. 10 fiszek na stronie w widoku listy.
11. Brak potrzeby wskaźnika postępu podczas generowania fiszek.
12. Bez opcji anulowania trwającego procesu generowania.
</decisions>

<matched_recommendations>
1. Zaprojektowanie minimalistycznego układu MVP z 5 głównymi widokami: logowanie/rejestracja, dashboard, generowanie fiszek, lista fiszek, panel użytkownika.
2. Stworzenie prostego dashboardu z liczbą posiadanych fiszek i przyciskami nawigacyjnymi.
3. Implementacja ekranu generowania fiszek z polem tekstowym ograniczonym do 100 znaków, licznikiem znaków i przyciskiem "Generuj".
4. Wyświetlanie komunikatu "Generowanie..." podczas oczekiwania na odpowiedź API.
5. Pokazywanie listy propozycji fiszek z widocznymi parami pytanie-odpowiedź.
6. Dodanie trzech przycisków pod każdą propozycją fiszki: "Akceptuj", "Edytuj", "Odrzuć".
7. Implementacja prostego modalu edycji z dwoma polami tekstowymi (przód/tył) i licznikami znaków.
8. Stworzenie widoku listy fiszek z paginacją po 10 elementów na stronę.
9. Wyświetlanie obu elementów fiszki (przód i tył) oraz przycisków edycji i usunięcia w widoku listy.
10. Użycie komponentu Dialog ze Shadcn/ui do potwierdzania usunięcia fiszki.
11. Implementacja prostego panelu użytkownika z formularzem zmiany hasła i przyciskiem wylogowania.
12. Użycie komponentu Toast ze Shadcn/ui do wyświetlania informacji o powodzeniu/niepowodzeniu operacji.
13. Implementacja górnego paska nawigacyjnego z linkami do głównych sekcji aplikacji.
14. Zastosowanie komponentów Card ze Shadcn/ui do prezentacji fiszek.
15. Zapewnienie walidacji w czasie rzeczywistym dla wszystkich pól formularzy z komunikatami błędów.
</matched_recommendations>

<ui_architecture_planning_summary>
# Architektura UI dla MVP 10xCards

## Struktura główna
Aplikacja będzie składać się z 5 kluczowych widoków, które zapewnią minimalną funkcjonalność wymaganą w PRD:

1. **Ekran uwierzytelniania** - prosty formularz logowania/rejestracji bez weryfikacji email czy odzyskiwania hasła
2. **Dashboard** - strona główna służąca jako punkt nawigacyjny z podstawową statystyką liczby fiszek
3. **Widok generowania fiszek** - główny ekran do wprowadzania tekstu i przeglądania wygenerowanych propozycji
4. **Lista fiszek** - widok zarządzania istniejącymi fiszkami z możliwością edycji i usuwania
5. **Panel użytkownika** - prosty widok do zmiany hasła i wylogowania

## Przepływy użytkownika
Główny przepływ użytkownika to:
- Logowanie/rejestracja -> przekierowanie do widoku generowania
- Wprowadzenie tekstu (max 100 znaków) -> generowanie propozycji fiszek przez AI
- Przeglądanie propozycji z możliwością akceptacji, edycji lub odrzucenia każdej fiszki
- Zarządzanie kolekcją fiszek poprzez listę z paginacją (10 elementów na stronę)

## Komponenty UI
Aplikacja będzie korzystać z biblioteki komponentów Shadcn/ui, w tym:
- **Card** - do prezentacji fiszek we wszystkich widokach
- **Dialog** - dla modali edycji i potwierdzeń usunięcia
- **Toast** - do komunikatów o statusie operacji
- **Button** - dla wszystkich akcji z odpowiednimi stanami (loading, disabled)
- Formularze z walidacją w czasie rzeczywistym

## Integracja z API
- Użycie React Query do zarządzania stanem i komunikacją z API
- Obsługa stanu ładowania podczas generowania fiszek ("Generowanie...")
- Jasne komunikaty błędów dla wszystkich operacji API
- Przepływ danych dostosowany do endpointów zdefiniowanych w planie API
- Zapewnienie właściwej walidacji po stronie klienta zgodnej z ograniczeniami API

## Szczegóły implementacyjne dla kluczowych widoków

### Generowanie fiszek
- Pole tekstowe z licznikiem znaków (max 100) i przyciskiem "Generuj"
- Prosty komunikat o statusie podczas generowania
- Lista wygenerowanych propozycji z parami pytanie-odpowiedź
- Trzy przyciski akcji pod każdą propozycją (Akceptuj, Edytuj, Odrzuć)
- Modal edycji z dwoma polami tekstowymi i walidacją

### Lista fiszek
- Tabela lub karty z pytaniem i odpowiedzią dla każdej fiszki
- Przyciski edycji i usuwania przy każdej fiszce
- Potwierdzenie przed usunięciem
- Prosta paginacja z przyciskami Poprzednia/Następna
- 10 fiszek na stronę

### Panel użytkownika
- Prosty formularz zmiany hasła
- Przycisk wylogowania

## Technologie
- Astro 5 dla komponentów statycznych
- React 19 dla komponentów interaktywnych
- TypeScript 5 dla typowania
- Tailwind 4 dla stylowania
- Shadcn/ui dla komponentów UI
- React Query dla zarządzania stanem i komunikacji z API
</ui_architecture_planning_summary>

<unresolved_issues>
1. Dokładny wygląd i zawartość dashboardu (poza podstawową statystyką liczby fiszek).
2. Szczegółowy sposób prezentacji fiszek w widoku listy (np. karty, tabela, czy inny układ).
3. Szczegóły dotyczące responsywności aplikacji i dostosowania do różnych urządzeń.
4. Dokładna implementacja komunikatów podczas interakcji z API (poza prostym "Generowanie...").
5. Szczegółowa strategia zarządzania stanem aplikacji z użyciem React Query.
</unresolved_issues>
</conversation_summary>

## Generowanie implementation plan
Jako starszy programista frontendu Twoim zadaniem jest stworzenie szczegółowego planu wdrożenia nowego widoku w aplikacji internetowej. Plan ten powinien być kompleksowy i wystarczająco jasny dla innego programisty frontendowego, aby mógł poprawnie i wydajnie wdrożyć widok.

Najpierw przejrzyj następujące informacje:

1. Product Requirements Document (PRD):
<prd>
{{@prd.md }}
</prd>

2. Opis widoku:
<view_description>
{{
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
}}
</view_description>

3. User Stories:
<user_stories>
{{
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
}}
</user_stories>

4. Endpoint Description:
<endpoint_description>
{{
### 2.2 Flashcards

#### 2.2.1 Create a Flashcard (Manual Entry)
- **HTTP Method:** POST
- **URL:** `/api/flashcards`
- **Description:** Manually create a new flashcard.
- **Request JSON:**
  ```json
  {
    "front": "string (max 200 characters)",
    "back": "string (max 500 characters)",
    "source": "manual"
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": "number",
    "front": "string",
    "back": "string",
    "user_id": "UUID",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Code:** 201 Created
- **Error Codes:**
  - 400 Bad Request (validation failure)
  - 401 Unauthorized

#### 2.2.2 List Flashcards
- **HTTP Method:** GET
- **URL:** `/api/flashcards`
- **Description:** Retrieve a list of flashcards for the authenticated user.
- **Query Parameters:**
  - `page`: number (optional, for pagination)
  - `limit`: number (optional, for pagination)
  - `sort_by`: field name (optional)
  - `filter[source]`: string (optional, e.g., 'manual', 'ai-full', 'ai-edited')
- **Response JSON:**
  ```json
  {
    "flashcards": [
      {
        "id": "number",
        "front": "string",
        "back": "string",
        "user_id": "UUID",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
      // ... more flashcards
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
  ```
- **Success Code:** 200 OK
- **Error Codes:**
  - 401 Unauthorized

#### 2.2.3 Get a Single Flashcard
- **HTTP Method:** GET
- **URL:** `/api/flashcards/{id}`
- **Description:** Retrieve details of a specific flashcard by its ID.
- **Response JSON:**
  ```json
  {
    "id": "number",
    "front": "string",
    "back": "string",
    "user_id": "UUID",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Success Code:** 200 OK
- **Error Codes:**
  - 404 Not Found
  - 401 Unauthorized

#### 2.2.4 Update a Flashcard
- **HTTP Method:** PUT/PATCH
- **URL:** `/api/flashcards/{id}`
- **Description:** Edit an existing flashcard (both manual or AI-generated once accepted/edited).
- **Request JSON:** (fields to update)
  ```json
  {
    "front": "string (max 200 characters, optional)",
    "back": "string (max 500 characters, optional)"
  }
  ```
- **Response JSON:** Updated flashcard object (same as GET single flashcard)
- **Success Code:** 200 OK
- **Error Codes:**
  - 400 Bad Request (validation failure)
  - 401 Unauthorized
  - 404 Not Found

#### 2.2.5 Delete a Flashcard
- **HTTP Method:** DELETE
- **URL:** `/api/flashcards/{id}`
- **Description:** Delete a flashcard owned by the authenticated user.
- **Success Code:** 204 No Content
- **Error Codes:**
  - 401 Unauthorized
  - 404 Not Found

### 2.3 Generations (AI-Generated Flashcards)

#### 2.3.1 Initiate Flashcard Generation via AI
- **HTTP Method:** POST
- **URL:** `/api/generations`
- **Description:** Submit text (up to 100 characters) to generate flashcards using AI. The endpoint validates input length and returns generated flashcards for review.
- **Request JSON:**
  ```json
  {
    "inputText": "string (max 100 characters)"
  }
  ```
- **Response JSON:**
  ```json
  {
    "generationId": "number",
    "flashcards": [
      {
        "front": "string (max 1000 characters)",
        "back": "string (max 1000 characters)",
        "source": "ai-full"  // or "ai-edited" if later modified
      }
    ]
  }
  ```
- **Success Code:** 201 Created
- **Error Codes:**
  - 400 Bad Request (input too long or other validation issues)
  - 401 Unauthorized

#### 2.3.2 Accept, Edit, or Reject Generated Flashcards
- **HTTP Method:** PATCH
- **URL:** `/api/generations/{generationId}/flashcards/{flashcardId}`
- **Description:** Update the status of an AI-generated flashcard. The user can accept, edit, or reject the flashcard.
- **Request JSON:**
  ```json
  {
    "action": "accept" | "reject" | "edit",
    "front": "string (optional, for edit)",
    "back": "string (optional, for edit)"
  }
  ```
- **Response JSON:** Updated flashcard object if accepted/edited, or a confirmation message if rejected.
- **Success Code:** 200 OK
- **Error Codes:**
  - 400 Bad Request
  - 401 Unauthorized
  - 404 Not Found
}} 
</endpoint_description>

5. Endpoint Implementation:
<endpoint_implementation>
{{@flashcards.ts @generations.ts }}
</endpoint_implementation>

6. Type Definitions:
<type_definitions>
{{@types.ts }}
</type_definitions>

7. Tech Stack:
<tech_stack>
{{@tech-stack.md }}
</tech_stack>

Przed utworzeniem ostatecznego planu wdrożenia przeprowadź analizę i planowanie wewnątrz tagów <implementation_breakdown> w swoim bloku myślenia. Ta sekcja może być dość długa, ponieważ ważne jest, aby być dokładnym.

W swoim podziale implementacji wykonaj następujące kroki:
1. Dla każdej sekcji wejściowej (PRD, User Stories, Endpoint Description, Endpoint Implementation, Type Definitions, Tech Stack):
  - Podsumuj kluczowe punkty
 - Wymień wszelkie wymagania lub ograniczenia
 - Zwróć uwagę na wszelkie potencjalne wyzwania lub ważne kwestie
2. Wyodrębnienie i wypisanie kluczowych wymagań z PRD
3. Wypisanie wszystkich potrzebnych głównych komponentów, wraz z krótkim opisem ich opisu, potrzebnych typów, obsługiwanych zdarzeń i warunków walidacji
4. Stworzenie wysokopoziomowego diagramu drzewa komponentów
5. Zidentyfikuj wymagane DTO i niestandardowe typy ViewModel dla każdego komponentu widoku. Szczegółowo wyjaśnij te nowe typy, dzieląc ich pola i powiązane typy.
6. Zidentyfikuj potencjalne zmienne stanu i niestandardowe hooki, wyjaśniając ich cel i sposób ich użycia
7. Wymień wymagane wywołania API i odpowiadające im akcje frontendowe
8. Zmapuj każdej historii użytkownika do konkretnych szczegółów implementacji, komponentów lub funkcji
9. Wymień interakcje użytkownika i ich oczekiwane wyniki
10. Wymień warunki wymagane przez API i jak je weryfikować na poziomie komponentów
11. Zidentyfikuj potencjalne scenariusze błędów i zasugeruj, jak sobie z nimi poradzić
12. Wymień potencjalne wyzwania związane z wdrożeniem tego widoku i zasugeruj możliwe rozwiązania

Po przeprowadzeniu analizy dostarcz plan wdrożenia w formacie Markdown z następującymi sekcjami:

1. Przegląd: Krótkie podsumowanie widoku i jego celu.
2. Routing widoku: Określenie ścieżki, na której widok powinien być dostępny.
3. Struktura komponentów: Zarys głównych komponentów i ich hierarchii.
4. Szczegóły komponentu: Dla każdego komponentu należy opisać:
 - Opis komponentu, jego przeznaczenie i z czego się składa
 - Główne elementy HTML i komponenty dzieci, które budują komponent
 - Obsługiwane zdarzenia
 - Warunki walidacji (szczegółowe warunki, zgodnie z API)
 - Typy (DTO i ViewModel) wymagane przez komponent
 - Propsy, które komponent przyjmuje od rodzica (interfejs komponentu)
5. Typy: Szczegółowy opis typów wymaganych do implementacji widoku, w tym dokładny podział wszelkich nowych typów lub modeli widoku według pól i typów.
6. Zarządzanie stanem: Szczegółowy opis sposobu zarządzania stanem w widoku, określenie, czy wymagany jest customowy hook.
7. Integracja API: Wyjaśnienie sposobu integracji z dostarczonym punktem końcowym. Precyzyjnie wskazuje typy żądania i odpowiedzi.
8. Interakcje użytkownika: Szczegółowy opis interakcji użytkownika i sposobu ich obsługi.
9. Warunki i walidacja: Opisz jakie warunki są weryfikowane przez interfejs, których komponentów dotyczą i jak wpływają one na stan interfejsu
10. Obsługa błędów: Opis sposobu obsługi potencjalnych błędów lub przypadków brzegowych.
11. Kroki implementacji: Przewodnik krok po kroku dotyczący implementacji widoku.

Upewnij się, że Twój plan jest zgodny z PRD, historyjkami użytkownika i uwzględnia dostarczony stack technologiczny.

Ostateczne wyniki powinny być w języku polskim i zapisane w pliku o nazwie .ai/{view-name}-view-implementation-plan.md. Nie uwzględniaj żadnej analizy i planowania w końcowym wyniku.

Oto przykład tego, jak powinien wyglądać plik wyjściowy (treść jest do zastąpienia):

```markdown
# Plan implementacji widoku [Nazwa widoku]

## 1. Przegląd
[Krótki opis widoku i jego celu]

## 2. Routing widoku
[Ścieżka, na której widok powinien być dostępny]

## 3. Struktura komponentów
[Zarys głównych komponentów i ich hierarchii]

## 4. Szczegóły komponentów
### [Nazwa komponentu 1]
- Opis komponentu [opis]
- Główne elementy: [opis]
- Obsługiwane interakcje: [lista]
- Obsługiwana walidacja: [lista, szczegółowa]
- Typy: [lista]
- Propsy: [lista]

### [Nazwa komponentu 2]
[...]

## 5. Typy
[Szczegółowy opis wymaganych typów]

## 6. Zarządzanie stanem
[Opis zarządzania stanem w widoku]

## 7. Integracja API
[Wyjaśnienie integracji z dostarczonym endpointem, wskazanie typów żądania i odpowiedzi]

## 8. Interakcje użytkownika
[Szczegółowy opis interakcji użytkownika]

## 9. Warunki i walidacja
[Szczegółowy opis warunków i ich walidacji]

## 10. Obsługa błędów
[Opis obsługi potencjalnych błędów]

## 11. Kroki implementacji
1. [Krok 1]
2. [Krok 2]
3. [...]
```

Rozpocznij analizę i planowanie już teraz. Twój ostateczny wynik powinien składać się wyłącznie z planu wdrożenia w języku polskim w formacie markdown, który zapiszesz w pliku .ai/{view-name}-view-implementation-plan.md i nie powinien powielać ani powtarzać żadnej pracy wykonanej w podziale implementacji.@ui-plan.md 

## Generowanie UI
Twoim zadaniem jest zaimplementowanie widoku frontendu w oparciu o podany plan implementacji i zasady implementacji. Twoim celem jest stworzenie szczegółowej i dokładnej implementacji, która jest zgodna z dostarczonym planem, poprawnie reprezentuje strukturę komponentów, integruje się z API i obsługuje wszystkie określone interakcje użytkownika.

Najpierw przejrzyj plan implementacji:

<implementation_plan>
{{@generate-view-implementation-plan.md }}
</implementation_plan>

Teraz przejrzyj zasady implementacji:

<implementation_rules>
{{@shared.mdc @frontend.mdc @astro.mdc @react.mdc @ui-shadcn-helper.mdc }} 
</implementation_rules>

Przejrzyj zdefiniowane typy:

<types>
{{@types.ts }}
</types>

Wdrażaj plan zgodnie z następującym podejściem:

<implementation_approach>
Realizuj maksymalnie 3 kroki planu implementacji, podsumuj krótko co zrobiłeś i opisz plan na 3 kolejne działania - zatrzymaj w tym momencie pracę i czekaj na mój feedback.
</implementation_approach>

Dokładnie przeanalizuj plan wdrożenia i zasady. Zwróć szczególną uwagę na strukturę komponentów, wymagania dotyczące integracji API i interakcje użytkownika opisane w planie.

Wykonaj następujące kroki, aby zaimplementować widok frontendu:

1. Struktura komponentów:
   - Zidentyfikuj wszystkie komponenty wymienione w planie wdrożenia.
   - Utwórz hierarchiczną strukturę tych komponentów.
   - Upewnij się, że obowiązki i relacje każdego komponentu są jasno zdefiniowane.

2. Integracja API:
   - Zidentyfikuj wszystkie endpointy API wymienione w planie.
   - Wdróż niezbędne wywołania API dla każdego endpointa.
   - Obsłuż odpowiedzi z API i odpowiednio aktualizacji stan komponentów.

3. Interakcje użytkownika:
   - Wylistuj wszystkie interakcje użytkownika określone w planie wdrożenia.
   - Wdróż obsługi zdarzeń dla każdej interakcji.
   - Upewnij się, że każda interakcja wyzwala odpowiednią akcję lub zmianę stanu.

4. Zarządzanie stanem:
   - Zidentyfikuj wymagany stan dla każdego komponentu.
   - Zaimplementuj zarządzanie stanem przy użyciu odpowiedniej metody (stan lokalny, custom hook, stan współdzielony).
   - Upewnij się, że zmiany stanu wyzwalają niezbędne ponowne renderowanie.

5. Stylowanie i layout:
   - Zastosuj określone stylowanie i layout, jak wspomniano w planie wdrożenia.
   - Zapewnienie responsywności, jeśli wymaga tego plan.

6. Obsługa błędów i przypadki brzegowe:
   - Wdrożenie obsługi błędów dla wywołań API i interakcji użytkownika.
   - Rozważ i obsłuż potencjalne edge case'y wymienione w planie.

7. Optymalizacja wydajności:
   - Wdrożenie wszelkich optymalizacji wydajności określonych w planie lub zasadach.
   - Zapewnienie wydajnego renderowania i minimalnej liczby niepotrzebnych ponownych renderowań.

8. Testowanie:
   - Jeśli zostało to określone w planie, zaimplementuj testy jednostkowe dla komponentów i funkcji.
   - Dokładnie przetestuj wszystkie interakcje użytkownika i integracje API.

W trakcie całego procesu implementacji należy ściśle przestrzegać dostarczonych zasad implementacji. Zasady te mają pierwszeństwo przed wszelkimi ogólnymi najlepszymi praktykami, które mogą być z nimi sprzeczne.

Upewnij się, że twoja implementacja dokładnie odzwierciedla dostarczony plan implementacji i przestrzega wszystkich określonych zasad. Zwróć szczególną uwagę na strukturę komponentów, integrację API i obsługę interakcji użytkownika.
