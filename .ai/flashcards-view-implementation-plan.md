# Plan implementacji widoku Listy Fiszek

## 1. Przegląd
Widok Listy Fiszek umożliwia użytkownikom przeglądanie, edytowanie i usuwanie ich kolekcji fiszek edukacyjnych. Jest to kluczowy element aplikacji FlashGen AI, pozwalający na zarządzanie materiałami do nauki. Interfejs zapewnia czytelną prezentację fiszek z pytaniami i odpowiedziami, z możliwością rozwijania pełnej treści, a także oferuje funkcje sortowania, filtrowania oraz paginacji dla wygodnego przeglądania dużych zbiorów fiszek.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/flashcards` w aplikacji.

## 3. Struktura komponentów
```
FlashcardsList (Astro)
├── FlashcardFilters (React)
├── FlashcardGrid (React)
│   └── FlashcardItem (React) - wielokrotnie
├── Pagination (React)
├── FlashcardEditModal (React) - warunkowy
└── DeleteConfirmationModal (React) - warunkowy
```

## 4. Szczegóły komponentów
### FlashcardsList (Astro)
- Opis komponentu: Główny komponent strony, który integruje wszystkie komponenty React i zarządza ogólnym układem.
- Główne elementy: Nagłówek strony z tytułem i liczbą fiszek, kontener dla komponentów React.
- Obsługiwane interakcje: Brak (statyczny kontener).
- Obsługiwana walidacja: Brak.
- Typy: Brak.
- Propsy: Brak.

### FlashcardFilters (React)
- Opis komponentu: Panel z kontrolkami do filtrowania i sortowania fiszek.
- Główne elementy: Dropdown do wyboru źródła fiszek (manual, ai-full, ai-edited), dropdown do sortowania, kontrolki resetu filtrów.
- Obsługiwane interakcje: Zmiana filtrów, zmiana sortowania, reset filtrów.
- Obsługiwana walidacja: Poprawność wartości dla filtrów.
- Typy: FlashcardFiltersProps.
- Propsy: 
  - currentFilters: FlashcardQueryParams
  - onFilterChange: (filters: Partial<FlashcardQueryParams>) => void

### FlashcardGrid (React)
- Opis komponentu: Kontener wyświetlający siatka fiszek.
- Główne elementy: Grid z kartami fiszek, wskaźnik ładowania, komunikat o braku fiszek.
- Obsługiwane interakcje: Brak.
- Obsługiwana walidacja: Brak.
- Typy: FlashcardGridProps.
- Propsy:
  - flashcards: FlashcardViewModel[]
  - isLoading: boolean
  - onEdit: (flashcard: FlashcardDto) => void
  - onDelete: (id: number) => void
  - onToggleExpand: (id: number) => void

### FlashcardItem (React)
- Opis komponentu: Pojedyncza karta fiszki wyświetlająca pytanie i odpowiedź.
- Główne elementy: Karta z pytaniem, odpowiedzią (całą lub skróconą), przyciskami akcji.
- Obsługiwane interakcje: Rozwijanie/zwijanie treści, edycja, usuwanie.
- Obsługiwana walidacja: Brak.
- Typy: FlashcardItemProps.
- Propsy:
  - flashcard: FlashcardViewModel
  - onEdit: () => void
  - onDelete: () => void
  - onToggleExpand: () => void

### Pagination (React)
- Opis komponentu: Kontrolki paginacji dla listy fiszek.
- Główne elementy: Przyciski poprzednia/następna strona, wybór konkretnej strony, informacja o liczbie stron.
- Obsługiwane interakcje: Zmiana strony.
- Obsługiwana walidacja: Poprawność numeru strony.
- Typy: PaginationProps.
- Propsy:
  - pagination: PaginationDto
  - onPageChange: (page: number) => void

### FlashcardEditModal (React)
- Opis komponentu: Modal do edycji fiszki.
- Główne elementy: Formularz z polami do edycji pytania i odpowiedzi, przyciski zapisz/anuluj.
- Obsługiwane interakcje: Zmiana tekstu, zapisanie zmian, anulowanie edycji.
- Obsługiwana walidacja: Długość pól (front max 200 znaków, back max 500 znaków), pola nie mogą być puste.
- Typy: FlashcardEditModalProps, FlashcardFormData.
- Propsy:
  - flashcard: FlashcardDto | null
  - isOpen: boolean
  - onClose: () => void
  - onSave: (data: UpdateFlashcardDto) => Promise<void>

### DeleteConfirmationModal (React)
- Opis komponentu: Modal potwierdzający usunięcie fiszki.
- Główne elementy: Komunikat potwierdzenia, przyciski usuń/anuluj.
- Obsługiwane interakcje: Potwierdzenie lub anulowanie usunięcia.
- Obsługiwana walidacja: Brak.
- Typy: DeleteConfirmationModalProps.
- Propsy:
  - flashcardId: number | null
  - isOpen: boolean
  - onClose: () => void
  - onConfirm: () => Promise<void>

## 5. Typy
```typescript
// ViewModel dla listy fiszek
interface FlashcardViewModel extends FlashcardDto {
  isExpanded: boolean;
}

// Props dla komponentu FlashcardFilters
interface FlashcardFiltersProps {
  currentFilters: FlashcardQueryParams;
  onFilterChange: (filters: Partial<FlashcardQueryParams>) => void;
}

// Props dla komponentu FlashcardGrid
interface FlashcardGridProps {
  flashcards: FlashcardViewModel[];
  isLoading: boolean;
  onEdit: (flashcard: FlashcardDto) => void;
  onDelete: (id: number) => void;
  onToggleExpand: (id: number) => void;
}

// Props dla komponentu FlashcardItem
interface FlashcardItemProps {
  flashcard: FlashcardViewModel;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
}

// Props dla komponentu Pagination
interface PaginationProps {
  pagination: PaginationDto;
  onPageChange: (page: number) => void;
}

// Props dla komponentu FlashcardEditModal
interface FlashcardEditModalProps {
  flashcard: FlashcardDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateFlashcardDto) => Promise<void>;
}

// Props dla komponentu DeleteConfirmationModal
interface DeleteConfirmationModalProps {
  flashcardId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

// Model dla formularza edycji fiszki
interface FlashcardFormData {
  front: string;
  back: string;
  frontError?: string;
  backError?: string;
}
```

## 6. Zarządzanie stanem
Do zarządzania stanem widoku zostanie wykorzystany customowy hook `useFlashcards`, który będzie odpowiedzialny za:

```typescript
const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<FlashcardViewModel[]>([]);
  const [pagination, setPagination] = useState<PaginationDto>({ page: 1, limit: 10, total: 0 });
  const [queryParams, setQueryParams] = useState<FlashcardQueryParams>({ page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardDto | null>(null);
  const [deletingFlashcardId, setDeletingFlashcardId] = useState<number | null>(null);

  // Funkcje zarządzające stanem i komunikacją z API:
  const fetchFlashcards = async () => {...}
  const handleFilterChange = (filters: Partial<FlashcardQueryParams>) => {...}
  const handlePageChange = (page: number) => {...}
  const handleToggleExpand = (id: number) => {...}
  const handleEditFlashcard = (flashcard: FlashcardDto) => {...}
  const handleSaveFlashcard = async (data: UpdateFlashcardDto) => {...}
  const handleDeleteFlashcard = (id: number) => {...}
  const handleConfirmDelete = async () => {...}

  // ...

  return {
    flashcards,
    pagination,
    queryParams,
    isLoading,
    error,
    editingFlashcard,
    deletingFlashcardId,
    handleFilterChange,
    handlePageChange,
    handleToggleExpand,
    handleEditFlashcard,
    handleSaveFlashcard,
    handleDeleteFlashcard,
    handleConfirmDelete
  };
};
```

Ten hook będzie używany w głównym komponencie React, który będzie renderowany w kontenerze Astro.

## 7. Integracja API
### Pobieranie listy fiszek
```typescript
const fetchFlashcards = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const queryString = new URLSearchParams();
    if (queryParams.page) queryString.append('page', queryParams.page.toString());
    if (queryParams.limit) queryString.append('limit', queryParams.limit.toString());
    if (queryParams.sort_by) queryString.append('sort_by', queryParams.sort_by);
    if (queryParams.filter?.source) queryString.append('filter[source]', queryParams.filter.source);
    
    const response = await fetch(`/api/flashcards?${queryString.toString()}`);
    
    if (!response.ok) {
      throw new Error('Nie udało się pobrać fiszek');
    }
    
    const data: FlashcardListResponseDto = await response.json();
    
    // Mapowanie na ViewModel
    const viewModels = data.flashcards.map(flashcard => ({
      ...flashcard,
      isExpanded: false
    }));
    
    setFlashcards(viewModels);
    setPagination(data.pagination);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
  } finally {
    setIsLoading(false);
  }
};
```

### Aktualizacja fiszki
```typescript
const handleSaveFlashcard = async (data: UpdateFlashcardDto) => {
  if (!editingFlashcard) return;
  
  try {
    const response = await fetch(`/api/flashcards/${editingFlashcard.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Nie udało się zaktualizować fiszki');
    }
    
    // Odświeżenie listy fiszek
    await fetchFlashcards();
    
    // Zamknięcie modalu
    setEditingFlashcard(null);
    
    // Powiadomienie o sukcesie
    toast.success('Fiszka została zaktualizowana');
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
  }
};
```

### Usuwanie fiszki
```typescript
const handleConfirmDelete = async () => {
  if (!deletingFlashcardId) return;
  
  try {
    const response = await fetch(`/api/flashcards/${deletingFlashcardId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Nie udało się usunąć fiszki');
    }
    
    // Odświeżenie listy fiszek
    await fetchFlashcards();
    
    // Zamknięcie modalu
    setDeletingFlashcardId(null);
    
    // Powiadomienie o sukcesie
    toast.success('Fiszka została usunięta');
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
  }
};
```

## 8. Interakcje użytkownika
1. **Przeglądanie listy fiszek**
   - Wyświetlenie listy fiszek po wejściu na stronę
   - Domyślnie pokazywane są skrócone wersje fiszek (pierwsze X znaków)

2. **Rozwijanie/zwijanie fiszki**
   - Kliknięcie w fiszkę lub przycisk "Rozwiń" powoduje wyświetlenie pełnej treści
   - Ponowne kliknięcie lub przycisk "Zwiń" powoduje zwinięcie treści

3. **Filtrowanie fiszek**
   - Wybór źródła fiszek z dropdown menu (wszystkie, manualne, AI, edytowane AI)
   - Automatyczne odświeżenie listy po zmianie filtra

4. **Sortowanie fiszek**
   - Wybór kryterium sortowania (data utworzenia, alfabetycznie itp.)
   - Automatyczne odświeżenie listy po zmianie sortowania

5. **Paginacja**
   - Nawigacja między stronami za pomocą przycisków paginacji
   - Limit 10 fiszek na stronę

6. **Edycja fiszki**
   - Kliknięcie przycisku "Edytuj" otwiera modal z formularzem
   - Wprowadzenie zmian i kliknięcie "Zapisz" aktualizuje fiszkę
   - Kliknięcie "Anuluj" zamyka modal bez zapisywania zmian

7. **Usuwanie fiszki**
   - Kliknięcie przycisku "Usuń" otwiera modal potwierdzenia
   - Kliknięcie "Potwierdź" usuwa fiszkę
   - Kliknięcie "Anuluj" zamyka modal bez usuwania

## 9. Warunki i walidacja
1. **Formularz edycji fiszki**
   - Pole "Pytanie" (front):
     - Wymagane
     - Maksymalnie 200 znaków
     - Walidacja w czasie rzeczywistym z komunikatem błędu
   - Pole "Odpowiedź" (back):
     - Wymagane
     - Maksymalnie 500 znaków
     - Walidacja w czasie rzeczywistym z komunikatem błędu
   - Przycisk "Zapisz" jest nieaktywny, gdy formularz zawiera błędy

2. **Paginacja**
   - Przycisk "Poprzednia strona" jest nieaktywny na pierwszej stronie
   - Przycisk "Następna strona" jest nieaktywny na ostatniej stronie
   - Numer strony jest w zakresie od 1 do maksymalnej liczby stron

3. **Filtrowanie i sortowanie**
   - Wartości filtrów i sortowania są zgodne z dozwolonymi wartościami API
   - Nieprawidłowe wartości są zastępowane wartościami domyślnymi

## 10. Obsługa błędów
1. **Błąd pobierania listy fiszek**
   - Wyświetlenie komunikatu o błędzie
   - Przycisk "Spróbuj ponownie" do ponownego pobrania danych

2. **Błąd autoryzacji**
   - Przekierowanie do strony logowania
   - Wyświetlenie komunikatu o wygaśnięciu sesji

3. **Błąd walidacji formularza**
   - Wyświetlenie komunikatów o błędach przy odpowiednich polach
   - Blokada przycisku "Zapisz" do czasu poprawienia błędów

4. **Błąd aktualizacji/usuwania fiszki**
   - Wyświetlenie powiadomienia o błędzie
   - Zamknięcie modalu z możliwością ponownej próby

5. **Brak fiszek**
   - Wyświetlenie przyjaznego komunikatu "Nie masz jeszcze żadnych fiszek"
   - Przycisk przekierowujący do tworzenia nowych fiszek

## 11. Kroki implementacji
1. **Przygotowanie struktury plików**
   - Utworzenie katalogu `src/pages/flashcards.astro`
   - Utworzenie katalogu `src/components/flashcards/` dla komponentów React

2. **Implementacja typów i modeli**
   - Utworzenie pliku `src/components/flashcards/types.ts` z definicjami typów

3. **Implementacja hooka zarządzającego stanem**
   - Utworzenie pliku `src/components/flashcards/useFlashcards.ts`
   - Implementacja logiki pobierania, filtrowania, sortowania, paginacji, edycji i usuwania

4. **Implementacja komponentów React**
   - Implementacja `FlashcardFilters.tsx`
   - Implementacja `FlashcardItem.tsx`
   - Implementacja `FlashcardGrid.tsx`
   - Implementacja `Pagination.tsx`
   - Implementacja `FlashcardEditModal.tsx`
   - Implementacja `DeleteConfirmationModal.tsx`
   - Implementacja `FlashcardList.tsx` (główny komponent React)

5. **Implementacja strony Astro**
   - Utworzenie pliku `src/pages/flashcards.astro`
   - Integracja głównego komponentu React

6. **Stylowanie komponentów**
   - Implementacja stylów z wykorzystaniem Tailwind
   - Użycie komponentów Shadcn/ui dla spójności UI

7. **Testowanie**
   - Sprawdzenie poprawności działania wszystkich interakcji
   - Weryfikacja responsywności interfejsu
   - Testowanie obsługi błędów

8. **Optymalizacja**
   - Dodanie debouncing dla kontrolek filtrowania
   - Optymalizacja liczby renderów komponentów
   - Zastosowanie memoizacji dla komponentów listy 