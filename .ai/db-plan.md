# Schemat bazy danych PostgreSQL dla FlashGen AI

## 1. Tabele

### 1.1. Tabela `users`

Ta tabela jest zarządzana przez Supabase Auth. Dodatkowe pola nie są wymagane.

```sql
-- Tabela users jest automatycznie tworzona i zarządzana przez Supabase Auth
-- Podstawowe pola obejmują: id (uuid), email, created_at, encrypted_password, confirmed_at
```

### 1.2. Tabela `flashcards`

```sql
CREATE TABLE flashcards (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    front VARCHAR NOT NULL CHECK (length(front) <= 200),
    back VARCHAR NOT NULL CHECK (length(back) <= 500),
    source VARCHAR NOT NULL CHECK (source IN ('ai-full', 'ai-edited', 'manual')),
    generation_id BIGINT,  -- bez relacji FK zgodnie z wymaganiami
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger dla automatycznej aktualizacji pola updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_flashcards_updated_at
BEFORE UPDATE ON flashcards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 1.3. Tabela `generations`

```sql
CREATE TABLE generations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    model VARCHAR,
    generated_count INTEGER DEFAULT 0,
    accepted_unedited_count INTEGER DEFAULT 0,
    accepted_edited_count INTEGER DEFAULT 0,
    source_text_hash VARCHAR NOT NULL,
    source_text_length INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 1.4. Tabela `generation_error_logs`

```sql
CREATE TABLE generation_error_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    model VARCHAR,
    source_text_hash VARCHAR NOT NULL,
    source_text_length INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000),
    error_code VARCHAR,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Relacje

Relacje w bazie danych są proste i opierają się głównie na powiązaniach z użytkownikiem:

1. `users` (1) → (n) `flashcards`: Jeden użytkownik może mieć wiele fiszek
2. `users` (1) → (n) `generations`: Jeden użytkownik może mieć wiele generacji
3. `users` (1) → (n) `generation_error_logs`: Jeden użytkownik może mieć wiele błędów generacji

Nie ma bezpośredniej relacji między `flashcards` a `generations` (zgodnie z wymaganiami), ale istnieje powiązanie logiczne poprzez pole `generation_id` w tabeli `flashcards`.

## 3. Indeksy

```sql
-- Indeks dla szybkiego wyszukiwania fiszek użytkownika
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);

-- Indeks dla sortowania fiszek po dacie utworzenia
CREATE INDEX idx_flashcards_created_at ON flashcards(created_at);

-- Indeks dla szybkiego wyszukiwania generacji użytkownika
CREATE INDEX idx_generations_user_id ON generations(user_id);

-- Indeks dla szybkiego wyszukiwania błędów generacji użytkownika
CREATE INDEX idx_generation_error_logs_user_id ON generation_error_logs(user_id);
```

## 4. Zasady RLS (Row Level Security)

```sql
-- Włączenie RLS dla wszystkich tabel
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_error_logs ENABLE ROW LEVEL SECURITY;

-- Polityki dla fiszek
CREATE POLICY "Użytkownicy mogą przeglądać tylko własne fiszki"
    ON flashcards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą tworzyć własne fiszki"
    ON flashcards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą aktualizować tylko własne fiszki"
    ON flashcards FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą usuwać tylko własne fiszki"
    ON flashcards FOR DELETE
    USING (auth.uid() = user_id);

-- Polityki dla generacji
CREATE POLICY "Użytkownicy mogą przeglądać tylko własne generacje"
    ON generations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą tworzyć własne generacje"
    ON generations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą aktualizować tylko własne generacje"
    ON generations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą usuwać tylko własne generacje"
    ON generations FOR DELETE
    USING (auth.uid() = user_id);

-- Polityki dla błędów generacji
CREATE POLICY "Użytkownicy mogą przeglądać tylko własne błędy generacji"
    ON generation_error_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą tworzyć własne błędy generacji"
    ON generation_error_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

## 5. Uwagi dodatkowe

1. **Przyszłe rozszerzenia:**
   - Schemat przygotowany jest do przyszłej integracji z algorytmem powtórek. Dodatkowe tabele i pola będą wymagane do implementacji funkcjonalności spaced-repetition.

2. **Bezpieczeństwo:**
   - Wszystkie tabele mają włączony Row Level Security (RLS), co zapewnia, że użytkownicy mają dostęp tylko do własnych danych.
   - Klucze obce user_id są skonfigurowane z ON DELETE CASCADE, aby zapewnić usunięcie wszystkich powiązanych danych po usunięciu konta użytkownika.

3. **Integralność danych:**
   - Zastosowano odpowiednie ograniczenia CHECK, aby utrzymać integralność danych (np. długość tekstu, wartości pola source).
   - Automatyczna aktualizacja pola updated_at za pomocą triggera PostgreSQL.

4. **Wydajność:**
   - Dodano indeksy dla najczęściej używanych kolumn w zapytaniach (user_id, created_at).
   - W miarę skalowania aplikacji może być konieczne dodanie dodatkowych indeksów lub optymalizacja istniejących. 