import { z } from "zod";
import { 
  FlashcardSource, 
  GeneratedFlashcardAction 
} from "../../types";

/**
 * Schema for validating flashcard generation request
 */
export const initiateGenerationSchema = z.object({
  input_text: z.string()
    .trim()
    .min(1, "Input text must be at least 1000 characters")
    .max(10000, "Input text must be 10000 characters or less")
});

/**
 * Schema for a generated flashcard
 */
export const generatedFlashcardSchema = z.object({
  front: z.string()
    .trim()
    .min(1, "Front side is required")
    .max(1000, "Front side must be 1000 characters or less"),
  back: z.string()
    .trim()
    .min(1, "Back side is required")
    .max(1000, "Back side must be 1000 characters or less"),
  source: z.enum([FlashcardSource.AI_FULL, FlashcardSource.AI_EDITED])
});

/**
 * Schema for validating generated flashcard actions
 */
export const updateGeneratedFlashcardSchema = z.object({
  action: z.nativeEnum(GeneratedFlashcardAction),
  front: z.string()
    .trim()
    .min(1, "Front side is required")
    .max(1000, "Front side must be 1000 characters or less")
    .optional(),
  back: z.string()
    .trim()
    .min(1, "Back side is required")
    .max(1000, "Back side must be 1000 characters or less")
    .optional()
}).refine(data => {
  // If action is EDIT, both front and back are required
  if (data.action === GeneratedFlashcardAction.EDIT) {
    return data.front !== undefined && data.back !== undefined;
  }
  return true;
}, {
  message: "Front and back sides are required when editing a flashcard",
  path: ["action"]
});

/**
 * Type for validated generation request
 */
export type ValidatedInitiateGenerationDto = z.infer<typeof initiateGenerationSchema>;

/**
 * Type for validated generated flashcard
 */
export type ValidatedGeneratedFlashcardDto = z.infer<typeof generatedFlashcardSchema>;

/**
 * Type for validated update request
 */
export type ValidatedUpdateGeneratedFlashcardDto = z.infer<typeof updateGeneratedFlashcardSchema>; 