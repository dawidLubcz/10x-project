// @ts-check
import { defineConfig } from "astro/config";
import path from 'path';

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), sitemap()],
  server: { port: 3000 },
  vite: {
    envPrefix: ["SUPABASE_", "PUBLIC_", "OPENROUTER_"],
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  },
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: "cloudflare",
  }),
  experimental: { session: true },
});