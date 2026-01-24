"use client";

import { forwardRef, HTMLAttributes } from "react";

/**
 * A visual separator component for dividing content sections.
 *
 * @description
 * The Separator component renders a semantic `<hr>` element that visually
 * and semantically divides content. It supports both horizontal and vertical
 * orientations and includes proper accessibility attributes.
 *
 * ## Features
 * - Renders semantic `<hr>` element
 * - Supports horizontal and vertical orientations
 * - Includes proper ARIA attributes for accessibility
 * - Data attributes for CSS-based styling (`data-orientation`)
 *
 * @remarks
 * - Defaults to horizontal orientation
 * - Uses `role="separator"` for explicit accessibility
 * - Sets both `aria-orientation` and `data-orientation` for styling flexibility
 * - Forwards refs correctly for DOM access
 *
 * ## Accessibility
 * This component follows WAI-ARIA Separator Pattern guidelines:
 * - Uses `role="separator"` to explicitly indicate its purpose
 * - Sets `aria-orientation` to communicate orientation to assistive technologies
 * - The `<hr>` element is inherently accessible as a thematic break
 * - For decorative separators, consider using `aria-hidden="true"`
 *
 * @param {"horizontal" | "vertical"} [orientation="horizontal"] - The orientation of the separator.
 *
 * @example
 * // Horizontal separator (default)
 * <Separator />
 *
 * @example
 * // Vertical separator
 * <Separator orientation="vertical" />
 *
 * @example
 * // With custom styling via className
 * <Separator className="my-4 border-gray-300" />
 *
 * @example
 * // Decorative separator (hidden from screen readers)
 * <Separator aria-hidden="true" />
 *
 * @example
 * // With aria-label for additional context
 * <Separator aria-label="Section divider" />
 */

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...rest }, ref) => {
    return (
      <hr
        {...rest}
        className={className}
        aria-orientation={orientation}
        data-ck="separator"
        data-orientation={orientation}
        role="separator"
        ref={ref}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator, type SeparatorProps };
