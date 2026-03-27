import { defineConfig } from "vitest/config";

const fromRoot = (path: string) => new URL(path, import.meta.url).pathname;

export default defineConfig({
  resolve: {
    alias: {
      "@": fromRoot("./src"),
      "@components": fromRoot("./src/components"),
      "@hooks": fromRoot("./src/hooks"),
      "@lib": fromRoot("./src/lib"),
      "@rfs-types": fromRoot("./src/types"),
      "@utils": fromRoot("./src/utils"),
    },
  },
  test: {
    passWithNoTests: true,
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
