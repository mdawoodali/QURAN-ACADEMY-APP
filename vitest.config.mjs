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
