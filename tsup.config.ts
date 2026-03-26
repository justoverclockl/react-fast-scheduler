import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  minify: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
});
