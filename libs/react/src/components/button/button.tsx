"use client";

import {
  ButtonHTMLAttributes,
  ElementType,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";

import { PolymorphicComponentProps, PolymorphicRef } from "../../types";
import { polymorphicForwardRef } from "../../utils";
import { Slot } from "../slot/slot";

/**
 * A polymorphic button component with support for loading states, icons, and composition.
 *
 * @description
 * The Button component is a flexible, accessible button that supports:
 * - Polymorphism via the `as` prop to render as any element type
 * - Composition via `asChild` to merge props with a child element (Radix-style)
 * - Loading states that automatically disable the button
 * - Leading and trailing icons as ReactNode for maximum flexibility
 * - Data attributes for CSS-based styling (`data-variant`, `data-size`, `data-loading`, `data-full-width`, `data-disabled`)
 *
 * @remarks
 * - Defaults to `type="button"` to prevent accidental form submissions
 * - When `isLoading` is true, the button is automatically disabled
 * - Supports all native button HTML attributes
 * - Forwards refs correctly for DOM access
 *
 * ## Accessibility
 * This component follows WAI-ARIA Button Pattern guidelines:
 * - Uses semantic `<button>` element for proper keyboard navigation and screen reader support
 * - Uses `aria-disabled` instead of native `disabled` to keep button focusable for screen reader users
 * - Sets `aria-busy="true"` during loading to announce busy state to screen readers
 * - Prevents click and keyboard (Enter/Space) interactions when disabled via event handlers
 * - Supports all ARIA attributes via props spread
 *
 * **Icon-only buttons:** When using only an icon without visible text, you MUST provide
 * an `aria-label` for screen reader users.
 *
 * @param {boolean} [asChild=false] - If true, merges button props with the child element instead of rendering a button.
 * @param {ReactNode} [children] - The content to render inside the button.
 * @param {boolean} [disabled] - If true, disables the button.
 * @param {boolean} [fullWidth] - If true, sets `data-full-width` for full-width styling.
 * @param {boolean} [isLoading=false] - If true, disables the button and sets `aria-busy` and `data-loading` attributes.
 * @param {ReactNode} [leadingIcon] - Icon or element to render before the button content.
 * @param {"sm" | "md" | "lg"} [size="md"] - The size variant of the button.
 * @param {ReactNode} [trailingIcon] - Icon or element to render after the button content.
 * @param {string} [variantName] - The variant name for styling (e.g., "primary", "secondary", "outline").
 *
 * @example
 * // Basic usage
 * <Button variantName="primary">Submit</Button>
 *
 * @example
 * // With icons
 * <Button leadingIcon={<SearchIcon />} variantName="secondary">
 *   Search
 * </Button>
 *
 * @example
 * // Loading state (automatically sets aria-busy)
 * <Button isLoading variantName="primary">
 *   Saving...
 * </Button>
 *
 * @example
 * // Icon-only button (aria-label required for accessibility)
 * <Button aria-label="Search" leadingIcon={<SearchIcon />} variantName="ghost" />
 *
 * @example
 * // As a link (polymorphic)
 * <Button as="a" href="/home" variantName="outline">
 *   Go Home
 * </Button>
 *
 * @example
 * // Composition with asChild (renders as the child element)
 * <Button asChild variantName="primary">
 *   <a href="/dashboard">Dashboard</a>
 * </Button>
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  size?: "lg" | "md" | "sm";
  trailingIcon?: ReactNode;
  variantName?: string;
}

const Button = polymorphicForwardRef<"button", ButtonProps>(
  <C extends ElementType = "button">(
    {
      asChild = false,
      children,
      disabled,
      fullWidth,
      isLoading = false,
      leadingIcon,
      size = "md",
      trailingIcon,
      type = "button",
      variantName,
      ...rest
    }: PolymorphicComponentProps<C, ButtonProps>,
    ref?: PolymorphicRef<C>
  ) => {
    const isDisabled = isLoading || disabled;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      rest.onClick?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (isDisabled && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        return;
      }
      rest.onKeyDown?.(e);
    };

    const sharedProps = {
      ...rest,
      "aria-busy": isLoading || undefined,
      "aria-disabled": isDisabled || undefined,
      "data-ck": "button",
      "data-disabled": isDisabled || undefined,
      "data-full-width": fullWidth || undefined,
      "data-loading": isLoading || undefined,
      "data-size": size,
      "data-variant": variantName,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      ref,
      type,
    };

    const renderChildren = (
      <>
        {leadingIcon}
        {children}
        {trailingIcon}
      </>
    );

    return asChild ? (
      <Slot asChild {...sharedProps}>
        {children}
      </Slot>
    ) : (
      <button {...sharedProps}>{renderChildren}</button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
