import { z } from 'zod';
import type { RegisterUserDto, LoginRequestDto } from '@/types';

export const registerSchema = z.object({
  email: z.string()
    .min(1, 'Email jest wymagany')
    .email('Niepoprawny format adresu email'),
  password: z.string()
    .min(8, 'Hasło musi mieć co najmniej 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną dużą literę')
    .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
    .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać co najmniej jeden znak specjalny')
}) satisfies z.ZodType<RegisterUserDto>;

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email jest wymagany')
    .email('Niepoprawny format adresu email'),
  password: z.string().min(1, 'Hasło jest wymagane')
}) satisfies z.ZodType<LoginRequestDto>; 