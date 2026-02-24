"use client";

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  type Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { type ReactNode, useState } from "react";

/* ── Tooltip ── */

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  openDelay?: number;
  placement?: Placement;
}

function Tooltip({
  children,
  content,
  openDelay = 120,
  placement = "top",
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { context, floatingStyles, refs } = useFloating({
    middleware: [offset(6), flip(), shift({ padding: 5 })],
    onOpenChange: setIsOpen,
    open: isOpen,
    placement,
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { close: 0, open: openDelay },
    move: false,
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: "scale(0.96)" },
  });

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="inline-flex"
      >
        {children}
      </span>
      {isMounted && (
        <FloatingPortal>
          <div
            style={floatingStyles}
            ref={refs.setFloating}
            {...getFloatingProps()}
            className="z-50 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900"
          >
            <div style={transitionStyles}>{content}</div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

export { Tooltip };
