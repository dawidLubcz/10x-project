import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get environment variables from either Cloudflare or Astro
function getEnv(name: string): string | undefined {
  // Check for Cloudflare environment
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  // Check for Astro environment
  if (import.meta.env && import.meta.env[name]) {
    return import.meta.env[name];
  }
  return undefined;
}

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_KEY');

if (!supabaseUrl) {
  throw new Error("Missing Supabase environment variable SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing Supabase environment variable SUPABASE_KEY");
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);