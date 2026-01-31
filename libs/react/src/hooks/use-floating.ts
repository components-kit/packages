"use client";

import {
  autoUpdate,
  flip,
  hide,
  offset,
  type Placement,
  shift,
  type Strategy,
  useFloating as useFloatingUI,
} from "@floating-ui/react";
import { useMemo } from "react";

/**
 * Configuration options for the generic Floating UI hook.
 *
 * @remarks
 * This interface defines the base configuration that applies to all floating elements
 * (Select, Tooltip, Dialog, Popover, etc.). Component-specific hooks may extend this
 * with additional options.
 */
export interface UseFloatingOptions {
  /**
   * Whether the floating element is currently open/visible.
   * Used to enable/disable positioning updates.
   */
  isOpen: boolean;
  /**
   * Offset distance in pixels between reference and floating elements.
   * @default 8
   */
  offsetDistance?: number;
  /**
   * Placement preference for the floating element relative to the reference.
   * @default 'bottom-start'
   */
  placement?: Placement;
  /**
   * Positioning strategy.
   * - `absolute`: Positioned relative to nearest positioned ancestor
   * - `fixed`: Positioned relative to viewport
   * @default 'absolute'
   */
  strategy?: Strategy;
  /**
   * Padding from viewport edges in pixels.
   * Used by flip, shift, and size middleware to prevent elements from touching viewport edges.
   * @default 8
   */
  viewportPadding?: number;
}

/**
 * Return type for the useFloating hook.
 */
export interface UseFloatingReturn {
  /**
   * Full Floating UI context for advanced usage.
   * Provides access to all positioning data and methods.
   */
  context: ReturnType<typeof useFloatingUI>;
  /**
   * Props to spread on the floating element (dropdown, tooltip, etc.).
   */
  floatingProps: {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
  };
  /**
   * Props to spread on the reference element (trigger).
   */
  referenceProps: {
    ref: (node: HTMLElement | null) => void;
  };
}

/**
 * Generic Floating UI positioning hook for all floating elements.
 *
 * @description
 * Provides intelligent positioning for floating elements with automatic collision detection,
 * viewport boundary handling, and scroll/resize tracking. Designed to be the foundation
 * for component-specific hooks like `useFloatingSelect`, `useFloatingTooltip`, etc.
 *
 * **Universal middleware:**
 * - `offset` - Adds configurable gap between reference and floating elements
 * - `flip` - Auto-flips to opposite side on collision
 * - `shift` - Slides along axis to stay in viewport
 * - `hide` - Hides when reference is scrolled out of view or obscured
 *
 * @remarks
 * This hook wraps `@floating-ui/react`'s `useFloating` with sensible defaults
 * and a simplified API. Component-specific hooks extend this base to add their
 * own middleware (e.g., `size` for Select components, `arrow` for Tooltips).
 *
 * @param options - Configuration for positioning behavior
 * @returns Props for reference and floating elements, plus full context
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { referenceProps, floatingProps } = useFloating({ isOpen: true });
 *
 * <button ref={referenceProps.ref}>Trigger</button>
 * <div ref={floatingProps.ref} style={floatingProps.style}>
 *   Floating content
 * </div>
 * ```
 *
 * @example
 * ```tsx
 * // Custom placement and offset
 * const { referenceProps, floatingProps } = useFloating({
 *   isOpen: true,
 *   placement: 'top-end',
 *   offsetDistance: 16,
 *   viewportPadding: 12,
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Accessing advanced context
 * const { context } = useFloating({ isOpen: true });
 * const { x, y, placement, middlewareData } = context;
 * ```
 *
 * @see {@link UseFloatingOptions} for all configuration options
 * @see {@link https://floating-ui.com/docs/getting-started | Floating UI Documentation}
 */
export function useFloating(options: UseFloatingOptions): UseFloatingReturn {
  const {
    isOpen,
    offsetDistance = 8,
    placement = "bottom-start",
    strategy = "absolute",
    viewportPadding = 8,
  } = options;

  const middleware = useMemo(
    () => [
      offset(offsetDistance),
      flip({ fallbackAxisSideDirection: "start", padding: viewportPadding }),
      shift({ padding: viewportPadding }),
      hide({ strategy: "referenceHidden" }),
    ],
    [offsetDistance, viewportPadding],
  );

  const floating = useFloatingUI({
    middleware,
    open: isOpen,
    placement,
    strategy,
    whileElementsMounted: autoUpdate,
  });

  return {
    context: floating,
    floatingProps: {
      ref: floating.refs.setFloating,
      style: floating.floatingStyles,
    },
    referenceProps: {
      ref: floating.refs.setReference,
    },
  };
}
