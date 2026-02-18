"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";

import type { VariantFor } from "../../types/register";

/**
 * An icon wrapper component for consistent icon sizing and styling.
 *
 * @description
 * The Icon component wraps icon library components (e.g., Lucide, Heroicons) with
 * consistent sizing via the `size` prop. Sizing is controlled through data attributes,
 * allowing CSS-based customization.
 *
 * ## Features
 * - Wraps any icon library component as children
 * - Discrete size variants: `sm`, `md`, `lg`
 * - Data attributes for CSS-based styling (`data-size`, `data-variant`)
 * - Full TypeScript support
 * - Forwards refs correctly for DOM access
 *
 * @remarks
 * - Always renders as a `<span>` element
 * - Size defaults to `"md"` for consistent icon sizing
 * - Sizing is handled via `data-size` attribute — define dimensions in your CSS
 * - Accepts any valid React node as children (icon components, SVGs, etc.)
 *
 * ## Accessibility
 * This component includes `aria-hidden="true"` by default because most icons are
 * decorative (e.g., icon next to text that describes the same thing).
 *
 * For **meaningful icons** that convey information not available in surrounding text:
 * - Override with `aria-hidden={false}` and add `aria-label` to describe the meaning
 * - Use `role="img"` with `aria-label` for standalone meaningful icons
 *
 * For **interactive icons** (in buttons):
 * - Keep the default `aria-hidden="true"` on the icon
 * - Provide `aria-label` on the parent button element instead
 *
 * ## Best Practices
 * - Provide accessible labels for icons that convey meaning
 * - Use `aria-hidden="true"` for decorative icons to reduce screen reader noise
 * - Ensure sufficient color contrast for icon visibility
 * - Don't rely solely on color to convey icon meaning
 * - Keep icon sizes appropriate for touch targets (minimum 44x44px for interactive icons)
 * - Use consistent icon sizes throughout the application
 *
 * @param {"sm" | "md" | "lg"} [size="md"] - The size of the icon.
 * @param {VariantFor<"icon">} [variantName] - The variant name for styling.
 * @param {ReactNode} children - The icon content (icon component, SVG, etc.).
 *
 * @example
 * // Basic icon wrapping a Lucide icon
 * <Icon>
 *   <Search />
 * </Icon>
 *
 * @example
 * // Small icon
 * <Icon size="sm">
 *   <Check />
 * </Icon>
 *
 * @example
 * // Large icon with variant
 * <Icon size="lg" variantName="primary">
 *   <Star />
 * </Icon>
 *
 * @example
 * // Meaningful icon (override aria-hidden)
 * <Icon aria-hidden={false} aria-label="Warning" role="img">
 *   <AlertTriangle />
 * </Icon>
 *
 * @example
 * // Icon button (aria-hidden stays true, label on button)
 * <button aria-label="Close dialog">
 *   <Icon size="sm">
 *     <X />
 *   </Icon>
 * </button>
 */

interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  children?: ReactNode;
  size?: "lg" | "md" | "sm";
  variantName?: VariantFor<"icon">;
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ children, className, size = "md", variantName, ...rest }, ref) => {
    return (
      <span
        aria-hidden="true"
        {...rest}
        className={className}
        data-ck="icon"
        data-size={size}
        data-variant={variantName}
        ref={ref}
      >
        {children}
      </span>
    );
  },
);

Icon.displayName = "Icon";

export { Icon, type IconProps };
