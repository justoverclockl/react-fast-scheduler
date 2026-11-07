import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// The site uses the library exactly as an app would install it: the built package in ../dist.
const lib = (file: string) => fileURLToPath(new URL(`../dist/${file}`, import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: [
      { find: /^@marco\.colia\/react-fast-scheduler\/styles\.css$/, replacement: lib("styles.css") },
      { find: /^@marco\.colia\/react-fast-scheduler$/, replacement: lib("index.js") },
    ],
    // ../dist imports react from the repo's node_modules: keep a single copy.
    dedupe: ["react", "react-dom"],
  },
  server: { fs: { allow: [".."] } },
});
