"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";

import { Button, ButtonProps } from "../button/button";

/**
 * An alert component for displaying important messages with optional icon and action.
 *
 * @description
 * The Alert component displays contextual feedback messages for user actions or system
 * states. It supports icons, headings, descriptions, and action buttons to create
 * comprehensive notification experiences.
 *
 * ## Features
 * - Semantic `role="alert"` for screen reader announcements
 * - Live region with `aria-live="polite"` for dynamic updates
 * - Flexible icon support via ReactNode
 * - Optional heading and description slots
 * - Integrated action button support (fixed to size "sm")
 * - Data attributes for CSS-based styling (`data-variant`)
 * - Data slot attributes for targeted styling (`data-slot`)
 * - Conditional data attributes (`data-has-icon`, `data-has-heading`, `data-has-action`)
 *
 * @remarks
 * - Uses `role="alert"` which causes screen readers to announce content immediately
 * - The `aria-live="polite"` attribute ensures updates are announced without interruption
 * - Icon is wrapped in `aria-hidden="true"` as it's decorative (meaning conveyed by text)
 * - Action button size is fixed to "sm" for visual balance
 * - All slots (icon, content, heading, description, action) have `data-slot` attributes
 * - `data-has-*` attributes enable conditional CSS styling based on content presence
 *
 * ## Accessibility
 * This component follows WAI-ARIA Alert Pattern guidelines:
 * - Uses `role="alert"` for immediate screen reader announcement
 * - Uses `aria-live="polite"` to announce updates without interrupting current speech
 * - Icon is marked `aria-hidden="true"` as it's decorative
 * - Heading should use appropriate heading level (`<h2>`, `<h3>`, etc.) if used in document
 * - For critical alerts, consider using `role="alertdialog"` with focus management
 * - Action buttons inherit full keyboard accessibility from Button component
 *
 * ## Alert Types and Usage
 * - **Info**: General information, neutral announcements
 * - **Success**: Positive feedback, completed actions
 * - **Warning**: Cautionary messages, potential issues
 * - **Error/Destructive**: Critical errors, failures requiring attention
 *
 * ## Best Practices
 * - Keep alert messages concise and actionable
 * - Use appropriate variant to match the severity of the message
 * - Provide a clear action when user response is needed
 * - Don't overuse alerts - they should convey important information
 * - Consider dismissible alerts for non-critical messages
 * - Group related information in a single alert rather than multiple
 *
 * @param {ReactNode} [icon] - Icon element to display (decorative, hidden from screen readers).
 * @param {ReactNode} [heading] - The main heading/title of the alert.
 * @param {ReactNode} [description] - The body content of the alert.
 * @param {Omit<ButtonProps, "as" | "size">} [action] - Action button props (size is fixed to "sm", polymorphic "as" not supported).
 * @param {string} [variantName] - The variant name for styling.
 *
 * @example
 * // Basic info alert
 * <Alert
 *   heading="Information"
 *   description="Your settings have been updated."
 *   variantName="info"
 * />
 *
 * @example
 * // Success alert with icon
 * <Alert
 *   icon={<CheckCircleIcon />}
 *   heading="Success!"
 *   description="Your changes have been saved successfully."
 *   variantName="success"
 * />
 *
 * @example
 * // Warning alert with action
 * <Alert
 *   icon={<WarningIcon />}
 *   heading="Warning"
 *   description="Your session will expire in 5 minutes."
 *   action={{
 *     children: "Extend Session",
 *     onClick: handleExtendSession,
 *     variantName: "outline"
 *   }}
 *   variantName="warning"
 * />
 *
 * @example
 * // Error alert with action
 * <Alert
 *   icon={<ErrorIcon />}
 *   heading="Error"
 *   description="Failed to save changes. Please try again."
 *   action={{
 *     children: "Retry",
 *     onClick: handleRetry,
 *     variantName: "destructive"
 *   }}
 *   variantName="destructive"
 * />
 *
 * @example
 * // Alert with rich description content
 * <Alert
 *   heading="Update Available"
 *   description={
 *     <div>
 *       <p>A new version (2.0.0) is available.</p>
 *       <ul>
 *         <li>Performance improvements</li>
 *         <li>Bug fixes</li>
 *       </ul>
 *     </div>
 *   }
 *   action={{ children: "Update Now", onClick: handleUpdate }}
 *   variantName="info"
 * />
 *
 * @example
 * // Description-only alert (minimal)
 * <Alert
 *   description="Please complete all required fields."
 *   variantName="warning"
 * />
 *
 * @example
 * // With semantic heading for document structure
 * <Alert
 *   icon={<InfoIcon />}
 *   heading={<h2>Important Notice</h2>}
 *   description="Please review the updated terms of service."
 *   variantName="info"
 * />
 *
 * @example
 * // With ref for DOM access
 * const alertRef = useRef<HTMLDivElement>(null);
 * <Alert
 *   ref={alertRef}
 *   description="Focusable alert"
 *   variantName="info"
 * />
 */

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  action?: Omit<ButtonProps, "as" | "size">;
  description?: ReactNode;
  heading?: ReactNode;
  icon?: ReactNode;
  variantName?: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { action, className, description, heading, icon, variantName, ...rest },
    ref,
  ) => {
    return (
      <div
        {...rest}
        className={className}
        aria-live="polite"
        data-ck="alert"
        data-has-action={action ? true : undefined}
        data-has-heading={heading ? true : undefined}
        data-has-icon={icon ? true : undefined}
        data-variant={variantName}
        role="alert"
        ref={ref}
      >
        {icon && (
          <div aria-hidden="true" data-slot="icon">
            {icon}
          </div>
        )}
        <div data-slot="content">
          {heading && <div data-slot="heading">{heading}</div>}
          {description && <div data-slot="description">{description}</div>}
        </div>
        {action && (
          <div data-slot="action">
            <Button {...action} size="sm" />
          </div>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export { Alert, type AlertProps };
