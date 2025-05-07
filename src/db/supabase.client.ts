import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get environment variables from Cloudflare Pages or Astro
function getEnv(name: string): string | undefined {
  // Check for variants of environment variable names
  const variants = [
    name,
    `VITE_${name}`,
    `PUBLIC_${name}`,
    `ASTRO_${name}`,
    `ASTRO_PUBLIC_${name}`
  ];
  
  // Try each variant with both process.env and import.meta.env
  for (const variant of variants) {
    // Cloudflare Pages environment
    if (typeof process !== 'undefined' && process.env && process.env[variant]) {
      return process.env[variant];
    }
    // Astro environment
    if (import.meta.env && import.meta.env[variant]) {
      return import.meta.env[variant];
    }
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