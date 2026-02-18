"use client";

import { forwardRef, HTMLAttributes, InputHTMLAttributes } from "react";

import type { VariantFor } from "../../types/register";

/**
 * A container component for grouping radio buttons.
 *
 * @description
 * The RadioGroup component provides a semantic container for grouping related
 * radio buttons. It uses the native `role="radiogroup"` for proper accessibility
 * and ensures screen readers announce the group correctly.
 *
 * ## Features
 * - Semantic `role="radiogroup"` for accessibility
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Full support for all native div attributes
 * - Ref forwarding for DOM access
 *
 * @remarks
 * - RadioGroup is a container component that wraps RadioGroupItem components
 * - All RadioGroupItem components within should share the same `name` attribute
 * - Use `aria-label` or `aria-labelledby` to provide a group label
 * - Consider wrapping in a `<fieldset>` with `<legend>` for better semantics
 *
 * ## Accessibility
 * This component follows WAI-ARIA Radio Group Pattern guidelines:
 * - Uses `role="radiogroup"` for screen reader identification
 * - Requires accessible label via `aria-label` or `aria-labelledby`
 * - Arrow keys should navigate between radio buttons (native browser behavior)
 * - Tab key moves focus to/from the radio group as a whole
 * - Space key selects the focused radio button
 * - Only one radio button in a group can be selected at a time
 *
 * ## Best Practices
 * - Always provide a visible label or aria-label for the group
 * - Use fieldset and legend for better semantic structure
 * - Ensure all radio items have the same `name` attribute
 * - Consider providing a default selection when appropriate
 * - Use `aria-describedby` for additional instructions
 * - Don't use radio groups for yes/no questions (use checkbox or switch)
 *
 * @param {VariantFor<"radio_group">} [variantName] - The variant name for styling.
 *
 * @example
 * // Basic radio group with labels
 * <RadioGroup aria-label="Select option" variantName="default">
 *   <div>
 *     <RadioGroupItem id="option1" name="option" value="1" defaultChecked />
 *     <label htmlFor="option1">Option 1</label>
 *   </div>
 *   <div>
 *     <RadioGroupItem id="option2" name="option" value="2" />
 *     <label htmlFor="option2">Option 2</label>
 *   </div>
 *   <div>
 *     <RadioGroupItem id="option3" name="option" value="3" disabled />
 *     <label htmlFor="option3">Option 3 (disabled)</label>
 *   </div>
 * </RadioGroup>
 *
 * @example
 * // With fieldset and legend
 * <fieldset>
 *   <legend>Choose your plan</legend>
 *   <RadioGroup variantName="default">
 *     <div>
 *       <RadioGroupItem id="basic" name="plan" value="basic" />
 *       <label htmlFor="basic">Basic - $9/month</label>
 *     </div>
 *     <div>
 *       <RadioGroupItem id="pro" name="plan" value="pro" />
 *       <label htmlFor="pro">Pro - $19/month</label>
 *     </div>
 *     <div>
 *       <RadioGroupItem id="enterprise" name="plan" value="enterprise" />
 *       <label htmlFor="enterprise">Enterprise - Contact us</label>
 *     </div>
 *   </RadioGroup>
 * </fieldset>
 *
 * @example
 * // Controlled radio group
 * const [selected, setSelected] = useState('option1');
 * <RadioGroup aria-label="Preferences" variantName="default">
 *   <div>
 *     <RadioGroupItem
 *       id="opt1"
 *       name="preference"
 *       value="option1"
 *       checked={selected === 'option1'}
 *       onChange={(e) => setSelected(e.target.value)}
 *     />
 *     <label htmlFor="opt1">Option 1</label>
 *   </div>
 *   <div>
 *     <RadioGroupItem
 *       id="opt2"
 *       name="preference"
 *       value="option2"
 *       checked={selected === 'option2'}
 *       onChange={(e) => setSelected(e.target.value)}
 *     />
 *     <label htmlFor="opt2">Option 2</label>
 *   </div>
 * </RadioGroup>
 *
 * @example
 * // With aria-labelledby
 * <div id="group-label">Select your shipping method:</div>
 * <RadioGroup aria-labelledby="group-label" variantName="default">
 *   <div>
 *     <RadioGroupItem id="standard" name="shipping" value="standard" />
 *     <label htmlFor="standard">Standard (5-7 days)</label>
 *   </div>
 *   <div>
 *     <RadioGroupItem id="express" name="shipping" value="express" />
 *     <label htmlFor="express">Express (2-3 days)</label>
 *   </div>
 * </RadioGroup>
 *
 * @example
 * // Horizontal layout with data attribute
 * <RadioGroup
 *   aria-label="View mode"
 *   data-orientation="horizontal"
 *   variantName="default"
 * >
 *   <RadioGroupItem id="grid" name="view" value="grid" />
 *   <label htmlFor="grid">Grid</label>
 *   <RadioGroupItem id="list" name="view" value="list" />
 *   <label htmlFor="list">List</label>
 * </RadioGroup>
 *
 * @example
 * // With ref for DOM access
 * const groupRef = useRef<HTMLDivElement>(null);
 * <RadioGroup ref={groupRef} variantName="default">
 *   <RadioGroupItem name="test" value="1" />
 * </RadioGroup>
 */

interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  variantName?: VariantFor<"radio_group">;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, className, variantName, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={className}
        data-ck="radio-group"
        data-variant={variantName}
        role="radiogroup"
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

/**
 * A radio input component for single selection within a group.
 *
 * @description
 * The RadioGroupItem component provides an individual radio button input.
 * It should be used within a RadioGroup container with other RadioGroupItem
 * components that share the same `name` attribute.
 *
 * ## Features
 * - Native radio input with full browser support
 * - Controlled and uncontrolled modes
 * - Always renders with `type="radio"`
 * - Full support for all native input attributes
 * - Ref forwarding for DOM access
 *
 * @remarks
 * - Must be used within a RadioGroup for proper accessibility
 * - All RadioGroupItem components in a group must share the same `name`
 * - Only one radio in a group can be selected at a time
 * - Use `defaultChecked` for uncontrolled mode
 * - Use `checked` with `onChange` for controlled mode
 *
 * ## Accessibility
 * This component follows WAI-ARIA Radio Pattern guidelines:
 * - Uses native `<input type="radio">` for built-in keyboard support
 * - Always associate with a `<label>` using `id` and `htmlFor`
 * - Or use `aria-label` for visually hidden labels
 * - Arrow keys navigate between radios in the same group
 * - Space key selects the focused radio
 * - Native `disabled` attribute properly conveys state
 *
 * ## Best Practices
 * - Always provide a visible label or aria-label
 * - Use clear, concise label text
 * - Group related options together
 * - Consider providing a default selection
 * - Use `aria-describedby` for additional context
 *
 * @example
 * // Basic radio item with label
 * <RadioGroupItem id="option1" name="options" value="1" />
 * <label htmlFor="option1">Option 1</label>
 *
 * @example
 * // With aria-label (no visible label)
 * <RadioGroupItem
 *   aria-label="First option"
 *   name="options"
 *   value="1"
 * />
 *
 * @example
 * // Disabled radio
 * <RadioGroupItem
 *   id="disabled-option"
 *   name="options"
 *   value="disabled"
 *   disabled
 * />
 * <label htmlFor="disabled-option">Disabled option</label>
 *
 * @example
 * // Default checked (uncontrolled)
 * <RadioGroupItem
 *   id="default-selected"
 *   name="options"
 *   value="default"
 *   defaultChecked
 * />
 *
 * @example
 * // Controlled radio
 * <RadioGroupItem
 *   id="controlled"
 *   name="options"
 *   value="controlled"
 *   checked={selected === 'controlled'}
 *   onChange={(e) => setSelected(e.target.value)}
 * />
 *
 * @example
 * // With ref for DOM access
 * const radioRef = useRef<HTMLInputElement>(null);
 * <RadioGroupItem ref={radioRef} name="options" value="1" />
 */

interface RadioGroupItemProps extends InputHTMLAttributes<HTMLInputElement> {}

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input {...rest} className={className} data-ck="radio-group-item" type="radio" ref={ref} />
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";

export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupItemProps,
  type RadioGroupProps,
};
