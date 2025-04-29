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
