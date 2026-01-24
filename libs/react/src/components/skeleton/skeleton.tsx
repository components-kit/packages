"use client";

import { CSSProperties, forwardRef, HTMLAttributes } from "react";

/**
 * A placeholder loading component that indicates content is being loaded.
 *
 * @description
 * The Skeleton component provides a visual placeholder while content is loading.
 * It renders a styled `<div>` element that can be customized with dimensions
 * and styling to match the expected content layout.
 *
 * ## Features
 * - Customizable width and height via props
 * - Supports all standard div HTML attributes
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Inline styles for dimensions with style prop merging
 *
 * @remarks
 * - Width and height props are applied as inline styles
 * - Additional styles can be passed via the `style` prop and will be merged
 * - Use CSS animations (pulse, shimmer) via className or external styles
 * - Forwards refs correctly for DOM access
 *
 * ## Accessibility
 * For proper accessibility, consider the following:
 * - Use `aria-busy="true"` on the container being loaded to indicate loading state
 * - Use `aria-label` to describe what content is loading (e.g., "Loading user profile")
 * - Use `role="status"` with `aria-live="polite"` for screen reader announcements
 * - Skeletons are typically decorative; the loading state should be communicated
 *   at a higher level (e.g., on the parent container)
 *
 * @param {string} [height] - The height of the skeleton (e.g., "100px", "50%").
 * @param {string} [width] - The width of the skeleton (e.g., "200px", "100%").
 * @param {string} [variantName] - The variant name for styling.
 *
 * @example
 * // Basic skeleton with dimensions
 * <Skeleton height="100px" width="200px" />
 *
 * @example
 * // Full-width skeleton
 * <Skeleton height="20px" width="100%" />
 *
 * @example
 * // Text line skeleton
 * <Skeleton height="1em" width="80%" />
 *
 * @example
 * // Avatar skeleton (circular via className)
 * <Skeleton
 *   height="48px"
 *   width="48px"
 *   className="rounded-full"
 * />
 *
 * @example
 * // With accessibility attributes
 * <div aria-busy="true" aria-label="Loading content">
 *   <Skeleton height="20px" width="100%" />
 *   <Skeleton height="20px" width="80%" />
 * </div>
 *
 * @example
 * // With role and aria-label for screen readers
 * <Skeleton
 *   role="status"
 *   aria-label="Loading user name"
 *   height="24px"
 *   width="150px"
 * />
 */

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: string;
  variantName?: string;
  width?: string;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, height, style, variantName, width, ...rest }, ref) => {
    const skeletonStyle: CSSProperties = {
      ...style,
      height,
      width,
    };

    return (
      <div
        {...rest}
        className={className}
        style={skeletonStyle}
        data-ck="skeleton"
        data-variant={variantName}
        ref={ref}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton, type SkeletonProps };
