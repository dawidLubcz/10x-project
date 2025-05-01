import type { UserDto } from "../../types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";

export class UserService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getUserProfile(userId: string): Promise<UserDto | null> {
    if (!userId) {
      return null;
    }

    const { data, error } = await this.supabase
      .from("users")
      .select("id, email, created_at")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      created_at: data.created_at
    };
  }
} 