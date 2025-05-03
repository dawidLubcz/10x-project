# Testing w 10xProject

Ten dokument zawiera informacje o testowaniu w projekcie 10xProject.

## Struktura testów

```
tests/
├── components/           # Testy jednostkowe komponentów
├── e2e/                  # Testy end-to-end z Playwright
├── api/                  # Testy API
├── setup/                # Konfiguracja testów
│   ├── mocks/            # Komponenty mockujące
│   └── vitest.setup.ts   # Plik konfiguracyjny dla Vitest
└── README.md             # Ten plik
```

## Technologie testowe

- **Vitest** - dla testów jednostkowych i integracyjnych
- **Playwright** - dla testów end-to-end (E2E)
- **Testing-Library** - dla testów komponentów React
- **MSW** - do mockowania API (opcjonalnie)

## Uruchamianie testów

### Testy jednostkowe

```bash
# Uruchom wszystkie testy jednostkowe
npm run test

# Uruchom testy w trybie watch
npm run test:watch

# Uruchom testy z interfejsem GUI
npm run test:ui

# Wygeneruj raport pokrycia testów
npm run test:coverage
```

### Testy E2E

```bash
# Zainstaluj przeglądarki dla Playwright (tylko przy pierwszym użyciu)
npm run test:e2e:install

# Uruchom testy E2E
npm run test:e2e

# Uruchom testy E2E z interfejsem GUI
npm run test:e2e:ui

# Uruchom testy E2E bez uruchamiania serwera (jeśli serwer już działa)
npm run test:e2e:no-server
```

## Pisanie testów

### Testy jednostkowe komponentów React

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from '@/components/Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Oczekiwany tekst')).toBeInTheDocument();
  });

  it('responds to user interaction', async () => {
    const user = userEvent.setup();
    render(<Component />);
    
    await user.click(screen.getByRole('button', { name: 'Kliknij mnie' }));
    
    expect(screen.getByText('Nowy stan')).toBeInTheDocument();
  });
});
```

### Testy E2E z Playwright

```ts
import { test, expect } from '@playwright/test';

test('przykładowy test nawigacji', async ({ page }) => {
  await page.goto('/');
  
  // Sprawdź czy strona główna załadowała się poprawnie
  await expect(page).toHaveTitle(/10xProject/);
  
  // Kliknij w przycisk logowania
  await page.click('button:has-text("Zaloguj")');
  
  // Sprawdź czy jesteśmy na stronie logowania
  await expect(page).toHaveURL(/.*login/);
});
```

## Mockowanie komponentów i API

Aby mockować komponenty UI lub zewnętrzne API, korzystaj z mechanizmów mockowania Vitest:

```tsx
// Mockowanie komponentu
vi.mock('@/components/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="mocked-button">{children}</button>
  )
}));

// Mockowanie fetch API za pomocą MSW
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: '1',
      name: 'Test User'
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Continuous Integration

Testy są uruchamiane automatycznie podczas procesu CI za pomocą polecenia:

```bash
npm run test:ci
``` 