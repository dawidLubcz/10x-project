import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { LoginRequestDto, LoginResponseDto, UserDto } from "../../types";

export class AuthService {
  private supabase: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabase = supabaseClient;
  }

  /**
   * Authenticates a user with email and password
   * @param loginData - Login credentials
   * @returns JWT token and user data
   * @throws Error on authentication failure
   */
  async login(loginData: LoginRequestDto): Promise<LoginResponseDto> {
    // Early return for validation errors (should be caught earlier)
    if (!loginData.email || !loginData.password) {
      throw new Error("Email i hasło są wymagane");
    }

    // Authenticate with Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    // Handle authentication errors
    if (error) {
      // Check specific error types and throw appropriate messages
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Nieprawidłowy email lub hasło");
      }
      
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Konto nie zostało potwierdzone. Sprawdź swój email");
      }
      
      // Generic error
      throw new Error(error.message);
    }

    // Ensure we have user data and session
    if (!data.user || !data.session) {
      throw new Error("Nie udało się zalogować. Spróbuj ponownie");
    }

    // Create user DTO
    const userDto: UserDto = {
      id: data.user.id,
      email: data.user.email || "",
      created_at: data.user.created_at,
    };

    // Return response DTO
    return {
      token: data.session.access_token,
      user: userDto,
    };
  }
}

/**
 * Creates an instance of AuthService with the provided Supabase client
 * @param supabaseClient - Supabase client instance
 * @returns AuthService instance
 */
export function createAuthService(supabaseClient: SupabaseClient<Database>): AuthService {
  return new AuthService(supabaseClient);
} 