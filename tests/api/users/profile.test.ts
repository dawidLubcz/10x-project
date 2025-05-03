// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/pages/api/users/profile';

// Helper: build minimal APIContext for handler
function buildContext(headers: Record<string, string>, supabaseClient: any) {
  return {
    request: new Request('http://localhost/api/users/profile', { headers }),
    locals: { supabase: supabaseClient }
  } as any;
}

describe('GET /api/users/profile', () => {
  let mockGetUser: ReturnType<typeof vi.fn>;
  let mockGetSession: ReturnType<typeof vi.fn>;
  let supabase: any;

  beforeEach(() => {
    mockGetUser = vi.fn();
    mockGetSession = vi.fn();
    supabase = { auth: { getUser: mockGetUser, getSession: mockGetSession } };
  });

  it('returns 401 when no token header and session has no user', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const context = buildContext({}, supabase);
    const res = await GET(context);

    expect(mockGetSession).toHaveBeenCalled();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: 'Unauthorized', message: 'Wymagane uwierzytelnienie' });
  });

  it('returns 200 and user data when valid Authorization header token', async () => {
    const user = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com', created_at: '2023-01-01T00:00:00.000Z' };
    mockGetUser.mockResolvedValue({ data: { user } });
    const context = buildContext({ Authorization: 'Bearer headerToken' }, supabase);
    const res = await GET(context);

    expect(mockGetUser).toHaveBeenCalledWith('headerToken');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(user);
  });

  it('returns 200 and user data when valid auth_token cookie', async () => {
    const user = { id: '550e8400-e29b-41d4-a716-446655440001', email: 'cookietest@example.com', created_at: '2023-02-02T12:00:00.000Z' };
    mockGetUser.mockResolvedValue({ data: { user } });
    const context = buildContext({ Cookie: 'foo=bar; auth_token=cookieToken; other=baz' }, supabase);
    const res = await GET(context);

    expect(mockGetUser).toHaveBeenCalledWith('cookieToken');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(user);
  });

  it('returns 500 when user response fails schema validation', async () => {
    const invalidUser = { id: 'not-uuid', email: 'bad-email', created_at: 'not-a-datetime' };
    mockGetUser.mockResolvedValue({ data: { user: invalidUser } });
    const context = buildContext({ Authorization: 'Bearer headerToken' }, supabase);
    const res = await GET(context);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: 'Internal Server Error', message: 'Błąd podczas przetwarzania danych użytkownika' });
  });
}); 