"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * Configuration options for the exit transition hook.
 */
export interface UseExitTransitionOptions {
  /**
   * Whether to animate the initial mount when `isOpen` starts as `true`.
   * When `true`, `dataState` starts as `"closed"` and transitions to `"open"`
   * after a `requestAnimationFrame`, allowing CSS enter animations on first render.
   * @default false
   */
  animateOnMount?: boolean;
  /**
   * Duration in milliseconds to keep the element mounted after closing.
   * When `nodeRef` is provided, acts as the maximum fallback timeout
   * in case `transitionend`/`animationend` events don't fire.
   * @default 150
   */
  duration?: number;
  /**
   * Whether the element should logically be visible.
   */
  isOpen: boolean;
  /**
   * Ref to the animated DOM element. When provided, the hook listens for
   * `transitionend` and `animationend` events to detect when the exit
   * animation completes, with `duration` as the fallback timeout.
   *
   * When omitted, the hook uses pure timer-based unmounting.
   */
  nodeRef?: RefObject<HTMLElement | null>;
  /**
   * Callback fired when the exit animation completes and the element
   * is about to be unmounted (`isMounted` becomes `false`).
   */
  onExitComplete?: () => void;
}

/**
 * Return type for the useExitTransition hook.
 */
export interface UseExitTransitionReturn {
  /**
   * Current visual state for the `data-state` attribute.
   * Transitions to `"closed"` immediately when `isOpen` becomes `false`,
   * before the element is unmounted.
   */
  dataState: "closed" | "open";
  /**
   * Whether the element should remain in the DOM.
   * Stays `true` during the exit animation window after `isOpen` becomes `false`.
   */
  isMounted: boolean;
}

/**
 * Delays unmounting an element so CSS exit animations can play.
 *
 * @description
 * When `isOpen` goes `false`, the hook keeps the element mounted while setting
 * `dataState` to `"closed"` immediately. This gives CSS animations time to run
 * before the element is removed from the DOM.
 *
 * When `nodeRef` is provided, the hook listens for `transitionend`/`animationend`
 * events on the element to detect when the animation finishes, with `duration`
 * as a fallback timeout. Without `nodeRef`, it uses a pure timer-based approach.
 *
 * @remarks
 * - Handles rapid open/close toggling (clears pending timers on re-open).
 * - Cleans up timers and event listeners on component unmount.
 * - Guards against bubbled transition events from child elements.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const { isMounted, dataState } = useExitTransition({
 *   isOpen,
 *   nodeRef: ref,
 * });
 *
 * {isMounted && (
 *   <div ref={ref} data-state={dataState}>
 *     Dropdown content
 *   </div>
 * )}
 * ```
 */
export function useExitTransition(
  options: UseExitTransitionOptions,
): UseExitTransitionReturn {
  const {
    animateOnMount = false,
    duration = 150,
    isOpen,
    nodeRef,
    onExitComplete,
  } = options;

  const [isMounted, setIsMounted] = useState(isOpen);
  const [dataState, setDataState] = useState<"closed" | "open">(
    isOpen && !animateOnMount ? "open" : "closed",
  );

  // Ref pattern to avoid stale closures in the effect
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  useEffect(() => {
    if (isOpen) {
      // Opening: mount immediately and set state to open
      setIsMounted(true);
      // Small delay to ensure the browser paints the mounted element before transitioning
      // This allows the CSS transition from closed -> open to trigger effectively
      const raf = requestAnimationFrame(() => {
        setDataState("open");
      });
      return () => cancelAnimationFrame(raf);
    }

    // Closing: set state to closed immediately to trigger exit animation
    setDataState("closed");

    const node = nodeRef?.current;
    let settled = false;

    const unmount = () => {
      if (settled) return;
      settled = true;
      setIsMounted(false);
      onExitCompleteRef.current?.();
    };

    const handleEnd = (e: Event) => {
      // Only respond to events on the target element, not bubbled from children
      if (e.target === node) {
        unmount();
      }
    };

    // Always set a timeout (primary timer or fallback for event-based mode)
    const fallbackTimer = setTimeout(unmount, duration);

    // If nodeRef is provided and the node exists, also listen for animation events.
    // { once: true } auto-removes after first fire, reducing cleanup surface.
    if (node) {
      node.addEventListener("transitionend", handleEnd, { once: true });
      node.addEventListener("animationend", handleEnd, { once: true });
    }

    return () => {
      settled = true;
      clearTimeout(fallbackTimer);
      if (node) {
        node.removeEventListener("transitionend", handleEnd);
        node.removeEventListener("animationend", handleEnd);
      }
    };
  }, [isOpen, duration, nodeRef]);

  return { dataState, isMounted };
}
