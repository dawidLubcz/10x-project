import type { APIRoute } from "astro";
import { userProfileResponseSchema } from "../../../lib/schemas/user.schema";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../db/database.types";
import type { UserDto } from "../../../types";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  // Sprawdzenie sesji użytkownika
  const session = await locals.supabase.auth.getSession();
  const user = session.data.session?.user;

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized", message: "Wymagane uwierzytelnienie" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  // Pobranie danych użytkownika bezpośrednio z supabase auth
  const { data: userData, error: userError } = await locals.supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized", message: "Nie znaleziono profilu użytkownika" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  // Utworzenie obiektu UserDto
  const userProfile: UserDto = {
    id: userData.user.id,
    email: userData.user.email || "",
    created_at: userData.user.created_at
  };

  // Walidacja odpowiedzi
  const validatedResponse = userProfileResponseSchema.safeParse(userProfile);
  
  if (!validatedResponse.success) {
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: "Błąd podczas przetwarzania danych użytkownika" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  // Zwrócenie odpowiedzi
  return new Response(
    JSON.stringify(validatedResponse.data),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}; 