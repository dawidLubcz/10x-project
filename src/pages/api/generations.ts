import type { APIRoute } from "astro";
import { AIGenerationService } from "../../lib/services/ai-generation.service";
import { initiateGenerationSchema } from "../../lib/schemas/generation.schema";
import { ZodError } from "zod";

// Predefined user ID for testing
//const TEST_USER_ID = "7eefde80-d362-40af-a6dd-d75e501cb1c7";
const TEST_USER_ID = "a5a661c1-13ed-4116-8a65-9fe8dd3f0341";

/**
 * API route for initiating flashcard generation
 * POST /api/generations
 */
export const POST: APIRoute = async ({ request, locals }) => {
  // Get the supabase client from locals
  const supabase = locals.supabase;
  
  try {
    // Parse request body
    const requestBody = await request.json();
    
    // Validate request data using zod schema
    const validatedData = initiateGenerationSchema.parse(requestBody);
    
    // Create AI generation service
    const generationService = new AIGenerationService(supabase);
    
    // Generate flashcards using predefined user ID
    const result = await generationService.generateFlashcards(
      validatedData.input_text,
      TEST_USER_ID
    );
    
    // Return success response
    return new Response(
      JSON.stringify(result),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error generating flashcards:", error);
    
    // Handle validation errors
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({ 
          message: "Validation error", 
          errors: error.errors 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Handle other errors
    return new Response(
      JSON.stringify({ message: "Failed to generate flashcards" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 