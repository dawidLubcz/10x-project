import type { APIRoute } from "astro";
import { userProfileResponseSchema } from "../../../lib/schemas/user.schema";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../db/database.types";
import type { UserDto } from "../../../types";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  // Pobierz token z nagłówka Authorization
  const authHeader = request.headers.get('Authorization');
  const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  // Alternatywnie możemy pobrać token z cookie (obsługiwane przez middleware)
  const cookieHeader = request.headers.get('Cookie');
  let tokenFromCookie = null;
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const authCookie = cookies.find(c => c.startsWith('auth_token='));
    if (authCookie) {
      tokenFromCookie = authCookie.split('=')[1];
    }
  }
  
  // Użyj tokenu z nagłówka lub z cookie
  const token = tokenFromHeader || tokenFromCookie;

  // Sprawdzenie sesji użytkownika na podstawie tokenu
  let user = null;
  
  if (token) {
    // Najpierw próbujemy zweryfikować token poprzez Supabase
    const { data } = await locals.supabase.auth.getUser(token);
    user = data.user;
  } else {
    // Jeśli brak tokenu, spróbuj pobrać sesję (dla kompatybilności wstecznej)
    const session = await locals.supabase.auth.getSession();
    user = session.data.session?.user;
  }

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

  // Utworzenie obiektu UserDto
  const userProfile: UserDto = {
    id: user.id,
    email: user.email || "",
    created_at: user.created_at
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