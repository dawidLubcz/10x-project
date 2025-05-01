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
    
    // Convert generationId to number
    const numericGenerationId = parseInt(generationId, 10);
    if (isNaN(numericGenerationId)) {
      return new Response(
        JSON.stringify({ error: "Invalid generation ID format" }),
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
        // First, get the current generation data
        const { data: generation, error: getError } = await supabase
          .from('generations')
          .select('accepted_unedited_count')
          .eq('id', numericGenerationId)
          .single();
          
        if (getError) {
          console.error('Error getting generation data:', getError);
          // Continue with flashcard creation even if counter update might fail
        }
        
        // Insert flashcard directly into database
        const { data: flashcard, error } = await supabase
          .from('flashcards')
          .insert({
            user_id: TEST_USER_ID,
            front: action.front,
            back: action.back,
            source: FlashcardSource.AI_FULL,
            generation_id: numericGenerationId
          })
          .select()
          .single();
        
        if (error) {
          throw new Error(`Failed to save accepted flashcard: ${error.message}`);
        }
        
        // Update the generation counter if we got the current value
        if (generation) {
          const newCount = generation.accepted_unedited_count + 1;
          const { error: updateError } = await supabase
            .from('generations')
            .update({ accepted_unedited_count: newCount })
            .eq('id', numericGenerationId);
            
          if (updateError) {
            console.error('Failed to update generation counter:', updateError);
            // Don't throw here to avoid breaking the flashcard save
          }
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
        // First, get the current generation data
        const { data: generation, error: getError } = await supabase
          .from('generations')
          .select('accepted_edited_count, accepted_unedited_count')
          .eq('id', numericGenerationId)
          .single();
          
        if (getError) {
          console.error('Error getting generation data:', getError);
          // Continue with flashcard creation even if counter update might fail
        }
        
        // Insert edited flashcard into database
        const { data: flashcard, error } = await supabase
          .from('flashcards')
          .insert({
            user_id: TEST_USER_ID,
            front: action.front,
            back: action.back,
            source: FlashcardSource.AI_EDITED,
            generation_id: numericGenerationId
          })
          .select()
          .single();
        
        if (error) {
          throw new Error(`Failed to save edited flashcard: ${error.message}`);
        }
        
        // Update the generation counters if we got the current values
        if (generation) {
          // Increment edited count, but decrease unedited count if it was previously accepted
          // This prevents double-counting when a card is both accepted and then edited
          const newEditedCount = generation.accepted_edited_count + 1;
          
          // We need to update both counters in one operation
          const updateData: Record<string, number> = {
            accepted_edited_count: newEditedCount
          };
          
          // Check if the card exists in the flashcards table with AI_FULL source
          // If so, we need to decrement the unedited count to avoid double counting
          const { data: existingFlashcard } = await supabase
            .from('flashcards')
            .select('id')
            .eq('generation_id', numericGenerationId)
            .eq('user_id', TEST_USER_ID)
            .eq('front', action.front)
            .eq('source', FlashcardSource.AI_FULL)
            .maybeSingle();
            
          if (existingFlashcard) {
            // This card was previously accepted as unedited, so decrement that counter
            updateData.accepted_unedited_count = Math.max(0, generation.accepted_unedited_count - 1);
          }
          
          const { error: updateError } = await supabase
            .from('generations')
            .update(updateData)
            .eq('id', numericGenerationId);
            
          if (updateError) {
            console.error('Failed to update generation counters:', updateError);
            // Don't throw here to avoid breaking the flashcard save
          }
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