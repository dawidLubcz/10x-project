// @vitest-environment node
// Use Node environment for API tests to avoid JSDOM TextEncoder bug
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/pages/api/users/login';
import { createAuthService } from '@/lib/services/auth.service';
import type { APIContext } from 'astro';
import type { LoginResponseDto } from '@/types';

// Mock the auth service factory
vi.mock('@/lib/services/auth.service', () => ({
  createAuthService: vi.fn()
}));

// Helper: build minimal APIContext for handler
function buildContext(request: any, supabaseClient?: any): APIContext {
  return {
    request,
    locals: { supabase: supabaseClient },
    // other context props not used by POST
  } as unknown as APIContext;
}

// Helper: create a fake Request with JSON body
function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

describe('POST /api/users/login', () => {
  let mockLogin: ReturnType<typeof vi.fn>;
  const fakeSupabase = {};

  beforeEach(() => {
    mockLogin = vi.fn();
    // stub createAuthService to return object with login
    (createAuthService as any).mockReturnValue({ login: mockLogin });
  });

  it('returns 500 when supabase client is missing', async () => {
    // Given: valid login credentials but no Supabase client
    const req = makeRequest({ email: 'a@b.com', password: 'pass123' });

    // When: calling the login endpoint handler
    const res = await POST(buildContext(req, undefined));

    // Then: it should respond with 500 and a server connection error message
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: 'Błąd serwera: brak połączenia z bazą danych' });
  });

  it('returns 400 when request JSON is invalid', async () => {
    // Given: a request that throws an error during JSON parsing
    const badReq = { json: () => { throw new Error('bad'); } } as any;

    // When: calling the login endpoint handler
    const res = await POST(buildContext(badReq, fakeSupabase));

    // Then: it should respond with 400 and an invalid input message
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ message: 'Nieprawidłowe dane wejściowe' });
  });

  it('returns 400 on validation error (missing fields)', async () => {
    // Given: a request missing email and password fields
    const req = makeRequest({});

    // When: calling the login endpoint handler
    const res = await POST(buildContext(req, fakeSupabase));

    // Then: it should respond with 400 and include validation errors
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty('message', 'Błąd walidacji danych');
    expect(Array.isArray(json.errors)).toBe(true);
    const paths = json.errors.map((e: any) => e.path);
    expect(paths).toContain('email');
    expect(paths).toContain('password');
  });

  it('returns 200 and payload on successful login', async () => {
    // Given: valid credentials and AuthService returns a login result
    const result: LoginResponseDto = { token: 'tk', user: { id: '1', email: 'a@b.com', created_at: '2023-01-01T00:00:00Z' } };
    mockLogin.mockResolvedValue(result);
    const req = makeRequest({ email: 'a@b.com', password: 'pass123' });

    // When: calling the login endpoint handler
    const res = await POST(buildContext(req, fakeSupabase));

    // Then: it should respond with 200 and return the LoginResponseDto
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(result);
  });

  it('returns 401 on invalid credentials error', async () => {
    // Given: AuthService rejects with invalid credentials message
    mockLogin.mockRejectedValue(new Error('Nieprawidłowy email lub hasło'));
    const req = makeRequest({ email: 'a@b.com', password: 'wrong' });

    // When: calling the login endpoint handler
    const res = await POST(buildContext(req, fakeSupabase));

    // Then: it should respond with 401 and the invalid credentials message
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: 'Nieprawidłowy email lub hasło' });
  });

  it('returns 401 on unconfirmed account', async () => {
    // Given: AuthService rejects with unconfirmed account error
    mockLogin.mockRejectedValue(new Error('Konto nie zostało potwierdzone. Sprawdź swój email'));
    const req = makeRequest({ email: 'a@b.com', password: 'pass123' });

    // When: calling the login endpoint handler
    const res = await POST(buildContext(req, fakeSupabase));

    // Then: it should respond with 401 and the unconfirmed account message
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ message: 'Konto nie zostało potwierdzone. Sprawdź swój email' });
  });

  it('returns 500 on other auth errors', async () => {
    // Given: AuthService rejects with a generic error
    mockLogin.mockRejectedValue(new Error('Service down'));
    const req = makeRequest({ email: 'a@b.com', password: 'pass123' });

    // When: calling the login endpoint handler
    const res = await POST(buildContext(req, fakeSupabase));

    // Then: it should respond with 500 and the error message
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: 'Service down' });
  });

  it('returns 500 on unexpected exception', async () => {
    // Given: createAuthService throws an unexpected exception
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (createAuthService as any).mockImplementation(() => { throw new Error('fail'); });
    const req = makeRequest({ email: 'a@b.com', password: 'pass123' });

    // When: calling the login endpoint handler
    const res = await POST(buildContext(req, fakeSupabase));

    // Then: it should respond with 500, log the error, and return a generic error message
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ message: 'Wystąpił nieoczekiwany błąd' });
    expect(errorSpy).toHaveBeenCalledWith('Unexpected error during login:', expect.any(Error));
    errorSpy.mockRestore();
  });
}); 