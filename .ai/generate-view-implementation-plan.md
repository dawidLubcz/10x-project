# Plan implementacji widoku generowania fiszek

## 1. Przegląd
Widok generowania fiszek to jeden z kluczowych elementów aplikacji 10xProject, umożliwiający użytkownikom szybkie tworzenie wysokiej jakości fiszek edukacyjnych przy pomocy sztucznej inteligencji. Pozwala on użytkownikowi wprowadzić tekst źródłowy (do 100 znaków), wygenerować na jego podstawie zestaw fiszek w formacie pytanie-odpowiedź, a następnie przeprowadzić selekcję wygenerowanych fiszek poprzez akceptację, edycję lub odrzucenie.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/generate`. Ta ścieżka powinna być zarejestrowana w Astro jako strona aplikacji.

## 3. Struktura komponentów
```
GenerateView (strona Astro z klientowskimi komponentami React)
├── InputForm (React component)
│   ├── TextArea (shadcn/ui)
│   └── Button (shadcn/ui)
├── GenerationStatus (React component)
│   ├── Spinner (shadcn/ui)
│   └── AlertBox (shadcn/ui)
├── FlashcardList (React component)
│   ├── FlashcardItem 1 (React component)
│   │   ├── Card (shadcn/ui)
│   │   └── ButtonGroup (shadcn/ui)
│   ├── FlashcardItem 2
│   └── ...
└── EditFlashcardModal (React component)
    ├── Dialog (shadcn/ui)
    ├── TextArea - Front (shadcn/ui)
    ├── TextArea - Back (shadcn/ui)
    └── ButtonGroup (shadcn/ui)
```

## 4. Szczegóły komponentów

### GenerateView
- Opis komponentu: Główny kontener dla całego widoku generowania fiszek, zawierający stan aplikacji i obsługujący komunikację z API.
- Główne elementy: Integruje wszystkie komponenty podrzędne. Zawiera InputForm, GenerationStatus, FlashcardList i EditFlashcardModal.
- Obsługiwane interakcje: Koordynuje wszystkie interakcje między komponentami, zarządza stanem globalnym.
- Obsługiwana walidacja: Brak bezpośredniej walidacji, deleguje ją do komponentów podrzędnych.
- Typy: Wykorzystuje hook useGenerateFlashcards do zarządzania stanem.
- Propsy: Brak (najwyższy komponent w hierarchii).

### InputForm
- Opis komponentu: Formularz umożliwiający wprowadzenie tekstu źródłowego do generowania fiszek.
- Główne elementy: 
  - Pole tekstowe (TextArea) z licznikiem znaków
  - Przycisk "Generuj" (Button)
- Obsługiwane interakcje: 
  - Wprowadzanie tekstu
  - Kliknięcie przycisku "Generuj"
- Obsługiwana walidacja: 
  - Długość tekstu (min 1, max 100 znaków)
  - Blokowanie przycisku "Generuj" gdy tekst jest pusty lub przekracza limit
- Typy: InputFormData
- Propsy:
  ```typescript
  interface InputFormProps {
    onSubmit: (data: InputFormData) => void;
    isGenerating: boolean;
  }
  ```

### GenerationStatus
- Opis komponentu: Wyświetla status procesu generowania fiszek.
- Główne elementy: 
  - Spinner podczas generowania
  - Komunikat o błędzie w przypadku niepowodzenia
  - Informacja o powodzeniu po zakończeniu generowania
- Obsługiwane interakcje: Brak (komponent prezentacyjny)
- Obsługiwana walidacja: Brak
- Typy: GenerationStatusState
- Propsy:
  ```typescript
  interface GenerationStatusProps {
    status: GenerationStatusType;
    message?: string;
  }
  ```

### FlashcardList
- Opis komponentu: Lista wygenerowanych fiszek do akceptacji, edycji lub odrzucenia.
- Główne elementy: 
  - Lista komponentów FlashcardItem
  - Podsumowanie liczby zaakceptowanych/odrzuconych fiszek
- Obsługiwane interakcje: Brak (deleguje do komponentów FlashcardItem)
- Obsługiwana walidacja: Brak
- Typy: GenerationViewModel
- Propsy:
  ```typescript
  interface FlashcardListProps {
    generation: GenerationViewModel | null;
    onAccept: (flashcardId: number) => void;
    onReject: (flashcardId: number) => void;
    onEdit: (flashcardId: number) => void;
  }
  ```

### FlashcardItem
- Opis komponentu: Pojedyncza karta fiszki z możliwościami interakcji.
- Główne elementy: 
  - Karta (Card) wyświetlająca pytanie i odpowiedź
  - Grupa przycisków (ButtonGroup): Akceptuj, Edytuj, Odrzuć
- Obsługiwane interakcje: 
  - Kliknięcie "Akceptuj"
  - Kliknięcie "Edytuj"
  - Kliknięcie "Odrzuć"
- Obsługiwana walidacja: Brak
- Typy: FlashcardViewModel
- Propsy:
  ```typescript
  interface FlashcardItemProps {
    flashcard: FlashcardViewModel;
    onAccept: () => void;
    onReject: () => void;
    onEdit: () => void;
  }
  ```

### EditFlashcardModal
- Opis komponentu: Modal do edycji wygenerowanej fiszki.
- Główne elementy: 
  - Dialog z formularzem edycji
  - Pole tekstowe (TextArea) dla pytania (front)
  - Pole tekstowe (TextArea) dla odpowiedzi (back)
  - Przyciski "Zapisz" i "Anuluj"
- Obsługiwane interakcje: 
  - Edycja pytania i odpowiedzi
  - Kliknięcie "Zapisz"
  - Kliknięcie "Anuluj"
- Obsługiwana walidacja: 
  - Długość pytania i odpowiedzi (max 1000 znaków łącznie)
  - Niepuste pola pytania i odpowiedzi
- Typy: EditFlashcardData
- Propsy:
  ```typescript
  interface EditFlashcardModalProps {
    flashcard: FlashcardViewModel | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EditFlashcardData) => void;
  }
  ```

## 5. Typy

```typescript
// Enumeracja statusów generowania
enum GenerationStatusType {
  IDLE = 'idle',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  ERROR = 'error'
}

// Stan statusu generowania
interface GenerationStatusState {
  status: GenerationStatusType;
  message?: string; // Opcjonalny komunikat, np. błędu
}

// Dane formularza wejściowego
interface InputFormData {
  inputText: string; // Tekst wprowadzony przez użytkownika
}

// ViewModel dla fiszki (rozszerzenie GeneratedFlashcardDto)
interface FlashcardViewModel extends GeneratedFlashcardDto {
  id: number; // ID fiszki
  isEditing: boolean; // Czy fiszka jest obecnie edytowana
  isProcessing: boolean; // Czy trwa przetwarzanie akcji (akceptacja, odrzucenie)
  status?: 'accepted' | 'rejected' | 'pending'; // Status fiszki
}

// ViewModel dla generacji fiszek
interface GenerationViewModel {
  id: number; // ID generacji
  flashcards: FlashcardViewModel[]; // Lista wygenerowanych fiszek
  stats: {
    total: number; // Łączna liczba fiszek
    accepted: number; // Liczba zaakceptowanych fiszek
    rejected: number; // Liczba odrzuconych fiszek
    pending: number; // Liczba oczekujących fiszek
  }
}

// Dane edycji fiszki
interface EditFlashcardData {
  front: string; // Edytowane pytanie
  back: string; // Edytowana odpowiedź
}
```

## 6. Zarządzanie stanem

Do zarządzania stanem widoku generowania fiszek wykorzystamy niestandardowy hook `useGenerateFlashcards`, który będzie odpowiedzialny za:

```typescript
const useGenerateFlashcards = () => {
  // Stan formularza wejściowego
  const [inputText, setInputText] = useState<string>("");
  
  // Stan procesu generowania
  const [generationStatus, setGenerationStatus] = useState<GenerationStatusState>({ 
    status: GenerationStatusType.IDLE 
  });
  
  // Bieżąca generacja fiszek
  const [currentGeneration, setCurrentGeneration] = useState<GenerationViewModel | null>(null);
  
  // Edytowana fiszka
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardViewModel | null>(null);

  // Funkcja generująca fiszki
  const generateFlashcards = async (input: string) => {
    setGenerationStatus({ status: GenerationStatusType.GENERATING });
    try {
      // Wywołanie API
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: input })
      });
      
      if (!response.ok) {
        throw new Error('Wystąpił błąd podczas generowania fiszek');
      }
      
      const data = await response.json();
      
      // Przekształcenie odpowiedzi na ViewModel
      const viewModel: GenerationViewModel = {
        id: data.generation_id,
        flashcards: data.flashcards.map((card, index) => ({
          ...card,
          id: index,
          isEditing: false,
          isProcessing: false,
          status: 'pending'
        })),
        stats: {
          total: data.flashcards.length,
          accepted: 0,
          rejected: 0,
          pending: data.flashcards.length
        }
      };
      
      setCurrentGeneration(viewModel);
      setGenerationStatus({ status: GenerationStatusType.COMPLETED });
    } catch (error) {
      setGenerationStatus({ 
        status: GenerationStatusType.ERROR, 
        message: error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas generowania fiszek." 
      });
    }
  };

  // Funkcje zarządzające fiszkami (akceptacja, odrzucenie, edycja)
  const acceptFlashcard = async (flashcardId: number) => {
    if (!currentGeneration) return;
    
    // Aktualizacja stanu fiszki
    setCurrentGeneration(prev => {
      if (!prev) return null;
      
      const updatedFlashcards = prev.flashcards.map(card => {
        if (card.id === flashcardId) {
          return { ...card, isProcessing: true };
        }
        return card;
      });
      
      return { ...prev, flashcards: updatedFlashcards };
    });
    
    try {
      // Wywołanie API (w implementacji docelowej)
      // W MVP możemy symulować komunikację z API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aktualizacja stanu po sukcesie
      setCurrentGeneration(prev => {
        if (!prev) return null;
        
        const updatedFlashcards = prev.flashcards.map(card => {
          if (card.id === flashcardId) {
            return { ...card, isProcessing: false, status: 'accepted' };
          }
          return card;
        });
        
        return { 
          ...prev, 
          flashcards: updatedFlashcards,
          stats: {
            ...prev.stats,
            accepted: prev.stats.accepted + 1,
            pending: prev.stats.pending - 1
          }
        };
      });
    } catch (error) {
      // Obsługa błędu
      setCurrentGeneration(prev => {
        if (!prev) return null;
        
        const updatedFlashcards = prev.flashcards.map(card => {
          if (card.id === flashcardId) {
            return { ...card, isProcessing: false };
          }
          return card;
        });
        
        return { ...prev, flashcards: updatedFlashcards };
      });
    }
  };

  // Podobne funkcje dla rejectFlashcard, editFlashcard i saveEditedFlashcard

  return {
    inputText,
    setInputText,
    generationStatus,
    currentGeneration,
    editingFlashcard,
    generateFlashcards,
    acceptFlashcard,
    rejectFlashcard,
    editFlashcard,
    saveEditedFlashcard
  };
};
```

Hook ten zapewnia centralne zarządzanie stanem dla całego widoku generowania fiszek, obsługując wszystkie operacje związane z formularzem wejściowym, generowaniem fiszek i zarządzaniem wygenerowanymi fiszkami.

## 7. Integracja API

### Generowanie fiszek
- Endpoint: `POST /api/generations`
- Żądanie:
  ```typescript
  {
    "input_text": string // max 100 znaków
  }
  ```
- Odpowiedź:
  ```typescript
  {
    "generation_id": number,
    "flashcards": [{
      "front": string, // max 1000 znaków
      "back": string, // max 1000 znaków
      "source": "ai-full"
    }]
  }
  ```

### Akceptacja/Odrzucenie/Edycja fiszki
- Endpoint: `PATCH /api/generations/{generationId}/flashcards/{flashcardId}`
- Żądanie dla akceptacji/odrzucenia:
  ```typescript
  {
    "action": "accept" | "reject"
  }
  ```
- Żądanie dla edycji:
  ```typescript
  {
    "action": "edit",
    "front": string, // max 1000 znaków
    "back": string // max 1000 znaków
  }
  ```
- Odpowiedź:
  ```typescript
  {
    // Zaktualizowana fiszka lub komunikat potwierdzenia
  }
  ```

## 8. Interakcje użytkownika

### Wprowadzanie tekstu
1. Użytkownik wprowadza tekst w pole tekstowe.
2. System w czasie rzeczywistym waliduje długość tekstu.
3. Licznik znaków aktualizuje się, pokazując pozostałą liczbę znaków.
4. Przycisk "Generuj" jest aktywny tylko gdy text ma długość 1-100 znaków.

### Generowanie fiszek
1. Użytkownik klika przycisk "Generuj".
2. Przycisk zmienia się na nieaktywny, pojawia się wskaźnik ładowania.
3. Komponent GenerationStatus pokazuje komunikat "Generowanie...".
4. Po zakończeniu generowania:
   - Jeśli sukces: Wyświetla się lista wygenerowanych fiszek.
   - Jeśli błąd: Wyświetla się komunikat o błędzie z możliwością ponownej próby.

### Akceptacja fiszki
1. Użytkownik klika przycisk "Akceptuj" przy wybranej fiszce.
2. Przycisk zmienia się na nieaktywny, pojawia się wskaźnik ładowania.
3. Po potwierdzeniu przez API:
   - Fiszka zmienia kolor lub styl na "zaakceptowana".
   - Licznik zaakceptowanych fiszek zwiększa się o 1.

### Odrzucenie fiszki
1. Użytkownik klika przycisk "Odrzuć" przy wybranej fiszce.
2. Przycisk zmienia się na nieaktywny, pojawia się wskaźnik ładowania.
3. Po potwierdzeniu przez API:
   - Fiszka zmienia kolor lub styl na "odrzucona" lub znika z listy.
   - Licznik odrzuconych fiszek zwiększa się o 1.

### Edycja fiszki
1. Użytkownik klika przycisk "Edytuj" przy wybranej fiszce.
2. Otwiera się modal z formularzem edycji.
3. Użytkownik wprowadza zmiany w polach pytanie i odpowiedź.
4. System waliduje długość wprowadzonego tekstu.
5. Użytkownik klika "Zapisz":
   - Przycisk zmienia się na nieaktywny, pojawia się wskaźnik ładowania.
   - Po potwierdzeniu przez API, modal zamyka się, fiszka jest zaktualizowana.
6. Użytkownik klika "Anuluj":
   - Modal zamyka się bez zapisywania zmian.

## 9. Warunki i walidacja

### Walidacja tekstu wejściowego
- Komponent: InputForm
- Warunki:
  - Minimalna długość: 1 znak
  - Maksymalna długość: 100 znaków
- Wpływ na UI:
  - Przycisk "Generuj" jest nieaktywny, gdy tekst jest pusty lub przekracza limit
  - Licznik znaków zmienia kolor na czerwony, gdy przekroczony jest limit
  - Komunikat o błędzie pojawia się, gdy użytkownik próbuje przesłać nieprawidłowy tekst

### Walidacja edytowanej fiszki
- Komponent: EditFlashcardModal
- Warunki:
  - Pytanie (front): niepuste, maks. 1000 znaków
  - Odpowiedź (back): niepuste, maks. 1000 znaków
- Wpływ na UI:
  - Przycisk "Zapisz" jest nieaktywny, gdy którekolwiek pole jest puste lub przekracza limit
  - Licznik znaków dla każdego pola
  - Komunikaty o błędach pod odpowiednimi polami

## 10. Obsługa błędów

### Błędy generowania
- Przyczyny:
  - Błąd serwera
  - Nieprawidłowe zapytanie
  - Przekroczenie limitu znaków
- Obsługa:
  - Wyświetlenie komunikatu błędu w komponencie GenerationStatus
  - Możliwość ponownej próby generowania
  - Logowanie błędów na serwerze

### Błędy zarządzania fiszkami
- Przyczyny:
  - Błąd serwera podczas akceptacji/odrzucenia/edycji
  - Nieprawidłowy format danych edytowanej fiszki
- Obsługa:
  - Toast z informacją o błędzie
  - Powrót fiszki do poprzedniego stanu
  - Możliwość ponownej próby

### Błędy połączenia
- Przyczyny:
  - Utrata połączenia internetowego
  - Timeouty
- Obsługa:
  - Monitorowanie statusu połączenia
  - Automatyczne ponowne próby (z limitem)
  - Informowanie użytkownika o problemach z połączeniem

## 11. Kroki implementacji

1. **Konfiguracja projektu**
   - Utworzenie pliku strony `src/pages/generate.astro`
   - Skonfigurowanie ścieżki w routingu Astro

2. **Implementacja komponentów bazowych**
   - Implementacja `InputForm` z walidacją długości tekstu
   - Implementacja `GenerationStatus` do wyświetlania statusu
   - Implementacja bazowego `FlashcardList` i `FlashcardItem`

3. **Integracja z API**
   - Implementacja hooka `useGenerateFlashcards`
   - Dodanie wywołań API dla generowania fiszek
   - Testowanie komunikacji z backendem

4. **Implementacja zarządzania fiszkami**
   - Implementacja `EditFlashcardModal`
   - Dodanie funkcji akceptacji, odrzucenia i edycji fiszek
   - Integracja z odpowiednimi endpointami API

5. **Stylizacja i responsywność**
   - Dostosowanie komponentów Shadcn/ui
   - Implementacja stylów Tailwind dla zapewnienia spójnego wyglądu
   - Testowanie i dostosowanie do różnych rozmiarów ekranu

6. **Testowanie i debugowanie**
   - Testowanie różnych scenariuszy użycia
   - Sprawdzanie obsługi błędów
   - Optymalizacja wydajności

7. **Dokumentacja**
   - Komentarze w kodzie
   - Dokumentacja komponentów
   - Przykłady użycia 