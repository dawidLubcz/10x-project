import type { SupabaseClient } from '@supabase/supabase-js';
import type { GeneratedFlashcardDto, GenerationResponseDto } from "../../types";
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
7. If the text is not related to flashcards, respond gently and create one flashcard with the message."
8. Respond in polish language.

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
  private defaultModel = 'qwen/qwen3-1.7b:free';

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
   * Logs an error to the generation_error_logs table
   * @param error - The error that occurred
   * @param userId - User ID who initiated the generation
   * @param inputText - Original input text
   * @param model - AI model used
   */
  private async logError(
    error: unknown,
    userId: string,
    inputText = '',
    model: string = this.defaultModel
  ): Promise<void> {
    try {
      // Generate hash only if inputText is provided
      const sourceTextHash = inputText ? await this.generateTextHash(inputText) : '';
      
      // Create error log entry
      const errorLog = {
        user_id: userId,
        error_code: error instanceof Error ? error.name : "UNKNOWN_ERROR",
        error_message: error instanceof Error ? error.message : String(error),
        source_text_hash: sourceTextHash,
        source_text_length: inputText ? inputText.length : 0,
        model: model
      };
      
      // Insert into generation_error_logs
      await this.supabaseClient
        .from("generation_error_logs")
        .insert(errorLog);
        
      console.error("Error logged to database:", errorLog.error_code, errorLog.error_message);
    } catch (logError) {
      console.error("Failed to log error to database:", logError);
    }
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
    let model = this.defaultModel;
    
    try {
      console.log("Starting flashcard generation for user:", userId);
      
      // Validate user ID
      if (!userId) {
        const error = new Error("User ID is required for flashcard generation");
        error.name = "MISSING_USER_ID";
        throw error;
      }
      
      // Ensure input text meets minimum length requirement (for database constraint)
      const MIN_TEXT_LENGTH = 1000;
      if (!inputText) {
        const error = new Error("Input text is required for flashcard generation");
        error.name = "MISSING_INPUT_TEXT";
        throw error;
      }
      
      if (inputText.length < MIN_TEXT_LENGTH) {
        const error = new Error(`Input text must be at least ${MIN_TEXT_LENGTH} characters long (currently ${inputText.length} characters)`);
        error.name = "INPUT_TOO_SHORT";
        throw error;
      }
      
      // Generate hash of input text
      const sourceTextHash = await this.generateTextHash(inputText);
      console.log("Generated hash:", sourceTextHash);
      
      // Call AI to generate flashcards
      try {
        const aiResponse = await this.callAIForFlashcards(inputText);
        const generatedFlashcards = aiResponse.flashcards;
        model = aiResponse.model || this.defaultModel;
        
        console.log("Generated flashcards count:", generatedFlashcards.length);
        console.log("Using model:", model);
        
        // Save generation data to the database
        const { data: generationData, error: generationError } = await this.supabaseClient
          .from("generations")
          .insert({
            user_id: userId,
            source_text_hash: sourceTextHash,
            source_text_length: inputText.length,
            model: model,
            generated_count: generatedFlashcards.length,
            accepted_edited_count: 0,
            accepted_unedited_count: 0
          })
          .select()
          .single();
        
        if (generationError) {
          console.error("Error saving generation data:", generationError);
          const error = new Error(`Failed to save generation data: ${generationError.message}`);
          error.name = "DATABASE_ERROR";
          throw error;
        }
        
        // Map flashcards with generation ID but DON'T save them to the database yet
        // They will be saved individually when accepted by the user
        const flashcardsWithGenerationId = generatedFlashcards.map(card => ({
          front: card.front,
          back: card.back,
          source: card.source,
          user_id: userId,
          generation_id: generationData.id
        })) as GeneratedFlashcardDto[];
        
        return {
          generation_id: generationData.id,
          flashcards: flashcardsWithGenerationId
        };
      } catch (aiError) {
        // Handle AI-specific errors separately
        console.error("Error in AI generation:", aiError);
        const error = aiError instanceof Error ? aiError : new Error(String(aiError));
        error.name = aiError instanceof Error ? aiError.name || "AI_GENERATION_ERROR" : "AI_GENERATION_ERROR";
        throw error;
      }
    } catch (error) {
      console.error("Error in generateFlashcards:", error);
      
      // Log error to the database
      await this.logError(error, userId, inputText, model);
      
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
  private async callAIForFlashcards(inputText: string): Promise<{flashcards: GeneratedFlashcardDto[], model: string}> {
    try {
      console.log('Calling OpenRouter with input:', inputText);
      
      if (!this.openRouter) {
        const error = new Error('OpenRouter service not initialized');
        error.name = "SERVICE_NOT_INITIALIZED";
        throw error;
      }
      
      // Make API call to OpenRouter
      let response;
      try {
        response = await this.openRouter.sendChat(
          [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: inputText }
          ],
          {
            responseFormat: FLASHCARDS_RESPONSE_FORMAT
          }
        );
      } catch (apiError) {
        // Handle API specific errors
        const error = new Error(`OpenRouter API error: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
        error.name = "OPENROUTER_API_ERROR";
        throw error;
      }

      console.log('OpenRouter response:', JSON.stringify(response, null, 2));

      // Validate response structure
      if (!response) {
        const error = new Error('Empty response from OpenRouter API');
        error.name = "EMPTY_API_RESPONSE";
        throw error;
      }

      if (!response.structured) {
        const error = new Error('Missing structured data in AI response');
        error.name = "INVALID_RESPONSE_FORMAT";
        throw error;
      }

      // Cast structured data to expected format
      const structured = response.structured as { flashcards: GeneratedFlashcardDto[] };
      if (!structured.flashcards || !Array.isArray(structured.flashcards)) {
        const error = new Error('Invalid or missing flashcards array in AI response');
        error.name = "MISSING_FLASHCARDS";
        throw error;
      }

      if (structured.flashcards.length === 0) {
        const error = new Error('AI generated empty flashcards list');
        error.name = "EMPTY_FLASHCARDS";
        throw error;
      }

      // Validate each flashcard
      for (const card of structured.flashcards) {
        if (!card.front || !card.back) {
          const error = new Error('Flashcard missing required fields (front or back)');
          error.name = "INVALID_FLASHCARD_FORMAT";
          throw error;
        }
      }

      // Transform the structured response into our DTO format
      const flashcards = structured.flashcards.map((card: { front: string; back: string }) => ({
        front: card.front,
        back: card.back,
        source: FlashcardSource.AI_FULL as const
      }));
      
      return {
        flashcards,
        model: response.model || this.defaultModel
      };
    } catch (error) {
      console.error("Error calling AI service:", error);
      // Error will be propagated up to be logged in generateFlashcards
      throw error;
    }
  }

  /**
   * Generates a hash of input text using Web Crypto API
   * @param text - Text to hash
   * @returns Hash of text
   */
  private async generateTextHash(text: string): Promise<string> {
    // Use TextEncoder to convert string to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    // Use Web Crypto API to create MD5-like hash (using SHA-256 as MD5 isn't available)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // Return first 32 chars to maintain similar length to MD5
    return hashHex.substring(0, 32);
  }
} 