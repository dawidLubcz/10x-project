import { z } from "zod";
import type { LoginRequestDto } from "../../types";

/**
 * Schema for validating login requests
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email jest wymagany" })
    .email("Nieprawidłowy format adresu email"),
  password: z
    .string({ required_error: "Hasło jest wymagane" })
    .min(1, "Hasło jest wymagane"),
});

/**
 * Type for validated login data
 */
export type ValidatedLoginData = z.infer<typeof loginSchema>;

/**
 * Validates login request data against the schema
 * @param data - The data to validate
 * @returns Validated data if valid
 * @throws ZodError if validation fails
 */
export function validateLoginRequest(data: unknown): ValidatedLoginData {
  return loginSchema.parse(data);
} 