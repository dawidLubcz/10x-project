import { FlashcardService } from "../../lib/services/flashcard.service";
import type { APIContext } from "astro";
import type { CreateFlashcardDto, FlashcardQueryParams } from "../../types";

// Wyłączenie prerenderowania dla endpointa API
export const prerender = false;

// Predefined user ID for testing
//const TEST_USER_ID = "7eefde80-d362-40af-a6dd-d75e501cb1c7";
const TEST_USER_ID = "a5a661c1-13ed-4116-8a65-9fe8dd3f0341";

/**
 * Endpoint do obsługi żądań GET i POST dla fiszek
 */
export async function GET(context: APIContext) {
  try {
    // Pobieranie klienta Supabase z kontekstu
    const supabase = context.locals.supabase;
    let userId = null;
    if (TEST_USER_ID !== null) {
        userId = TEST_USER_ID;
    } else {
        // Pobranie sesji użytkownika
        const { data: { session } } = await supabase.auth.getSession();
        // Sprawdzenie autoryzacji
        if (!session) {
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
        userId = session?.user.id;
    }

    // Pobranie parametrów zapytania
    const url = new URL(context.request.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    const sort_by = url.searchParams.get("sort_by");
    const filter_source = url.searchParams.get("filter[source]");

    // Przygotowanie parametrów zapytania
    const queryParams: FlashcardQueryParams = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sort_by: sort_by as any || undefined,
      filter: filter_source ? { source: filter_source as any } : undefined
    };

    // Utworzenie serwisu i pobranie fiszek
    const flashcardService = new FlashcardService(supabase);
    const result = await flashcardService.getFlashcards(userId, queryParams);

    // Zwrócenie odpowiedzi
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, max-age=60"
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

    let userId = null;

    if (TEST_USER_ID !== null) {
      userId = TEST_USER_ID;
    } else {
      // Pobranie sesji użytkownika
      const { data: { session } } = await supabase.auth.getSession();
      // Sprawdzenie autoryzacji
      if (!session) {
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
        userId = session?.user.id;
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