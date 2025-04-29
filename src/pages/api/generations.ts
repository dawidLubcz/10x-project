import type { APIRoute } from 'astro';
import { z } from 'zod';
import { FlashcardSource } from '../../types';

// Disable prerendering for dynamic response
export const prerender = false;

// Predefined user ID for testing
//const TEST_USER_ID = "7eefde80-d362-40af-a6dd-d75e501cb1c7";
const TEST_USER_ID = "a5a661c1-13ed-4116-8a65-9fe8dd3f0341";

// Schema validation for input
const GenerationSchema = z.object({
  input_text: z.string().min(1).max(100)
});

// Mock function to generate flashcards with an AI (to be replaced with actual implementation)
const generateFlashcardsWithAI = async (text: string, userId: string) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate 3-6 flashcards based on the input text
  const numFlashcards = Math.floor(Math.random() * 4) + 3;
  const flashcards = Array(numFlashcards).fill(null).map((_, i) => ({
    front: `Pytanie ${i + 1} dotyczące: ${text.slice(0, 30)}${text.length > 30 ? '...' : ''}?`,
    back: `Odpowiedź ${i + 1} na pytanie dotyczące: ${text.slice(0, 30)}${text.length > 30 ? '...' : ''}.`,
    source: FlashcardSource.AI_FULL
  }));
  
  return {
    generation_id: Date.now(),
    user_id: userId,
    flashcards
  };
};

export const POST: APIRoute = async ({ request }) => {
  try {
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
    
    // Generate flashcards using predefined user ID
    const generatedData = await generateFlashcardsWithAI(input_text, TEST_USER_ID);
    
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