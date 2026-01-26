/**
 * Import map with data URI shims for React dependencies.
 * These shims re-export React from window globals set by CKProvider.
 */

const REACT_SHIM = `data:application/javascript,${encodeURIComponent(`
const R = window.__CK_REACT__;
export default R;
export const {
  useState, useEffect, useRef, useCallback, useMemo,
  useContext, useReducer, useLayoutEffect, useId,
  createContext, createElement, Fragment, Children,
  forwardRef, memo, lazy, Suspense, startTransition,
  isValidElement, cloneElement
} = R;
`)}`;

const JSX_RUNTIME_SHIM = `data:application/javascript,${encodeURIComponent(`
const R = window.__CK_JSX_RUNTIME__;
export const jsx = R.jsx;
export const jsxs = R.jsxs;
export const Fragment = R.Fragment;
`)}`;

const REACT_DOM_CLIENT_SHIM = `data:application/javascript,${encodeURIComponent(`
const R = window.__CK_REACT_DOM_CLIENT__;
export const hydrateRoot = R.hydrateRoot;
export const createRoot = R.createRoot;
`)}`;

/**
 * Returns the import map configuration for CK components.
 * Add this to your layout's <head> as a script with type="importmap".
 *
 * @example
 * ```tsx
 * <script
 *   type="importmap"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(getImportMap()) }}
 * />
 * ```
 */
export function getImportMap() {
  return {
    imports: {
      react: REACT_SHIM,
      "react-dom/client": REACT_DOM_CLIENT_SHIM,
      "react/jsx-runtime": JSX_RUNTIME_SHIM,
    },
  };
}
