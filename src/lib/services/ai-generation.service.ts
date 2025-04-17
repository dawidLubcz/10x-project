import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { 
  GeneratedFlashcardDto, 
  GenerationResponseDto,
  GenerationErrorLogDto
} from "../../types";
import { FlashcardSource } from "../../types";
import type { Database } from "../../db/database.types";

/**
 * Service for handling AI-powered flashcard generation
 */
export class AIGenerationService {
  constructor(private supabaseClient: SupabaseClient<Database>) {}

  /**
   * Generates flashcards from input text using AI
   * @param inputText - Text to generate flashcards from
   * @param userId - ID of the user requesting generation
   * @returns Generated flashcards with generation ID
   */
  async generateFlashcards(
    inputText: string,
    userId: string
  ): Promise<GenerationResponseDto> {
    try {
      console.log("Starting flashcard generation for user:", userId);
      
      // Generate hash of input text
      const sourceTextHash = this.generateTextHash(inputText);
      console.log("Generated hash:", sourceTextHash);
      
      // Call AI to generate flashcards
      const generatedFlashcards = await this.callAIForFlashcards(inputText);
      console.log("Generated flashcards count:", generatedFlashcards.length);
      
      // For testing purposes, return mock data without database operations
      console.log("Returning mock data for testing purposes");
      
      // Return mock generation ID and generated flashcards
      return {
        generation_id: 999, // Mock ID for testing
        flashcards: generatedFlashcards
      };
    } catch (error) {
      // Log error
      console.error("Error in generateFlashcards:", error);
      // Skip logging to database
      throw error;
    }
  }

  /**
   * Calls AI service to generate flashcards from input text
   * @param inputText - Text to generate flashcards from 
   * @returns Array of generated flashcards
   */
  private async callAIForFlashcards(inputText: string): Promise<GeneratedFlashcardDto[]> {
    try {
      // TODO: Implement actual call to OpenRouter.ai or other AI service
      console.log("Calling AI service with input text:", inputText);
      
      // For now, return mock data
      return [
        {
          front: "Example front side 1",
          back: "Example back side 1",
          source: FlashcardSource.AI_FULL
        },
        {
          front: "Example front side 2",
          back: "Example back side 2",
          source: FlashcardSource.AI_FULL
        }
      ];
    } catch (error) {
      console.error("Error calling AI service:", error);
      throw new Error("Failed to generate flashcards with AI");
    }
  }

  /**
   * Generates MD5 hash of input text
   * @param text - Text to hash
   * @returns Hash of text
   */
  private generateTextHash(text: string): string {
    return crypto
      .createHash('md5')
      .update(text)
      .digest('hex');
  }
} 