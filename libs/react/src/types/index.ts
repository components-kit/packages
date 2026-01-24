import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  Ref,
} from "react";

/**
 * Prop to specify which element type to render as.
 */
type AsProp<C extends ElementType> = {
  as?: C;
};

/**
 * Props that should be omitted when combining with element props.
 */
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

/**
 * Polymorphic component props without ref.
 * Combines the props of the target element with custom component props.
 */
export type PolymorphicComponentProps<
  C extends ElementType,
  Props = Record<string, never>,
> = Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>> &
  PropsWithChildren<AsProp<C> & Props>;

/**
 * Extracts the ref type for a given element type.
 */
export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>["ref"];

/**
 * Polymorphic component props with ref.
 */
export type PolymorphicComponentPropsWithRef<
  C extends ElementType,
  Props = Record<string, never>,
> = PolymorphicComponentProps<C, Props> & { ref?: PolymorphicRef<C> };

/**
 * Type for the render function passed to createPolymorphicComponent.
 *
 * Uses `Ref<Element>` for the ref parameter because polymorphic components
 * can render as any element type, and Element is the common base type.
 */
type PolymorphicRenderFunction<OwnProps extends object> = (
  props: OwnProps & { as?: ElementType; className?: string },
  ref: Ref<Element>,
) => ReactElement | null;

/**
 * Return type for a polymorphic component.
 * This type allows the component to be called with different element types
 * while maintaining proper prop and ref typing.
 */
type PolymorphicForwardRefComponent<
  DefaultElement extends ElementType,
  OwnProps extends object,
> = <C extends ElementType = DefaultElement>(
  props: PolymorphicComponentPropsWithRef<C, OwnProps>,
) => ReactElement | null;

/**
 * Internal render function type for forwardRef.
 * Uses Record<string, unknown> and Ref<unknown> to satisfy forwardRef's signature.
 */
type ForwardRefRenderFn = (
  props: Record<string, unknown>,
  ref: Ref<unknown>,
) => ReactElement | null;

/**
 * Creates a type-safe polymorphic forwardRef component.
 *
 * This utility handles the complex ref typing for polymorphic components.
 * Due to TypeScript limitations with forwardRef and generics, internal casts
 * are necessary. The external API remains fully type-safe.
 *
 * @remarks
 * The internal type casts are a known limitation when creating polymorphic
 * components with forwardRef in TypeScript. The React team and TypeScript
 * maintainers are aware of this limitation. See:
 * - https://github.com/microsoft/TypeScript/issues/30650
 * - https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35834
 *
 * @example
 * ```tsx
 * const Text = createPolymorphicComponent<'p', { variant?: string }>(
 *   ({ as: Component = 'p', variant, ...props }, ref) => (
 *     <Component ref={ref} data-variant={variant} {...props} />
 *   )
 * );
 *
 * // Usage - fully type-safe:
 * <Text>Paragraph</Text>
 * <Text as="span">Span</Text>
 * <Text as="a" href="/link">Link</Text>
 * ```
 */
export function createPolymorphicComponent<
  DefaultElement extends ElementType,
  OwnProps extends object,
>(
  render: PolymorphicRenderFunction<OwnProps>,
): PolymorphicForwardRefComponent<DefaultElement, OwnProps> & {
  displayName?: string;
} {
  // ForwardRef requires a specific function signature that doesn't support
  // the generic polymorphic pattern directly. We cast to ForwardRefRenderFn
  // to satisfy forwardRef internally while maintaining type safety at the API boundary.
  const component = forwardRef(render as ForwardRefRenderFn);

  // Cast the component to our polymorphic type. This is safe because:
  // 1. The render function handles all prop/ref combinations correctly
  // 2. TypeScript will enforce correct usage at call sites
  return component as unknown as PolymorphicForwardRefComponent<
    DefaultElement,
    OwnProps
  > & { displayName?: string };
}
