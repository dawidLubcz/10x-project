import { describe, it, expect } from 'vitest';
import { loginSchema, validateLoginRequest } from '@/lib/schemas/login.schema';

// Unit tests for loginSchema (Zod) and validateLoginRequest helper
// covering key business rules and edge cases

describe('loginSchema', () => {
  it('should succeed for valid data', () => {
    const data = { email: 'user@example.com', password: 'secret' };
    const result = loginSchema.safeParse(data);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(data);
    }
  });

  it('should fail when email is missing', () => {
    const data = { password: 'secret' };
    const result = loginSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'email');
      expect(issue).toBeDefined();
      expect(issue?.message).toBe('Email jest wymagany');
    }
  });

  it('should fail when email format is invalid', () => {
    const data = { email: 'invalid-email', password: 'secret' };
    const result = loginSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'email');
      expect(issue).toBeDefined();
      expect(issue?.message).toBe('Nieprawidłowy format adresu email');
    }
  });

  it('should fail when password is missing', () => {
    const data = { email: 'user@example.com' };
    const result = loginSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'password');
      expect(issue).toBeDefined();
      expect(issue?.message).toBe('Hasło jest wymagane');
    }
  });

  it('should fail when password is empty string', () => {
    const data = { email: 'user@example.com', password: '' };
    const result = loginSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'password');
      expect(issue).toBeDefined();
      expect(issue?.message).toBe('Hasło jest wymagane');
    }
  });
});

describe('validateLoginRequest', () => {
  it('should throw when data is invalid', () => {
    expect(() => validateLoginRequest({ email: 'bad', password: '' })).toThrow();
  });

  it('should return parsed data when input is valid', () => {
    const input = { email: 'user@example.com', password: 'secret' };
    const validated = validateLoginRequest(input);

    expect(validated).toEqual(input);
  });
}); 