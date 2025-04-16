Jesteś doświadczonym menedżerem produktu, którego zadaniem jest pomoc w stworzeniu kompleksowego dokumentu wymagań projektowych (PRD) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do utworzenia pełnego PRD.

Prosimy o uważne zapoznanie się z poniższymi informacjami:

<project_description>
{{
### Główny problem
Manualne tworzenie wysokiej jakości fiszek edukacyjnych jest czasochłonne, co zniechęca do korzystania z efektywnej metody nauki jaką jest spaced repetition.

### Najmniejszy zestaw funkcjonalności
- Generowanie fiszek przez AI na podstawie wprowadzonego tekstu (kopiuj-wklej)
- Manualne tworzenie fiszek
- Przeglądanie, edycja i usuwanie fiszek
- Prosty system kont użytkowników do przechowywania fiszek
- Integracja fiszek z gotowym algorytmem powtórek

### Co NIE wchodzi w zakres MVP
- Własny, zaawansowany algorytm powtórek (jak SuperMemo, Anki)
- Import wielu formatów (PDF, DOCX, itp.)
- Współdzielenie zestawów fiszek między użytkownikami
- Integracje z innymi platformami edukacyjnymi
- Aplikacje mobilne (na początek tylko web)

### Kryteria sukcesu
- 75% fiszek wygenerowanych przez AI jest akceptowane przez użytkownika
- Użytkownicy tworzą 75% fiszek z wykorzystaniem AI
}}
</project_description>

Przeanalizuj dostarczone informacje, koncentrując się na aspektach istotnych dla tworzenia PRD. Rozważ następujące kwestie:
<prd_analysis>
1. Zidentyfikuj główny problem, który produkt ma rozwiązać.
2. Określ kluczowe funkcjonalności MVP.
3. Rozważ potencjalne historie użytkownika i ścieżki korzystania z produktu.
4. Pomyśl o kryteriach sukcesu i sposobach ich mierzenia.
5. Oceń ograniczenia projektowe i ich wpływ na rozwój produktu.
</prd_analysis>

Na podstawie analizy wygeneruj listę pytań i zaleceń. Powinny one dotyczyć wszelkich niejasności, potencjalnych problemów lub obszarów, w których potrzeba więcej informacji, aby stworzyć skuteczny PRD. Rozważ pytania dotyczące:

1. Szczegółów problemu użytkownika
2. Priorytetyzacji funkcjonalności
3. Oczekiwanego doświadczenia użytkownika
4. Mierzalnych wskaźników sukcesu
5. Potencjalnych ryzyk i wyzwań
6. Harmonogramu i zasobów

<pytania>
[Wymień tutaj swoje pytania, ponumerowane dla jasności].
</pytania>

<rekomendacje>
[Wymień tutaj swoje zalecenia, ponumerowane dla jasności]
</rekomendacje>

Kontynuuj ten proces, generując nowe pytania i rekomendacje w oparciu o odpowiedzi użytkownika, dopóki użytkownik wyraźnie nie poprosi o podsumowanie.

Pamiętaj, aby skupić się na jasności, trafności i dokładności wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.

Pracę analityczną należy przeprowadzić w bloku myślenia. Końcowe dane wyjściowe powinny składać się wyłącznie z pytań i zaleceń i nie powinny powielać ani powtarzać żadnej pracy wykonanej w sekcji prd_analysis.

-------------
<pytania>
Kim są główni użytkownicy docelowi (np. studenci, nauczyciele, profesjonaliści)?
Jakie konkretne potrzeby edukacyjne mają zaspokoić te fiszki (języki obce, medycyna, prawo)?
Który gotowy algorytm powtórek planujecie wykorzystać?
Jakie parametry będą konfigurowalne przez użytkownika w procesie generowania fiszek przez AI?
Jak dokładnie będzie mierzony wskaźnik "akceptacji fiszek" (75%)?
Jakie są wymagania dotyczące interfejsu użytkownika i doświadczenia użytkownika?
Jakie języki będą wspierane przez system generowania fiszek?
Czy planujecie jakieś mechanizmy zachęcające do regularnego korzystania z aplikacji?
Jak będziecie zbierać feedback od użytkowników na temat jakości wygenerowanych fiszek?
Jaki jest planowany czas realizacji MVP?
Jakie są oczekiwania dotyczące skalowalności systemu?
Jakie są wymagania dotyczące bezpieczeństwa danych użytkowników?
</pytania>
<rekomendacje>
Zdefiniować dokładne kryteria jakości dla wygenerowanych fiszek AI
Stworzyć jasny system oceny i feedbacku dla wygenerowanych fiszek
Zaprojektować prosty interfejs edycji fiszek z podglądem na żywo
Zaimplementować funkcję sugerowania poprawek do wygenerowanych fiszek
Ustalić mechanizm pomiaru efektywności nauki z wykorzystaniem fiszek
Opracować ścieżkę rozwoju produktu po fazie MVP
Stworzyć plan testów z udziałem rzeczywistych użytkowników przed pełnym wdrożeniem
Zdefiniować metryki sukcesu dla każdej głównej funkcjonalności
Przygotować strategię onboardingu dla nowych użytkowników
Określić wymagania techniczne dla wydajnego działania AI w systemie
</rekomendacje>

------------------
1. Studenci i profesjonalisci
2. Jako, ze generuje kontent AI to moze to byc kazda dziedzina
3. nie wiem
4. Tekst na podstawie ktorego AI wygeneruje fiszke
5. Na podstwie tego czy uzytkownik zaakceptuje sugestie AI
6. Manualne tworzenie fiszki poprzez formularz tesktowy oraz generowanie przez AI gdzie rowniez bedzie to formularz tesktowy. Lista zapisanych fiszek. Mozliwosc dodania nowej, usuniecia istniejacej. Logowanie, stworzenie konta, usuniecie konta uzytkownika
7. Polski
8. Nie
9. Po wygenerowaniu fiszki przez AI fiszka zostanie dodana do listy oczekujacych. Na liscie oczekujacych uzytkownik bedzie mogl kliknac w fiszke, zaakceptowac ja, edytowac lub odrzucic. Po zaakceptowaniu fiszka zostanie zapisana do bazy danych.
10. 5 dni
11. Na ten moment nie ma takich wymagan
12. Jest to zalatwiane przez uzycie supabase
