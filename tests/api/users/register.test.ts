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
    const request = createRequest({});
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty('error.email._errors');
    expect(json).toHaveProperty('error.password._errors');
  });

  it('returns 400 for invalid email format', async () => {
    const request = createRequest({ email: 'invalid', password: 'strongpass' });
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error.email._errors[0]).toBe('Nieprawidłowy format adresu email');
  });

  it('returns 400 for short password', async () => {
    const request = createRequest({ email: 'user@example.com', password: 'short' });
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error.password._errors[0]).toBe('Hasło musi zawierać co najmniej 8 znaków');
  });

  it('returns 409 when user already exists', async () => {
    mockSignUp.mockResolvedValue({ data: null, error: { message: 'already registered' } });
    const request = createRequest({ email: 'user@example.com', password: 'strongpass' });
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: 'User with this email already exists' });
  });

  it('returns 400 for other supabase errors', async () => {
    mockSignUp.mockResolvedValue({ data: null, error: { message: 'Unexpected error' } });
    const request = createRequest({ email: 'user@example.com', password: 'strongpass' });
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Unexpected error' });
  });

  it('returns 500 when no user is returned', async () => {
    mockSignUp.mockResolvedValue({ data: {}, error: null });
    const request = createRequest({ email: 'user@example.com', password: 'strongpass' });
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to create user' });
  });

  it('returns 201 and user data on success', async () => {
    const user = { id: '123', email: 'user@example.com', created_at: '2023-01-01T00:00:00Z' };
    mockSignUp.mockResolvedValue({ data: { user }, error: null });
    const request = createRequest({ email: 'user@example.com', password: 'strongpass' });
    const response = await POST({ request, locals: { supabase: mockSupabase } } as any);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(user);
  });

  it('returns 500 on unexpected exception', async () => {
    // Spy on console.error to suppress actual error logging and to verify it's called
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const badRequest = { json: () => { throw new Error('fail to parse'); } } as unknown as Request;
    const response = await POST({ request: badRequest, locals: { supabase: mockSupabase } } as any);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Internal server error' });
    expect(errorSpy).toHaveBeenCalledWith('Registration error:', expect.any(Error));
    errorSpy.mockRestore();
  });
}); 