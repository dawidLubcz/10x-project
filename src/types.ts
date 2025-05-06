/**
 * DTO and Command Models for 10xProject API
 */

import type { Database } from "./db/database.types";

/**********************
 * Entity Base Types
 **********************/

/** Base Flashcard type from DB */
export type FlashcardEntity = Database["public"]["Tables"]["flashcards"]["Row"];

/** Base Generation type from DB */
export type GenerationEntity = Database["public"]["Tables"]["generations"]["Row"];

/** Base Generation Error Log type from DB */
export type GenerationErrorLogEntity = Database["public"]["Tables"]["generation_error_logs"]["Row"];

/**********************
 * User DTOs
 **********************/

/** Request DTO for user registration */
export interface RegisterUserDto {
  email: string;
  password: string;
}

/** Response DTO for user information */
export interface UserDto {
  id: string;
  email: string;
  created_at: string;
}

/** Request DTO for user login */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/** Response DTO for successful login */
export interface LoginResponseDto {
  token: string;
  user: UserDto;
}

/**********************
 * Flashcard DTOs
 **********************/

/** Enumeration of possible flashcard sources */
export enum FlashcardSource {
  MANUAL = "manual",
  AI_FULL = "ai-full",
  AI_EDITED = "ai-edited"
}

/** Request DTO for manual flashcard creation */
export interface CreateFlashcardDto {
  front: string; // max 200 characters
  back: string; // max 500 characters
  source: FlashcardSource.MANUAL;
}

/** Response DTO for a flashcard */
export type FlashcardDto = Pick<
  FlashcardEntity, 
  "id" | "front" | "back" | "user_id" | "created_at" | "updated_at"
>;

/** Request DTO for updating a flashcard */
export interface UpdateFlashcardDto {
  front?: string; // max 200 characters
  back?: string; // max 500 characters
}

/** Pagination information for list responses */
export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}

/** Response DTO for flashcard listings */
export interface FlashcardListResponseDto {
  flashcards: FlashcardDto[];
  pagination: PaginationDto;
}

/**********************
 * Generation DTOs
 **********************/

/** Request DTO to initiate flashcard generation */
export interface InitiateGenerationDto {
  input_text: string; // max 10000 characters
}

/** DTO for an AI-generated flashcard before saving */
export interface GeneratedFlashcardDto {
  front: string; // max 1000 characters
  back: string; // max 1000 characters
  source: FlashcardSource.AI_FULL | FlashcardSource.AI_EDITED;
}

/** Response DTO for flashcard generation */
export interface GenerationResponseDto {
  generation_id: number;
  flashcards: GeneratedFlashcardDto[];
}

/** Enum for actions on generated flashcards */
export enum GeneratedFlashcardAction {
  ACCEPT = "accept",
  REJECT = "reject",
  EDIT = "edit"
}

/** Request DTO for updating a generated flashcard */
export interface UpdateGeneratedFlashcardDto {
  action: GeneratedFlashcardAction;
  front?: string; // Required for edit action
  back?: string; // Required for edit action
}

/**********************
 * Error Logging DTOs
 **********************/

/** Request DTO for logging generation errors */
export interface GenerationErrorLogDto {
  user_id: string;
  model: string;
  source_text_hash: string;
  source_text_length: number;
  error_code: string;
  error_message: string | null;
}

/** Response DTO for error log confirmation */
export interface ErrorLogResponseDto {
  id: number;
  created_at: string;
}

/**********************
 * Query Parameters
 **********************/

/** Query parameters for flashcard listings */
export interface FlashcardQueryParams {
  page?: number;
  limit?: number;
  sort_by?: keyof FlashcardEntity;
  filter?: {
    source?: FlashcardSource;
  };
} 