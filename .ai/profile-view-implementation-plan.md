# Plan implementacji widoku Profilu Użytkownika

## 1. Przegląd
Panel profilu użytkownika umożliwia zarządzanie kontem. Pozwala na zmianę hasła, usunięcie konta oraz wylogowanie z systemu. Jest to kluczowy element aplikacji 10xProject, zapewniający użytkownikom kontrolę nad własnym kontem w systemie.

## 2. Routing widoku
Widok powinien być dostępny pod ścieżką `/profile` i zabezpieczony przed dostępem dla niezalogowanych użytkowników.

## 3. Struktura komponentów
```
ProfileView
├── UserInfo
├── ChangePasswordForm
├── DeleteAccountSection
└── LogoutButton
```

## 4. Szczegóły komponentów

### ProfileView
- Opis komponentu: Główny komponent widoku profilu, który zarządza layoutem i organizuje pozostałe komponenty
- Główne elementy: Kontener z nagłówkiem, sekcjami dla informacji o użytkowniku, formularza zmiany hasła, sekcji usuwania konta oraz przycisku wylogowania
- Obsługiwane interakcje: Pobieranie danych profilu użytkownika przy ładowaniu strony
- Obsługiwana walidacja: Sprawdzanie czy użytkownik jest zalogowany
- Typy: `UserDto`
- Propsy: Brak (komponent najwyższego poziomu)

### UserInfo
- Opis komponentu: Wyświetla podstawowe informacje o użytkowniku
- Główne elementy: Adres email, data utworzenia konta
- Obsługiwane interakcje: Brak (komponent tylko do wyświetlania)
- Obsługiwana walidacja: Brak
- Typy: `UserDto`
- Propsy: 
  ```typescript
  {
    user: UserDto;
    isLoading: boolean;
  }
  ```

### ChangePasswordForm
- Opis komponentu: Formularz umożliwiający zmianę hasła użytkownika
- Główne elementy: 
  - Pole aktualne hasło (type="password")
  - Pole nowe hasło (type="password")
  - Pole potwierdzenie nowego hasła (type="password")
  - Przycisk "Zmień hasło"
  - Komunikaty o błędach walidacji
  - Komunikat o sukcesie
- Obsługiwane interakcje: 
  - Wprowadzanie danych do formularza
  - Walidacja pól w czasie rzeczywistym
  - Przesyłanie formularza
- Obsługiwana walidacja: 
  - Aktualne hasło: wymagane
  - Nowe hasło: wymagane, minimum 6 znaków
  - Potwierdzenie hasła: musi być identyczne z nowym hasłem
- Typy: `PasswordChangeRequest`, `PasswordChangeResponse`
- Propsy: 
  ```typescript
  {
    onSuccess?: () => void;
  }
  ```

### DeleteAccountSection
- Opis komponentu: Sekcja umożliwiająca usunięcie konta użytkownika
- Główne elementy: 
  - Tekst ostrzegający o konsekwencjach usunięcia konta
  - Przycisk "Usuń konto"
  - Dialog potwierdzający usunięcie konta
  - Pole potwierdzające wpisanie "USUŃ" dla dodatkowego zabezpieczenia
- Obsługiwane interakcje: 
  - Kliknięcie przycisku "Usuń konto"
  - Potwierdzenie usunięcia konta
  - Wpisanie tekstu potwierdzającego
- Obsługiwana walidacja: 
  - Sprawdzenie, czy tekst potwierdzający jest poprawny
- Typy: `DeleteAccountRequest`, `DeleteAccountResponse`
- Propsy: 
  ```typescript
  {
    onAccountDeleted?: () => void;
  }
  ```

### LogoutButton
- Opis komponentu: Przycisk umożliwiający wylogowanie się z systemu
- Główne elementy: 
  - Przycisk "Wyloguj się"
- Obsługiwane interakcje: 
  - Kliknięcie przycisku
- Obsługiwana walidacja: Brak
- Typy: Brak
- Propsy: 
  ```typescript
  {
    onLogout?: () => void;
  }
  ```

## 5. Typy

### Istniejące typy
```typescript
// UserDto z src/types.ts
export interface UserDto {
  id: string;
  email: string;
  created_at: string;
}
```

### Nowe typy do zaimplementowania
```typescript
// Typy dla zmiany hasła
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

// Typy dla usuwania konta
export interface DeleteAccountRequest {
  confirmationText: string;
}

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

// Typ dla błędu API
export interface ApiError {
  message: string;
  errors?: { path: string; message: string }[];
}
```

## 6. Zarządzanie stanem

### useProfile
Custom hook do pobierania i przechowywania danych profilu użytkownika.

```typescript
const useProfile = () => {
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users/profile');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Przekierowanie do logowania jeśli brak autoryzacji
            window.location.href = '/auth';
            return;
          }
          throw new Error('Nie udało się pobrać danych profilu');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nieznany błąd');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error };
};
```

### usePasswordChange
Custom hook do obsługi zmiany hasła.

```typescript
const usePasswordChange = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const changePassword = async (data: PasswordChangeRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Nie udało się zmienić hasła');
      }
      
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { changePassword, isSubmitting, error, success };
};
```

### useAccountDeletion
Custom hook do obsługi usuwania konta.

```typescript
const useAccountDeletion = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const openConfirmation = () => setShowConfirmation(true);
  const closeConfirmation = () => setShowConfirmation(false);

  const deleteAccount = async (data: DeleteAccountRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Nie udało się usunąć konta');
      }
      
      // Przekierowanie do strony logowania po pomyślnym usunięciu konta
      window.location.href = '/auth';
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    deleteAccount, 
    isSubmitting, 
    error, 
    showConfirmation, 
    openConfirmation, 
    closeConfirmation 
  };
};
```

### useLogout
Custom hook do obsługi wylogowania.

```typescript
const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      setError(null);
      
      const response = await fetch('/api/users/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Nie udało się wylogować');
      }
      
      // Czyszczenie localStorage/cookies
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      
      // Przekierowanie do strony logowania
      window.location.href = '/auth';
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
      // Nawet jeśli wystąpi błąd, próbujemy wylogować lokalnie
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      window.location.href = '/auth';
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut, error };
};
```

## 7. Integracja API

### GET /api/users/profile
- Opis: Pobieranie danych profilu zalogowanego użytkownika
- Metoda: GET
- URL: `/api/users/profile`
- Headers: 
  - `Authorization: Bearer {token}` (token dodawany automatycznie przez ciasteczka)
- Typ odpowiedzi: `UserDto`
- Obsługa błędów: 
  - 401 Unauthorized - przekierowanie do strony logowania
  - Inne błędy - wyświetlenie komunikatu

### POST /api/users/change-password (do zaimplementowania)
- Opis: Zmiana hasła użytkownika
- Metoda: POST
- URL: `/api/users/change-password`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}` (token dodawany automatycznie przez ciasteczka)
- Request body: `PasswordChangeRequest`
- Typ odpowiedzi: `PasswordChangeResponse`
- Obsługa błędów: 
  - 400 Bad Request - wyświetlenie błędów walidacji
  - 401 Unauthorized - przekierowanie do strony logowania
  - Inne błędy - wyświetlenie komunikatu

### DELETE /api/users/account (do zaimplementowania)
- Opis: Usuwanie konta użytkownika
- Metoda: DELETE
- URL: `/api/users/account`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}` (token dodawany automatycznie przez ciasteczka)
- Request body: `DeleteAccountRequest`
- Typ odpowiedzi: `DeleteAccountResponse`
- Obsługa błędów: 
  - 400 Bad Request - wyświetlenie błędów walidacji
  - 401 Unauthorized - przekierowanie do strony logowania
  - Inne błędy - wyświetlenie komunikatu

### POST /api/users/logout (do zaimplementowania)
- Opis: Wylogowanie użytkownika
- Metoda: POST
- URL: `/api/users/logout`
- Headers: 
  - `Authorization: Bearer {token}` (token dodawany automatycznie przez ciasteczka)
- Typ odpowiedzi: `{ success: boolean, message?: string }`
- Obsługa błędów: 
  - 401 Unauthorized - przekierowanie do strony logowania
  - Inne błędy - wyświetlenie komunikatu

## 8. Interakcje użytkownika

### Wyświetlanie profilu
1. Użytkownik wchodzi na stronę `/profile`
2. System sprawdza, czy użytkownik jest zalogowany
3. Jeśli nie jest zalogowany, przekierowuje do strony logowania
4. Jeśli jest zalogowany, pobiera dane profilu z API
5. System wyświetla dane użytkownika

### Zmiana hasła
1. Użytkownik wypełnia formularz zmiany hasła:
   - Wpisuje aktualne hasło
   - Wpisuje nowe hasło
   - Wpisuje potwierdzenie nowego hasła
2. System waliduje dane w czasie rzeczywistym:
   - Sprawdza, czy wszystkie pola są wypełnione
   - Sprawdza, czy nowe hasło ma minimum 6 znaków
   - Sprawdza, czy potwierdzenie hasła jest identyczne z nowym hasłem
3. Użytkownik klika przycisk "Zmień hasło"
4. System wysyła żądanie do API
5. System wyświetla komunikat o sukcesie lub błędzie

### Usunięcie konta
1. Użytkownik klika przycisk "Usuń konto"
2. System wyświetla okno dialogowe z ostrzeżeniem o konsekwencjach usunięcia konta
3. System prosi o wpisanie tekstu "USUŃ" dla potwierdzenia
4. Użytkownik wpisuje tekst potwierdzający
5. Użytkownik klika przycisk "Potwierdzam usunięcie konta"
6. System wysyła żądanie do API
7. System wylogowuje użytkownika i przekierowuje do strony logowania

### Wylogowanie
1. Użytkownik klika przycisk "Wyloguj się"
2. System wysyła żądanie do API
3. System usuwa token z localStorage/cookies
4. System przekierowuje użytkownika do strony logowania

## 9. Warunki i walidacja

### Zmiana hasła
- **Aktualne hasło**:
  - Wymagane pole
  - Musi być zgodne z aktualnym hasłem użytkownika w systemie (walidacja po stronie serwera)
  
- **Nowe hasło**:
  - Wymagane pole
  - Minimum 6 znaków
  - Warunki walidacji wyświetlane użytkownikowi podczas wpisywania
  
- **Potwierdzenie nowego hasła**:
  - Wymagane pole
  - Musi być identyczne z nowym hasłem
  - Warunki walidacji wyświetlane użytkownikowi podczas wpisywania

### Usuwanie konta
- **Tekst potwierdzający**:
  - Wymagane pole
  - Musi być dokładnie równy "USUŃ"
  - Walidacja w czasie rzeczywistym (przycisk potwierdzenia nieaktywny dopóki tekst nie jest poprawny)

## 10. Obsługa błędów

### Ogólne podejście
- Wyświetlanie komunikatów o błędach w pobliżu odpowiednich elementów interfejsu
- Używanie kolorów i ikon dla lepszej czytelności (czerwony dla błędów, zielony dla sukcesu)
- Przejrzyste komunikaty o błędach z instrukcjami jak je rozwiązać

### Pobieranie profilu
- Błąd 401 (Unauthorized): Przekierowanie do strony logowania
- Inne błędy: Wyświetlenie komunikatu o błędzie z możliwością odświeżenia strony

### Zmiana hasła
- Błąd walidacji formularza: Wyświetlenie komunikatu przy każdym polu z błędem
- Błąd 400 (Bad Request): Wyświetlenie szczegółowych błędów walidacji z API
- Błąd 401 (Unauthorized): Przekierowanie do strony logowania
- Inne błędy: Wyświetlenie ogólnego komunikatu o błędzie

### Usuwanie konta
- Błąd walidacji potwierdzenia: Dezaktywacja przycisku potwierdzenia
- Błąd 400 (Bad Request): Wyświetlenie szczegółowych błędów z API
- Błąd 401 (Unauthorized): Przekierowanie do strony logowania
- Inne błędy: Wyświetlenie ogólnego komunikatu o błędzie

### Wylogowanie
- Błąd podczas wylogowania: Wyświetlenie komunikatu o błędzie, ale nadal próba lokalnego wylogowania i przekierowania

## 11. Kroki implementacji

1. **Utworzenie strony profilu**
   - Utworzenie pliku `src/pages/profile.astro`
   - Implementacja podstawowego układu strony
   - Dodanie warunkowego przekierowania dla niezalogowanych użytkowników

2. **Implementacja komponentu UserInfo**
   - Utworzenie pliku `src/components/UserInfo.tsx`
   - Implementacja wyświetlania danych użytkownika
   - Stylizacja komponentu z użyciem Tailwind

3. **Implementacja formularza zmiany hasła**
   - Utworzenie pliku `src/components/ChangePasswordForm.tsx`
   - Implementacja formularza z polami i walidacją
   - Implementacja obsługi przesyłania formularza
   - Stylizacja komponentu z użyciem Tailwind i Shadcn/ui

4. **Implementacja sekcji usuwania konta**
   - Utworzenie pliku `src/components/DeleteAccountSection.tsx`
   - Implementacja przycisku usuwania i dialogu potwierdzającego
   - Implementacja logiki potwierdzania usunięcia
   - Stylizacja komponentu z użyciem Tailwind i Shadcn/ui

5. **Implementacja przycisku wylogowania**
   - Utworzenie pliku `src/components/LogoutButton.tsx`
   - Implementacja obsługi kliknięcia i wylogowania
   - Stylizacja komponentu z użyciem Tailwind i Shadcn/ui

6. **Implementacja custom hooków**
   - Utworzenie pliku `src/lib/hooks/useProfile.ts`
   - Utworzenie pliku `src/lib/hooks/usePasswordChange.ts`
   - Utworzenie pliku `src/lib/hooks/useAccountDeletion.ts`
   - Utworzenie pliku `src/lib/hooks/useLogout.ts`

7. **Implementacja endpointów API (backend)**
   - Implementacja endpointu dla zmiany hasła (`src/pages/api/users/change-password.ts`)
   - Implementacja endpointu dla usuwania konta (`src/pages/api/users/account.ts`)
   - Implementacja endpointu dla wylogowania (`src/pages/api/users/logout.ts`)

8. **Dodanie komponentu nagłówka z odnośnikiem do profilu**
   - Aktualizacja istniejącego komponentu nagłówka lub utworzenie nowego
   - Dodanie odnośnika do profilu z wyświetlaną nazwą zalogowanego użytkownika
   - Implementacja pobierania danych użytkownika

9. **Testowanie**
   - Testowanie wszystkich funkcjonalności widoku
   - Testowanie obsługi błędów
   - Testowanie przepływu użytkownika

10. **Optymalizacja i refaktoryzacja**
    - Optymalizacja wydajności
    - Refaktoryzacja kodu
    - Finalne dostosowanie stylizacji 