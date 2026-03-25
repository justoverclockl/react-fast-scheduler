import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const fromRoot = (path: string) => new URL(path, import.meta.url).pathname;

export default defineConfig({
  plugins: [tailwindcss()],
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
});
