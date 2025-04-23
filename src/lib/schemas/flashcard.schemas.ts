import { z } from "zod";
import { FlashcardSource } from "../../types";

/**
 * Schemat walidacji dla tworzenia fiszki manualnie
 */
export const createFlashcardSchema = z.object({
  front: z.string().max(200, "Front nie może przekraczać 200 znaków"),
  back: z.string().max(500, "Back nie może przekraczać 500 znaków"),
  source: z.literal(FlashcardSource.MANUAL)
});

/**
 * Schemat walidacji dla parametrów zapytania przy pobieraniu fiszek
 */
export const flashcardQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().max(100).optional().default(20),
  sort_by: z.enum(["id", "front", "back", "created_at", "updated_at"]).optional().default("created_at"),
  filter: z.object({
    source: z.enum([
      FlashcardSource.MANUAL,
      FlashcardSource.AI_FULL,
      FlashcardSource.AI_EDITED
    ]).optional()
  }).optional()
});

/**
 * Schemat walidacji dla ID fiszki
 */
export const flashcardIdSchema = z.coerce.number().int().positive();

/**
 * Schemat walidacji dla aktualizacji fiszki
 */
export const updateFlashcardSchema = z.object({
  front: z.string().max(200, "Front nie może przekraczać 200 znaków").optional(),
  back: z.string().max(500, "Back nie może przekraczać 500 znaków").optional()
}).refine(data => data.front !== undefined || data.back !== undefined, {
  message: "Musisz podać przynajmniej jedno pole do aktualizacji (front lub back)"
});

export type CreateFlashcardSchemaType = z.infer<typeof createFlashcardSchema>;
export type FlashcardQuerySchemaType = z.infer<typeof flashcardQuerySchema>;
export type UpdateFlashcardSchemaType = z.infer<typeof updateFlashcardSchema>; 