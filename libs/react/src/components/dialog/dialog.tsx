"use client";

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";
import {
  cloneElement,
  type CSSProperties,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useCallback,
  useId,
  useRef,
} from "react";

import type { VariantFor } from "../../types/register";

import { useExitTransition } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import { useDialog } from "./use-dialog";

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

/**
 * Props for the Dialog component.
 */
export interface DialogProps {
  /**
   * Dialog body content.
   */
  children: ReactNode;

  /**
   * Additional className on the dialog content panel.
   */
  className?: string;

  /**
   * Close on Escape key press.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Close when clicking the overlay backdrop.
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Exit animation duration in ms (fallback timeout for CSS animations).
   * @default 150
   */
  exitDuration?: number;

  /**
   * Keep content mounted when closed. Useful for animation libraries
   * that manage their own enter/exit animations.
   * Content is rendered with `data-state="closed"` and `visibility: hidden`.
   * @default false
   */
  forceMount?: boolean;

  /**
   * ID for the dialog element. Auto-generated if not provided.
   */
  id?: string;

  /**
   * Initial focus target when the dialog opens.
   * - `number`: index of the tabbable element (0 = first, -1 = floating element itself)
   * - `RefObject`: ref to the element to focus
   * @default 0
   */
  initialFocus?: number | RefObject<HTMLElement | null>;

  /**
   * Callback when open state changes. Used with `open` for controlled mode.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Controlled open state. Use with `onOpenChange`.
   */
  open?: boolean;

  /**
   * Additional className on the overlay backdrop.
   */
  overlayClassName?: string;

  /**
   * Whether to render the dialog in a portal. Prevents overflow clipping.
   * @default true
   */
  portal?: boolean;

  /**
   * Explicit portal root element. Defaults to `document.body`.
   */
  portalRoot?: HTMLElement | null;

  /**
   * Whether to return focus to the trigger when the dialog closes.
   * @default true
   */
  returnFocus?: boolean;

  /**
   * ARIA role for the dialog.
   * - `"dialog"`: standard dialog
   * - `"alertdialog"`: requires explicit user action to dismiss
   * @default "dialog"
   */
  role?: "alertdialog" | "dialog";

  /**
   * Optional trigger element. When provided, clicking it toggles the dialog.
   * Must accept a ref.
   */
  trigger?: ReactElement;

  /**
   * Variant name for the `data-variant` attribute.
   */
  variantName?: VariantFor<"dialog">;
}

/**
 * A headless, accessible Dialog (modal) component.
 *
 * @description
 * Provides a full-screen overlay modal for focused interactions, powered by
 * `@floating-ui/react` for focus management and accessibility.
 *
 * ## Features
 * - Free-form children — consumer controls all content structure
 * - Optional trigger element or fully controlled mode
 * - `role="dialog"` or `role="alertdialog"` for confirmations
 * - Focus trapping via `FloatingFocusManager`
 * - Scroll lock via `FloatingOverlay`
 * - Configurable overlay click and Escape key dismiss
 * - Portal rendering (on by default)
 * - CSS exit animations via `data-state` attribute
 *
 * ## Keyboard Support
 *
 * | Key | Action |
 * | --- | --- |
 * | `Escape` | Close dialog (configurable) |
 * | `Tab` | Navigate within dialog (focus trapped) |
 *
 * ## Accessibility
 *
 * Follows the WAI-ARIA Dialog (Modal) pattern:
 * - `role="dialog"` or `role="alertdialog"` on the dialog element
 * - `aria-modal="true"` for screen reader isolation
 * - Focus is trapped within the dialog
 * - Focus returns to trigger on close
 * - `aria-haspopup` and `aria-expanded` on trigger (when provided)
 *
 * ## Data Attributes
 *
 * | Attribute | Values | Description |
 * | --- | --- | --- |
 * | `data-ck` | `"dialog"` | Content panel identifier |
 * | `data-ck` | `"dialog-overlay"` | Overlay backdrop identifier |
 * | `data-state` | `"open"` \| `"closed"` | Animation state |
 * | `data-variant` | string | User-defined variant |
 *
 * @example
 * ```tsx
 * // With trigger (uncontrolled)
 * <Dialog trigger={<button>Open</button>}>
 *   <h2>Settings</h2>
 *   <p>Configure your preferences.</p>
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // Controlled (no trigger)
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <h2>Confirm</h2>
 *   <button onClick={() => setIsOpen(false)}>Close</button>
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // Alert dialog
 * <Dialog role="alertdialog" trigger={<button>Delete</button>}>
 *   <h2>Are you sure?</h2>
 *   <button>Cancel</button>
 *   <button>Delete</button>
 * </Dialog>
 * ```
 */
const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      children,
      className,
      closeOnEscape,
      closeOnOverlayClick = true,
      defaultOpen,
      exitDuration = 150,
      forceMount = false,
      id: externalId,
      initialFocus = 0,
      onOpenChange,
      open,
      overlayClassName,
      portal = true,
      portalRoot,
      returnFocus = true,
      role: dialogRole,
      trigger,
      variantName,
    },
    ref,
  ) => {
    const autoId = useId();
    const dialogId = externalId ?? `ck-dialog-${autoId}`;
    const contentNodeRef = useRef<HTMLDivElement>(null);

    const dialog = useDialog({
      closeOnEscape,
      defaultOpen,
      hasTrigger: trigger !== undefined,
      onOpenChange,
      open,
      role: dialogRole,
    });

    const { dataState, isMounted } = useExitTransition({
      animateOnMount: true,
      duration: exitDuration,
      isOpen: dialog.isOpen,
      nodeRef: contentNodeRef,
    });

    const shouldRender = forceMount || isMounted;

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          dialog.setIsOpen(false);
        }
      },
      [closeOnOverlayClick, dialog],
    );

    // Clone the trigger element and merge interaction props + ref
    const triggerElement =
      trigger !== undefined && isValidElement(trigger)
        ? cloneElement(
            trigger as ReactElement<Record<string, unknown>>,
            dialog.getReferenceProps({
              ref: mergeRefs<HTMLElement>(
                dialog.referenceRef,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (trigger as any).ref,
              ),
            }),
          )
        : null;

    const dialogContent = shouldRender ? (
      <FloatingOverlay
        className={overlayClassName}
        style={
          !isMounted && forceMount
            ? ({
                pointerEvents: "none",
                visibility: "hidden",
              } as CSSProperties)
            : undefined
        }
        data-ck="dialog-overlay"
        data-state={dataState}
        lockScroll
        onClick={handleOverlayClick}
      >
        <div
          {...dialog.getFloatingProps({
            id: dialogId,
          })}
          className={className}
          aria-modal={true}
          data-ck="dialog"
          data-state={dataState}
          data-variant={variantName}
          ref={mergeRefs<HTMLDivElement>(
            dialog.floatingRef,
            contentNodeRef,
            ref,
          )}
        >
          {children}
        </div>
      </FloatingOverlay>
    ) : null;

    const wrappedContent =
      dialogContent !== null && isMounted ? (
        <FloatingFocusManager
          context={dialog.context}
          initialFocus={initialFocus}
          modal
          returnFocus={returnFocus}
        >
          {dialogContent}
        </FloatingFocusManager>
      ) : (
        dialogContent
      );

    return (
      <>
        {triggerElement}
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

Dialog.displayName = "Dialog";

export { Dialog };
