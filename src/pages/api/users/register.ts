import { z } from 'zod';
import type { APIRoute } from 'astro';
import type { UserDto } from '../../../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../db/database.types';

// Wyłączenie prerenderowania dla endpointu API
export const prerender = false;

// Schemat walidacji dla RegisterUserDto
const registerUserSchema = z.object({
  email: z.string().email('Nieprawidłowy format adresu email'),
  password: z.string().min(8, 'Hasło musi zawierać co najmniej 8 znaków')
});

/**
 * Endpoint rejestracji nowego użytkownika
 * 
 * @route POST /api/users/register
 * @param {Object} request - Obiekt żądania
 * @param {Object} locals - Lokalny kontekst Astro zawierający instancję Supabase
 * @returns {Response} Odpowiedź HTTP zawierająca dane użytkownika lub informację o błędzie
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parsowanie JSON z żądania
    const rawData = await request.json();
    
    // Walidacja danych wejściowych przy użyciu Zod
    const parseResult = registerUserSchema.safeParse(rawData);
    
    // Jeśli walidacja się nie powiedzie, zwróć błąd 400 Bad Request
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: parseResult.error.format() }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Dane przeszły walidację, możemy je bezpiecznie użyć
    const { email, password } = parseResult.data;
    
    // Pobierz instancję klienta Supabase z kontekstu Astro
    const supabase = locals.supabase as SupabaseClient<Database>;
    
    // Rejestracja użytkownika przy użyciu Supabase Auth API
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (authError) {
      // Sprawdzenie czy błąd dotyczy istniejącego użytkownika
      if (authError.message.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'User with this email already exists' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Sprawdzenie, czy użytkownik został utworzony
    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // W schemacie bazy danych nie ma tabeli `users` w schemacie `public`.
    // Użytkownicy są zarządzani przez Supabase Auth i przechowywani w schemacie `auth`.
    // Jeśli potrzebujemy dodatkowych danych użytkownika, należy utworzyć odpowiednią tabelę.
    
    // Przygotowanie odpowiedzi zgodnie z typem UserDto
    const userData: UserDto = {
      id: authData.user.id,
      email: authData.user.email || '',
      created_at: authData.user.created_at
    };
    
    // Zwrócenie pomyślnej odpowiedzi z kodem 201 Created
    return new Response(
      JSON.stringify(userData),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 