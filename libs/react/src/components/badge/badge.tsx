"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";

import type { VariantFor } from "../../types/register";

import { Slot } from "../slot/slot";

/**
 * A small status indicator component for highlighting information.
 *
 * @description
 * The Badge component displays short status information, counts, or labels.
 * It's commonly used to indicate status, highlight new content, show counts,
 * or categorize items. The component supports composition through the `asChild`
 * pattern for flexible rendering.
 *
 * ## Features
 * - Three size variants: sm, md, lg
 * - Composition pattern via `asChild` prop
 * - Data attributes for CSS-based styling (`data-variant`, `data-size`)
 * - Ref forwarding for DOM access
 * - Supports all standard span HTML attributes
 *
 * @remarks
 * - Defaults to rendering as a `<span>` element
 * - When `asChild` is true, merges props with the single child element
 * - Size is controlled via `data-size` attribute for CSS styling
 * - Variant is controlled via `data-variant` attribute for CSS styling
 *
 * ## Accessibility
 * This component should follow proper badge accessibility practices:
 * - Badges are typically decorative and don't need special ARIA roles
 * - When a badge conveys important status, associate it with the related element
 *   using `aria-describedby` on the parent or use visually hidden text
 * - For notification counts, consider using `aria-label` on the parent element
 *   (e.g., "Messages, 5 unread")
 * - Don't rely solely on color to convey meaning; use text or icons
 * - For dynamic badges (e.g., live counts), consider using `aria-live="polite"`
 * - Interactive badges should use `asChild` with a button or link
 *
 * ## Best Practices
 * - Keep badge text short (1-2 words or numbers)
 * - Use consistent badge colors for similar statuses across the app
 * - Position badges relative to the element they describe
 * - Consider hiding badges with zero counts if they're not meaningful
 * - Use appropriate semantic colors (red for errors, green for success, etc.)
 *
 * @param {boolean} [asChild=false] - Merge props with child element instead of wrapping.
 * @param {string} [size="md"] - The size of the badge: "sm", "md", or "lg".
 * @param {VariantFor<"badge">} [variantName] - The variant name for styling.
 * @param {ReactNode} children - The badge content.
 *
 * @example
 * // Basic badge
 * <Badge>New</Badge>
 *
 * @example
 * // With size variants
 * <Badge size="sm">Small</Badge>
 * <Badge size="md">Medium</Badge>
 * <Badge size="lg">Large</Badge>
 *
 * @example
 * // With variant styling
 * <Badge variantName="success">Active</Badge>
 * <Badge variantName="error">Failed</Badge>
 * <Badge variantName="warning">Pending</Badge>
 *
 * @example
 * // Notification count badge
 * <button aria-label="Messages, 5 unread">
 *   <MailIcon />
 *   <Badge size="sm" variantName="notification">5</Badge>
 * </button>
 *
 * @example
 * // Status badge with accessible description
 * <div>
 *   <span id="order-status">Order Status:</span>
 *   <Badge aria-describedby="order-status" variantName="success">
 *     Shipped
 *   </Badge>
 * </div>
 *
 * @example
 * // As child pattern (merges with button)
 * <Badge asChild variantName="primary">
 *   <button type="button">Click me</button>
 * </Badge>
 *
 * @example
 * // Category tag badge
 * <Badge variantName="category" size="sm">Technology</Badge>
 *
 * @example
 * // Live count with aria-live (for screen readers)
 * <div aria-live="polite" aria-atomic="true">
 *   <Badge variantName="count">{notificationCount}</Badge>
 * </div>
 *
 * @example
 * // With custom styling
 * <Badge
 *   className="rounded-full"
 *   style={{ backgroundColor: 'purple' }}
 *   variantName="custom"
 * >
 *   Custom
 * </Badge>
 *
 * @example
 * // With ref for DOM access
 * const badgeRef = useRef<HTMLSpanElement>(null);
 * <Badge ref={badgeRef}>Ref Badge</Badge>
 */

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  children?: ReactNode;
  size?: "lg" | "md" | "sm";
  variantName?: VariantFor<"badge">;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { asChild = false, children, className, size = "md", variantName, ...rest },
    ref
  ) => {
    const sharedProps = {
      ...rest,
      className,
      "data-ck": "badge",
      "data-size": size,
      "data-variant": variantName,
      ref,
    };

    if (asChild) {
      return (
        <Slot asChild {...sharedProps}>
          {children}
        </Slot>
      );
    }

    return <span {...sharedProps}>{children}</span>;
  }
);

Badge.displayName = "Badge";

export { Badge, type BadgeProps };
