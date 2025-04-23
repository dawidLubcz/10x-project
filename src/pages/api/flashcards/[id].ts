import type { APIRoute } from 'astro';
import { FlashcardService } from '../../../lib/services/flashcard.service';
import { flashcardIdSchema } from '../../../lib/schemas/flashcard.schemas';
import { ZodError } from 'zod';

// Testowy ID użytkownika - taki sam jak w src/pages/api/flashcards.ts
const TEST_USER_ID = "a5a661c1-13ed-4116-8a65-9fe8dd3f0341";

export const GET: APIRoute = async ({ params, locals, request }) => {
  try {
    // Walidacja ID fiszki
    const { id } = params;
    const validatedId = flashcardIdSchema.parse(id);
    
    // Pobieranie supabase z kontekstu
    const supabase = locals.supabase;
    let userId = null;
    
    // Użyj testowego ID lub pobierz z sesji
    if (TEST_USER_ID !== null) {
      userId = TEST_USER_ID;
    } else {
      // Pobranie sesji użytkownika
      const { data: { session } } = await supabase.auth.getSession();
      
      // Sprawdzenie autoryzacji
      if (!session) {
        return new Response(JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Musisz być zalogowany, aby uzyskać dostęp do fiszki."
          }
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      userId = session.user.id;
    }

    // Pobranie fiszki z serwisu
    const flashcardService = new FlashcardService(supabase);
    const flashcard = await flashcardService.getFlashcardById(validatedId, userId);

    // Sprawdzenie czy fiszka istnieje
    if (!flashcard) {
      return new Response(JSON.stringify({ 
        error: {
          code: "NOT_FOUND",
          message: "Nie znaleziono fiszki o podanym ID."
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Zwrócenie danych fiszki
    return new Response(JSON.stringify(flashcard), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60'
      }
    });
  } catch (error) {
    // Obsługa błędów walidacji
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ 
        error: {
          code: "VALIDATION_ERROR",
          message: "Nieprawidłowy format ID fiszki.",
          details: error.format()
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Logowanie błędu
    console.error('Błąd podczas pobierania fiszki:', error);

    // Zwrócenie ogólnego błędu serwera
    return new Response(JSON.stringify({ 
      error: {
        code: "SERVER_ERROR",
        message: "Wystąpił błąd serwera podczas pobierania fiszki."
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, locals, request }) => {
  try {
    // Walidacja ID fiszki
    const { id } = params;
    const validatedId = flashcardIdSchema.parse(id);
    
    // Pobieranie supabase z kontekstu
    const supabase = locals.supabase;
    let userId = null;
    
    // Użyj testowego ID lub pobierz z sesji
    if (TEST_USER_ID !== null) {
      userId = TEST_USER_ID;
    } else {
      // Pobranie sesji użytkownika
      const { data: { session } } = await supabase.auth.getSession();
      
      // Sprawdzenie autoryzacji
      if (!session) {
        return new Response(JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Musisz być zalogowany, aby zaktualizować fiszkę."
          }
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      userId = session.user.id;
    }

    // Pobranie danych z body
    const data = await request.json();

    // Aktualizacja fiszki
    const flashcardService = new FlashcardService(supabase);
    const flashcard = await flashcardService.updateFlashcard(validatedId, userId, data);

    // Sprawdzenie czy fiszka istnieje
    if (!flashcard) {
      return new Response(JSON.stringify({ 
        error: {
          code: "NOT_FOUND",
          message: "Nie znaleziono fiszki o podanym ID."
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Zwrócenie zaktualizowanej fiszki
    return new Response(JSON.stringify(flashcard), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Obsługa błędów walidacji
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ 
        error: {
          code: "VALIDATION_ERROR",
          message: "Nieprawidłowe dane wejściowe.",
          details: error.format()
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Logowanie błędu
    console.error('Błąd podczas aktualizacji fiszki:', error);

    // Zwrócenie ogólnego błędu serwera
    return new Response(JSON.stringify({ 
      error: {
        code: "SERVER_ERROR",
        message: "Wystąpił błąd serwera podczas aktualizacji fiszki."
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals, request }) => {
  try {
    // Walidacja ID fiszki
    const { id } = params;
    const validatedId = flashcardIdSchema.parse(id);
    
    // Pobieranie supabase z kontekstu
    const supabase = locals.supabase;
    let userId = null;
    
    // Użyj testowego ID lub pobierz z sesji
    if (TEST_USER_ID !== null) {
      userId = TEST_USER_ID;
    } else {
      // Pobranie sesji użytkownika
      const { data: { session } } = await supabase.auth.getSession();
      
      // Sprawdzenie autoryzacji
      if (!session) {
        return new Response(JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Musisz być zalogowany, aby usunąć fiszkę."
          }
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      userId = session.user.id;
    }

    // Usunięcie fiszki
    const flashcardService = new FlashcardService(supabase);
    const deleted = await flashcardService.deleteFlashcard(validatedId, userId);

    // Sprawdzenie czy fiszka istniała
    if (!deleted) {
      return new Response(JSON.stringify({ 
        error: {
          code: "NOT_FOUND",
          message: "Nie znaleziono fiszki o podanym ID."
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Zwrócenie odpowiedzi bez treści
    return new Response(null, {
      status: 204
    });
  } catch (error) {
    // Obsługa błędów walidacji
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ 
        error: {
          code: "VALIDATION_ERROR",
          message: "Nieprawidłowy format ID fiszki.",
          details: error.format()
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Logowanie błędu
    console.error('Błąd podczas usuwania fiszki:', error);

    // Zwrócenie ogólnego błędu serwera
    return new Response(JSON.stringify({ 
      error: {
        code: "SERVER_ERROR",
        message: "Wystąpił błąd serwera podczas usuwania fiszki."
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Ustawienie eksportu do SSR
export const prerender = false; 