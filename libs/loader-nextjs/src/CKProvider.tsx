"use client";

import { type ReactNode, useEffect } from "react";
import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import * as jsxRuntime from "react/jsx-runtime";

declare global {
  interface Window {
    __CK_JSX_RUNTIME__: typeof jsxRuntime;
    __CK_REACT__: typeof React;
    __CK_REACT_DOM_CLIENT__: typeof ReactDOMClient;
  }
}

interface CKProviderProps {
  children: ReactNode;
}

/**
 * Provider that exposes host app's React to window globals.
 * Required for CK components to use the same React instance as the host app.
 *
 * @example
 * ```tsx
 * // layout.tsx
 * import { CKProvider } from "@components-kit/loader-nextjs/client";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <CKProvider>{children}</CKProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function CKProvider({ children }: CKProviderProps) {
  useEffect(() => {
    window.__CK_REACT__ = React;
    window.__CK_REACT_DOM_CLIENT__ = ReactDOMClient;
    window.__CK_JSX_RUNTIME__ = jsxRuntime;
  }, []);

  return <>{children}</>;
}
