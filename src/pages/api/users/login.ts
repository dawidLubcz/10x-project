import { type APIContext } from "astro";
import { createAuthService } from "../../../lib/services/auth.service";
import { validateLoginRequest } from "../../../lib/schemas/login.schema";
import type { LoginRequestDto } from "../../../types";
import { ZodError } from "zod";

export const prerender = false;

/**
 * Handles user login requests
 * @param context - Astro API context
 * @returns Response with authentication results or error
 */
export async function POST(context: APIContext): Promise<Response> {
  try {
    // Get Supabase client from context
    const supabase = context.locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({ message: "Błąd serwera: brak połączenia z bazą danych" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    let requestData: unknown;
    try {
      requestData = await context.request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Nieprawidłowe dane wejściowe" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate request data
    let validatedData: LoginRequestDto;
    try {
      validatedData = validateLoginRequest(requestData);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));
        
        return new Response(
          JSON.stringify({ message: "Błąd walidacji danych", errors }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Nieprawidłowe dane wejściowe" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create auth service and attempt login
    const authService = createAuthService(supabase);
    try {
      const result = await authService.login(validatedData);
      
      // Return successful response
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      // Handle authentication errors
      const message = error instanceof Error ? error.message : "Błąd uwierzytelniania";
      
      // Determine appropriate status code based on error message
      const status = message.includes("Nieprawidłowy email lub hasło") ||
                    message.includes("Konto nie zostało potwierdzone") 
                    ? 401 : 500;
      
      return new Response(
        JSON.stringify({ message }),
        { status, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error("Unexpected error during login:", error);
    
    return new Response(
      JSON.stringify({ message: "Wystąpił nieoczekiwany błąd" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 