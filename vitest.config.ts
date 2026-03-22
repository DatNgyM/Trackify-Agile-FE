import path from "node:path";
import { defineConfig } from "vitest/config";

/** Tối giản: chỉ `vitest`, env `node` — không jsdom / không plugin React. */
export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
