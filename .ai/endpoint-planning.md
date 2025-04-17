## generations

Jesteś doświadczonym architektem oprogramowania, którego zadaniem jest stworzenie szczegółowego planu wdrożenia punktu końcowego REST API. Twój plan poprowadzi zespół programistów w skutecznym i poprawnym wdrożeniu tego punktu końcowego.

Zanim zaczniemy, zapoznaj się z poniższymi informacjami:

1. Route API specification:
<route_api_specification>
{{### 2.3 Generations (AI-Generated Flashcards)

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
</route_api_specification>

2. Related database resources:
<related_db_resources>
{{## 1.3. Tabela `generations`
- **id**: BIGSERIAL PRIMARY KEY  
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE  
- **model**: VARCHAR NOT NULL  
- **generated_count**: INTEGER NOT NULL  
- **accepted_unedited_count**: INTEGER NOT NULL  
- **accepted_edited_count**: INTEGER NOT NULL  
- **source_text_hash**: VARCHAR NOT NULL  
- **source_text_length**: INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)

## 2. Relacje między tabelami

- **users** → **flashcards**: Jeden użytkownik może mieć wiele fiszek. Relacja 1:N realizowana przez pole `user_id` (ON DELETE CASCADE).
- **users** → **generations**: Jeden użytkownik może mieć wiele generacji. Relacja 1:N realizowana przez pole `user_id` (ON DELETE CASCADE).
- **users** → **generation_error_logs**: Jeden użytkownik może mieć wiele wpisów błędów generacji. Relacja 1:N realizowana przez pole `user_id` (ON DELETE CASCADE).
}}
</related_db_resources>

3. Definicje typów:
<type_definitions>
{{@types.ts }}
</type_definitions>

3. Tech stack:
<tech_stack>
{{@tech_stack.md }}
</tech_stack>

4. Implementation rules:
<implementation_rules>
{{@shared.mdc @astro.mdc @backend.mdc }} <- zamień na referencje do Rules for AI dla backendu (np. @shared.mdc, @backend.mdc, @astro.mdc)
</implementation_rules>

Twoim zadaniem jest stworzenie kompleksowego planu wdrożenia endpointu interfejsu API REST. Przed dostarczeniem ostatecznego planu użyj znaczników <analysis>, aby przeanalizować informacje i nakreślić swoje podejście. W tej analizie upewnij się, że:

1. Podsumuj kluczowe punkty specyfikacji API.
2. Wymień wymagane i opcjonalne parametry ze specyfikacji API.
3. Wymień niezbędne typy DTO i Command Modele.
4. Zastanów się, jak wyodrębnić logikę do service (istniejącego lub nowego, jeśli nie istnieje).
5. Zaplanuj walidację danych wejściowych zgodnie ze specyfikacją API endpointa, zasobami bazy danych i regułami implementacji.
6. Określenie sposobu rejestrowania błędów w tabeli błędów (jeśli dotyczy).
7. Identyfikacja potencjalnych zagrożeń bezpieczeństwa w oparciu o specyfikację API i stack technologiczny.
8. Nakreśl potencjalne scenariusze błędów i odpowiadające im kody stanu.

Po przeprowadzeniu analizy utwórz szczegółowy plan wdrożenia w formacie markdown. Plan powinien zawierać następujące sekcje:

1. Przegląd punktu końcowego
2. Szczegóły żądania
3. Szczegóły odpowiedzi
4. Przepływ danych
5. Względy bezpieczeństwa
6. Obsługa błędów
7. Wydajność
8. Kroki implementacji

W całym planie upewnij się, że
- Używać prawidłowych kodów stanu API:
  - 200 dla pomyślnego odczytu
  - 201 dla pomyślnego utworzenia
  - 400 dla nieprawidłowych danych wejściowych
  - 401 dla nieautoryzowanego dostępu
  - 404 dla nie znalezionych zasobów
  - 500 dla błędów po stronie serwera
- Dostosowanie do dostarczonego stacku technologicznego
- Postępuj zgodnie z podanymi zasadami implementacji

Końcowym wynikiem powinien być dobrze zorganizowany plan wdrożenia w formacie markdown. Oto przykład tego, jak powinny wyglądać dane wyjściowe:

``markdown
# API Endpoint Implementation Plan: [Nazwa punktu końcowego]

## 1. Przegląd punktu końcowego
[Krótki opis celu i funkcjonalności punktu końcowego]

## 2. Szczegóły żądania
- Metoda HTTP: [GET/POST/PUT/DELETE]
- Struktura URL: [wzorzec URL]
- Parametry:
  - Wymagane: [Lista wymaganych parametrów]
  - Opcjonalne: [Lista opcjonalnych parametrów]
- Request Body: [Struktura treści żądania, jeśli dotyczy]

## 3. Wykorzystywane typy
[DTOs i Command Modele niezbędne do implementacji]

## 3. Szczegóły odpowiedzi
[Oczekiwana struktura odpowiedzi i kody statusu]

## 4. Przepływ danych
[Opis przepływu danych, w tym interakcji z zewnętrznymi usługami lub bazami danych]

## 5. Względy bezpieczeństwa
[Szczegóły uwierzytelniania, autoryzacji i walidacji danych]

## 6. Obsługa błędów
[Lista potencjalnych błędów i sposób ich obsługi]

## 7. Rozważania dotyczące wydajności
[Potencjalne wąskie gardła i strategie optymalizacji]

## 8. Etapy wdrożenia
1. [Krok 1]
2. [Krok 2]
3. [Krok 3]
...
```

Końcowe wyniki powinny składać się wyłącznie z planu wdrożenia w formacie markdown i nie powinny powielać ani powtarzać żadnej pracy wykonanej w sekcji analizy.

Pamiętaj, aby zapisać swój plan wdrożenia jako .ai/view-implementation-plan.md. Upewnij się, że plan jest szczegółowy, przejrzysty i zapewnia kompleksowe wskazówki dla zespołu programistów.

############

Utworzyłem szczegółowy plan implementacji endpointów do generowania i zarządzania fiszkami AI. Plan został zapisany w pliku .ai/view-implementation-plan.md i zawiera wszystkie niezbędne informacje dla zespołu programistów, w tym:
Przegląd funkcjonalności endpointów
Szczegółową specyfikację żądań i odpowiedzi
Listę wykorzystywanych typów DTO
Opis przepływu danych
Rozważania dotyczące bezpieczeństwa i wydajności
Kompletny plan kroków implementacyjnych
Plan został dostosowany do specyfikacji technicznej projektu, uwzględniając technologie Astro, Supabase, oraz zasady implementacji opisane w dostarczonych dokumentach.