import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/pages/api/users/register';

// Helper to create a mock Request with JSON body
function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/users/register', () => {
  let mockSignUp: ReturnType<typeof vi.fn>;
  let mockSupabase: any;

  beforeEach(() => {
    mockSignUp = vi.fn();
    mockSupabase = {
      auth: { signUp: mockSignUp }
    } as any;
  });

  it('returns 400 for missing fields', async () => {
    // Given: an empty request body (missing email and password)
    const request = createRequest({});

    // When: invoking the register endpoint handler
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);

    // Then: it should respond with 400 and include required field errors for email and password
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toHaveProperty('error.email._errors');
    expect(json).toHaveProperty('error.password._errors');
  });

  it('returns 400 for invalid email format', async () => {
    // Given: a request body with invalid email format
    const request = createRequest({ email: 'invalid', password: 'strongpass' });

    // When: invoking the register endpoint handler
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);

    // Then: it should respond with 400 and indicate invalid email format
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error.email._errors[0]).toBe('Nieprawidłowy format adresu email');
  });

  it('returns 400 for short password', async () => {
    // Given: a request body with a password shorter than minimum length
    const request = createRequest({ email: 'user@example.com', password: 'short' });

    // When: invoking the register endpoint handler
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);

    // Then: it should respond with 400 and indicate password length requirement
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error.password._errors[0]).toBe('Hasło musi zawierać co najmniej 8 znaków');
  });

  it('returns 409 when user already exists', async () => {
    // Given: Supabase signUp returns an "already registered" error
    mockSignUp.mockResolvedValue({ data: null, error: { message: 'already registered' } });
    const request = createRequest({ email: 'user@example.com', password: 'strongpass' });

    // When: invoking the register endpoint handler with existing user credentials
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);

    // Then: it should respond with 409 and a conflict error message
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: 'User with this email already exists' });
  });

  it('returns 400 for other supabase errors', async () => {
    // Given: Supabase signUp returns a generic error
    mockSignUp.mockResolvedValue({ data: null, error: { message: 'Unexpected error' } });
    const request = createRequest({ email: 'user@example.com', password: 'strongpass' });

    // When: invoking the register endpoint handler
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);

    // Then: it should respond with 400 and propagate the error message
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Unexpected error' });
  });

  it('returns 500 when no user is returned', async () => {
    // Given: Supabase signUp returns no authError and empty data
    mockSignUp.mockResolvedValue({ data: {}, error: null });
    const request = createRequest({ email: 'user@example.com', password: 'strongpass' });

    // When: invoking the register endpoint handler
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);

    // Then: it should respond with 500 and a creation failure message
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to create user' });
  });

  it('returns 201 and user data on success', async () => {
    // Given: Supabase signUp successfully returns a new user object
    const user = { id: '123', email: 'user@example.com', created_at: '2023-01-01T00:00:00Z' };
    mockSignUp.mockResolvedValue({ data: { user }, error: null });
    const request = createRequest({ email: 'user@example.com', password: 'strongpass' });

    // When: invoking the register endpoint handler
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);

    // Then: it should respond with 201 and return the user data
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(user);
  });

  it('returns 500 on unexpected exception', async () => {
    // Given: the handler throws an unexpected exception during parsing
    // Spy on console.error to suppress actual error logging and to verify it's called
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const badRequest = { json: () => { throw new Error('fail to parse'); } } as unknown as Request;

    // When: invoking the register endpoint handler
    const response = await POST({ request: badRequest, locals: { supabase: mockSupabase } } as any);

    // Then: it should respond with 500 and return a generic error message, and log the error
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Internal server error' });
    expect(errorSpy).toHaveBeenCalledWith('Registration error:', expect.any(Error));
    errorSpy.mockRestore();
  });
}); 