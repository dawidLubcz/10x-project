import type { APIRoute } from 'astro';
import { z } from 'zod';
import { AIGenerationService } from '../../lib/services/ai-generation.service';

// Disable prerendering for dynamic response
export const prerender = false;

// Schema validation for input
const GenerationSchema = z.object({
  input_text: z.string()
    .min(1, "Input text cannot be empty")
    .max(10000, "Input text must be 10000 characters or less")
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Get Supabase client from context
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
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Musisz być zalogowany, aby korzystać z generatora."
          }
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if OPENROUTER_API_KEY is available
    const apiKey = import.meta.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Log this error to the database
      let errorLog = null;
      try {
        await supabase
          .from("generation_error_logs")
          .insert({
            user_id: userId,
            error_code: "MISSING_API_KEY",
            error_message: "OpenRouter API key is not configured on the server",
            source_text_hash: "",
            source_text_length: 0,
            model: "unknown"
          });
      } catch (logError) {
        console.error("Failed to log API key error:", logError);
        errorLog = logError;
      }

      return new Response(
        JSON.stringify({
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "Usługa generatora jest obecnie niedostępna. Prosimy spróbować później. Msg: " + errorLog
          }
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize AI Generation Service
    const aiService = new AIGenerationService(
      supabase,
      apiKey
    );

    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      // Log JSON parsing error
      try {
        await supabase
          .from("generation_error_logs")
          .insert({
            user_id: userId,
            error_code: "INVALID_JSON",
            error_message: parseError instanceof Error ? parseError.message : "Nieprawidłowy format JSON",
            source_text_hash: "",
            source_text_length: 0,
            model: "unknown"
          });
      } catch (logError) {
        console.error("Failed to log JSON parsing error:", logError);
      }

      return new Response(
        JSON.stringify({
          error: {
            code: "INVALID_REQUEST",
            message: "Nieprawidłowy format zapytania. Oczekiwany poprawny format JSON."
          }
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate the request body
    const validationResult = GenerationSchema.safeParse(body);
    if (!validationResult.success) {
      // Log validation error
      try {
        await supabase
          .from("generation_error_logs")
          .insert({
            user_id: userId,
            error_code: "VALIDATION_ERROR",
            error_message: JSON.stringify(validationResult.error.format()),
            source_text_hash: "",
            source_text_length: body?.input_text?.length || 0,
            model: "unknown"
          });
      } catch (logError) {
        console.error("Failed to log validation error:", logError);
      }

      return new Response(
        JSON.stringify({
          error: {
            code: "INVALID_INPUT",
            message: "Nieprawidłowe dane wejściowe",
            details: validationResult.error.format()
          }
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Extract validated data
    const { input_text } = validationResult.data;
    
    // Generate flashcards using AI service
    try {
      const generatedData = await aiService.generateFlashcards(input_text, userId);
      
      // Return response
      return new Response(
        JSON.stringify(generatedData),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (generationError) {
      // Error is already logged to the database in the AIGenerationService
      console.error('Error generating flashcards:', generationError);
      
      // Determine the appropriate error code and message based on the error
      let statusCode = 500;
      let errorCode = "GENERATION_FAILED";
      let errorMessage = "Wystąpił błąd podczas generowania fiszek. Msg: " + generationError;
      
      // Handle specific error cases
      if (generationError instanceof Error) {
        const message = generationError.message;
        
        if (message.includes("at least") && message.includes("characters")) {
          statusCode = 400;
          errorCode = "INPUT_TOO_SHORT";
          errorMessage = message;
        } else if (message.includes("OpenRouter API error")) {
          statusCode = 503;
          errorCode = "AI_SERVICE_ERROR";
          errorMessage = "Serwis AI jest chwilowo niedostępny. Prosimy spróbować później. Msg: " + generationError;
        }
      }
      
      return new Response(
        JSON.stringify({
          error: {
            code: errorCode,
            message: errorMessage
          }
        }),
        {
          status: statusCode,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error in generations endpoint:', error);
    
    return new Response(
      JSON.stringify({
        error: {
          code: "SERVER_ERROR",
          message: "Wystąpił nieoczekiwany błąd serwera."
        }
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 