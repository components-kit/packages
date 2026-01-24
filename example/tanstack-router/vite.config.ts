import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "..", "VITE_");
  const BASE_URL = env.VITE_COMPONENTS_KIT_URL ?? "";
  const API_KEY = env.VITE_COMPONENTS_KIT_KEY ?? "";

  return {
    envDir: "..",
    plugins: [
      tanstackRouter({ autoCodeSplitting: true }),
      react(),
      {
        name: "inject-components-kit-assets",
        transformIndexHtml(html) {
          return html
            .replace(
              /__BUNDLE_URL__/g,
              `${BASE_URL}/v1/public/bundle.css?key=${API_KEY}`,
            )
            .replace(
              /__FONTS_URL__/g,
              `${BASE_URL}/v1/public/fonts.txt?key=${API_KEY}`,
            );
        },
      },
    ],
  };
});
