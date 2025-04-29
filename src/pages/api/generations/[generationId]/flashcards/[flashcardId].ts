import type { APIRoute } from 'astro';
import { z } from 'zod';
import { FlashcardSource } from '../../../../../types';

// Disable prerendering for dynamic response
export const prerender = false;

// Predefined user ID for testing
const TEST_USER_ID = "a5a661c1-13ed-4116-8a65-9fe8dd3f0341";

// Schema validation for flashcard actions
const FlashcardActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('accept'),
    front: z.string().min(1),
    back: z.string().min(1)
  }),
  z.object({
    action: z.literal('reject')
  }),
  z.object({
    action: z.literal('edit'),
    front: z.string().min(1),
    back: z.string().min(1)
  })
]);

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  try {
    // Get supabase client from locals
    const supabase = locals.supabase;
    
    // Extract path parameters
    const { generationId, flashcardId } = params;
    
    if (!generationId || !flashcardId) {
      return new Response(
        JSON.stringify({ error: "Missing required path parameters" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validationResult = FlashcardActionSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid action format",
          details: validationResult.error.format()
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract validated data
    const action = validationResult.data;
    
    // Handle different actions
    let result;
    switch (action.action) {
      case 'accept': {
        // Insert flashcard directly into database
        const { data: flashcard, error } = await supabase
          .from('flashcards')
          .insert({
            user_id: TEST_USER_ID,
            front: action.front,
            back: action.back,
            source: FlashcardSource.AI_FULL
          })
          .select()
          .single();
        
        if (error) {
          throw new Error(`Failed to save accepted flashcard: ${error.message}`);
        }
        
        result = { 
          status: 'accepted',
          message: 'Flashcard accepted and saved to database',
          flashcard
        };
        break;
      }
      
      case 'reject':
        // Just return success response for rejected flashcards
        result = { 
          status: 'rejected',
          message: 'Flashcard rejected successfully'
        };
        break;
      
      case 'edit': {
        // Insert edited flashcard into database
        const { data: flashcard, error } = await supabase
          .from('flashcards')
          .insert({
            user_id: TEST_USER_ID,
            front: action.front,
            back: action.back,
            source: FlashcardSource.AI_EDITED
          })
          .select()
          .single();
        
        if (error) {
          throw new Error(`Failed to save edited flashcard: ${error.message}`);
        }
        
        result = { 
          status: 'edited',
          message: 'Flashcard edited and saved to database',
          flashcard
        };
        break;
      }
    }
    
    // Return response
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error handling flashcard action:', error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to process flashcard action",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 