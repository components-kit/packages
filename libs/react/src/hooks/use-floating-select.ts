"use client";

import {
  autoUpdate,
  flip,
  hide,
  offset,
  type Placement,
  shift,
  size,
  type Strategy,
  useFloating as useFloatingUI,
} from "@floating-ui/react";
import { useMemo } from "react";

/**
 * Configuration options for the Select-specific Floating UI hook.
 *
 * @remarks
 * Extends the base floating options with select-specific behavior.
 * The `size` middleware is automatically applied to match trigger width
 * and calculate dynamic max-height based on available viewport space.
 */
export interface UseFloatingSelectOptions {
  /**
   * Whether the dropdown is currently open/visible.
   */
  isOpen: boolean;
  /**
   * Maximum height of the dropdown in pixels.
   * When set, the dropdown height will not exceed this value,
   * even if more viewport space is available.
   */
  maxDropdownHeight?: number;
  /**
   * Offset distance in pixels between trigger and dropdown.
   * @default 8
   */
  offsetDistance?: number;
  /**
   * Placement preference for the dropdown relative to the trigger.
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
   * Used by flip, shift, and size middleware.
   * @default 8
   */
  viewportPadding?: number;
}

/**
 * Return type for the useFloatingSelect hook.
 */
export interface UseFloatingSelectReturn {
  /**
   * Full Floating UI context for advanced usage.
   */
  context: ReturnType<typeof useFloatingUI>;
  /**
   * Props to spread on the dropdown element.
   * Includes ref and inline styles for positioning and sizing.
   */
  floatingProps: {
    /**
     * Resolved placement after middleware (e.g., flip) has been applied.
     * May differ from the requested placement if the dropdown was flipped.
     */
    placement: Placement;
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
  };
  /**
   * Props to spread on the trigger element (button or input wrapper).
   */
  referenceProps: {
    ref: (node: HTMLElement | null) => void;
  };
}

/**
 * Floating UI positioning hook for Select components.
 *
 * @description
 * Provides intelligent dropdown positioning with automatic width matching,
 * dynamic height calculation, collision detection, and viewport handling.
 * Built on top of the generic `useFloating` hook with select-specific enhancements.
 *
 * **Select-specific features:**
 * - **Width matching:** Dropdown min-width matches trigger width
 * - **Dynamic height:** Max-height adapts to available viewport space
 * - **Auto-scroll:** Adds `overflow-y: auto` when content exceeds max-height
 *
 * **Universal middleware (inherited):**
 * - `offset` - Gap between trigger and dropdown
 * - `flip` - Auto-flip to opposite side on collision
 * - `shift` - Slide along axis to stay in viewport
 * - `hide` - Hide when trigger is obscured
 *
 * @remarks
 * This hook is specifically designed for dropdown components (Select, MultiSelect,
 * Combobox, AsyncSelect). For other floating components like Tooltip or Dialog,
 * use the generic `useFloating` hook or create a component-specific hook.
 *
 * Works seamlessly with Downshift for state management and accessibility.
 * The dropdown is typically rendered in a `FloatingPortal` to escape overflow containers.
 *
 * @param options - Configuration for dropdown positioning
 * @returns Props for trigger and dropdown elements, plus full context
 *
 * @example
 * ```tsx
 * // Basic usage with Downshift
 * const { isOpen, getMenuProps, getToggleButtonProps } = useSelect(...);
 * const { referenceProps, floatingProps } = useFloatingSelect({ isOpen });
 *
 * <button {...getToggleButtonProps()} ref={referenceProps.ref}>
 *   Select
 * </button>
 *
 * <FloatingPortal>
 *   {isOpen && (
 *     <div
 *       {...getMenuProps()}
 *       ref={floatingProps.ref}
 *       style={floatingProps.style}
 *     >
 *       Dropdown content
 *     </div>
 *   )}
 * </FloatingPortal>
 * ```
 *
 * @example
 * ```tsx
 * // Custom configuration
 * const { referenceProps, floatingProps } = useFloatingSelect({
 *   isOpen: true,
 *   placement: 'top-start',      // Prefer top placement
 *   offsetDistance: 16,           // Larger gap
 *   viewportPadding: 12,          // More viewport padding
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Ref merging with Downshift
 * const menuRef = (node: HTMLDivElement | null) => {
 *   // Merge Downshift's ref
 *   const menuProps = getMenuProps();
 *   if (menuProps.ref && typeof menuProps.ref === 'function') {
 *     menuProps.ref(node);
 *   }
 *   // Set Floating UI ref
 *   floatingProps.ref(node);
 * };
 *
 * <div ref={menuRef} style={floatingProps.style}>...</div>
 * ```
 *
 * @see {@link UseFloatingSelectOptions} for all configuration options
 * @see {@link https://floating-ui.com/docs/size | Floating UI size middleware}
 */
export function useFloatingSelect(
  options: UseFloatingSelectOptions,
): UseFloatingSelectReturn {
  const {
    isOpen,
    maxDropdownHeight,
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
      size({
        apply({ availableHeight, elements, rects }) {
          // Match trigger width (minimum) + dynamic max-height
          const effectiveMaxHeight = maxDropdownHeight
            ? Math.min(availableHeight, maxDropdownHeight)
            : availableHeight;
          Object.assign(elements.floating.style, {
            maxHeight: `${effectiveMaxHeight}px`,
            minWidth: `${rects.reference.width}px`,
            overflowY: "auto",
          });
        },
        padding: viewportPadding,
      }),
      hide({ strategy: "referenceHidden" }),
    ],
    [maxDropdownHeight, offsetDistance, viewportPadding],
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
      placement: floating.placement,
      ref: floating.refs.setFloating,
      style: floating.floatingStyles,
    },
    referenceProps: {
      ref: floating.refs.setReference,
    },
  };
}
