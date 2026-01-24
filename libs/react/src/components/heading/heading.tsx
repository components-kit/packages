"use client";

import { ElementType, ReactNode, Ref } from "react";

import {
  createPolymorphicComponent,
  PolymorphicComponentPropsWithRef,
} from "../../types";

/**
 * A polymorphic heading component for rendering semantic headings or styled text elements.
 *
 * @description
 * The Heading component renders text with heading styles while allowing control over
 * the semantic HTML element used. It supports all heading levels (h1-h6) as well as
 * non-semantic elements like div or span for visual-only heading styles.
 *
 * ## Features
 * - Polymorphic: renders as h1 by default, but can be any HTML element
 * - Supports all standard heading levels (h1-h6)
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Full TypeScript support with proper prop inference
 * - Forwards refs correctly for DOM access
 *
 * @remarks
 * - Defaults to rendering as `<h1>` element
 * - The `as` prop controls the rendered HTML element
 * - Use semantic heading elements (h1-h6) when the heading represents document structure
 * - Use non-semantic elements (div, span) with `role="heading"` and `aria-level` for
 *   visual headings that don't represent document structure
 *
 * ## Accessibility
 * This component should follow proper heading hierarchy for accessibility:
 * - Use only one `<h1>` per page (main page title)
 * - Maintain proper heading order: h1 → h2 → h3 (don't skip levels)
 * - For visual-only headings, use `role="heading"` with `aria-level`
 * - Screen readers use headings to navigate, so use them meaningfully
 * - Headings should describe the content that follows
 *
 * ## Best Practices
 * - Match the `as` prop to the document outline level, not the visual style
 * - Use `variantName` to control visual appearance independently of semantic level
 * - Example: An h2 can look like an h1 visually using variantName="h1"
 *
 * @param {ElementType} [as="h1"] - The HTML element to render as.
 * @param {string} [variantName] - The variant name for styling.
 * @param {ReactNode} children - The content to render inside the heading.
 *
 * @example
 * // Basic h1 heading
 * <Heading>Page Title</Heading>
 *
 * @example
 * // Semantic h2 heading
 * <Heading as="h2">Section Title</Heading>
 *
 * @example
 * // All heading levels
 * <Heading as="h1">Main Title</Heading>
 * <Heading as="h2">Section</Heading>
 * <Heading as="h3">Subsection</Heading>
 * <Heading as="h4">Sub-subsection</Heading>
 * <Heading as="h5">Minor heading</Heading>
 * <Heading as="h6">Smallest heading</Heading>
 *
 * @example
 * // With variant for visual styling
 * <Heading as="h2" variantName="display">
 *   Large Display Heading
 * </Heading>
 *
 * @example
 * // Visual-only heading (not part of document outline)
 * <Heading
 *   as="div"
 *   role="heading"
 *   aria-level={2}
 *   variantName="h2"
 * >
 *   Visual Heading
 * </Heading>
 *
 * @example
 * // With custom styling
 * <Heading
 *   as="h1"
 *   className="text-center text-primary"
 *   style={{ marginBottom: '2rem' }}
 * >
 *   Styled Heading
 * </Heading>
 *
 * @example
 * // With ref for DOM access
 * const headingRef = useRef<HTMLHeadingElement>(null);
 * <Heading ref={headingRef} as="h1">
 *   Focusable Heading
 * </Heading>
 */

interface HeadingOwnProps {
  children?: ReactNode;
  variantName?: string;
}

type HeadingProps<C extends ElementType = "h1"> = PolymorphicComponentPropsWithRef<
  C,
  HeadingOwnProps
>;

const Heading = createPolymorphicComponent<"h1", HeadingOwnProps>(
  (props, ref: Ref<Element>) => {
    const {
      as: Component = "h1",
      children,
      className,
      variantName,
      ...rest
    } = props;

    return (
      <Component
        {...rest}
        className={className}
        data-ck="heading"
        data-variant={variantName}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";

export { Heading, type HeadingProps };
