# OpenRouter Service Implementation Plan

## 1. Opis usługi
`OpenRouterService` to warstwa komunikacji z API OpenRouter, umożliwiająca wysyłanie i odbieranie wiadomości LLM z zachowaniem struktury konwersacji oraz formatowania odpowiedzi.

### Główne cele:
1. Umożliwienie wysyłania wiadomości systemowych i użytkownika.
2. Zapewnienie ustrukturyzowanych odpowiedzi (JSON Schema).
3. Obsługa parametrów modelu i konfiguracji.
4. Bezpieczne przechowywanie klucza API.

## 2. Opis konstruktora
```ts
constructor(options: {
  apiKey: string;
  baseUrl?: string;          // domyślnie `https://openrouter.ai/api`
  defaultModel?: string;     // np. `gpt-4o-mini`
  defaultParams?: Record<string, any>;
})
```
- `apiKey`: klucz do autoryzacji w OpenRouter.
- `baseUrl`: adres endpointu API.
- `defaultModel`: nazwa domyślnego modelu.
- `defaultParams`: domyślne parametry (temperatura, maks. długość, itd.).

## 3. Publiczne metody i pola

### Pola:
- `apiKey: string`
- `baseUrl: string`
- `model: string`
- `params: Record<string, any>`

### Metody:
1. **sendChat**(
    `messages: Array<{ role: 'system' | 'user'; content: string }>,`
    `options?: { model?: string; params?: Record<string, any>; responseFormat?: ResponseFormat }
  ): Promise<ChatResponse>`
   - Buduje i wysyła żądanie do OpenRouter.
   - Zwraca sparsowane dane zgodne z odpowiednim JSON Schema.

2. **setModel**(`model: string`): void
   - Ustawia nazwę modelu.

3. **setParams**(`params: Record<string, any>`): void
   - Ustawia domyślne parametry modelu.

## 4. Prywatne metody i pola

1. **buildPayload**(messages, options) → `RequestPayload`
   - Dodaje klucz API.
   - Wstrzykuje `messages`, `model`, `params`, `response_format`.

2. **validateResponse**(raw: any, format: ResponseFormat) → `boolean`
   - Waliduje odpowiedź pod kątem zgodności ze schema.

3. **parseResponse**(raw: any) → `ChatResponse`
   - Wyciąga treść odpowiedzi i ustrukturyzowane dane.

4. **handleError**(error: any) → `never`
   - Mapuje błędy HTTP i sieciowe na niestandardowe wyjątki.

## 5. Obsługa błędów

Potencjalne scenariusze:
1. **Błąd sieci (Timeout/Connection)**
   - Kod 408 lub brak odpowiedzi: retry z backoff.
2. **Błąd uwierzytelnienia**
   - HTTP 401: wyjątek `AuthenticationError`.
3. **Przekroczenie limitu**
   - HTTP 429: wyjątek `RateLimitError`, opcjonalny retry po `Retry-After`.
4. **Błąd walidacji odpowiedzi**
   - `ValidationError` przy niezgodności JSON Schema.
5. **Nieznany błąd serwera**
   - HTTP 500–599: wyjątek `ServerError`, z logowaniem dla dewelopera.

## 6. Kwestie bezpieczeństwa

1. Przechowywanie klucza API w zmiennych środowiskowych (`.env`) i ładowanie przez `process.env`.
2. Ograniczenie uprawnień klucza (tylko do odczytu i zapisu rozmów).
3. Sanityzacja treści wiadomości.
4. Ograniczanie liczby żądań (rate limiting) po stronie aplikacji.
5. Logowanie i maskowanie wrażliwych danych.

## 7. Plan wdrożenia krok po kroku

1. **Instalacja zależności**
   ```bash
   pnpm add axios zod
   ```

2. **Stworzenie pliku serwisu**
   - `src/lib/OpenRouterService.ts`
   - Implementacja klasy zgodnie z sekcjami 2–4.

3. **Definiowanie ResponseFormat i typów**
   ```ts
   export type ResponseFormat = {
     type: 'json_schema';
     json_schema: { name: string; strict: boolean; schema: any };
   };

   export interface ChatResponse {
     content: string;
     structured: any;
   }
   ```

4. **Przykładowe użycie**
   ```ts
   const service = new OpenRouterService({
     apiKey: process.env.OPENROUTER_KEY!,
     defaultModel: 'gpt-4o-mini',
     defaultParams: { temperature: 0.7, max_tokens: 1024 }
   });

   const messages = [
     { role: 'system', content: 'You are a helpful assistant.' },
     { role: 'user', content: 'What is the capital of France?' }
   ];

   const responseFormat: ResponseFormat = {
     type: 'json_schema',
     json_schema: {
       name: 'capitalResponse',
       strict: true,
       schema: { type: 'object', properties: { capital: { type: 'string' } }, required: ['capital'] }
     }
   };

   const { content, structured } = await service.sendChat(messages, { responseFormat });
   console.log(content);           // surowy tekst odpowiedzi
   console.log(structured.capital); // np. "Paris"
   ```

5. **Integracja w API**
   - W `src/pages/api/chat.ts` wywołaj `service.sendChat(...)`.
   - Obsłuż błędy i zwróć ustrukturyzowaną odpowiedź klientowi.

---

*Plan wdrożony zgodnie z zalecaną architekturą i standardami czystego kodu.* 