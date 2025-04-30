import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { 
  GeneratedFlashcardDto, 
  GenerationResponseDto,
  GenerationErrorLogDto
} from "../../types";
import { FlashcardSource } from "../../types";
import type { Database } from "../../db/database.types";
import { OpenRouterService, type ResponseFormat } from '../openrouter.service';

const FLASHCARDS_RESPONSE_FORMAT: ResponseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'flashcards',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        flashcards: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              front: { type: 'string' },
              back: { type: 'string' }
            },
            required: ['front', 'back']
          },
          minItems: 1
        }
      },
      required: ['flashcards']
    }
  }
};

const SYSTEM_PROMPT = `You are an expert at creating educational flashcards. Your task is to analyze the provided text and create a set of high-quality flashcards that will help users learn the material effectively.

Guidelines for creating flashcards:
1. Each flashcard should focus on a single concept, fact, or relationship
2. Front side should pose a clear question or present a key term
3. Back side should provide a concise but complete answer or explanation
4. Avoid creating cards that are too complex or contain multiple concepts
5. Use clear, simple language
6. Create between 5-10 flashcards depending on the content

IMPORTANT: You must respond with a valid JSON object containing an array of flashcards. Each flashcard must have 'front' and 'back' properties. Example format:

{
  "flashcards": [
    {
      "front": "What is the capital of France?",
      "back": "Paris"
    }
  ]
}

DO NOT include any additional text or explanation in your response, ONLY the JSON object.`;

/**
 * Service for handling AI-powered flashcard generation
 */
export class AIGenerationService {
  private openRouter: OpenRouterService;

  constructor(
    private supabaseClient: SupabaseClient<Database>,
    openRouterApiKey: string
  ) {
    this.openRouter = new OpenRouterService({ 
      apiKey: openRouterApiKey,
      defaultParams: {
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }
    });
  }

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
      
      // TODO: Add database operations for production
      
      return {
        generation_id: Date.now(), // Temporary ID until DB integration
        flashcards: generatedFlashcards
      };
    } catch (error) {
      console.error("Error in generateFlashcards:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate flashcards: ${error.message}`);
      }
      throw new Error('Failed to generate flashcards: Unknown error');
    }
  }

  /**
   * Calls AI service to generate flashcards from input text
   * @param inputText - Text to generate flashcards from 
   * @returns Array of generated flashcards
   */
  private async callAIForFlashcards(inputText: string): Promise<GeneratedFlashcardDto[]> {
    try {
      console.log('Calling OpenRouter with input:', inputText);
      
      const response = await this.openRouter.sendChat(
        [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: inputText }
        ],
        {
          responseFormat: FLASHCARDS_RESPONSE_FORMAT
        }
      );

      console.log('OpenRouter response:', JSON.stringify(response, null, 2));

      if (!response.structured?.flashcards || !Array.isArray(response.structured.flashcards)) {
        throw new Error('Invalid response format from AI');
      }

      // Transform the structured response into our DTO format
      return response.structured.flashcards.map((card: { front: string; back: string }) => ({
        front: card.front,
        back: card.back,
        source: FlashcardSource.AI_FULL
      }));
    } catch (error) {
      console.error("Error calling AI service:", error);
      throw error;
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