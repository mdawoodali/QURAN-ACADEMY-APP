import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["**/node_modules/**", "**/.next/**"],
    env: {
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://yqtkgobvfpphwrfwarls.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdGtnb2J2ZnBwaHdyZndhcmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzOTQxMzYsImV4cCI6MjEwNjk3MDEzNn0.UEdDRFOuivxAqT2vhf3SuU3LINfOyhNLWX8fx_ARK_E",
      SUPABASE_SERVICE_ROLE_KEY:
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdGtnb2J2ZnBwaHdyZndhcmxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM5NDEzNiwiZXhwIjoyMTA2OTcwMTM2fQ.MwxHQBB-wRc3ktnHs36MFuPa1ePIBfagK3ad8_FQhhM",
      DEEPGRAM_API_KEY:
        process.env.DEEPGRAM_API_KEY || "5d6b86e07b415db4cdd9d41b76e0d5892f0268c9",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./apps/web/src"),
      "@quran/domain": path.resolve(__dirname, "./packages/domain/src"),
      "@quran/contracts": path.resolve(__dirname, "./packages/contracts/src"),
      "@quran/adapters": path.resolve(__dirname, "./packages/adapters/src"),
    },
  },
});
