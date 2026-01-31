import { type Ref } from "react";

/**
 * A ref that can be assigned a value of type `T`.
 * Covers callback refs and mutable object refs, including refs typed
 * with a supertype (e.g. `Ref<HTMLElement>` is assignable with an `HTMLDivElement`).
 */
type AssignableRef<T> =
  | ((instance: T) => void)
  | { current: T | null }
  | null
  | undefined;

/**
 * Merges multiple refs into a single ref callback.
 * Handles both callback refs and object refs.
 *
 * Supports mixing refs of compatible types (e.g. `Ref<HTMLDivElement>` with
 * `Ref<HTMLElement>`) — specify the target element type explicitly when needed:
 * `mergeRefs<HTMLDivElement>(divRef, elementRef)`.
 */
export function mergeRefs<T>(...refs: Array<AssignableRef<T>>): Ref<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref !== null && ref !== undefined) {
        Object.assign(ref, { current: node });
      }
    });
  };
}
