# Plan implementacji widoku Dashboard

## 1. Przegląd
Dashboard to główny widok aplikacji FlashGen AI, służący jako centralny punkt nawigacyjny oraz miejsce prezentacji podstawowych statystyk użytkownika. Widok zapewnia szybki dostęp do głównych funkcjonalności aplikacji, takich jak generowanie fiszek przez AI, manualne tworzenie fiszek, przeglądanie kolekcji oraz rozpoczęcie nauki. Dodatkowo, zawiera podstawowe statystyki dotyczące fiszek użytkownika oraz uproszczony formularz do szybkiego tworzenia nowych fiszek.

## 2. Routing widoku
Widok Dashboard powinien być dostępny pod ścieżką główną `/`.

## 3. Struktura komponentów
```
DashboardPage
├── DashboardLayout
│   ├── Header (z logo i menu)
│   ├── Main Content
│   │   ├── StatisticsCard
│   │   ├── ActionCardGrid
│   │   │   ├── ActionCard (Generuj z AI)
│   │   │   ├── ActionCard (Utwórz manualnie)
│   │   │   ├── ActionCard (Przeglądaj fiszki)
│   │   │   └── ActionCard (Rozpocznij naukę)
│   │   └── QuickCreateForm
│   └── Footer
```

## 4. Szczegóły komponentów
### DashboardLayout
- Opis komponentu: Główny układ strony zawierający nagłówek, stopkę i obszar głównej zawartości
- Główne elementy: Header, main content container, Footer
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: Brak
- Propsy: `children: ReactNode`

### StatisticsCard
- Opis komponentu: Karta wyświetlająca podstawowe statystyki dotyczące fiszek użytkownika
- Główne elementy: Tytuł sekcji, liczniki fiszek w różnych kategoriach, ikony
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: `FlashcardStatistics`
- Propsy: `statistics: FlashcardStatistics, isLoading: boolean, error: Error | null`

### ActionCard
- Opis komponentu: Karta reprezentująca pojedynczą akcję/funkcję aplikacji z linkiem nawigacyjnym
- Główne elementy: Tytuł, opis, ikona, link
- Obsługiwane interakcje: Kliknięcie (przekierowanie do odpowiedniej funkcjonalności)
- Obsługiwana walidacja: Brak
- Typy: `ActionCardProps`
- Propsy: `title: string, description: string, icon: ReactNode, linkTo: string, variant?: 'default' | 'primary' | 'secondary'`

### ActionCardGrid
- Opis komponentu: Kontener wyświetlający siatkę kart akcji w responsywnym układzie
- Główne elementy: Kontenery flex/grid, karty ActionCard
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: `ActionCardGridProps`
- Propsy: `actions: ActionCardProps[]`

### QuickCreateForm
- Opis komponentu: Uproszczony formularz do szybkiego tworzenia fiszek bezpośrednio z dashboardu
- Główne elementy: Pola formularza (front, back), przycisk submit, komunikaty walidacji, komunikat sukcesu/błędu
- Obsługiwane interakcje: Wypełnianie formularza, submit formularza
- Obsługiwana walidacja:
  - Pole front: wymagane, max 200 znaków
  - Pole back: wymagane, max 500 znaków
- Typy: `QuickCreateFormData`, `CreateFlashcardDto`
- Propsy: Brak (komponent wykorzystuje wewnętrzny hook `useQuickCreateFlashcard`)

## 5. Typy
```typescript
// Statystyki fiszek (ViewModel)
interface FlashcardStatistics {
  totalFlashcards: number;
  aiGeneratedFlashcards: number;
  manualFlashcards: number;
  flashcardsToReview: number;
}

// Props dla komponentu ActionCard
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  variant?: 'default' | 'primary' | 'secondary';
}

// Props dla komponentu ActionCardGrid
interface ActionCardGridProps {
  actions: ActionCardProps[];
}

// Dane formularza szybkiego tworzenia fiszki
interface QuickCreateFormData {
  front: string;  // max 200 znaków
  back: string;   // max 500 znaków
}

// DTO do integracji z API - istniejący w aplikacji typ
// import { CreateFlashcardDto, FlashcardSource } from '../../types';
```

## 6. Zarządzanie stanem
Dashboard będzie wykorzystywać dwa główne niestandardowe hooki do zarządzania stanem:

### useFlashcardStatistics
Hook odpowiedzialny za pobieranie statystyk fiszek użytkownika.

```typescript
const useFlashcardStatistics = () => {
  const [statistics, setStatistics] = useState<FlashcardStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Pobieranie statystyk z API
    // Aktualizacja stanu
  }, []);

  return { statistics, loading, error };
};
```

### useQuickCreateFlashcard
Hook odpowiedzialny za tworzenie nowych fiszek bezpośrednio z dashboardu.

```typescript
const useQuickCreateFlashcard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createFlashcard = async (data: QuickCreateFormData) => {
    // Przygotowanie danych zgodnie z DTO
    // Wysłanie żądania do API
    // Obsługa odpowiedzi
  };

  return { createFlashcard, loading, error, success };
};
```

## 7. Integracja API
Dashboard integruje się z API poprzez endpointy:

### GET `/api/flashcards`
- Cel: Pobieranie statystyk fiszek
- Używany w: `useFlashcardStatistics`
- Typy odpowiedzi: `FlashcardListResponseDto`

### POST `/api/flashcards`
- Cel: Tworzenie nowej fiszki
- Używany w: `useQuickCreateFlashcard`
- Typy żądania: `CreateFlashcardDto`
- Typy odpowiedzi: `FlashcardDto`

Przykład integracji:
```typescript
const createFlashcard = async (data: QuickCreateFormData) => {
  setLoading(true);
  setError(null);
  setSuccess(false);
  
  try {
    const requestData: CreateFlashcardDto = {
      front: data.front,
      back: data.back,
      source: FlashcardSource.MANUAL
    };
    
    const response = await fetch('/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Wystąpił błąd podczas tworzenia fiszki');
    }
    
    const flashcard = await response.json();
    setSuccess(true);
    return flashcard;
  } catch (err) {
    setError(err instanceof Error ? err : new Error('Nieznany błąd'));
    return null;
  } finally {
    setLoading(false);
  }
};
```

## 8. Interakcje użytkownika
1. **Nawigacja do głównych funkcji aplikacji:**
   - Użytkownik klika na kartę akcji (ActionCard)
   - System przekierowuje użytkownika do odpowiedniego widoku

2. **Szybkie tworzenie fiszki:**
   - Użytkownik wypełnia pola formularza (front i back)
   - Użytkownik klika przycisk "Utwórz fiszkę"
   - System waliduje dane
   - Jeśli dane są poprawne:
     - System wysyła żądanie do API
     - System wyświetla komunikat o sukcesie
     - System resetuje formularz
   - Jeśli dane są niepoprawne:
     - System wyświetla komunikaty o błędach walidacji
     - Formularz pozostaje wypełniony

## 9. Warunki i walidacja
### QuickCreateForm
1. **Pole Front (Pytanie):**
   - Wymagane
   - Maksymalna długość: 200 znaków
   - Komunikat błędu: "Pytanie jest wymagane" lub "Pytanie może zawierać maksymalnie 200 znaków"

2. **Pole Back (Odpowiedź):**
   - Wymagane
   - Maksymalna długość: 500 znaków
   - Komunikat błędu: "Odpowiedź jest wymagana" lub "Odpowiedź może zawierać maksymalnie 500 znaków"

Walidacja odbywa się:
- W czasie rzeczywistym podczas wpisywania
- Przed wysłaniem formularza
- Z wykorzystaniem biblioteki walidacyjnej (np. Zod)

## 10. Obsługa błędów
1. **Błędy pobierania statystyk:**
   - Wyświetlenie komunikatu o błędzie w komponencie StatisticsCard
   - Przycisk do ponowienia próby

2. **Błędy walidacji formularza:**
   - Wyświetlenie komunikatów o błędach pod odpowiednimi polami
   - Blokada wysłania formularza do momentu poprawienia błędów

3. **Błędy API podczas tworzenia fiszki:**
   - Wyświetlenie komunikatu o błędzie nad formularzem
   - Zachowanie danych wprowadzonych przez użytkownika
   - Możliwość ponowienia próby

4. **Błędy autoryzacji:**
   - Przekierowanie do strony logowania
   - Zapisanie stanu formularza w localStorage (opcjonalnie)

## 11. Kroki implementacji
1. **Przygotowanie struktury plików:**
   - Utworzenie komponentu strony `src/pages/index.astro`
   - Utworzenie katalogu `src/components/dashboard` dla komponentów
   - Utworzenie plików dla poszczególnych komponentów

2. **Implementacja typów i hooków:**
   - Zdefiniowanie typów w pliku `src/lib/types/dashboard.ts`
   - Implementacja hooków w katalogu `src/lib/hooks`

3. **Implementacja komponentów od dołu hierarchii:**
   - ActionCard
   - ActionCardGrid
   - StatisticsCard
   - QuickCreateForm
   - DashboardLayout

4. **Implementacja strony Dashboard:**
   - Złożenie komponentów w `index.astro`
   - Podłączenie hooków i przekazanie danych

5. **Stylowanie komponentów:**
   - Zastosowanie styli z Tailwind
   - Użycie komponentów z Shadcn/ui
   - Zapewnienie responsywności

6. **Testowanie:**
   - Sprawdzenie funkcjonalności wszystkich komponentów
   - Testowanie walidacji formularza
   - Testowanie integracji z API
   - Testowanie responsywności

7. **Optymalizacja:**
   - Zastosowanie lazy loading dla komponentów niekrytycznych
   - Optymalizacja zapytań do API
   - Implementacja cachowania danych 