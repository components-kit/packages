"use client";

import {
  arrow,
  autoUpdate,
  flip,
  hide,
  offset,
  type Placement,
  shift,
  type Strategy,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useCallback, useMemo, useRef, useState } from "react";

/**
 * Configuration options for the Popover positioning and interaction hook.
 *
 * @remarks
 * This hook wraps `@floating-ui/react` directly (not via the generic `useFloating` wrapper)
 * because popover interaction hooks (`useClick`, `useDismiss`, `useRole`)
 * require the full `FloatingContext` with `open`/`onOpenChange` wired in.
 */
export interface UsePopoverOptions {
  /**
   * Close on Escape key press.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Close when clicking outside the popover.
   * @default true
   */
  closeOnOutsideClick?: boolean;

  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Whether the popover is disabled (never opens).
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the popover is modal (traps focus and hides outside from screen readers).
   * @default false
   */
  modal?: boolean;

  /**
   * Offset distance in pixels between trigger and popover.
   * @default 8
   */
  offsetDistance?: number;

  /**
   * Callback when open state changes. Used for controlled mode.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Controlled open state.
   */
  open?: boolean;

  /**
   * Placement of the popover relative to the trigger.
   * @default 'bottom'
   */
  placement?: Placement;

  /**
   * Whether to show an arrow pointing from the popover to the trigger.
   * @default false
   */
  showArrow?: boolean;

  /**
   * CSS positioning strategy.
   * @default 'absolute'
   */
  strategy?: Strategy;

  /**
   * Padding from viewport edges in pixels.
   * @default 8
   */
  viewportPadding?: number;
}

/**
 * Return type for the usePopover hook.
 */
export interface UsePopoverReturn {
  /**
   * Ref for the arrow SVG element. Pass to `FloatingArrow`.
   */
  arrowRef: React.RefObject<SVGSVGElement | null>;

  /**
   * Floating UI context. Required by `FloatingArrow` and `FloatingFocusManager`.
   */
  context: ReturnType<typeof useFloating>["context"];

  /**
   * Ref setter for the floating (popover content) element.
   */
  floatingRef: (node: HTMLElement | null) => void;

  /**
   * Inline styles for the floating element.
   */
  floatingStyles: React.CSSProperties;

  /**
   * Returns props to spread on the floating (popover) element.
   */
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement>,
  ) => Record<string, unknown>;

  /**
   * Returns props to spread on the reference (trigger) element.
   */
  getReferenceProps: (
    userProps?: React.HTMLProps<Element>,
  ) => Record<string, unknown>;

  /**
   * Whether the popover is currently open.
   */
  isOpen: boolean;

  /**
   * Whether the popover is modal.
   */
  modal: boolean;

  /**
   * Ref setter for the reference (trigger) element.
   */
  referenceRef: (node: HTMLElement | null) => void;

  /**
   * Resolved placement after middleware (may differ from requested placement after flip).
   */
  resolvedPlacement: Placement;

  /**
   * Set the open state programmatically.
   */
  setIsOpen: (open: boolean) => void;
}

/**
 * Core hook for Popover positioning and interaction.
 *
 * @description
 * Wraps `@floating-ui/react` with popover-specific interactions:
 * - Click trigger to toggle open/close
 * - Dismiss on Escape key and outside click
 * - Dialog ARIA role with `aria-haspopup` and `aria-expanded`
 * - Optional modal mode for focus trapping
 * - Optional arrow positioning
 *
 * @remarks
 * Uses `@floating-ui/react`'s `useFloating` directly because the interaction hooks
 * require the full `FloatingContext` with `open`/`onOpenChange`. This follows the same
 * pattern as `useTooltip` and `useFloatingSelect`.
 *
 * @see {@link UsePopoverOptions} for configuration
 * @see {@link https://floating-ui.com/docs/popover | Floating UI Popover docs}
 */
export function usePopover(
  options: UsePopoverOptions = {},
): UsePopoverReturn {
  const {
    closeOnEscape = true,
    closeOnOutsideClick = true,
    defaultOpen = false,
    disabled = false,
    modal = false,
    offsetDistance = 8,
    onOpenChange: controlledOnOpenChange,
    open: controlledOpen,
    placement = "bottom",
    showArrow = false,
    strategy = "absolute",
    viewportPadding = 8,
  } = options;

  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      controlledOnOpenChange?.(nextOpen);
    },
    [controlledOnOpenChange, isControlled],
  );

  const arrowRef = useRef<SVGSVGElement | null>(null);

  const middleware = useMemo(
    () => [
      offset(offsetDistance),
      flip({ fallbackAxisSideDirection: "start", padding: viewportPadding }),
      shift({ padding: viewportPadding }),
      ...(showArrow ? [arrow({ element: arrowRef })] : []),
      hide({ strategy: "referenceHidden" }),
    ],
    [offsetDistance, showArrow, viewportPadding],
  );

  const floating = useFloating({
    middleware,
    onOpenChange: disabled ? undefined : setIsOpen,
    open: isOpen,
    placement,
    strategy,
    whileElementsMounted: autoUpdate,
  });

  const { context } = floating;

  const clickInteraction = useClick(context, {
    enabled: !disabled,
  });

  const dismissInteraction = useDismiss(context, {
    enabled: !disabled,
    escapeKey: closeOnEscape,
    outsidePress: closeOnOutsideClick,
  });

  const roleInteraction = useRole(context, {
    enabled: !disabled,
    role: "dialog",
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    clickInteraction,
    dismissInteraction,
    roleInteraction,
  ]);

  return {
    arrowRef,
    context,
    floatingRef: floating.refs.setFloating,
    floatingStyles: floating.floatingStyles,
    getFloatingProps,
    getReferenceProps,
    isOpen,
    modal,
    referenceRef: floating.refs.setReference,
    resolvedPlacement: floating.placement,
    setIsOpen,
  };
}
