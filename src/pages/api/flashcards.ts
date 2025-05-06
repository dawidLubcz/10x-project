import { FlashcardService } from "../../lib/services/flashcard.service";
import type { APIContext } from "astro";
import type { CreateFlashcardDto, FlashcardQueryParams, FlashcardSource } from "../../types";

// Wyłączenie prerenderowania dla endpointa API
export const prerender = false;

/**
 * Endpoint do obsługi żądań GET i POST dla fiszek
 */
export async function GET(context: APIContext) {
  try {
    // Pobieranie klienta Supabase z kontekstu
    const supabase = context.locals.supabase;
    
    // Pobierz token uwierzytelniający
    const authHeader = context.request.headers.get('Authorization');
    const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    // Pobierz token z ciasteczka
    const cookieHeader = context.request.headers.get('Cookie');
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
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Musisz być zalogowany, aby uzyskać dostęp do swoich fiszek."
          }
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Pobranie parametrów zapytania
    const url = new URL(context.request.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    const sort_by = url.searchParams.get("sort_by");
    const filter_source = url.searchParams.get("filter[source]");

    // Przygotowanie parametrów zapytania
    // Cast query params to proper types
    const sortByParam = sort_by as FlashcardQueryParams['sort_by'];
    const filterSourceParam = filter_source as FlashcardSource;
    const queryParams: FlashcardQueryParams = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sort_by: sortByParam || undefined,
      filter: filter_source ? { source: filterSourceParam } : undefined
    };

    // Utworzenie serwisu i pobranie fiszek
    const flashcardService = new FlashcardService(supabase);
    const result = await flashcardService.getFlashcards(userId, queryParams);

    // Zwrócenie odpowiedzi
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, max-age=0"
      }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania fiszek:", error);

    // Określenie rodzaju błędu
    if (error instanceof Error && error.message.includes("walidacji")) {
      return new Response(
        JSON.stringify({
          error: {
            code: "VALIDATION_ERROR",
            message: "Nieprawidłowe parametry zapytania.",
            details: error.message
          }
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Zwrócenie ogólnego błędu
    return new Response(
      JSON.stringify({
        error: {
          code: "SERVER_ERROR",
          message: "Wystąpił błąd serwera podczas pobierania fiszek."
        }
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}

/**
 * Obsługa tworzenia nowej fiszki
 */
export async function POST(context: APIContext) {
  try {
    // Pobieranie klienta Supabase z kontekstu
    const supabase = context.locals.supabase;
    
    // Pobierz token uwierzytelniający
    const authHeader = context.request.headers.get('Authorization');
    const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    // Pobierz token z ciasteczka
    const cookieHeader = context.request.headers.get('Cookie');
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
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Musisz być zalogowany, aby utworzyć fiszkę."
          }
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Pobranie danych z body
    const data = await context.request.json() as CreateFlashcardDto;

    // Utworzenie serwisu i dodanie fiszki
    const flashcardService = new FlashcardService(supabase);
    const flashcard = await flashcardService.createFlashcard(userId, data);

    // Zwrócenie odpowiedzi
    return new Response(JSON.stringify(flashcard), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia fiszki:", error);

    // Określenie rodzaju błędu
    if (error instanceof Error && error.message.includes("walidacji")) {
      return new Response(
        JSON.stringify({
          error: {
            code: "VALIDATION_ERROR",
            message: "Nieprawidłowe dane fiszki.",
            details: error.message
          }
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Zwrócenie ogólnego błędu
    return new Response(
      JSON.stringify({
        error: {
          code: "SERVER_ERROR",
          message: "Wystąpił błąd serwera podczas tworzenia fiszki."
        }
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
} 