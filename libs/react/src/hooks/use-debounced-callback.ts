"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a debounced version of the callback.
 * The debounced function resets its timer on each call.
 * Timer is cleaned up on unmount.
 *
 * Uses the `callbackRef` pattern so the returned function is stable
 * (only changes when `delayMs` changes) and always calls the latest callback.
 *
 * @param callback - The function to debounce
 * @param delayMs - Delay in milliseconds before the callback fires
 * @returns A debounced version of the callback
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebouncedCallback(async (query: string) => {
 *   const results = await fetchResults(query);
 *   setResults(results);
 * }, 300);
 *
 * // In an input handler:
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        () => callbackRef.current(...args),
        delayMs,
      );
    },
    [delayMs],
  );
}
