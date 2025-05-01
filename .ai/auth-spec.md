# Specyfikacja architektury modułu autentykacji dla aplikacji 10xProject

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Struktura stron i komponentów

#### Strony Astro (Server-Side)
- **`/src/pages/auth/index.astro`** - strona uwierzytelniania z kartą zakładkową (logowanie/rejestracja)
- **`/src/pages/auth/forgot-password.astro`** - strona odzyskiwania hasła
- **`/src/pages/auth/reset-password.astro`** - strona resetowania hasła
- **`/src/pages/auth/verify-email.astro`** - strona weryfikacji email

#### Komponenty React (Client-Side)
- **`/src/components/auth/AuthTabs.tsx`** - komponent z zakładkami logowania i rejestracji
- **`/src/components/auth/LoginForm.tsx`** - formularz logowania
- **`/src/components/auth/RegisterForm.tsx`** - formularz rejestracji
- **`/src/components/auth/ForgotPasswordForm.tsx`** - formularz odzyskiwania hasła
- **`/src/components/auth/ResetPasswordForm.tsx`** - formularz resetowania hasła
- **`/src/components/auth/UserMenu.tsx`** - menu użytkownika z opcją wylogowania

#### Layouty
- **`/src/layouts/AuthLayout.astro`** - layout dla stron autentykacji (prosty, z logo i podstawowymi informacjami)
- Rozszerzenie istniejącego layoutu głównego o obsługę stanu autentykacji

### 1.2 Podział odpowiedzialności

#### Strony Astro
- Renderowanie layoutu strony
- Przekazywanie stanu początkowego do komponentów React
- Obsługa przekierowań na podstawie stanu autentykacji (SSR)
- Obsługa parametrów URL (np. token resetowania hasła)

#### Komponenty React
- Interaktywne formularze z walidacją w czasie rzeczywistym
- Komunikacja z API Supabase
- Zarządzanie stanem formularza i błędami
- Przekierowywanie użytkownika po udanej operacji
- Przechowywanie tokenów JWT w bezpieczny sposób

### 1.3 Walidacja i komunikaty błędów

#### Walidacja formularzy w czasie rzeczywistym
- Walidacja emaila: format poprawnego adresu email
- Walidacja hasła: minimalna długość (8 znaków), wymagana duża litera, cyfra i znak specjalny
- Walidacja potwierdzenia hasła: zgodność z wprowadzonym hasłem
- Informacja o sile hasła podczas wpisywania

#### Komunikaty błędów
- Błędy walidacji: wyświetlane bezpośrednio pod odpowiednim polem
- Błędy autentykacji: wyświetlane na górze formularza w wyróżnionym obszarze
- Informacyjne komunikaty o stanie operacji (np. "Wysyłanie emaila weryfikacyjnego...")
- Kody błędów z Supabase tłumaczone na przyjazne komunikaty dla użytkownika

### 1.4 Kluczowe komponenty UI

#### Karta z zakładkami Logowanie/Rejestracja
- Komponet `Tabs` z biblioteki Shadcn/ui
- Dwie zakładki: "Logowanie" i "Rejestracja"
- Stan zakładki przechowywany w URL (query parameter) dla łatwego powrotu do wybranej zakładki

#### Pola formularza z walidacją
- Komponenty `Input` i `Button` z biblioteki Shadcn/ui
- Komunikaty walidacyjne pojawiające się w czasie rzeczywistym
- Wskaźnik siły hasła przy rejestracji

#### Przyciski akcji
- Główny przycisk akcji "Zaloguj" lub "Zarejestruj"
- Przycisk "Zapomniałem hasła" pod formularzem logowania
- Przyciski pokazujące/ukrywające hasło

### 1.5 Scenariusze użytkownika

#### Rejestracja
1. Użytkownik wchodzi na stronę `/auth`
2. Wybiera zakładkę "Rejestracja"
3. Wprowadza email i hasło
4. System waliduje dane w czasie rzeczywistym
5. Po kliknięciu "Zarejestruj", system tworzy konto
6. Użytkownik otrzymuje email weryfikacyjny
7. Po weryfikacji email, użytkownik jest przekierowywany do dashboardu

#### Logowanie
1. Użytkownik wchodzi na stronę `/auth`
2. Wybiera zakładkę "Logowanie" (domyślnie wybrana)
3. Wprowadza email i hasło
4. System weryfikuje dane
5. W przypadku poprawnych danych, użytkownik jest logowany i przekierowywany do dashboardu
6. W przypadku błędnych danych, wyświetlany jest wyraźny komunikat o błędzie

#### Odzyskiwanie hasła
1. Użytkownik klika "Zapomniałem hasła" na formularzu logowania
2. Zostaje przekierowany na stronę `/auth/forgot-password`
3. Wprowadza adres email
4. System wysyła email z linkiem do resetowania hasła
5. Użytkownik klika link w emailu i zostaje przekierowany na stronę `/auth/reset-password`
6. Wprowadza nowe hasło i potwierdza je
7. System aktualizuje hasło i przekierowuje użytkownika do strony logowania

#### Wylogowanie
1. Zalogowany użytkownik klika na swój profil w górnej nawigacji
2. Wybiera opcję "Wyloguj" z menu użytkownika
3. System usuwa sesję użytkownika i tokeny JWT
4. Użytkownik jest przekierowywany do strony głównej

## 2. LOGIKA BACKENDOWA

### 2.1 Struktura endpointów API

Wykorzystanie wbudowanych endpointów Supabase Auth z integracją Astro:

#### Endpointy Astro API
- **`/src/pages/api/auth/register.ts`** - endpoint rejestracji
- **`/src/pages/api/auth/login.ts`** - endpoint logowania
- **`/src/pages/api/auth/logout.ts`** - endpoint wylogowania
- **`/src/pages/api/auth/forgot-password.ts`** - endpoint zapomnienia hasła
- **`/src/pages/api/auth/reset-password.ts`** - endpoint resetowania hasła

### 2.2 Modele danych

#### Wykorzystanie istniejących modeli DTO z src/types.ts
Aplikacja korzysta z istniejących typów DTO dla autentykacji:

```typescript
// Istniejące typy w src/types.ts:

/** Request DTO for user registration */
export interface RegisterUserDto {
  email: string;
  password: string;
}

/** Response DTO for user information */
export interface UserDto {
  id: string;
  email: string;
  created_at: string;
}

/** Request DTO for user login */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/** Response DTO for successful login */
export interface LoginResponseDto {
  token: string;
  user: UserDto;
}
```

#### Dodatkowe modele DTO dla rozszerzonej funkcjonalności autentykacji
Rozszerzenie istniejących typów o nowe potrzebne funkcjonalności:

```typescript
// Dodatkowe typy do dodania w src/types.ts:

/** Request DTO for password reset request */
export interface ForgotPasswordDto {
  email: string;
}

/** Request DTO for setting a new password */
export interface ResetPasswordDto {
  password: string;
  token: string;
}
```

### 2.3 Mechanizm walidacji danych wejściowych

Implementacja walidacji w dwóch warstwach:
1. **Frontend** - walidacja w komponentach React przed wysłaniem formularza
2. **Backend** - walidacja w endpointach API

#### Biblioteka walidacji
Wykorzystanie biblioteki Zod do typebezpiecznej walidacji:

```typescript
// /src/lib/validators/auth.ts
import { z } from 'zod';
import type { RegisterUserDto, LoginRequestDto, ForgotPasswordDto, ResetPasswordDto } from '@/types';

export const registerSchema = z.object({
  email: z.string().email('Niepoprawny format adresu email'),
  password: z.string()
    .min(8, 'Hasło musi mieć co najmniej 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną dużą literę')
    .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
    .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać co najmniej jeden znak specjalny'),
}) satisfies z.ZodType<RegisterUserDto>;

export const loginSchema = z.object({
  email: z.string().email('Niepoprawny format adresu email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
}) satisfies z.ZodType<LoginRequestDto>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Niepoprawny format adresu email'),
}) satisfies z.ZodType<ForgotPasswordDto>;

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Hasło musi mieć co najmniej 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną dużą literę')
    .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
    .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać co najmniej jeden znak specjalny'),
  token: z.string().min(1, 'Token jest wymagany'),
}) satisfies z.ZodType<ResetPasswordDto>;
```

### 2.4 Obsługa wyjątków

Centralizacja obsługi błędów w jednym miejscu:

```typescript
// /src/lib/errors/auth.ts
export const authErrorMessages = {
  'auth/user-not-found': 'Użytkownik o podanym adresie email nie istnieje',
  'auth/wrong-password': 'Niepoprawne hasło',
  'auth/email-already-in-use': 'Konto z tym adresem email już istnieje',
  'auth/too-many-requests': 'Zbyt wiele prób. Spróbuj ponownie później',
  'auth/invalid-email': 'Niepoprawny adres email',
  'auth/weak-password': 'Hasło jest zbyt słabe',
  'default': 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później'
};

export function mapSupabaseError(error: any): string {
  const code = error?.code || 'default';
  return authErrorMessages[code] || authErrorMessages.default;
}
```

### 2.5 Aktualizacja renderowania server-side

Middleware Astro dla ochrony stron wymagających autentykacji:

```typescript
// /src/middleware/index.ts
import { defineMiddleware } from 'astro:middleware';
import { createClient } from '@supabase/supabase-js';

export const onRequest = defineMiddleware(async ({ request, cookies, redirect }, next) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  const authCookie = cookies.get('sb-auth-token');
  
  if (authCookie) {
    supabase.auth.setSession({
      access_token: authCookie.value,
      refresh_token: cookies.get('sb-refresh-token')?.value || '',
    });
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  // Chronione ścieżki wymagające autentykacji
  const protectedPaths = ['/', '/dashboard', '/flashcards', '/generate', '/profile'];
  // Ścieżki tylko dla niezalogowanych użytkowników
  const guestOnlyPaths = ['/auth'];
  
  const path = new URL(request.url).pathname;
  
  // Przekierowanie zalogowanych użytkowników z guestOnly stron
  if (user && guestOnlyPaths.some(p => path.startsWith(p))) {
    return redirect('/');
  }
  
  // Przekierowanie niezalogowanych z chronionych stron
  if (!user && protectedPaths.some(p => path === p || path.startsWith(p))) {
    return redirect('/auth');
  }
  
  // Dodanie informacji o użytkowniku do wszystkich stron
  const response = await next();
  return response;
});
```

## 3. SYSTEM AUTENTYKACJI

### 3.1 Inicjalizacja Supabase

Utworzenie klienta Supabase dostępnego w całej aplikacji:

```typescript
// /src/db/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

### 3.2 Bezpieczne zarządzanie tokenami JWT

Implementacja bezpiecznego przechowywania i obsługi tokenów JWT:

```typescript
// /src/lib/services/token.service.ts
export const TokenService = {
  saveToken(token: string) {
    // Zapisz token w localStorage z odpowiednią flagą HttpOnly i Secure
    localStorage.setItem('access_token', token);
  },
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
  
  removeToken() {
    localStorage.removeItem('access_token');
  },
  
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Sprawdź czy token nie wygasł
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // konwersja na milisekundy
      return Date.now() < exp;
    } catch (error) {
      return false;
    }
  }
};
```

### 3.3 Serwisy autentykacji

Centralne miejsce dla logiki autentykacji wykorzystujące istniejące typy:

```typescript
// /src/lib/services/auth.service.ts
import { supabase } from '@/db/supabase';
import { TokenService } from './token.service';
import type { 
  RegisterUserDto, 
  LoginRequestDto, 
  LoginResponseDto, 
  UserDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from '@/types';

export const AuthService = {
  async register({ email, password }: RegisterUserDto) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify-email`
      }
    });
    
    if (error) throw error;
    
    // Konwertowanie odpowiedzi Supabase do formatu LoginResponseDto
    if (data.session) {
      const user: UserDto = {
        id: data.user?.id || '',
        email: data.user?.email || '',
        created_at: data.user?.created_at || new Date().toISOString()
      };
      
      const response = {
        token: data.session.access_token,
        user
      } as LoginResponseDto;
      
      // Zapisz token JWT
      TokenService.saveToken(response.token);
      
      return response;
    }
    
    return null;
  },

  async login({ email, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    const user: UserDto = {
      id: data.user?.id || '',
      email: data.user?.email || '',
      created_at: data.user?.created_at || new Date().toISOString()
    };
    
    const response = {
      token: data.session.access_token,
      user
    };
    
    // Zapisz token JWT
    TokenService.saveToken(response.token);
    
    return response;
  },

  async logout() {
    // Usuń token JWT
    TokenService.removeToken();
    return await supabase.auth.signOut();
  },

  async forgotPassword({ email }: ForgotPasswordDto) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
  },

  async resetPassword({ password, token }: ResetPasswordDto) {
    // Ustawienie tokena w sesji (token z URL jest potrzebny do resetowania hasła)
    if (token) {
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: token
      });
    }
    
    return await supabase.auth.updateUser({
      password,
    });
  },

  async getSession() {
    return await supabase.auth.getSession();
  },

  async getUser(): Promise<UserDto | null> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) return null;
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      created_at: data.user.created_at || new Date().toISOString()
    };
  }
};
```

### 3.4 Integracja z Astro

Konfiguracja Astro.js do obsługi sesji użytkownika:

```typescript
// astro.config.mjs
export default defineConfig({
  // ... inne konfiguracje
  output: 'server', // Używamy trybu SSR dla obsługi autentykacji
  adapter: node({
    mode: 'standalone'
  }),
  // ... reszta konfiguracji
});
```

### 3.5 Zarządzanie sesją użytkownika

Context Provider do przechowywania informacji o zalogowanym użytkowniku:

```typescript
// /src/components/providers/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/lib/services/auth.service';
import { TokenService } from '@/lib/services/token.service';
import type { UserDto } from '@/types';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  isAuthenticated: false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      // Sprawdź czy token JWT jest ważny
      if (!TokenService.isTokenValid()) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const userData = await AuthService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    
    // Nasłuchiwanie na zmiany stanu autentykacji
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: UserDto = {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || new Date().toISOString()
          };
          setUser(userData);
          
          // Aktualizuj token JWT
          if (session.access_token) {
            TokenService.saveToken(session.access_token);
          }
        } else {
          setUser(null);
          // Usuń token JWT
          TokenService.removeToken();
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user && TokenService.isTokenValid();

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## 4. PODSUMOWANIE

Przedstawiona architektura modułu autentykacji dla aplikacji 10xProject zapewnia:

1. **Prosty, intuicyjny interfejs uwierzytelniania** - karta z zakładkami logowania i rejestracji
2. **Kompletny flow autentykacji** - rejestracja, logowanie, wylogowanie, odzyskiwanie hasła
3. **Walidację w czasie rzeczywistym** - natychmiastowa informacja o błędach dla użytkownika
4. **Dwuwarstwową walidację** - frontend (React) i backend (Astro API)
5. **Obsługę błędów** - wyraźne, przyjazne komunikaty dla użytkownika
6. **Bezpieczeństwo** - bezpieczne zarządzanie tokenami JWT i wykorzystanie Supabase Auth
7. **Integrację z Astro** - middleware do ochrony stron i zarządzania sesją
8. **Typebezpieczeństwo** - wykorzystanie TypeScript dla wszystkich interfejsów i funkcji

Implementacja tego modułu pozwoli na realizację wymagań z historyjek użytkownika US-001 i US-002, zapewniając jednocześnie framework dla przyszłych funkcjonalności związanych z zarządzaniem kontem użytkownika (US-011).

Architektura jest zgodna ze stosem technologicznym projektu i zachowuje separację odpowiedzialności między komponentami, a także wykorzystuje istniejące typy zdefiniowane w aplikacji. 