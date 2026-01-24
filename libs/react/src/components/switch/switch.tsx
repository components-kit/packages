"use client";

import { forwardRef, InputHTMLAttributes } from "react";

/**
 * A toggle switch component for binary on/off choices.
 *
 * @description
 * The Switch component provides a toggle control for binary choices. Unlike
 * checkboxes which are typically used for multiple selections, switches are
 * ideal for immediate on/off decisions like enabling features or settings.
 *
 * ## Features
 * - Native checkbox input with `role="switch"` for accessibility
 * - Controlled and uncontrolled modes
 * - Data attribute for CSS-based styling (`data-variant`)
 * - Full support for all native input attributes
 * - Ref forwarding for DOM access
 *
 * @remarks
 * - Uses `type="checkbox"` with `role="switch"` for proper semantics
 * - Switches should be used for immediate effect actions (no form submit needed)
 * - Use `defaultChecked` for uncontrolled mode, `checked` with `onChange` for controlled
 * - The switch should always have an associated label for accessibility
 * - Unlike checkboxes, switches typically don't support indeterminate state
 *
 * ## Accessibility
 * This component follows WAI-ARIA Switch Pattern guidelines:
 * - Uses `role="switch"` for screen reader identification
 * - Uses native checkbox for keyboard support (Space to toggle)
 * - Always associate with a `<label>` using `id` and `htmlFor`
 * - Or use `aria-label` for visually hidden labels
 * - Use `aria-describedby` to link to helper text
 * - Native `disabled` attribute properly conveys state
 * - Screen readers announce "on" or "off" state
 *
 * ## Switch vs Checkbox
 * Use a **Switch** when:
 * - The action takes immediate effect (no form submission)
 * - It's a simple on/off choice (like a light switch)
 * - Used in settings panels or preference screens
 *
 * Use a **Checkbox** when:
 * - Part of a form that will be submitted
 * - Multiple options can be selected
 * - There's an indeterminate/mixed state
 *
 * ## Best Practices
 * - Always provide a visible label or aria-label
 * - Use clear, action-oriented label text
 * - Place the switch consistently (before or after label)
 * - Consider adding descriptions for complex settings
 * - Ensure the switch is large enough for touch targets
 * - Provide visual feedback for state changes
 *
 * @param {string} [variantName] - The variant name for styling.
 *
 * @example
 * // Basic switch with label
 * <Switch id="notifications" variantName="default" />
 * <label htmlFor="notifications">Enable notifications</label>
 *
 * @example
 * // Controlled switch
 * const [enabled, setEnabled] = useState(false);
 * <Switch
 *   checked={enabled}
 *   onChange={(e) => setEnabled(e.target.checked)}
 *   variantName="default"
 * />
 *
 * @example
 * // With aria-label (no visible label)
 * <Switch
 *   aria-label="Enable dark mode"
 *   variantName="default"
 * />
 *
 * @example
 * // Disabled switch
 * <Switch
 *   id="premium-feature"
 *   disabled
 *   variantName="default"
 * />
 * <label htmlFor="premium-feature">Premium feature (upgrade required)</label>
 *
 * @example
 * // Default on (uncontrolled)
 * <Switch
 *   id="auto-save"
 *   defaultChecked
 *   variantName="default"
 * />
 * <label htmlFor="auto-save">Auto-save enabled</label>
 *
 * @example
 * // With description
 * <div>
 *   <Switch
 *     id="analytics"
 *     aria-describedby="analytics-desc"
 *     variantName="default"
 *   />
 *   <label htmlFor="analytics">Analytics</label>
 *   <p id="analytics-desc">Help us improve by sharing anonymous usage data</p>
 * </div>
 *
 * @example
 * // In a settings panel
 * <div role="group" aria-labelledby="settings-title">
 *   <h3 id="settings-title">Notification Settings</h3>
 *   <div>
 *     <Switch id="email" variantName="default" />
 *     <label htmlFor="email">Email notifications</label>
 *   </div>
 *   <div>
 *     <Switch id="push" variantName="default" />
 *     <label htmlFor="push">Push notifications</label>
 *   </div>
 *   <div>
 *     <Switch id="sms" variantName="default" />
 *     <label htmlFor="sms">SMS notifications</label>
 *   </div>
 * </div>
 *
 * @example
 * // With ref for DOM access
 * const switchRef = useRef<HTMLInputElement>(null);
 * <Switch ref={switchRef} variantName="default" />
 */

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  variantName?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, variantName, ...rest }, ref) => {
    return (
      <input
        {...rest}
        className={className}
        data-ck="switch"
        data-variant={variantName}
        role="switch"
        type="checkbox"
        ref={ref}
      />
    );
  }
);

Switch.displayName = "Switch";

export { Switch, type SwitchProps };
