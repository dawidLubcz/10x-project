import type { APIRoute } from 'astro';
import { FlashcardService } from '../../../lib/services/flashcard.service';
import { flashcardIdSchema } from '../../../lib/schemas/flashcard.schemas';
import { ZodError } from 'zod';

export const GET: APIRoute = async ({ params, locals, request }) => {
  try {
    // Walidacja ID fiszki
    const { id } = params;
    const validatedId = flashcardIdSchema.parse(id);
    
    // Pobieranie supabase z kontekstu
    const supabase = locals.supabase;
    
    // Pobierz token uwierzytelniający
    const authHeader = request.headers.get('Authorization');
    const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    // Pobierz token z ciasteczka
    const cookieHeader = request.headers.get('Cookie');
    let tokenFromCookie = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const authCookie = cookies.find(c => c.startsWith('auth_token='));
      if (authCookie) {
        tokenFromCookie = authCookie.split('=')[1];
      }
    }
    
    // Użyj tokenu z nagłówka lub ciasteczka
    const token = tokenFromHeader || tokenFromCookie;
    
    // Pobierz użytkownika na podstawie tokenu
    let userId = null;
    
    if (token) {
      // Weryfikacja tokenu przez Supabase
      const { data } = await supabase.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
      }
    } else {
      // Próba pobrania sesji jako alternatywa
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }
    
    // Sprawdzenie autoryzacji
    if (!userId) {
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
    
    // Pobierz token uwierzytelniający
    const authHeader = request.headers.get('Authorization');
    const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    // Pobierz token z ciasteczka
    const cookieHeader = request.headers.get('Cookie');
    let tokenFromCookie = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const authCookie = cookies.find(c => c.startsWith('auth_token='));
      if (authCookie) {
        tokenFromCookie = authCookie.split('=')[1];
      }
    }
    
    // Użyj tokenu z nagłówka lub ciasteczka
    const token = tokenFromHeader || tokenFromCookie;
    
    // Pobierz użytkownika na podstawie tokenu
    let userId = null;
    
    if (token) {
      // Weryfikacja tokenu przez Supabase
      const { data } = await supabase.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
      }
    } else {
      // Próba pobrania sesji jako alternatywa
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }
    
    // Sprawdzenie autoryzacji
    if (!userId) {
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
    
    // Pobierz token uwierzytelniający
    const authHeader = request.headers.get('Authorization');
    const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    // Pobierz token z ciasteczka
    const cookieHeader = request.headers.get('Cookie');
    let tokenFromCookie = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const authCookie = cookies.find(c => c.startsWith('auth_token='));
      if (authCookie) {
        tokenFromCookie = authCookie.split('=')[1];
      }
    }
    
    // Użyj tokenu z nagłówka lub ciasteczka
    const token = tokenFromHeader || tokenFromCookie;
    
    // Pobierz użytkownika na podstawie tokenu
    let userId = null;
    
    if (token) {
      // Weryfikacja tokenu przez Supabase
      const { data } = await supabase.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
      }
    } else {
      // Próba pobrania sesji jako alternatywa
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }
    
    // Sprawdzenie autoryzacji
    if (!userId) {
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