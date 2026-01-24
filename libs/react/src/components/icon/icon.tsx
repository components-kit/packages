"use client";

import { CSSProperties, ElementType, ReactNode, Ref } from "react";

import {
  createPolymorphicComponent,
  PolymorphicComponentPropsWithRef,
} from "../../types";

/**
 * A polymorphic icon container component for rendering icons with controlled dimensions.
 *
 * @description
 * The Icon component provides a flexible container for rendering icons with consistent
 * sizing. It wraps user-provided icon content (SVGs, icon components, etc.) and applies
 * width and height styling. The component is polymorphic, allowing it to render as
 * different HTML elements based on the use case.
 *
 * ## Features
 * - Polymorphic: renders as `<span>` by default, but can be any HTML element
 * - Controlled dimensions via `width` and `height` props
 * - Inline-flex display for proper alignment with text
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Full TypeScript support with proper prop inference
 * - Forwards refs correctly for DOM access
 *
 * @remarks
 * - Defaults to rendering as `<span>` element (inline by nature)
 * - The `as` prop controls the rendered HTML element
 * - Width and height default to "20px" for consistent icon sizing
 * - Uses inline-flex display for proper icon alignment
 * - Accepts any valid React node as children (SVGs, icon components, etc.)
 *
 * ## Accessibility
 * This component should follow proper icon accessibility practices:
 * - **Decorative icons**: Use `aria-hidden="true"` when the icon is purely decorative
 *   and doesn't convey meaning (e.g., icon next to text that describes the same thing)
 * - **Meaningful icons**: Use `aria-label` to describe the icon's meaning when it
 *   conveys information not available in surrounding text
 * - **Interactive icons**: When used in buttons, ensure the parent button has an
 *   accessible name via `aria-label` or visible text
 * - Use `role="img"` with `aria-label` for standalone meaningful icons
 * - Consider using `<title>` element inside SVGs for tooltip and accessibility
 * - For icon-only buttons, always provide `aria-label` on the button element
 *
 * ## Best Practices
 * - Provide accessible labels for icons that convey meaning
 * - Use `aria-hidden="true"` for decorative icons to reduce screen reader noise
 * - Ensure sufficient color contrast for icon visibility
 * - Don't rely solely on color to convey icon meaning
 * - Keep icon sizes appropriate for touch targets (minimum 44x44px for interactive icons)
 * - Use consistent icon sizes throughout the application
 *
 * @param {ElementType} [as="span"] - The HTML element to render as.
 * @param {string} [width="20px"] - The width of the icon container.
 * @param {string} [height="20px"] - The height of the icon container.
 * @param {string} [variantName] - The variant name for styling.
 * @param {ReactNode} children - The icon content (SVG, icon component, etc.).
 *
 * @example
 * // Basic icon with SVG child
 * <Icon width="24px" height="24px">
 *   <svg viewBox="0 0 24 24">
 *     <path d="M12 2L2 7l10 5 10-5-10-5z" />
 *   </svg>
 * </Icon>
 *
 * @example
 * // Decorative icon (hidden from screen readers)
 * <Icon aria-hidden="true" width="16px" height="16px">
 *   <CheckmarkSvg />
 * </Icon>
 * <span>Success</span>
 *
 * @example
 * // Meaningful icon with accessible label
 * <Icon aria-label="Warning" role="img" width="20px" height="20px">
 *   <WarningSvg />
 * </Icon>
 *
 * @example
 * // Icon button with accessibility
 * <button aria-label="Close dialog">
 *   <Icon aria-hidden="true">
 *     <CloseSvg />
 *   </Icon>
 * </button>
 *
 * @example
 * // With variant styling
 * <Icon variantName="primary" width="32px" height="32px">
 *   <StarSvg />
 * </Icon>
 *
 * @example
 * // As different element
 * <Icon as="div" width="48px" height="48px">
 *   <LargeLogoSvg />
 * </Icon>
 *
 * @example
 * // With custom styling
 * <Icon
 *   className="text-blue-500"
 *   style={{ opacity: 0.8 }}
 *   width="24px"
 *   height="24px"
 * >
 *   <InfoSvg />
 * </Icon>
 *
 * @example
 * // With ref for DOM access
 * const iconRef = useRef<HTMLSpanElement>(null);
 * <Icon ref={iconRef}>
 *   <CustomIcon />
 * </Icon>
 */

interface IconOwnProps {
  children?: ReactNode;
  height?: string;
  style?: CSSProperties;
  variantName?: string;
  width?: string;
}

type IconProps<C extends ElementType = "span"> = PolymorphicComponentPropsWithRef<
  C,
  IconOwnProps
>;

const Icon = createPolymorphicComponent<"span", IconOwnProps>(
  (props, ref: Ref<Element>) => {
    const {
      as: Component = "span",
      children,
      className,
      height = "20px",
      style,
      variantName,
      width = "20px",
      ...rest
    } = props;

    const iconStyle: CSSProperties = {
      ...style,
      alignItems: "center",
      display: "inline-flex",
      height,
      justifyContent: "center",
      width,
    };

    return (
      <Component
        {...rest}
        className={className}
        style={iconStyle}
        data-ck="icon"
        data-variant={variantName}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Icon.displayName = "Icon";

export { Icon, type IconProps };
