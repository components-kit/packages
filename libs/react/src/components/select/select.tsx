"use client";

import { FloatingPortal, type Placement } from "@floating-ui/react";
import { useSelect } from "downshift";
import {
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { NormalizedItem, SelectOption } from "../../types/select";

import { useExitTransition, useFloatingSelect } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import { renderDropdownItems } from "../../utils/render-dropdown-items";
import {
  areValuesEqual,
  findItemByValue,
  itemToString,
  processOptions,
  serializeValue,
} from "../../utils/select";

/**
 * A Select component with a simple props-based API.
 *
 * @description
 * Provides a fully accessible dropdown select with keyboard navigation,
 * powered by Downshift. Supports string options, labeled options, groups,
 * separators, and disabled items.
 *
 * ## Features
 * - Simple props-based API with `options` array
 * - Keyboard navigation: Arrow keys, Enter, Space, Escape, Home, End
 * - Type-ahead character search
 * - Controlled and uncontrolled modes
 * - Support for string and object values via generic `<T>`
 * - Full accessibility (WAI-ARIA Listbox pattern)
 * - CSS-based styling via data attributes
 * - Icon slot (`data-slot="icon"`) for CSS-injected chevron indicator
 * - Configurable dropdown placement via Floating UI
 * - Read-only mode for view-only contexts
 * - Form integration via `name` prop with hidden inputs
 *
 * @remarks
 * - Built on Downshift's `useSelect` hook for state management
 * - `processOptions` normalizes mixed option formats (strings, labeled, groups, separators)
 *   into flat selectable items and render items
 * - Dropdown is rendered inside a `FloatingPortal` and positioned via `useFloatingSelect`
 *   (Floating UI) with flip, shift, and size middleware
 * - `forwardRef` generic `<T>` is preserved via a type cast (TypeScript #30650 workaround)
 * - Uses `data-ck` attributes on root, trigger, value, content, items, separators, and
 *   group labels for CSS targeting
 * - Forwards refs correctly for DOM access
 * - Trigger contains a `data-slot="icon"` div (`aria-hidden`) for CSS-driven open/close indicators
 *
 * ## Keyboard Support
 *
 * | Key | Action |
 * | --- | --- |
 * | `ArrowDown` | Open menu / move to next item |
 * | `ArrowUp` | Move to previous item |
 * | `Enter` | Select highlighted item and close |
 * | `Space` | Open menu / select highlighted item |
 * | `Escape` | Close menu |
 * | `Home` | Move to first item |
 * | `End` | Move to last item |
 * | Characters | Type-ahead search by character |
 *
 * ## Accessibility
 *
 * This component follows the WAI-ARIA Listbox pattern:
 * - Trigger has `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`
 * - Menu has `role="listbox"` with `aria-labelledby` linking to the trigger
 * - Listbox has `aria-orientation="vertical"`
 * - Items have `role="option"` with `aria-selected` and `aria-disabled`
 * - Groups wrapped in `role="group"` with `aria-labelledby` linking to group label
 * - Group labels have `role="presentation"` and a unique `id` for `aria-labelledby`
 * - Separators use `role="separator"` with `aria-orientation="horizontal"`
 * - Live region announces selection changes to screen readers
 * - Empty state uses `role="status"` with `aria-live="polite"`
 *
 * ## Best Practices
 *
 * - Provide a descriptive `aria-label` if no visible label is present
 * - Use groups and separators to organize large option sets
 * - Use `getOptionValue` when working with object values
 * - Disable options rather than hiding them when possible
 *
 * @param {SelectOption<T>[]} options - Array of options to display. Required.
 * @param {T} [value] - Controlled selected value.
 * @param {T} [defaultValue] - Default value for uncontrolled mode.
 * @param {(value: T | undefined) => void} [onValueChange] - Callback when selection changes.
 * @param {string} [placeholder="Select..."] - Placeholder text shown when no value is selected.
 * @param {string} [aria-label] - Accessible label for the trigger. Required when no visible label exists.
 * @param {boolean} [disabled=false] - Whether the select is disabled.
 * @param {string} [variantName] - Variant name for styling via `data-variant`.
 * @param {(option: T) => string | number} [getOptionValue] - Function to extract unique primitive key from option values for object values.
 * @param {string} [emptyContent="No options"] - Text to display when there are no options.
 * @param {Placement} [placement="bottom-start"] - Dropdown placement relative to the trigger (Floating UI placement).
 * @param {(open: boolean) => void} [onOpenChange] - Callback when dropdown opens or closes.
 * @param {boolean} [openOnFocus=true] - Whether to open dropdown when trigger receives focus.
 * @param {boolean} [error=false] - Whether the select is in an error state.
 * @param {number} [maxDropdownHeight] - Maximum height of the dropdown in pixels.
 * @param {boolean} [readOnly=false] - Whether the select is read-only.
 * @param {string} [name] - Form field name. When set, renders a hidden input for form submission.
 * @param {boolean} [required=false] - Whether the select is required.
 *
 * @example
 * ```tsx
 * // Simple string options
 * <Select
 *   options={['apple', 'banana', 'cherry']}
 *   placeholder="Select a fruit..."
 *   onValueChange={setFruit}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Labeled options with disabled items
 * <Select
 *   options={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana', disabled: true },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Grouped options
 * <Select
 *   options={[
 *     { type: 'group', label: 'Fruits', options: ['apple', 'banana'] },
 *     { type: 'separator' },
 *     { type: 'group', label: 'Vegetables', options: ['carrot'] },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Object values
 * <Select<User>
 *   options={users.map(u => ({ value: u, label: u.name }))}
 *   getOptionValue={(u) => u.id}
 *   onValueChange={setSelectedUser}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled mode
 * const [fruit, setFruit] = useState('apple');
 * <Select
 *   options={['apple', 'banana', 'cherry']}
 *   value={fruit}
 *   onValueChange={setFruit}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With ref for DOM access
 * const selectRef = useRef<HTMLDivElement>(null);
 * <Select ref={selectRef} options={['apple', 'banana']} />
 * ```
 *
 * @example
 * ```tsx
 * // Custom placement (opens upward)
 * <Select
 *   options={['apple', 'banana', 'cherry']}
 *   placement="top-start"
 *   placeholder="Opens upward..."
 * />
 * ```
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Select Props
// -----------------------------------------------------------------------------

interface SelectProps<T = string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  /**
   * Accessible label for the select trigger button.
   * Required when there is no visible label element.
   * Prefer a visible <label> element when possible.
   */
  "aria-label"?: string;
  /**
   * Whether to auto-focus the trigger on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: T;
  /**
   * Whether the select is disabled.
   */
  disabled?: boolean;
  /**
   * Text to display when there are no options.
   * @default "No options"
   */
  emptyContent?: string;
  /**
   * Whether the select is in an error state.
   * Renders `data-error` attribute on root for CSS styling.
   */
  error?: boolean;
  /**
   * Function to extract a unique primitive key from option values.
   * Required for object values where reference equality won't work.
   * For primitive values (string, number), this is not needed.
   *
   * @example
   * getOptionValue={(user) => user.id}
   */
  getOptionValue?: (option: T) => number | string;
  /**
   * Maximum height of the dropdown in pixels.
   * When set, the dropdown height will not exceed this value.
   */
  maxDropdownHeight?: number;
  /**
   * Form field name. When set, renders a hidden input for native form submission.
   */
  name?: string;
  /**
   * Callback when the dropdown opens or closes.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when selection changes.
   */
  onValueChange?: (value: T | undefined) => void;
  /**
   * Whether to open the dropdown when the trigger receives focus.
   * @default true
   */
  openOnFocus?: boolean;
  /**
   * Array of options to display.
   */
  options: SelectOption<T>[];
  /**
   * Placeholder text shown when no value is selected.
   * @default "Select..."
   */
  placeholder?: string;
  /**
   * Placement of the dropdown relative to the trigger.
   * Uses Floating UI placement values.
   * @default "bottom-start"
   */
  placement?: Placement;
  /**
   * Whether the select is read-only.
   * Unlike disabled, the component is not greyed out but does not allow interaction.
   */
  readOnly?: boolean;
  /**
   * Whether the select is required.
   * Applies `aria-required` and `data-required` for form validation styling.
   */
  required?: boolean;
  /**
   * Controlled value.
   */
  value?: T;
  /**
   * Variant name for styling via `data-variant` attribute.
   */
  variantName?: string;
}

// -----------------------------------------------------------------------------
// Select Component
// -----------------------------------------------------------------------------

/**
 * Select component with props-based API.
 */
function SelectInner<T = string>(
  {
    "aria-label": ariaLabel,
    autoFocus,
    className,
    defaultValue,
    disabled = false,
    emptyContent = "No options",
    error = false,
    getOptionValue,
    maxDropdownHeight,
    name,
    onOpenChange,
    onValueChange,
    openOnFocus = true,
    options,
    placeholder = "Select...",
    placement,
    readOnly = false,
    required = false,
    value,
    variantName,
    ...rest
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const triggerId = useId();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuNodeRef = useRef<HTMLDivElement | null>(null);
  // Tracks whether a pointer (mouse/touch) interaction is in progress.
  // Set on pointerdown, cleared after the click event settles.
  // Used to: (1) skip openMenu() on focus (let ToggleButtonClick handle it)
  // and (2) suppress ToggleButtonBlur in the stateReducer during a click
  // gesture so blur doesn't close the menu right before click reopens it.
  const pointerFocusRef = useRef(false);

  // Live region announcement state
  const [announcement, setAnnouncement] = useState("");
  const announcementTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    return () => {
      if (announcementTimerRef.current) clearTimeout(announcementTimerRef.current);
    };
  }, []);

  // Process options into selectable items and render items
  const { renderItems, selectableItems } = useMemo(
    () => processOptions(options, triggerId),
    [options, triggerId],
  );

  // Find controlled/initial selected item
  const controlledItem = useMemo(
    () => findItemByValue(selectableItems, value, getOptionValue),
    [selectableItems, value, getOptionValue],
  );

  const initialItem = useMemo(
    () =>
      findItemByValue(selectableItems, defaultValue, getOptionValue) ?? null,
    [selectableItems, defaultValue, getOptionValue],
  );

  const isInteractive = !disabled && !readOnly;

  // Use Downshift for state management
  const {
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
    openMenu,
    selectedItem,
  } = useSelect<NormalizedItem<T>>({
    id: triggerId,
    initialSelectedItem: initialItem,
    isItemDisabled: (item) => item?.disabled ?? false,
    items: selectableItems,
    itemToString,
    menuId,
    onIsOpenChange: ({ isOpen: open }) => {
      if (readOnly) return;
      onOpenChange?.(open ?? false);
    },
    onSelectedItemChange: ({ selectedItem: newItem }) => {
      onValueChange?.(newItem?.value);
      if (newItem) {
        setAnnouncement(`${newItem.label} selected`);
        // Clear announcement after screen reader has had time to announce
        if (announcementTimerRef.current) clearTimeout(announcementTimerRef.current);
        announcementTimerRef.current = setTimeout(() => setAnnouncement(""), 1000);
      }
    },
    selectedItem: controlledItem,
    stateReducer: (_state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      if (readOnly) {
        return { ...changes, isOpen: false };
      }
      // During a pointer click the browser fires events in this order:
      //   pointerdown → focus → blur → click
      // Downshift processes blur as ToggleButtonBlur (closing the menu) and
      // then click as ToggleButtonClick (toggling it back open).
      // pointerFocusRef is set on pointerdown and cleared on click (not
      // via setTimeout, which is unreliable). While it's set, suppress
      // blur so only the ToggleButtonClick drives the toggle.
      if (
        type === useSelect.stateChangeTypes.ToggleButtonBlur &&
        pointerFocusRef.current
      ) {
        return { ...changes, isOpen: _state.isOpen };
      }
      return changes;
    },
  });

  // Use Floating UI for positioning
  const { floatingProps, referenceProps } = useFloatingSelect({
    isOpen,
    maxDropdownHeight,
    placement,
  });
  const side = floatingProps.placement.split("-")[0];

  // Delay unmount for CSS exit animations
  const contentRef = useRef<HTMLDivElement>(null);
  const { dataState: contentState, isMounted } = useExitTransition({
    isOpen,
    nodeRef: contentRef,
  });

  // Merge refs (memoized to avoid new callbacks on every render)
  const containerRef_ = useMemo(
    () => mergeRefs<HTMLDivElement>(containerRef, ref),
    [ref],
  );
  const triggerRef = useMemo(
    () => mergeRefs<HTMLButtonElement>(referenceProps.ref),
    [referenceProps.ref],
  );
  const menuRef = useMemo(
    () => mergeRefs<HTMLDivElement>(menuNodeRef, contentRef),
    [],
  );

  // Mark that the upcoming focus is from a pointer (mouse/touch) so the
  // focus handler and stateReducer can distinguish pointer clicks from
  // keyboard focus. pointerdown fires before focus and blur, and click
  // fires after — so the flag is set during the entire event cascade.
  const handleTriggerPointerDown = useCallback(() => {
    pointerFocusRef.current = true;
  }, []);

  // Clear pointerFocusRef on click — fires after pointerdown → focus → blur,
  // so the flag is still true when the stateReducer processes ToggleButtonBlur.
  const handleTriggerClick = useCallback(() => {
    pointerFocusRef.current = false;
  }, []);

  // Open on focus handler (openOnFocus).
  // For pointer clicks: skip openMenu() — Downshift's ToggleButtonClick
  // already toggles the menu open. Calling openMenu() here would conflict
  // (focus opens → click toggles closed → flash).
  // For keyboard (Tab): no click follows, so we must call openMenu().
  // The !isOpen guard prevents reopening when Downshift returns focus to the
  // trigger after closing (e.g. after ToggleButtonClick closes the menu).
  const handleTriggerFocus = useCallback(() => {
    if (openOnFocus && isInteractive && !isOpen) {
      if (pointerFocusRef.current) {
        return;
      }
      openMenu();
    }
  }, [openOnFocus, isInteractive, isOpen, openMenu]);

  // Serialize value for hidden input
  const serializedValue = useMemo(() => {
    if (!selectedItem) return "";
    return serializeValue(selectedItem.value, getOptionValue);
  }, [selectedItem, getOptionValue]);

  const isEmpty = renderItems.length === 0;

  return (
    <div
      {...rest}
      className={className}
      data-ck="select"
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      data-has-value={selectedItem ? true : undefined}
      data-readonly={readOnly || undefined}
      data-required={required || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-variant={variantName}
      ref={containerRef_}
    >
      {/* Hidden input for form submission */}
      {name && <input name={name} type="hidden" value={serializedValue} />}

      {/* Live region for screen reader announcements */}
      <div
        aria-atomic="true"
        aria-live="polite"
        data-ck="select-live"
        role="status"
      >
        {announcement}
      </div>

      {/* Trigger */}
      <button
        {...getToggleButtonProps({
          disabled: disabled || readOnly,
          id: triggerId,
          onClick: handleTriggerClick,
          ...(ariaLabel !== undefined && { "aria-label": ariaLabel }),
        })}
        // Override Downshift's auto-generated aria-labelledby (which points at
        // the trigger + menu) so the trigger relies on its own content or the
        // consumer-provided aria-label instead.
        aria-labelledby={undefined}
        aria-required={required || undefined}
        autoFocus={autoFocus}
        data-ck="select-trigger"
        data-state={isOpen ? "open" : "closed"}
        type="button"
        onFocus={handleTriggerFocus}
        onPointerDown={handleTriggerPointerDown}
        ref={triggerRef}
      >
        <span
          data-ck="select-value"
          data-placeholder={!selectedItem ? "" : undefined}
        >
          {selectedItem?.label ?? placeholder}
        </span>
        <div aria-hidden="true" data-slot="icon" />
      </button>

      {/* Content - Rendered in portal */}
      <FloatingPortal>
        {isMounted && (
          <div
            style={{
              ...floatingProps.style,
              ...(!isOpen && { pointerEvents: "none" }),
            }}
            ref={floatingProps.ref}
          >
            <div
              {...getMenuProps({ id: menuId, ref: menuRef })}
              aria-labelledby={triggerId}
              aria-orientation="vertical"
              data-ck="select-content"
              data-empty={isEmpty || undefined}
              data-side={side}
              data-state={contentState}
            >
              {isEmpty && (
                <div aria-live="polite" data-ck="select-empty" role="status">
                  {emptyContent}
                </div>
              )}

              {renderDropdownItems({
                getItemProps,
                highlightedIndex,
                isItemSelected: (item) =>
                  selectedItem
                    ? areValuesEqual(
                        selectedItem.value,
                        item.value,
                        getOptionValue,
                      )
                    : false,
                prefix: "select",
                renderItems,
              })}
            </div>
          </div>
        )}
      </FloatingPortal>
    </div>
  );
}

// forwardRef erases the generic <T> parameter (TypeScript #30650).
// This cast restores it while keeping the external API fully type-safe.
const Select = forwardRef(SelectInner) as unknown as (<T = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string };

Select.displayName = "Select";

export { Select, type SelectProps };
