"use client";

import {
  FloatingArrow,
  FloatingDelayGroup,
  FloatingPortal,
  type Placement,
  type Strategy,
} from "@floating-ui/react";
import {
  cloneElement,
  type CSSProperties,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
  useRef,
} from "react";

import type { VariantFor } from "../../types/register";

import { useExitTransition } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import { useTooltip } from "./use-tooltip";

// ---------------------------------------------------------------------------
// Transform-origin map: placement → CSS transform-origin value
// ---------------------------------------------------------------------------

const TRANSFORM_ORIGIN: Record<string, string> = {
  bottom: "top center",
  "bottom-end": "top right",
  "bottom-start": "top left",
  left: "center right",
  "left-end": "bottom right",
  "left-start": "top right",
  right: "center left",
  "right-end": "bottom left",
  "right-start": "top left",
  top: "bottom center",
  "top-end": "bottom right",
  "top-start": "bottom left",
};

// ---------------------------------------------------------------------------
// TooltipProvider
// ---------------------------------------------------------------------------

/**
 * Configuration for the TooltipProvider component.
 */
export interface TooltipProviderProps {
  children: ReactNode;

  /**
   * Delay configuration for the group.
   * When a tooltip was recently closed, the next one opens with this shorter delay.
   * @default \{ open: 200, close: 300 \}
   */
  delay?: number | { close?: number; open?: number };

  /**
   * How long the skip-delay effect lasts after the last tooltip closes (ms).
   * @default 300
   */
  timeoutMs?: number;
}

/**
 * Provides skip-delay grouping for multiple Tooltip components.
 *
 * @description
 * When users move quickly between tooltips inside a `TooltipProvider`,
 * subsequent tooltips open with a shorter delay instead of the full open delay.
 * This wraps `@floating-ui/react`'s `FloatingDelayGroup`.
 *
 * @example
 * ```tsx
 * <TooltipProvider delay={{ open: 200, close: 300 }}>
 *   <Tooltip content="Bold"><button>B</button></Tooltip>
 *   <Tooltip content="Italic"><button>I</button></Tooltip>
 *   <Tooltip content="Underline"><button>U</button></Tooltip>
 * </TooltipProvider>
 * ```
 */
function TooltipProvider({
  children,
  delay = { close: 300, open: 200 },
  timeoutMs = 300,
}: TooltipProviderProps) {
  return (
    <FloatingDelayGroup delay={delay} timeoutMs={timeoutMs}>
      {children}
    </FloatingDelayGroup>
  );
}

TooltipProvider.displayName = "TooltipProvider";

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

/**
 * Props for the Tooltip component.
 */
export interface TooltipProps {
  // --- Arrow ---

  /**
   * Arrow height in px.
   * @default 7
   */
  arrowHeight?: number;

  /**
   * Arrow width in px.
   * @default 14
   */
  arrowWidth?: number;

  // --- Content ---

  /**
   * The trigger element. Must accept a ref.
   */
  children: ReactElement;

  /**
   * Additional className on the tooltip content element.
   */
  className?: string;

  /**
   * Close delay in ms.
   * @default 300
   */
  closeDelay?: number;

  /**
   * Tooltip content. Can be a string or ReactNode for rich content.
   */
  content: ReactNode;

  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * When true, uses `aria-label` instead of `aria-describedby` on the trigger.
   * Use for icon-only buttons where the tooltip IS the accessible label.
   * @default false
   */
  describeChild?: boolean;

  /**
   * Whether the tooltip is disabled (never opens).
   * @default false
   */
  disabled?: boolean;

  /**
   * Exit animation duration in ms (fallback timeout for CSS animations).
   * @default 150
   */
  exitDuration?: number;

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
   * Keep content mounted when closed. Useful for animation libraries
   * like Framer Motion that manage their own enter/exit animations.
   * Content is rendered with `data-state="closed"` and `visibility: hidden`.
   * @default false
   */
  forceMount?: boolean;

  /**
   * Enable hover trigger.
   * @default true
   */
  hover?: boolean;

  /**
   * ID for the tooltip element. Auto-generated if not provided.
   */
  id?: string;

  /**
   * Whether tooltip content is hoverable (WCAG 2.1 SC 1.4.13).
   * When true, users can hover over the tooltip without it closing.
   * @default true
   */
  interactive?: boolean;

  /**
   * Max width as a CSS value. Prevents overly wide tooltips.
   */
  maxWidth?: number | string;

  /**
   * Offset distance from the trigger in px.
   * @default 8
   */
  offset?: number;

  /**
   * Callback when open state changes. Used with `open` for controlled mode.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Controlled open state. Use with `onOpenChange`.
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
   * Whether to render the tooltip in a portal. Prevents overflow clipping.
   * @default true
   */
  portal?: boolean;

  /**
   * Explicit portal root element. Defaults to `document.body`.
   */
  portalRoot?: HTMLElement | null;

  /**
   * Rest time in ms before opening. Provides a more natural feel
   * than a fixed delay — the tooltip opens after the cursor rests.
   * @default 0 (disabled)
   */
  restMs?: number;

  /**
   * Show a pointing arrow from the tooltip to the trigger.
   * @default false
   */
  showArrow?: boolean;

  /**
   * CSS positioning strategy.
   * @default 'absolute'
   */
  strategy?: Strategy;

  /**
   * Variant name for the `data-variant` attribute.
   */
  variantName?: VariantFor<"tooltip">;

  /**
   * Viewport padding in px for collision detection.
   * @default 8
   */
  viewportPadding?: number;
}

/**
 * A headless, accessible Tooltip component.
 *
 * @description
 * Provides a floating label that appears on hover/focus, powered by
 * `@floating-ui/react` for positioning and interaction management.
 *
 * ## Features
 * - Props-driven API — no compound components needed
 * - 12 placement options with collision-aware flip/shift
 * - Controlled and uncontrolled modes
 * - Configurable open/close delays with skip-delay grouping
 * - WCAG 2.1 hoverable content (safe polygon)
 * - Optional pointing arrow
 * - Follow cursor mode
 * - Portal rendering (on by default)
 * - CSS exit animations via `data-state` attribute
 * - CSS custom property `--ck-tooltip-transform-origin` for scale animations
 *
 * ## Keyboard Support
 *
 * | Key | Action |
 * | --- | --- |
 * | `Tab` | Focus trigger → tooltip opens |
 * | `Escape` | Close tooltip |
 *
 * ## Accessibility
 *
 * Follows the WAI-ARIA Tooltip pattern:
 * - `role="tooltip"` on the tooltip element
 * - `aria-describedby` on the trigger pointing to the tooltip `id`
 * - Opens on keyboard focus (visible-only) for screen reader / keyboard users
 * - Dismissible via Escape key
 * - Content is hoverable by default (WCAG 2.1 SC 1.4.13)
 *
 * ## Data Attributes
 *
 * | Attribute | Values | Description |
 * | --- | --- | --- |
 * | `data-ck` | `"tooltip"` | Component identifier |
 * | `data-state` | `"open"` \| `"closed"` | Animation state |
 * | `data-side` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | Resolved side |
 * | `data-align` | `"start"` \| `"center"` \| `"end"` | Resolved alignment |
 * | `data-variant` | string | User-defined variant |
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Tooltip content="Save document">
 *   <button>Save</button>
 * </Tooltip>
 * ```
 *
 * @example
 * ```tsx
 * // With arrow and custom placement
 * <Tooltip content="Bold text" placement="bottom" showArrow>
 *   <button>B</button>
 * </Tooltip>
 * ```
 *
 * @example
 * ```tsx
 * // Icon-only button (tooltip as label)
 * <Tooltip content="Settings" describeChild>
 *   <button aria-label="Settings"><GearIcon /></button>
 * </Tooltip>
 * ```
 *
 * @example
 * ```tsx
 * // Skip-delay grouping
 * <TooltipProvider>
 *   <Tooltip content="Bold"><button>B</button></Tooltip>
 *   <Tooltip content="Italic"><button>I</button></Tooltip>
 * </TooltipProvider>
 * ```
 */
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      arrowHeight = 7,
      arrowWidth = 14,
      children,
      className,
      closeDelay = 300,
      content,
      defaultOpen,
      describeChild,
      disabled,
      exitDuration = 150,
      focus,
      followCursor,
      forceMount = false,
      hover,
      id: externalId,
      interactive,
      maxWidth,
      offset: offsetDistance,
      onOpenChange,
      open,
      openDelay = 700,
      placement,
      portal = true,
      portalRoot,
      restMs,
      showArrow,
      strategy,
      variantName,
      viewportPadding,
    },
    ref,
  ) => {
    const autoId = useId();
    const tooltipId = externalId ?? `ck-tooltip-${autoId}`;
    const contentNodeRef = useRef<HTMLDivElement>(null);

    const tooltip = useTooltip({
      closeDelay,
      defaultOpen,
      describeChild,
      disabled,
      focus,
      followCursor,
      hover,
      interactive,
      offsetDistance,
      onOpenChange,
      open,
      openDelay,
      placement,
      restMs,
      showArrow,
      strategy,
      viewportPadding,
    });

    const { dataState, isMounted } = useExitTransition({
      animateOnMount: true,
      duration: exitDuration,
      isOpen: tooltip.isOpen,
      nodeRef: contentNodeRef,
    });

    const [side, align = "center"] = tooltip.resolvedPlacement.split("-") as [
      string,
      string | undefined,
    ];

    const shouldRender = forceMount || isMounted;

    // Clone the trigger child and merge interaction props + ref
    const trigger = isValidElement(children)
      ? cloneElement(
          children as ReactElement<Record<string, unknown>>,
          tooltip.getReferenceProps({
            ref: mergeRefs<HTMLElement>(
              tooltip.referenceRef,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (children as any).ref,
            ),
          }),
        )
      : children;

    const tooltipContent = shouldRender ? (
      <div
        {...tooltip.getFloatingProps({
          id: tooltipId,
        })}
        className={className}
        style={
          {
            ...tooltip.floatingStyles,
            ...(maxWidth !== null && maxWidth !== undefined && {
              maxWidth:
                typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
            }),
            "--ck-tooltip-transform-origin":
              TRANSFORM_ORIGIN[tooltip.resolvedPlacement] ?? "center center",
            ...(!isMounted &&
              forceMount && {
                pointerEvents: "none",
                visibility: "hidden" as const,
              }),
          } as CSSProperties
        }
        data-align={align}
        data-ck="tooltip"
        data-side={side}
        data-state={dataState}
        data-variant={variantName}
        ref={mergeRefs<HTMLDivElement>(
          tooltip.floatingRef,
          contentNodeRef,
          ref,
        )}
      >
        {content}
        {showArrow && (
          <FloatingArrow
            context={tooltip.context}
            data-ck="tooltip-arrow"
            height={arrowHeight}
            width={arrowWidth}
            ref={tooltip.arrowRef}
          />
        )}
      </div>
    ) : null;

    return (
      <>
        {trigger}
        {portal ? (
          <FloatingPortal root={portalRoot ?? undefined}>
            {tooltipContent}
          </FloatingPortal>
        ) : (
          tooltipContent
        )}
      </>
    );
  },
);

Tooltip.displayName = "Tooltip";

export { Tooltip, TooltipProvider };
