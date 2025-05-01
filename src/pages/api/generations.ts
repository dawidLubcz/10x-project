import type { APIRoute } from 'astro';
import { z } from 'zod';
import { AIGenerationService } from '../../lib/services/ai-generation.service';
import type { Database } from '../../db/database.types';

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
          error: "Unauthorized",
          message: "Musisz być zalogowany, aby korzystać z generatora."
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize AI Generation Service
    const aiService = new AIGenerationService(
      supabase,
      import.meta.env.OPENROUTER_API_KEY
    );

    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validationResult = GenerationSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: validationResult.error.format()
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
    const generatedData = await aiService.generateFlashcards(input_text, userId);
    
    // Return response
    return new Response(
      JSON.stringify(generatedData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating flashcards:', error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to generate flashcards",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 