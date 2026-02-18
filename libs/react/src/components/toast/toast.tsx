"use client";

import { ReactNode } from "react";
import { ExternalToast, toast as sonnerToast } from "sonner";

import type { VariantFor } from "../../types/register";

import { Button, ButtonProps } from "../button/button";

/**
 * A toast notification function powered by Sonner for displaying temporary messages and alerts with semantic markup.
 *
 * @description
 * The Toast function creates contextual notification messages with title, description, and optional action buttons.
 * It uses Sonner's toast management with custom semantic markup, ARIA attributes, and data attributes for CSS-based styling.
 *
 * ## Features
 * - Semantic markup with `role="status"` and `aria-live="polite"`
 * - Title, description, and action button slots
 * - Decorative icon slot (aria-hidden by default)
 * - Data attributes for CSS-based styling (`data-variant`, `data-has-*`)
 * - Data slot attributes for targeted styling (`data-slot`)
 * - Auto-dismisses on button click
 * - Returns toast ID for manual dismissal
 * - Supports all Sonner ExternalToast options (duration, position, etc.)
 *
 * @remarks
 * - Built on Sonner library - requires `<Toaster />` component in app root
 * - **Important:** Import `<Toaster />` from `sonner` directly, not from this package (prevents "use client" boundary issues in Next.js)
 * - Uses `toast.custom()` internally with semantic markup
 * - Action button auto-dismisses toast on click
 * - Action button uses the shared `Button` component with `size="sm"` for consistent accessibility and styling
 * - Button inherits `Button` component features: `aria-disabled`, `aria-busy`, `data-size`, icon support
 * - Button variant is controlled by the parent toast's `variantName` via CSS (e.g., `[data-ck="toast"][data-variant="error"] [data-ck="button"]`)
 * - Icon slot is always rendered but hidden from screen readers
 * - Returns toast ID (number or string) that can be used with `sonner.dismiss(id)`
 *
 * ## Accessibility
 * This component follows WAI-ARIA Live Region guidelines:
 * - Uses `role="status"` for screen reader announcements
 * - Uses `aria-live="polite"` to announce without interrupting current speech
 * - Icon is marked `aria-hidden="true"` as it's decorative (meaning conveyed by text)
 * - Action button is fully keyboard accessible:
 *   - Uses shared `Button` component with built-in keyboard support, `aria-disabled`, and `aria-busy`
 *   - Has `type="button"` to prevent form submission
 *   - Focusable and activatable with Space/Enter keys
 *   - Has visible text label from `button.label` prop
 *   - Supports `isLoading`, `leadingIcon`, and `trailingIcon` props
 * - Title and description are announced by screen readers
 * - Auto-dismiss doesn't interrupt user interaction
 *
 * ## Best Practices
 * - Keep toast messages concise and scannable (1-2 short sentences)
 * - Use appropriate variant to match message severity
 * - Provide action button only when immediate user response is needed
 * - Don't use toasts for critical information - use alerts or dialogs instead
 * - Consider toast frequency - avoid overwhelming users with notifications
 * - Test with screen readers to ensure announcements are clear
 * - Remember to install `sonner` and add `<Toaster />` to your app root
 *
 * @param {string | ReactNode} title - The main title/heading of the toast. Required. Can be a string or React element for rich content.
 * @param {string | ReactNode} [description] - The body content of the toast. Optional. Can be a string or React element for rich content.
 * @param {Omit<ButtonProps, "asChild" | "children" | "size" | "variantName"> & { label: string }} [button] - Action button configuration. Optional. Uses the shared `Button` component with `size="sm"`. Accepts Button props (isLoading, leadingIcon, trailingIcon, etc.) plus a required `label` for button text. Button variant is controlled by the parent toast's `variantName` via CSS. Toast auto-dismisses on click.
 * @param {VariantFor<"toast">} [variantName] - The variant name for CSS-based styling. Optional. No default - controlled via CSS.
 * @param {number} [duration=4000] - Time in milliseconds before auto-dismiss. Default is 4000ms (4 seconds). From Sonner's ExternalToast.
 * @param {'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'} [position='bottom-right'] - Toast position on screen. Default is 'bottom-right'. From Sonner's ExternalToast.
 * @param {boolean} [dismissible=true] - Whether toast can be dismissed by user (swipe). Default is true. From Sonner's ExternalToast.
 *
 * @returns {number | string} The toast ID that can be used to manually dismiss the toast with `sonnerToast.dismiss(id)`.
 *
 * @example
 * // Basic toast with title only
 * toast({
 *   title: "Settings saved",
 *   variantName: "success"
 * });
 *
 * @example
 * // Toast with title and description
 * toast({
 *   title: "Update available",
 *   description: "A new version of the app is ready to install.",
 *   variantName: "info"
 * });
 *
 * @example
 * // Toast with action button
 * toast({
 *   title: "Item deleted",
 *   description: "The item has been removed from your list.",
 *   button: {
 *     label: "Undo",
 *     onClick: () => restoreItem()
 *   },
 *   variantName: "info"
 * });
 *
 * @example
 * // Toast with custom duration and position
 * toast({
 *   title: "Session expiring soon",
 *   description: "Your session will expire in 5 minutes.",
 *   duration: 300000, // 5 minutes
 *   position: "top-center",
 *   variantName: "warning"
 * });
 *
 * @example
 * // Toast with rich content (ReactNode)
 * toast({
 *   title: "Installation complete",
 *   description: (
 *     <div>
 *       <p>Version 2.0.0 has been installed.</p>
 *       <ul>
 *         <li>Performance improvements</li>
 *         <li>New features</li>
 *         <li>Bug fixes</li>
 *       </ul>
 *     </div>
 *   ),
 *   button: {
 *     label: "View changelog",
 *     onClick: () => openChangelog()
 *   },
 *   variantName: "success"
 * });
 *
 * @example
 * // Manual dismissal using returned ID
 * import { toast as sonnerToast } from 'sonner';
 *
 * const toastId = toast({
 *   title: "Processing...",
 *   description: "Please wait while we process your request.",
 *   duration: Infinity // Won't auto-dismiss
 * });
 *
 * // Later, dismiss manually
 * sonnerToast.dismiss(toastId);
 *
 * @example
 * // Toast with Sonner options
 * toast({
 *   title: "Network error",
 *   description: "Failed to connect to server. Please check your connection.",
 *   variantName: "error",
 *   duration: 10000,
 *   position: "top-right",
 *   dismissible: true,
 *   className: "custom-toast-class",
 *   style: { border: '2px solid red' }
 * });
 *
 * @example
 * // Important: Setup required in app root
 * // In your layout.tsx or _app.tsx:
 * import { Toaster } from 'sonner'; // Import from sonner, not @components-kit/react
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Toaster />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 */

interface ToastProps extends Omit<
  ExternalToast,
  | "action"
  | "actionButtonStyle"
  | "cancel"
  | "cancelButtonStyle"
  | "closeButton"
  | "description"
  | "icon"
  | "invert"
> {
  button?: Omit<
    ButtonProps,
    "asChild" | "children" | "size" | "variantName"
  > & {
    label: string;
  };
  description?: string | ReactNode;
  title: string | ReactNode;
  variantName?: VariantFor<"toast">;
}

function ToastAction({
  button,
  toastId,
}: {
  button: NonNullable<ToastProps["button"]>;
  toastId: number | string;
}) {
  const { label, onClick: buttonOnClick, ...buttonRest } = button;
  return (
    <Button
      {...buttonRest}
      data-slot="action"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        buttonOnClick?.(e);
        sonnerToast.dismiss(toastId);
      }}
    >
      {label}
    </Button>
  );
}

const toastFn = (options: ToastProps): number | string => {
  const { button, description, title, variantName, ...rest } = options;

  return sonnerToast.custom(
    (t) => (
      <div
        aria-live="polite"
        data-ck="toast"
        data-has-action={button ? true : undefined}
        data-has-description={description ? true : undefined}
        data-has-title={title ? true : undefined}
        data-variant={variantName}
        role="status"
      >
        <div aria-hidden="true" data-slot="icon" />
        <div data-slot="content">
          {title && <div data-slot="title">{title}</div>}
          {description && <div data-slot="description">{description}</div>}
        </div>
        {button && (
          <div data-slot="actions">
            <ToastAction button={button} toastId={t} />
          </div>
        )}
      </div>
    ),
    rest,
  );
};

const toast = Object.assign(toastFn, { displayName: "Toast" });

export { toast, type ToastProps };
