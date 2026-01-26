import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    format: ["esm"],
    skipNodeModulesBundle: true,
    sourcemap: true,
    target: "esnext",
  },
  {
    banner: {
      js: '"use client";',
    },
    dts: true,
    entry: { client: "src/client.ts" },
    format: ["esm"],
    skipNodeModulesBundle: true,
    sourcemap: true,
    target: "esnext",
  },
]);
