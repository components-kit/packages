"use client";

import {
  FloatingArrow,
  FloatingFocusManager,
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
  type RefObject,
  useId,
  useRef,
} from "react";

import type { VariantFor } from "../../types/register";

import { useExitTransition } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import { usePopover } from "./use-popover";

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
// Popover
// ---------------------------------------------------------------------------

/**
 * Props for the Popover component.
 */
export interface PopoverProps {
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
   * Additional className on the popover content element.
   */
  className?: string;

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
   * Popover content. Can be a string or ReactNode for rich content.
   */
  content: ReactNode;

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
   * Exit animation duration in ms (fallback timeout for CSS animations).
   * @default 150
   */
  exitDuration?: number;

  /**
   * Keep content mounted when closed. Useful for animation libraries
   * like Framer Motion that manage their own enter/exit animations.
   * Content is rendered with `data-state="closed"` and `visibility: hidden`.
   * @default false
   */
  forceMount?: boolean;

  /**
   * ID for the popover element. Auto-generated if not provided.
   */
  id?: string;

  /**
   * Initial focus target when the popover opens.
   * - `number`: index of the tabbable element (0 = first, -1 = floating element itself)
   * - `RefObject`: ref to the element to focus
   * @default 0
   */
  initialFocus?: number | RefObject<HTMLElement | null>;

  /**
   * Max width as a CSS value. Prevents overly wide popovers.
   */
  maxWidth?: number | string;

  /**
   * Whether the popover is modal (traps focus and hides outside from screen readers).
   * @default false
   */
  modal?: boolean;

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
   * Placement of the popover relative to the trigger.
   * @default 'bottom'
   */
  placement?: Placement;

  /**
   * Whether to render the popover in a portal. Prevents overflow clipping.
   * @default true
   */
  portal?: boolean;

  /**
   * Explicit portal root element. Defaults to `document.body`.
   */
  portalRoot?: HTMLElement | null;

  /**
   * Whether to return focus to the trigger when the popover closes.
   * @default true
   */
  returnFocus?: boolean;

  /**
   * Show a pointing arrow from the popover to the trigger.
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
  variantName?: VariantFor<"popover">;

  /**
   * Viewport padding in px for collision detection.
   * @default 8
   */
  viewportPadding?: number;
}

/**
 * A headless, accessible Popover component.
 *
 * @description
 * Provides a floating panel that appears on click, powered by
 * `@floating-ui/react` for positioning and interaction management.
 *
 * ## Features
 * - Props-driven API — no compound components needed
 * - 12 placement options with collision-aware flip/shift
 * - Controlled and uncontrolled modes
 * - Optional modal mode with focus trapping
 * - Optional pointing arrow
 * - Portal rendering (on by default)
 * - CSS exit animations via `data-state` attribute
 * - CSS custom property `--ck-popover-transform-origin` for scale animations
 *
 * ## Keyboard Support
 *
 * | Key | Action |
 * | --- | --- |
 * | `Enter` / `Space` | Toggle popover |
 * | `Escape` | Close popover |
 * | `Tab` | Navigate within popover (trapped in modal mode) |
 *
 * ## Accessibility
 *
 * Follows the WAI-ARIA Dialog (non-modal) pattern:
 * - `role="dialog"` on the popover element
 * - `aria-haspopup="dialog"` on the trigger
 * - `aria-expanded` on the trigger
 * - `aria-controls` linking trigger to popover `id`
 * - Focus management via `FloatingFocusManager`
 * - Optional `modal` mode for focus trapping and screen reader isolation
 *
 * ## Data Attributes
 *
 * | Attribute | Values | Description |
 * | --- | --- | --- |
 * | `data-ck` | `"popover"` | Component identifier |
 * | `data-state` | `"open"` \| `"closed"` | Animation state |
 * | `data-side` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | Resolved side |
 * | `data-align` | `"start"` \| `"center"` \| `"end"` | Resolved alignment |
 * | `data-variant` | string | User-defined variant |
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Popover content={<div>Panel content</div>}>
 *   <button>Open</button>
 * </Popover>
 * ```
 *
 * @example
 * ```tsx
 * // Modal mode with focus trap
 * <Popover content={<form>...</form>} modal>
 *   <button>Edit</button>
 * </Popover>
 * ```
 *
 * @example
 * ```tsx
 * // With arrow and placement
 * <Popover content="Info" placement="right" showArrow>
 *   <button>Info</button>
 * </Popover>
 * ```
 */
const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      arrowHeight = 7,
      arrowWidth = 14,
      children,
      className,
      closeOnEscape,
      closeOnOutsideClick,
      content,
      defaultOpen,
      disabled,
      exitDuration = 150,
      forceMount = false,
      id: externalId,
      initialFocus = 0,
      maxWidth,
      modal,
      offset: offsetDistance,
      onOpenChange,
      open,
      placement,
      portal = true,
      portalRoot,
      returnFocus = true,
      showArrow,
      strategy,
      variantName,
      viewportPadding,
    },
    ref,
  ) => {
    const autoId = useId();
    const popoverId = externalId ?? `ck-popover-${autoId}`;
    const contentNodeRef = useRef<HTMLDivElement>(null);

    const popover = usePopover({
      closeOnEscape,
      closeOnOutsideClick,
      defaultOpen,
      disabled,
      modal,
      offsetDistance,
      onOpenChange,
      open,
      placement,
      showArrow,
      strategy,
      viewportPadding,
    });

    const { dataState, isMounted } = useExitTransition({
      animateOnMount: true,
      duration: exitDuration,
      isOpen: popover.isOpen,
      nodeRef: contentNodeRef,
    });

    const [side, align = "center"] = popover.resolvedPlacement.split("-") as [
      string,
      string | undefined,
    ];

    const shouldRender = forceMount || isMounted;

    // Clone the trigger child and merge interaction props + ref
    const trigger = isValidElement(children)
      ? cloneElement(
          children as ReactElement<Record<string, unknown>>,
          popover.getReferenceProps({
            ref: mergeRefs<HTMLElement>(
              popover.referenceRef,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (children as any).ref,
            ),
          }),
        )
      : children;

    const popoverContent = shouldRender ? (
      <div
        {...popover.getFloatingProps({
          id: popoverId,
        })}
        className={className}
        style={
          {
            ...popover.floatingStyles,
            ...(maxWidth !== null && maxWidth !== undefined && {
              maxWidth:
                typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
            }),
            "--ck-popover-transform-origin":
              TRANSFORM_ORIGIN[popover.resolvedPlacement] ?? "center center",
            ...(!isMounted &&
              forceMount && {
                pointerEvents: "none",
                visibility: "hidden" as const,
              }),
          } as CSSProperties
        }
        aria-modal={popover.modal ? true : undefined}
        data-align={align}
        data-ck="popover"
        data-side={side}
        data-state={dataState}
        data-variant={variantName}
        ref={mergeRefs<HTMLDivElement>(
          popover.floatingRef,
          contentNodeRef,
          ref,
        )}
      >
        {content}
        {showArrow && (
          <FloatingArrow
            context={popover.context}
            data-ck="popover-arrow"
            height={arrowHeight}
            width={arrowWidth}
            ref={popover.arrowRef}
          />
        )}
      </div>
    ) : null;

    const wrappedContent =
      popoverContent !== null && isMounted ? (
        <FloatingFocusManager
          context={popover.context}
          initialFocus={initialFocus}
          modal={popover.modal}
          returnFocus={returnFocus}
        >
          {popoverContent}
        </FloatingFocusManager>
      ) : (
        popoverContent
      );

    return (
      <>
        {trigger}
        {portal ? (
          <FloatingPortal root={portalRoot ?? undefined}>
            {wrappedContent}
          </FloatingPortal>
        ) : (
          wrappedContent
        )}
      </>
    );
  },
);

Popover.displayName = "Popover";

export { Popover };
