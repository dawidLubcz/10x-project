import type { APIRoute } from 'astro';
import { z } from 'zod';
import { AIGenerationService } from '../../lib/services/ai-generation.service';
import type { Database } from '../../db/database.types';

// Disable prerendering for dynamic response
export const prerender = false;

// Predefined user ID for testing
const TEST_USER_ID = "a5a661c1-13ed-4116-8a65-9fe8dd3f0341";

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
    const generatedData = await aiService.generateFlashcards(input_text, TEST_USER_ID);
    
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