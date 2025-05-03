import { describe, it, expect } from 'vitest';
import { loginSchema, validateLoginRequest } from '@/lib/schemas/login.schema';

// Unit tests for loginSchema (Zod) and validateLoginRequest helper
// covering key business rules and edge cases

describe('loginSchema', () => {
  it('should succeed for valid data', () => {
    // Given: valid login data with both email and password
    const data = { email: 'user@example.com', password: 'secret' };

    // When: parsing data with loginSchema.safeParse
    const result = loginSchema.safeParse(data);

    // Then: parsing should succeed and data should equal the input
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(data);
    }
  });

  it('should fail when email is missing', () => {
    // Given: login data missing the email field
    const data = { password: 'secret' };

    // When: parsing data with loginSchema.safeParse
    const result = loginSchema.safeParse(data);

    // Then: parsing should fail with 'Email jest wymagany' message on email
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'email');
      expect(issue).toBeDefined();
      expect(issue?.message).toBe('Email jest wymagany');
    }
  });

  it('should fail when email format is invalid', () => {
    // Given: login data with malformed email
    const data = { email: 'invalid-email', password: 'secret' };

    // When: parsing data with loginSchema.safeParse
    const result = loginSchema.safeParse(data);

    // Then: parsing should fail with 'Nieprawidłowy format adresu email'
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'email');
      expect(issue).toBeDefined();
      expect(issue?.message).toBe('Nieprawidłowy format adresu email');
    }
  });

  it('should fail when password is missing', () => {
    // Given: login data missing the password field
    const data = { email: 'user@example.com' };

    // When: parsing data with loginSchema.safeParse
    const result = loginSchema.safeParse(data);

    // Then: parsing should fail with 'Hasło jest wymagane' message on password
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'password');
      expect(issue).toBeDefined();
      expect(issue?.message).toBe('Hasło jest wymagane');
    }
  });

  it('should fail when password is empty string', () => {
    // Given: login data with empty password string
    const data = { email: 'user@example.com', password: '' };

    // When: parsing data with loginSchema.safeParse
    const result = loginSchema.safeParse(data);

    // Then: parsing should fail with 'Hasło jest wymagane' message on password
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
    // Given: invalid login data payload
    const invalid = { email: 'bad', password: '' };

    // When/Then: calling validateLoginRequest should throw a ZodError
    expect(() => validateLoginRequest(invalid)).toThrow();
  });

  it('should return parsed data when input is valid', () => {
    // Given: valid login data payload
    const input = { email: 'user@example.com', password: 'secret' };

    // When: calling validateLoginRequest
    const validated = validateLoginRequest(input);

    // Then: it should return the parsed data matching input
    expect(validated).toEqual(input);
  });
}); 