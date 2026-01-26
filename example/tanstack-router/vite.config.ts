import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// Import map shims for dynamic ESM components (shares React with host app)
const REACT_SHIM = `const R=window.__CK_REACT__;export default R;export const{useState,useEffect,useRef,useCallback,useMemo,useContext,useReducer,useLayoutEffect,useId,createContext,createElement,Fragment,Children,forwardRef,memo,lazy,Suspense,startTransition,isValidElement,cloneElement}=R;`;
const JSX_RUNTIME_SHIM = `const R=window.__CK_JSX_RUNTIME__;export const jsx=R.jsx;export const jsxs=R.jsxs;export const Fragment=R.Fragment;`;
const REACT_DOM_CLIENT_SHIM = `const R=window.__CK_REACT_DOM_CLIENT__;export const hydrateRoot=R.hydrateRoot;export const createRoot=R.createRoot;`;

const importMapScript = `
<script type="importmap">
{
  "imports": {
    "react": "data:application/javascript,${encodeURIComponent(REACT_SHIM)}",
    "react/jsx-runtime": "data:application/javascript,${encodeURIComponent(JSX_RUNTIME_SHIM)}",
    "react-dom/client": "data:application/javascript,${encodeURIComponent(REACT_DOM_CLIENT_SHIM)}"
  }
}
</script>
`;

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
        transformIndexHtml: {
          handler(html) {
            return html
              .replace("<head>", `<head>${importMapScript}`)
              .replace(
                /__BUNDLE_URL__/g,
                `${BASE_URL}/v1/public/bundle.css?key=${API_KEY}`,
              )
              .replace(
                /__FONTS_URL__/g,
                `${BASE_URL}/v1/public/fonts.txt?key=${API_KEY}`,
              );
          },
          order: "pre",
        },
      },
    ],
  };
});
