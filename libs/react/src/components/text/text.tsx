"use client";

import { ElementType, ReactNode, Ref } from "react";

import type { VariantFor } from "../../types/register";

import {
  createPolymorphicComponent,
  PolymorphicComponentPropsWithRef,
} from "../../types";

/**
 * A polymorphic text component for rendering styled text with semantic HTML.
 *
 * @description
 * The Text component renders text content with styling while allowing control over
 * the semantic HTML element used. It supports various inline and block-level
 * text elements for different use cases.
 *
 * ## Features
 * - Polymorphic: renders as `<p>` by default, but can be any text-related HTML element
 * - Supports common text elements: p, span, div, label, small, strong, em, etc.
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Full TypeScript support with proper prop inference
 * - Forwards refs correctly for DOM access
 *
 * @remarks
 * - Defaults to rendering as `<p>` (paragraph) element
 * - The `as` prop controls the rendered HTML element
 * - Use semantic elements that match the content's purpose
 * - `variantName` controls visual appearance independently of semantic meaning
 *
 * ## Accessibility
 * This component should follow proper semantic usage for accessibility:
 * - Use `<p>` for paragraphs of text
 * - Use `<span>` for inline text without semantic meaning
 * - Use `<strong>` for important text (not just bold styling)
 * - Use `<em>` for emphasized text (not just italic styling)
 * - Use `<small>` for side comments, disclaimers, or fine print
 * - Use `<label>` with `htmlFor` to associate with form inputs
 * - Use `<blockquote>` for quotations with proper `cite` attribute
 * - For text that serves as a label, use `aria-label` or `aria-labelledby`
 *
 * ## Best Practices
 * - Choose the element based on semantic meaning, not visual appearance
 * - Use `variantName` for visual variations (body, caption, small, etc.)
 * - Avoid using `<div>` or `<span>` when a semantic element is appropriate
 * - For interactive text, use `<button>` or `<a>` instead
 *
 * @param {ElementType} [as="p"] - The HTML element to render as.
 * @param {VariantFor<"text">} [variantName] - The variant name for styling.
 * @param {ReactNode} children - The content to render inside the text element.
 *
 * @example
 * // Basic paragraph
 * <Text>This is a paragraph of text.</Text>
 *
 * @example
 * // Inline text with span
 * <Text as="span">Inline text</Text>
 *
 * @example
 * // With variant styling
 * <Text as="p" variantName="body-large">
 *   Large body text for emphasis.
 * </Text>
 *
 * @example
 * // Caption text
 * <Text as="small" variantName="caption">
 *   Caption or fine print text
 * </Text>
 *
 * @example
 * // Important text with semantic strong
 * <Text as="strong" variantName="bold">
 *   Important information
 * </Text>
 *
 * @example
 * // Emphasized text
 * <Text as="em">Emphasized content</Text>
 *
 * @example
 * // Form label
 * <Text as="label" htmlFor="email-input">
 *   Email Address
 * </Text>
 * <input id="email-input" type="email" />
 *
 * @example
 * // With custom styling
 * <Text
 *   as="p"
 *   className="text-gray-600"
 *   style={{ lineHeight: 1.6 }}
 * >
 *   Styled paragraph text
 * </Text>
 *
 * @example
 * // With ref for DOM access
 * const textRef = useRef<HTMLParagraphElement>(null);
 * <Text ref={textRef}>
 *   Text with ref access
 * </Text>
 */

interface TextOwnProps {
  children?: ReactNode;
  variantName?: VariantFor<"text">;
}

type TextProps<C extends ElementType = "p"> = PolymorphicComponentPropsWithRef<
  C,
  TextOwnProps
>;

const Text = createPolymorphicComponent<"p", TextOwnProps>(
  (props, ref: Ref<Element>) => {
    const {
      as: Component = "p",
      children,
      className,
      variantName,
      ...rest
    } = props;

    return (
      <Component
        {...rest}
        className={className}
        data-ck="text"
        data-variant={variantName}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";

export { Text, type TextProps };
