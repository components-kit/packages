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
  useClientPoint,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { safePolygon } from "@floating-ui/react";
import { useCallback, useMemo, useRef, useState } from "react";

/**
 * Configuration options for the Tooltip positioning and interaction hook.
 *
 * @remarks
 * This hook wraps `@floating-ui/react` directly (not via the generic `useFloating` wrapper)
 * because tooltip interaction hooks (`useHover`, `useFocus`, `useDismiss`, `useRole`)
 * require the full `FloatingContext` with `open`/`onOpenChange` wired in.
 */
export interface UseTooltipOptions {
  /**
   * Close delay in ms.
   * @default 300
   */
  closeDelay?: number;

  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * When true, uses `aria-label` on the trigger instead of `aria-describedby`.
   * Useful for icon-only buttons where the tooltip IS the accessible label.
   * @default false
   */
  describeChild?: boolean;

  /**
   * Whether the tooltip is disabled (never opens).
   * @default false
   */
  disabled?: boolean;

  /**
   * Enable focus trigger.
   * @default true
   */
  focus?: boolean;

  /**
   * Follow cursor mode.
   * - `false`: disabled
   * - `true`: follows on both axes
   * - `"x"`: follows horizontally only
   * - `"y"`: follows vertically only
   * @default false
   */
  followCursor?: boolean | "x" | "y";

  /**
   * Enable hover trigger.
   * @default true
   */
  hover?: boolean;

  /**
   * Whether tooltip content is hoverable (WCAG 2.1 SC 1.4.13).
   * When true, users can hover over the tooltip without it closing.
   * @default true
   */
  interactive?: boolean;

  /**
   * Offset distance in pixels between trigger and tooltip.
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
   * Open delay in ms.
   * @default 700
   */
  openDelay?: number;

  /**
   * Placement of the tooltip relative to the trigger.
   * @default 'top'
   */
  placement?: Placement;

  /**
   * Rest time in ms before opening.
   * When set, the tooltip opens after the cursor rests for this duration
   * instead of using the open delay. Provides a more natural feel.
   * @default 0 (disabled)
   */
  restMs?: number;

  /**
   * Whether to show an arrow pointing from the tooltip to the trigger.
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
 * Return type for the useTooltip hook.
 */
export interface UseTooltipReturn {
  /**
   * Ref for the arrow SVG element. Pass to `FloatingArrow`.
   */
  arrowRef: React.RefObject<SVGSVGElement | null>;

  /**
   * Floating UI context. Required by `FloatingArrow`.
   */
  context: ReturnType<typeof useFloating>["context"];

  /**
   * Ref setter for the floating (tooltip content) element.
   */
  floatingRef: (node: HTMLElement | null) => void;

  /**
   * Inline styles for the floating element.
   */
  floatingStyles: React.CSSProperties;

  /**
   * Returns props to spread on the floating (tooltip) element.
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
   * Whether the tooltip is currently open.
   */
  isOpen: boolean;

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
 * Core hook for Tooltip positioning and interaction.
 *
 * @description
 * Wraps `@floating-ui/react` with tooltip-specific interactions:
 * - Hover trigger with configurable delay and WCAG safe polygon
 * - Focus trigger for keyboard accessibility
 * - Dismiss on Escape and ancestor scroll
 * - Tooltip ARIA role with `aria-describedby`
 * - Delay group support for skip-delay behavior
 * - Follow cursor mode
 * - Optional arrow positioning
 *
 * @remarks
 * Uses `@floating-ui/react`'s `useFloating` directly because the interaction hooks
 * require the full `FloatingContext` with `open`/`onOpenChange`. This follows the same
 * pattern as `useFloatingSelect`.
 *
 * @see {@link UseTooltipOptions} for configuration
 * @see {@link https://floating-ui.com/docs/tooltip | Floating UI Tooltip docs}
 */
export function useTooltip(options: UseTooltipOptions = {}): UseTooltipReturn {
  const {
    closeDelay = 300,
    defaultOpen = false,
    describeChild = false,
    disabled = false,
    focus: focusEnabled = true,
    followCursor = false,
    hover: hoverEnabled = true,
    interactive = true,
    offsetDistance = 8,
    onOpenChange: controlledOnOpenChange,
    open: controlledOpen,
    openDelay = 700,
    placement = "top",
    restMs = 0,
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

  // Delay group: enables skip-delay when inside a TooltipProvider (FloatingDelayGroup).
  // When no provider is present, this is a no-op and individual delays are used.
  const { delay: groupDelay } = useDelayGroup(context);
  const computedDelay = groupDelay ?? { close: closeDelay, open: openDelay };

  const hoverInteraction = useHover(context, {
    delay: computedDelay,
    enabled: hoverEnabled && !disabled,
    handleClose: interactive ? safePolygon() : null,
    move: !followCursor,
    restMs,
  });

  const focusInteraction = useFocus(context, {
    enabled: focusEnabled && !disabled,
    visibleOnly: true,
  });

  const dismissInteraction = useDismiss(context, {
    ancestorScroll: true,
    enabled: !disabled,
  });

  const roleInteraction = useRole(context, {
    enabled: !disabled,
    role: describeChild ? "label" : "tooltip",
  });

  const clientPointInteraction = useClientPoint(context, {
    axis:
      followCursor === "x" ? "x" : followCursor === "y" ? "y" : "both",
    enabled: !!followCursor && !disabled,
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    hoverInteraction,
    focusInteraction,
    dismissInteraction,
    roleInteraction,
    clientPointInteraction,
  ]);

  return {
    arrowRef,
    context,
    floatingRef: floating.refs.setFloating,
    floatingStyles: floating.floatingStyles,
    getFloatingProps,
    getReferenceProps,
    isOpen,
    referenceRef: floating.refs.setReference,
    resolvedPlacement: floating.placement,
    setIsOpen,
  };
}
