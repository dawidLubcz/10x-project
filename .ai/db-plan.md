# Schemat bazy danych PostgreSQL dla 10xProject

## 1. Lista tabel

### 1.1. Tabela `users`
- **id**: UUID PRIMARY KEY  
- **email**: VARCHAR NOT NULL UNIQUE  
- **created_at**: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  
- **encrypted_password**: VARCHAR NOT NULL  
- **confirmed_at**: TIMESTAMP

*Uwaga: Tabela `users` wykorzystuje standardowy model autentykacji Supabase (obsługa dodatkowych pól jest zarządzana przez Supabase).*

### 1.2. Tabela `flashcards`
- **id**: BIGSERIAL PRIMARY KEY  
- **front**: VARCHAR(200) NOT NULL CHECK (LENGTH(front) <= 200)  
- **back**: VARCHAR(500) NOT NULL CHECK (LENGTH(back) <= 500)  
- **source**: VARCHAR(50) NOT NULL CHECK (source IN ('ai-full', 'ai-edited', 'manual'))  
- **generation_id**: BIGINT REFERENCES generations(id) ON DELETE SET NULL
  *Uwaga: Pole przechowuje identyfikator generacji, ale nie jest powiązane relacją FK.*  
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE  
- **created_at**: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  
- **updated_at**: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### 1.3. Tabela `generations`
- **id**: BIGSERIAL PRIMARY KEY  
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE  
- **model**: VARCHAR NOT NULL  
- **generated_count**: INTEGER NOT NULL  
- **accepted_unedited_count**: INTEGER NOT NULL  
- **accepted_edited_count**: INTEGER NOT NULL  
- **source_text_hash**: VARCHAR NOT NULL  
- **source_text_length**: INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)

### 1.4. Tabela `generation_error_logs`
- **id**: BIGSERIAL PRIMARY KEY  
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE  
- **model**: VARCHAR NOT NULL  
- **source_text_hash**: VARCHAR NOT NULL  
- **source_text_length**: INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)  
- **error_code**: VARCHAR NOT NULL  
- **error_message**: TEXT  
- **created_at**: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## 2. Relacje między tabelami

- **users** → **flashcards**: Jeden użytkownik może mieć wiele fiszek. Relacja 1:N realizowana przez pole `user_id` (ON DELETE CASCADE).
- **users** → **generations**: Jeden użytkownik może mieć wiele generacji. Relacja 1:N realizowana przez pole `user_id` (ON DELETE CASCADE).
- **users** → **generation_error_logs**: Jeden użytkownik może mieć wiele wpisów błędów generacji. Relacja 1:N realizowana przez pole `user_id` (ON DELETE CASCADE).

*Uwaga: Nie ma bezpośredniej relacji FK między tabelami `flashcards` a `generations`; powiązanie generacji z fiszkami jest zarządzane na poziomie logiki aplikacji, a jedyne zależności są ustanowione względem użytkownika.*

## 3. Indeksy

- **flashcards**:  
  - Indeks na kolumnie `user_id`  
  - Indeks na kolumnie `created_at` (opcjonalnie, do sortowania)

- **generations**:  
  - Indeks na kolumnie `user_id`

- **generation_error_logs**:  
  - Indeks na kolumnie `user_id`

## 4. Zasady PostgreSQL / RLS

- **Row Level Security (RLS)** zostanie włączone na tabelach `flashcards`, `generations` oraz `generation_error_logs`.

Przykładowe polityki RLS:
- Dla tabeli `flashcards`:
  - SELECT: `USING (auth.uid() = user_id)`
  - INSERT: `WITH CHECK (auth.uid() = user_id)`
  - UPDATE: `USING (auth.uid() = user_id)`
  - DELETE: `USING (auth.uid() = user_id)`

- Analogiczne polityki zostaną utworzone dla tabel `generations` oraz `generation_error_logs`.

## 5. Dodatkowe uwagi i wyjaśnienia

- **Trigger Aktualizacji**:  
  Tabela `flashcards` posiada trigger automatycznie aktualizujący kolumnę `updated_at` przy każdej aktualizacji rekordu.

- **Kaskadowe Usuwanie**:  
  Wszystkie zależności (klucze obce odnoszące się do `user_id`) mają ustawione `ON DELETE CASCADE`, co gwarantuje spójność danych przy usunięciu konta użytkownika.

- **Brak relacji między `flashcards` a `generations`**:  
  Pole `generation_id` w tabeli `flashcards` przechowuje identyfikator generacji, lecz nie jest powiązane relacją FK – zarządzanie powiązaniem odbywa się na poziomie logiki aplikacji.

- **Przyszłe Rozszerzenia**:  
  Schemat został zaprojektowany z myślą o przyszłej integracji z algorytmem powtórek. Dalsze tabele oraz kolumny mogą zostać dodane, aby wspierać funkcjonalność spaced-repetition.

- **Integralność Danych**:  
  Wszystkie wymagane ograniczenia CHECK (np. długość tekstów, zakres wartości dla `source_text_length`) oraz NOT NULL zapewniają właściwą integralność danych.

- **Optymalizacja Wydajności**:  
  Indeksy na kluczowych kolumnach (takich jak `user_id` i `created_at`) zostały zaprojektowane w celu optymalizacji zapytań oraz sortowania. 