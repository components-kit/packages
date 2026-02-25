"use client";

import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useCallback, useState } from "react";

/**
 * Configuration options for the Dialog positioning and interaction hook.
 *
 * @remarks
 * This hook wraps `@floating-ui/react` directly (not via the generic `useFloating` wrapper)
 * because dialog interaction hooks (`useClick`, `useDismiss`, `useRole`)
 * require the full `FloatingContext` with `open`/`onOpenChange` wired in.
 *
 * Unlike `usePopover` and `useTooltip`, this hook uses no positioning middleware —
 * Dialog is centered via CSS, not Floating UI positioning.
 */
export interface UseDialogOptions {
  /**
   * Close on Escape key press.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Whether a trigger element is provided (enables `useClick`).
   * @default false
   */
  hasTrigger?: boolean;

  /**
   * Callback when open state changes. Used for controlled mode.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Controlled open state.
   */
  open?: boolean;

  /**
   * ARIA role for the dialog.
   * - `"dialog"`: standard dialog
   * - `"alertdialog"`: requires explicit user action to dismiss
   * @default "dialog"
   */
  role?: "alertdialog" | "dialog";
}

/**
 * Return type for the useDialog hook.
 */
export interface UseDialogReturn {
  /**
   * Floating UI context. Required by `FloatingFocusManager`.
   */
  context: ReturnType<typeof useFloating>["context"];

  /**
   * Ref setter for the floating (dialog content) element.
   */
  floatingRef: (node: HTMLElement | null) => void;

  /**
   * Returns props to spread on the floating (dialog) element.
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
   * Whether the dialog is currently open.
   */
  isOpen: boolean;

  /**
   * Ref setter for the reference (trigger) element.
   */
  referenceRef: (node: HTMLElement | null) => void;

  /**
   * Set the open state programmatically.
   */
  setIsOpen: (open: boolean) => void;
}

/**
 * Core hook for Dialog interaction management.
 *
 * @description
 * Wraps `@floating-ui/react` with dialog-specific interactions:
 * - Optional click trigger to toggle open/close
 * - Dismiss on Escape key
 * - Dialog or alertdialog ARIA role
 *
 * Unlike tooltip/popover hooks, this hook uses no positioning middleware —
 * Dialog is centered via CSS, not Floating UI positioning.
 *
 * @remarks
 * Uses `@floating-ui/react`'s `useFloating` directly because the interaction hooks
 * require the full `FloatingContext` with `open`/`onOpenChange`.
 *
 * @see {@link UseDialogOptions} for configuration
 */
export function useDialog(options: UseDialogOptions = {}): UseDialogReturn {
  const {
    closeOnEscape = true,
    defaultOpen = false,
    hasTrigger = false,
    onOpenChange: controlledOnOpenChange,
    open: controlledOpen,
    role: dialogRole = "dialog",
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

  const floating = useFloating({
    onOpenChange: setIsOpen,
    open: isOpen,
  });

  const { context } = floating;

  const clickInteraction = useClick(context, {
    enabled: hasTrigger,
  });

  const dismissInteraction = useDismiss(context, {
    escapeKey: closeOnEscape,
    outsidePress: false,
  });

  const roleInteraction = useRole(context, {
    role: dialogRole,
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    clickInteraction,
    dismissInteraction,
    roleInteraction,
  ]);

  return {
    context,
    floatingRef: floating.refs.setFloating,
    getFloatingProps,
    getReferenceProps,
    isOpen,
    referenceRef: floating.refs.setReference,
    setIsOpen,
  };
}
