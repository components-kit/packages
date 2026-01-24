"use client";

import { forwardRef, InputHTMLAttributes } from "react";

/**
 * A text input component for single-line user input.
 *
 * @description
 * The Input component provides a standard text input field for collecting user
 * input. It's built on the native HTML input element with support for various
 * input types, controlled and uncontrolled modes, and full accessibility.
 *
 * ## Features
 * - Defaults to `type="text"` but supports all input types
 * - Controlled and uncontrolled modes
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Full support for all native input attributes
 * - Ref forwarding for DOM access
 *
 * @remarks
 * - Defaults to `type="text"` when no type is specified
 * - For multi-line input, use the Textarea component instead
 * - For checkbox input, use the Checkbox component instead
 * - The input should always have an associated label for accessibility
 *
 * ## Accessibility
 * This component follows WAI-ARIA form input guidelines:
 * - Always associate with a `<label>` using `id` and `htmlFor`
 * - Or use `aria-label` for visually hidden labels
 * - Use `aria-describedby` to link to helper text or error messages
 * - Use `aria-invalid="true"` to indicate validation errors
 * - Use `aria-required="true"` or native `required` for required fields
 * - Native `disabled` and `readOnly` attributes properly convey state
 * - Ensure sufficient color contrast for text and borders
 * - Provide clear focus indicators for keyboard navigation
 *
 * ## Best Practices
 * - Always provide a visible label or aria-label
 * - Use placeholder as a hint, not as a label replacement
 * - Use appropriate input type for the data (email, tel, url, etc.)
 * - Provide clear error messages using aria-describedby
 * - Consider using autocomplete for common fields
 * - Use inputMode for mobile keyboard optimization
 * - Group related inputs with fieldset and legend
 *
 * @param {string} [variantName] - The variant name for styling.
 *
 * @example
 * // Basic text input with label
 * <label htmlFor="name">Name</label>
 * <Input id="name" placeholder="Enter your name" variantName="default" />
 *
 * @example
 * // Email input
 * <label htmlFor="email">Email</label>
 * <Input
 *   id="email"
 *   type="email"
 *   placeholder="you@example.com"
 *   variantName="default"
 * />
 *
 * @example
 * // Controlled input
 * const [value, setValue] = useState('');
 * <Input
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   variantName="default"
 * />
 *
 * @example
 * // With aria-label (no visible label)
 * <Input
 *   aria-label="Search"
 *   type="search"
 *   placeholder="Search..."
 *   variantName="default"
 * />
 *
 * @example
 * // Disabled state
 * <Input
 *   disabled
 *   value="Cannot edit"
 *   variantName="default"
 * />
 *
 * @example
 * // Read-only state
 * <Input
 *   readOnly
 *   value="Read only value"
 *   variantName="default"
 * />
 *
 * @example
 * // With validation error
 * <label htmlFor="email">Email</label>
 * <Input
 *   id="email"
 *   aria-describedby="email-error"
 *   aria-invalid="true"
 *   type="email"
 *   variantName="error"
 * />
 * <span id="email-error">Please enter a valid email</span>
 *
 * @example
 * // With helper text
 * <label htmlFor="password">Password</label>
 * <Input
 *   id="password"
 *   aria-describedby="password-hint"
 *   type="password"
 *   variantName="default"
 * />
 * <span id="password-hint">Must be at least 8 characters</span>
 *
 * @example
 * // Number input with constraints
 * <label htmlFor="quantity">Quantity</label>
 * <Input
 *   id="quantity"
 *   type="number"
 *   min="1"
 *   max="100"
 *   step="1"
 *   variantName="default"
 * />
 *
 * @example
 * // With pattern validation
 * <label htmlFor="phone">Phone</label>
 * <Input
 *   id="phone"
 *   type="tel"
 *   pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
 *   placeholder="123-456-7890"
 *   variantName="default"
 * />
 *
 * @example
 * // With ref for DOM access
 * const inputRef = useRef<HTMLInputElement>(null);
 * <Input ref={inputRef} variantName="default" />
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variantName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variantName, ...rest }, ref) => {
    return (
      <input
        {...rest}
        className={className}
        data-ck="input"
        data-variant={variantName}
        type={type}
        ref={ref}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
