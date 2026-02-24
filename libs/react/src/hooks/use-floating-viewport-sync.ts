"use client";

import { useEffect } from "react";

/**
 * Keeps Floating UI dropdown coordinates synchronized with mobile viewport changes.
 *
 * @description
 * On mobile devices the visual viewport can shift when the virtual keyboard
 * appears (especially on iOS Safari). This hook listens to `window.resize`,
 * `window.scroll` (capture), and `visualViewport` resize/scroll events and
 * calls the Floating UI `update` function so the dropdown repositions
 * correctly.
 *
 * A second effect triggers a `requestAnimationFrame`-based reposition whenever
 * the dropdown content changes (e.g. filtered item count or input value), so
 * the dropdown size stays in sync with its contents.
 *
 * @remarks
 * - The first `useEffect` manages global viewport listeners while the dropdown
 *   is open (`isOpen` + `update` deps).
 * - The second `useEffect` fires a single rAF reposition when `inputValue` or
 *   `itemCount` change, keeping the popup aligned after content reflows.
 * - All listeners and animation frames are cleaned up on unmount or when the
 *   dropdown closes.
 *
 * @param {boolean} isOpen - Whether the dropdown is currently open. Listeners
 *   are only attached while `true`.
 * @param {() => void} update - The Floating UI `update` function (typically
 *   `floatingContext.update`) that recalculates position.
 * @param {string} [inputValue] - Current filter/input text. A change triggers
 *   a rAF reposition so the dropdown resizes to fit new results.
 * @param {number} [itemCount] - Number of visible items in the dropdown. A
 *   change triggers a rAF reposition.
 *
 * @example
 * ```tsx
 * useFloatingViewportSync(
 *   isOpen,
 *   floatingContext.update,
 *   currentInputValue,
 *   filteredItems.length,
 * );
 * ```
 */
export function useFloatingViewportSync(
  isOpen: boolean,
  update: () => void,
  inputValue?: string,
  itemCount?: number,
): void {
  useEffect(() => {
    if (!isOpen) return undefined;

    const updatePosition = () => {
      update();
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { capture: true });

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", updatePosition);
    visualViewport?.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, { capture: true });
      visualViewport?.removeEventListener("resize", updatePosition);
      visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, update]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const frameId = requestAnimationFrame(() => {
      update();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isOpen, inputValue, itemCount, update]);
}
