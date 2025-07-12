import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.tsx"],
  format: ["esm"],
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  splitting: true,
  target: "esnext",
  treeshake: true,
});
