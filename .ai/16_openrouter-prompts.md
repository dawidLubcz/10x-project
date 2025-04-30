## 1. Plan implementacji

Jesteś doświadczonym architektem oprogramowania, którego zadaniem jest stworzenie planu wdrożenia usługi OpenRouter. Usługa ta będzie współdziałać z interfejsem API OpenRouter w celu uzupełnienia czatów opartych na LLM. Twoim celem jest stworzenie kompleksowego i przejrzystego planu wdrożenia, który developer może wykorzystać do prawidłowego i sprawnego wdrożenia usługi.

Najpierw przejrzyj dostarczony stack technologiczny i zasady implementacji:

<tech_stack>
{{@tech-stack.md }}
</tech_stack>

<service_rules>
{{@shared.mdc }}
</service_rules>

Teraz przeanalizuj dostarczone informacje i rozbij szczegóły implementacji. Użyj znaczników <implementation_breakdown> wewnątrz bloku myślenia, aby pokazać swój proces myślowy. Rozważ następujące kwestie:

1. Wymień każdy kluczowy komponent usługi OpenRouter i jego cel, numerując je.
2. Dla każdego komponentu:
   a. Szczegółowo opisz jego funkcjonalność.
   b. Wymień potencjalne wyzwania związane z wdrożeniem, numerując je.
   c. Zaproponuj niezależne od technologii rozwiązania tych wyzwań, numerując je tak, aby odpowiadały wyzwaniom.
3. Wyraźne rozważenie sposobu włączenia każdego z poniższych elementów, wymieniając potencjalne metody lub podejścia w celu spełnienia oczekiwań OpenRouter API:
   - Komunikat systemowy
   - Komunikat użytkownika
   - Ustrukturyzowane odpowiedzi poprzez response_format (schemat JSON w odpowiedzi modelu)
   - Nazwa modelu
   - Parametry modelu

Podaj konkretne przykłady dla każdego elementu, numerując je. Upewnij się, że przykłady te są jasne i pokazują, w jaki sposób należy je zaimplementować w usłudze, zwłaszcza w przypadku response_format. Wykorzystaj wzór poprawnie zdefiniowanego response_format: { type: 'json_schema', json_schema: { name: [schema-name], strict: true, schema: [schema-obj] } }

4. Zajmij się obsługą błędów dla całej usługi, wymieniając potencjalne scenariusze błędów i numerując je.

Na podstawie przeprowadzonej analizy utwórz kompleksowy przewodnik implementacji. Przewodnik powinien być napisany w formacie Markdown i mieć następującą strukturę:

1. Opis usługi
2. Opis konstruktora
3. Publiczne metody i pola
4. Prywatne metody i pola
5. Obsługa błędów
6. Kwestie bezpieczeństwa
7. Plan wdrożenia krok po kroku

Upewnij się, że plan wdrożenia
1. Jest dostosowany do określonego stacku technologicznego
2. Obejmuje wszystkie istotne komponenty usługi OpenRouter
3. Obejmuje obsługę błędów i najlepsze praktyki bezpieczeństwa
4. Zawiera jasne instrukcje dotyczące wdrażania kluczowych metod i funkcji
5. Wyjaśnia, jak skonfigurować komunikat systemowy, komunikat użytkownika, response_format (schemat JSON), nazwę modelu i parametry modelu.

Używa odpowiedniego formatowania Markdown dla lepszej czytelności. Końcowy wynik powinien składać się wyłącznie z przewodnika implementacji w formacie Markdown i nie powinien powielać ani powtarzać żadnej pracy wykonanej w sekcji podziału implementacji.

Zapisz przewodnik implementacji w .ai/openrouter-service-implementation-plan.md

## 2. Implementacja

Twoim zadaniem jest zaimplementowanie serwisu w oparciu o podany plan implementacji i zasady implementacji. Twoim celem jest stworzenie szczegółowej i dokładnej implementacji, która jest zgodna z dostarczonym planem, poprawnie komunikuje się z API i obsługuje wszystkie określone funkcjonalności oraz przypadki błędów.

Najpierw przejrzyj plan implementacji:
<implementation_plan>
{{@openrouter-service-implementation-plan.md }}

Utwórz serwis w {{src/lib/openrouter.service.ts}}
</implementation_plan>

Teraz przejrzyj zasady implementacji:
<implementation_rules>
{{@shared.mdc @backend.mdc @astro.mdc }}
</implementation_rules>

Wdrażaj plan zgodnie z następującym podejściem:
<implementation_approach>
Realizuj maksymalnie 3 kroki planu implementacji, podsumuj krótko co zrobiłeś i opisz plan na 3 kolejne działania - zatrzymaj w tym momencie pracę i czekaj na mój feedback.
</implementation_approach>

Dokładnie przeanalizuj plan wdrożenia i zasady. Zwróć szczególną uwagę na strukturę serwisu, integrację API, obsługę błędów i kwestie bezpieczeństwa opisane w planie.

Wykonaj następujące kroki, aby zaimplementować serwis:

Struktura serwisu:
- Zdefiniuj klasę serwisu zgodnie z planem implementacji
- Utwórz konstruktor inicjalizujący wymagane pola
- Zastosuj odpowiednie modyfikatory dostępu dla pól i metod (public, private)

Implementacja metod publicznych:
- Zaimplementuj metody publiczne wymienione w planie
- Upewnij się, że każda metoda jest poprawnie typowana zarówno dla parametrów jak i zwracanych wartości
- Zapewnij kompletną implementację logiki biznesowej opisanej w planie

Implementacja metod prywatnych:
- Opracuj metody pomocnicze wymienione w planie
- Zapewnij prawidłową enkapsulację i separację odpowiedzialności
- Zaimplementuj logikę formatowania danych, wysyłania żądań i przetwarzania odpowiedzi

Integracja z API:
- Zaimplementuj logikę komunikacji z zewnętrznym API
- Obsłuż wszystkie niezbędne parametry i nagłówki żądań
- Zapewnij poprawne przetwarzanie odpowiedzi z API

Obsługa błędów:
- Zaimplementuj kompleksową obsługę błędów dla wszystkich scenariuszy
- Zastosuj odpowiednie mechanizmy ponownych prób dla błędów przejściowych
- Zapewnij czytelne komunikaty błędów dla różnych scenariuszy

Zabezpieczenia:
- Zaimplementuj zalecane praktyki bezpieczeństwa wymienione w planie
- Zapewnij bezpieczne zarządzanie kluczami API i danymi uwierzytelniającymi
- Zastosuj walidację danych wejściowych dla zapobiegania atakom

Dokumentacja i typowanie:
- Zdefiniuj i zastosuj odpowiednie interfejsy dla parametrów i zwracanych wartości
- Zapewnij pełne pokrycie typami dla całego serwisu

Testowanie:
- Przygotuj strukturę serwisu w sposób umożliwiający łatwe testowanie jednostkowe
- Uwzględnij możliwość mockowania zależności zewnętrznych

W trakcie całego procesu implementacji należy ściśle przestrzegać dostarczonych zasad implementacji. Zasady te mają pierwszeństwo przed wszelkimi ogólnymi najlepszymi praktykami, które mogą być z nimi sprzeczne.

Upewnij się, że twoja implementacja dokładnie odzwierciedla dostarczony plan implementacji i przestrzega wszystkich określonych zasad. Zwróć szczególną uwagę na strukturę serwisu, integrację z API, obsługę błędów i zabezpieczenia.