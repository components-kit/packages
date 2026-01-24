"use client";

import {
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  ElementType,
  forwardRef,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

/**
 * A utility component for composition patterns, enabling the "asChild" pattern.
 *
 * @description
 * The Slot component allows parent components to pass their props and behavior
 * to a child element instead of rendering a wrapper. This enables flexible,
 * composable UI components where consumers control the rendered element.
 *
 * ## How It Works
 * - **Default mode (`asChild=false`)**: Renders children inside a wrapper element (default: `<span>`)
 * - **AsChild mode (`asChild=true`)**: Merges all props onto the child element using `cloneElement`
 *
 * ## Prop Merging Behavior
 * When `asChild` is true, props are merged with the following strategy:
 * - **Refs**: Both parent and child refs are called (merged via callback ref)
 * - **classNames**: Concatenated with space separator (parent first, then child)
 * - **Event handlers**: Both handlers are called (child first, then parent) for:
 *   `onClick`, `onKeyDown`, `onBlur`, `onFocus`, `onMouseEnter`, `onMouseLeave`
 * - **Other props**: Child props override parent props (spread order)
 *
 * ## Requirements for AsChild Mode
 * - Must have exactly **one** child element
 * - Child must be a valid React element (not a Fragment, string, or number)
 * - If requirements aren't met, falls back to wrapper mode with a dev warning
 *
 * @remarks
 * - Uses React's `cloneElement` for zero-dependency prop merging
 * - No styled-components or CSS-in-JS required
 * - Forwards refs correctly for DOM access
 * - Development warnings help catch misuse
 *
 * @param {ElementType} [as="span"] - The HTML tag or React component for fallback/wrapper rendering.
 * @param {boolean} [asChild=false] - If true, merges props with child element instead of wrapping.
 * @param {ReactNode} children - The content to render. Must be a single element when `asChild` is true.
 * @param {string} [className] - CSS class to apply (merged with child's className in asChild mode).
 *
 * @example
 * // Default rendering (with wrapper)
 * <Slot as="div" className="wrapper">
 *   <span>Content</span>
 * </Slot>
 * // Output: <div class="wrapper"><span>Content</span></div>
 *
 * @example
 * // AsChild mode (no wrapper, props merged to child)
 * <Slot asChild className="slot-class" onClick={handleClick}>
 *   <a href="/link" className="link-class">Link</a>
 * </Slot>
 * // Output: <a href="/link" class="slot-class link-class" onClick={handleClick}>Link</a>
 *
 * @example
 * // Used in a Button component for composition
 * const Button = ({ asChild, children, ...props }) => (
 *   <Slot asChild={asChild} className="btn" {...props}>
 *     {asChild ? children : <button>{children}</button>}
 *   </Slot>
 * );
 *
 * // Consumer renders as a link instead of button
 * <Button asChild>
 *   <a href="/home">Go Home</a>
 * </Button>
 *
 * @example
 * // Ref forwarding works in both modes
 * const ref = useRef<HTMLAnchorElement>(null);
 * <Slot asChild ref={ref}>
 *   <a href="/link">Link</a>
 * </Slot>
 * // ref.current points to the <a> element
 *
 * @example
 * // Event handler merging (both get called)
 * <Slot asChild onClick={() => console.log('parent')}>
 *   <button onClick={() => console.log('child')}>Click</button>
 * </Slot>
 * // Clicking logs: "child" then "parent"
 */

type EventHandler = ((event: unknown) => void) | undefined;

interface SlotProps extends ComponentPropsWithoutRef<ElementType> {
  as?: ElementType;
  asChild?: boolean;
  children: ReactNode;
}

interface SlottableChildProps {
  className?: string;
  onBlur?: EventHandler;
  onClick?: EventHandler;
  onFocus?: EventHandler;
  onKeyDown?: EventHandler;
  onMouseEnter?: EventHandler;
  onMouseLeave?: EventHandler;
  ref?: Ref<HTMLElement>;
}

/**
 * Merges multiple refs into a single ref callback
 */
function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): Ref<T> {
  return (node: T) => {
    refs.forEach((refItem) => {
      if (typeof refItem === "function") {
        refItem(node);
      } else if (refItem !== null && refItem !== undefined) {
        Object.assign(refItem, { current: node });
      }
    });
  };
}

/**
 * Checks if children is a single valid React element that can receive props
 */
function isSlottable(
  children: ReactNode
): children is ReactElement<SlottableChildProps> {
  return (
    isValidElement(children) &&
    children.type !== Fragment &&
    typeof children.type !== "symbol"
  );
}

/**
 * Merges two className strings
 */
function mergeClassNames(
  ...classNames: Array<string | undefined>
): string | undefined {
  const merged = classNames.filter(Boolean).join(" ");
  return merged || undefined;
}

/**
 * Merges event handlers so both get called
 */
function mergeEventHandlers(
  parentHandler: EventHandler,
  childHandler: EventHandler
): EventHandler {
  if (!parentHandler && !childHandler) return undefined;
  if (!parentHandler) return childHandler;
  if (!childHandler) return parentHandler;

  return (event: unknown) => {
    childHandler(event);
    parentHandler(event);
  };
}

/**
 * Logs a warning when asChild is true but children cannot be slotted
 */
function warnAboutInvalidChild() {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Slot] Expected a single valid React element as a child when asChild is true. " +
        "Received multiple children, a Fragment, or a non-element. " +
        "Falling back to default rendering."
    );
  }
}

/**
 * Gets props from a child element with proper typing
 */
function getChildProps(
  child: ReactElement<SlottableChildProps>
): SlottableChildProps {
  return child.props || {};
}

/**
 * Gets ref from a child element if it exists
 * In React 19, ref is a regular prop, so we check props.ref first
 */
function getChildRef(
  child: ReactElement<SlottableChildProps>
): Ref<HTMLElement> | undefined {
  // React 19: ref is a regular prop
  if (child.props && "ref" in child.props) {
    return child.props.ref as Ref<HTMLElement> | undefined;
  }
  return undefined;
}

const Slot = forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const {
    as: FallbackComponent = "span",
    asChild = false,
    children,
    className,
    ...restProps
  } = props;

  // Get the single child (if any)
  const childArray = Children.toArray(children);
  const singleChild = childArray.length === 1 ? childArray[0] : null;

  // Determine if we should use asChild mode
  const shouldUseAsChildMode =
    asChild && singleChild && isSlottable(singleChild);

  // Fallback: Render children inside a wrapper element
  if (!shouldUseAsChildMode) {
    if (asChild && children) {
      warnAboutInvalidChild();
    }

    return (
      <FallbackComponent {...restProps} className={className} ref={ref}>
        {children}
      </FallbackComponent>
    );
  }

  // AsChild mode: Clone and enhance the child element
  const childElement = singleChild;
  const childProps = getChildProps(childElement);
  const childRef = getChildRef(childElement);

  // Merge props
  const mergedProps = {
    ...restProps,
    ...childProps,
    className: mergeClassNames(className, childProps.className),
    // Merge common event handlers (alphabetical order)
    onBlur: mergeEventHandlers(restProps.onBlur, childProps.onBlur),
    onClick: mergeEventHandlers(restProps.onClick, childProps.onClick),
    onFocus: mergeEventHandlers(restProps.onFocus, childProps.onFocus),
    onKeyDown: mergeEventHandlers(restProps.onKeyDown, childProps.onKeyDown),
    onMouseEnter: mergeEventHandlers(
      restProps.onMouseEnter,
      childProps.onMouseEnter
    ),
    onMouseLeave: mergeEventHandlers(
      restProps.onMouseLeave,
      childProps.onMouseLeave
    ),
    ref: childRef ? mergeRefs(ref, childRef) : ref,
  };

  return cloneElement(childElement, mergedProps);
});

Slot.displayName = "Slot";

export { Slot, type SlotProps };
