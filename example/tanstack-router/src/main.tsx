import "./index.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import * as React from "react";
import { type ReactNode, StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import * as ReactDOMClient from "react-dom/client";
import * as jsxRuntime from "react/jsx-runtime";

import { routeTree } from "./routeTree.gen";

// Expose host app's React to window globals for dynamic CK components
declare global {
  interface Window {
    __CK_JSX_RUNTIME__: typeof jsxRuntime;
    __CK_REACT__: typeof React;
    __CK_REACT_DOM_CLIENT__: typeof ReactDOMClient;
  }
}

function CKProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.__CK_REACT__ = React;
    window.__CK_REACT_DOM_CLIENT__ = ReactDOMClient;
    window.__CK_JSX_RUNTIME__ = jsxRuntime;
  }, []);

  return <>{children}</>;
}

// Create a new router instance with preloading enabled
const router = createRouter({
  defaultPreload: "intent", // Preload on hover/touch
  defaultPreloadStaleTime: 30_000, // Cache for 30 seconds
  routeTree,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <CKProvider>
        <RouterProvider router={router} />
      </CKProvider>
    </StrictMode>,
  );
}
