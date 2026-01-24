"use client";

import { forwardRef, InputHTMLAttributes } from "react";

/**
 * A checkbox input component for boolean selections.
 *
 * @description
 * The Checkbox component provides a standard checkbox input for toggling boolean
 * values. It's built on the native HTML checkbox input element with support for
 * controlled and uncontrolled modes, indeterminate state, and full accessibility.
 *
 * ## Features
 * - Native checkbox behavior with full browser support
 * - Controlled and uncontrolled modes
 * - Indeterminate state support (via ref)
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Full support for all native input checkbox attributes
 * - Ref forwarding for DOM access
 *
 * @remarks
 * - Always renders with `type="checkbox"` regardless of any type prop passed
 * - Indeterminate state must be set programmatically via ref
 * - Use `defaultChecked` for uncontrolled mode, `checked` with `onChange` for controlled
 * - The checkbox should always have an associated label for accessibility
 *
 * ## Accessibility
 * This component follows WAI-ARIA checkbox pattern guidelines:
 * - Uses native `<input type="checkbox">` for built-in keyboard support
 * - Always associate with a `<label>` using `id` and `htmlFor`
 * - Or use `aria-label` for visually hidden labels
 * - Use `aria-describedby` to link to helper text or error messages
 * - Use `aria-invalid="true"` to indicate validation errors
 * - Native `disabled` attribute properly conveys disabled state
 * - Indeterminate state is announced by screen readers
 * - Supports Space key for toggling (native behavior)
 * - Can be part of a group using `role="group"` on container
 *
 * ## Best Practices
 * - Always provide a visible label or aria-label
 * - Use clear, action-oriented label text
 * - Group related checkboxes with `<fieldset>` and `<legend>`
 * - Consider using indeterminate state for "select all" patterns
 * - Provide error feedback using `aria-describedby`
 * - Don't use checkboxes for mutually exclusive options (use radio instead)
 *
 * @param {string} [variantName] - The variant name for styling.
 *
 * @example
 * // Basic checkbox with label
 * <Checkbox id="terms" variantName="default" />
 * <label htmlFor="terms">I accept the terms</label>
 *
 * @example
 * // Controlled checkbox
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   checked={checked}
 *   onChange={(e) => setChecked(e.target.checked)}
 *   variantName="default"
 * />
 *
 * @example
 * // With aria-label (no visible label)
 * <Checkbox
 *   aria-label="Select row"
 *   variantName="default"
 * />
 *
 * @example
 * // Disabled state
 * <Checkbox
 *   disabled
 *   id="disabled-option"
 *   variantName="default"
 * />
 * <label htmlFor="disabled-option">Disabled option</label>
 *
 * @example
 * // With validation error
 * <Checkbox
 *   aria-describedby="terms-error"
 *   aria-invalid="true"
 *   id="terms"
 *   variantName="error"
 * />
 * <label htmlFor="terms">Accept terms</label>
 * <span id="terms-error">You must accept the terms</span>
 *
 * @example
 * // Checkbox group with fieldset
 * <fieldset>
 *   <legend>Select your interests</legend>
 *   <Checkbox id="sports" name="interests" value="sports" variantName="default" />
 *   <label htmlFor="sports">Sports</label>
 *   <Checkbox id="music" name="interests" value="music" variantName="default" />
 *   <label htmlFor="music">Music</label>
 * </fieldset>
 *
 * @example
 * // Indeterminate state (select all pattern)
 * const checkboxRef = useRef<HTMLInputElement>(null);
 * useEffect(() => {
 *   if (checkboxRef.current) {
 *     checkboxRef.current.indeterminate = someChecked && !allChecked;
 *   }
 * }, [someChecked, allChecked]);
 * <Checkbox
 *   ref={checkboxRef}
 *   checked={allChecked}
 *   onChange={handleSelectAll}
 *   variantName="default"
 * />
 *
 * @example
 * // With ref for DOM access
 * const checkboxRef = useRef<HTMLInputElement>(null);
 * <Checkbox ref={checkboxRef} variantName="default" />
 */

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  variantName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variantName, ...rest }, ref) => {
    return (
      <input
        {...rest}
        className={className}
        data-ck="checkbox"
        data-variant={variantName}
        type="checkbox"
        ref={ref}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, type CheckboxProps };
