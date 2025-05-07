// @ts-check
import { defineConfig } from "astro/config";
import path from "path";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  integrations: [react(), sitemap()],

  server: { port: 3000 },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // --- FIX ↓ ---------------------------------------------------------
        "react-dom/server": "react-dom/server.edge",
        // -------------------------------------------------------------------
        "@": path.resolve("./src")
      }
    }
  },

  adapter: cloudflare(),

  experimental: { session: true }   // pamiętaj o KV "SESSION" w wrangler.toml
});