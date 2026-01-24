"use client";

import {
  FormEvent,
  forwardRef,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from "react";

/**
 * A multi-line text input component with automatic height adjustment.
 *
 * @description
 * The Textarea component provides a multi-line text input field that automatically
 * resizes to fit its content. It's built on the native HTML textarea element with
 * enhanced auto-resize functionality that adjusts height as users type.
 *
 * ## Features
 * - Auto-resize: Automatically adjusts height based on content
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Full support for all native textarea attributes
 * - Ref forwarding for DOM access
 * - Controlled and uncontrolled modes supported
 *
 * @remarks
 * - The auto-resize feature works by setting height to "auto" then to scrollHeight
 * - Initial height is set on mount and when value/defaultValue changes
 * - The component merges internal refs with forwarded refs for auto-resize to work
 * - Use `rows` prop to set minimum visible rows before content grows
 *
 * ## Accessibility
 * This component should follow proper form accessibility practices:
 * - Always associate with a label using `id` and `<label htmlFor="...">`
 * - Or use `aria-label` for visually hidden labels
 * - Use `aria-describedby` to link to helper text or error messages
 * - Use `aria-invalid="true"` to indicate validation errors
 * - Use `aria-required="true"` or the native `required` attribute for required fields
 * - Ensure sufficient color contrast for text and borders
 * - Provide clear focus indicators for keyboard navigation
 * - Use `disabled` sparingly and provide alternative ways to convey information
 *
 * ## Best Practices
 * - Always provide a visible label or aria-label
 * - Use placeholder text as a hint, not as a label replacement
 * - Provide character count feedback for maxLength constraints
 * - Use appropriate autocomplete values for common field types
 * - Consider using `rows` to hint at expected content length
 * - Group related form fields with fieldset and legend
 *
 * @param {string} [variantName] - The variant name for styling.
 * @param {function} [onInput] - Handler called on input, after auto-resize.
 *
 * @example
 * // Basic textarea with label
 * <label htmlFor="message">Message</label>
 * <Textarea
 *   id="message"
 *   placeholder="Enter your message"
 *   variantName="default"
 * />
 *
 * @example
 * // With minimum rows
 * <Textarea
 *   rows={3}
 *   placeholder="Write your bio..."
 *   variantName="default"
 * />
 *
 * @example
 * // Controlled textarea
 * const [value, setValue] = useState('');
 * <Textarea
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   variantName="default"
 * />
 *
 * @example
 * // With validation error state
 * <Textarea
 *   aria-invalid="true"
 *   aria-describedby="error-message"
 *   variantName="error"
 * />
 * <span id="error-message">This field is required</span>
 *
 * @example
 * // With character count
 * <Textarea
 *   maxLength={500}
 *   aria-describedby="char-count"
 *   variantName="default"
 * />
 * <span id="char-count">0/500 characters</span>
 *
 * @example
 * // Disabled state
 * <Textarea
 *   disabled
 *   value="This content cannot be edited"
 *   variantName="default"
 * />
 *
 * @example
 * // Read-only state
 * <Textarea
 *   readOnly
 *   value="This content is read-only"
 *   variantName="default"
 * />
 *
 * @example
 * // With ref for DOM access
 * const textareaRef = useRef<HTMLTextAreaElement>(null);
 * <Textarea ref={textareaRef} variantName="default" />
 *
 * @example
 * // Full form example with accessibility
 * <form>
 *   <div>
 *     <label htmlFor="feedback">Your Feedback</label>
 *     <Textarea
 *       id="feedback"
 *       name="feedback"
 *       required
 *       aria-required="true"
 *       aria-describedby="feedback-hint"
 *       placeholder="Tell us what you think..."
 *       variantName="default"
 *     />
 *     <span id="feedback-hint">
 *       Please provide detailed feedback (minimum 10 characters)
 *     </span>
 *   </div>
 * </form>
 */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variantName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onInput, variantName, ...rest }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // Auto-resize function
    const adjustHeight = useCallback((element: HTMLTextAreaElement) => {
      const { style } = element;
      style.height = "auto";
      style.height = `${element.scrollHeight}px`;
    }, []);

    // Composed input handler: auto-resize + user's onInput
    const composedOnInput = useCallback(
      (e: FormEvent<HTMLTextAreaElement>) => {
        // Always run internal auto-resize logic first
        const target = e.target as HTMLTextAreaElement;
        adjustHeight(target);

        // Then call user's onInput handler if provided
        onInput?.(e);
      },
      [adjustHeight, onInput]
    );

    // Handle initial resize and value changes
    useEffect(() => {
      const element = internalRef.current;
      if (element) {
        adjustHeight(element);
      }
    }, [rest.value, rest.defaultValue, adjustHeight]);

    // Merge refs
    const mergedRef = useCallback(
      (element: HTMLTextAreaElement | null) => {
        internalRef.current = element;

        if (typeof ref === "function") {
          ref(element);
        } else if (ref && typeof ref === "object" && "current" in ref) {
          Object.assign(ref, { current: element });
        }

        if (element) {
          adjustHeight(element);
        }
      },
      [ref, adjustHeight]
    );

    return (
      <textarea
        {...rest}
        className={className}
        data-ck="textarea"
        data-variant={variantName}
        onInput={composedOnInput}
        ref={mergedRef}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
