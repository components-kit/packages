import { ElementType, forwardRef, ReactElement, Ref } from "react";

import {
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from "../types";

/**
 * Type for the render function passed to polymorphicForwardRef.
 */
type PolymorphicRenderFn<
  DefaultElement extends ElementType,
  OwnProps
> = <C extends ElementType = DefaultElement>(
  props: PolymorphicComponentProps<C, OwnProps>,
  ref?: PolymorphicRef<C>
) => ReactElement | null;

/**
 * Return type for a polymorphic forwardRef component.
 */
type PolymorphicForwardRefComponent<
  DefaultElement extends ElementType,
  OwnProps
> = <C extends ElementType = DefaultElement>(
  props: PolymorphicComponentPropsWithRef<C, OwnProps>
) => ReactElement | null;

/**
 * Internal render function type for forwardRef.
 */
type ForwardRefRenderFn = (
  props: Record<string, unknown>,
  ref: Ref<unknown>
) => ReactElement | null;

/**
 * Creates a polymorphic component with forwarded ref support.
 *
 * This utility wraps React's forwardRef to support polymorphic components
 * (components that can render as different element types via the `as` prop).
 *
 * @remarks
 * Due to TypeScript limitations with forwardRef and generics, internal type
 * assertions are necessary. The external API remains fully type-safe.
 * See: https://github.com/microsoft/TypeScript/issues/30650
 *
 * @example
 * ```tsx
 * interface ButtonProps {
 *   variant?: 'primary' | 'secondary';
 *   size?: 'sm' | 'md' | 'lg';
 * }
 *
 * const Button = polymorphicForwardRef<'button', ButtonProps>(
 *   ({ as: Component = 'button', variant, size, ...props }, ref) => (
 *     <Component ref={ref} data-variant={variant} data-size={size} {...props} />
 *   )
 * );
 *
 * // Usage:
 * <Button>Click me</Button>
 * <Button as="a" href="/link">Link button</Button>
 * ```
 */
export const polymorphicForwardRef = <
  DefaultElement extends ElementType,
  OwnProps = Record<string, never>
>(
  render: PolymorphicRenderFn<DefaultElement, OwnProps>
): PolymorphicForwardRefComponent<DefaultElement, OwnProps> & {
  displayName?: string;
} => {
  // ForwardRef requires a specific function signature that doesn't support
  // the generic polymorphic pattern directly. We cast to ForwardRefRenderFn
  // to satisfy forwardRef internally while maintaining type safety at the API boundary.
  const component = forwardRef(render as ForwardRefRenderFn);

  // Cast to our polymorphic type. This is safe because:
  // 1. The render function handles all prop/ref combinations correctly
  // 2. TypeScript will enforce correct usage at call sites
  return component as unknown as PolymorphicForwardRefComponent<
    DefaultElement,
    OwnProps
  > & {
    displayName?: string;
  };
};
