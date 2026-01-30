"use client";

import { useCombobox } from "downshift";
import {
  forwardRef,
  HTMLAttributes,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";

import type { NormalizedItem, SelectOption } from "../../types/select";

import {
  filterRenderItems,
  itemToString,
  processOptions,
} from "../../utils/select";

/**
 * A searchable select component with type-ahead filtering and keyboard navigation.
 *
 * @description
 * Provides a fully accessible combobox with text input filtering and keyboard
 * navigation, powered by Downshift. Supports string options, labeled options,
 * groups, separators, and disabled items.
 *
 * ## Features
 * - Props-based API with `options` array and text input filtering
 * - Keyboard navigation: Arrow keys, Enter, Escape, Home, End
 * - Type-ahead text filtering (case-insensitive by default, customizable via `filterFn`)
 * - Controlled and uncontrolled modes for both value and input text
 * - Support for string and object values via generic `<T>`
 * - Custom filter function support
 * - Option groups, separators, and disabled items
 * - Full accessibility (WAI-ARIA Combobox with Listbox Popup pattern)
 * - CSS-based styling via data attributes
 *
 * @remarks
 * Built on Downshift's `useCombobox` hook.
 *
 * Filtering is computed before passing items to Downshift (standard Downshift
 * pattern). Input value is tracked locally for filtering and synced via
 * `onInputValueChange`.
 *
 * Uses `data-ck` attributes for CSS-based styling. Forwards refs correctly for
 * DOM access.
 *
 * ## Keyboard Support
 * | Key | Action |
 * | --- | --- |
 * | `ArrowDown` | Open menu / move to next item |
 * | `ArrowUp` | Move to previous item |
 * | `Enter` | Select highlighted item and close |
 * | `Escape` | Close menu |
 * | `Home` | Move to first item |
 * | `End` | Move to last item |
 * | Characters | Filter options by typing |
 *
 * ## Accessibility
 * - Follows WAI-ARIA Combobox Pattern with `role="combobox"` on input
 * - `role="listbox"` on dropdown menu
 * - `role="option"` with `aria-selected` on items
 * - `aria-expanded` toggles with menu state
 * - `aria-controls` links input to listbox
 * - `aria-disabled` on disabled items
 * - `role="status"` with `aria-live="polite"` on empty state for screen reader announcement
 * - `role="separator"` on dividers
 *
 * ## Best Practices
 * - Provide a descriptive `aria-label` if no visible label
 * - Use `filterFn` for custom matching (e.g., fuzzy search)
 * - Use `getOptionValue` when working with object values
 * - Use groups and separators to organize large option sets
 *
 * @param {SelectOption<T>[]} options - Array of options to display. Required.
 * @param {T} [value] - Controlled selected value.
 * @param {T} [defaultValue] - Default value for uncontrolled mode.
 * @param {(value: T | undefined) => void} [onValueChange] - Callback when selection changes.
 * @param {string} [inputValue] - Controlled input text value.
 * @param {string} [defaultInputValue] - Default input value for uncontrolled input mode.
 * @param {(value: string) => void} [onInputValueChange] - Callback when input text changes.
 * @param {string} [placeholder="Search..."] - Placeholder text for the input.
 * @param {boolean} [disabled=false] - Whether the combobox is disabled.
 * @param {string} [variantName] - Variant name for styling via `data-variant`.
 * @param {(option: T) => string | number} [getOptionValue] - Function to extract unique primitive key from option values for object values.
 * @param {(option: NormalizedItem<T>, inputValue: string) => boolean} [filterFn] - Custom filter function. Default: case-insensitive includes.
 *
 * @example
 * ```tsx
 * // Simple string options
 * <Combobox
 *   options={['apple', 'banana', 'cherry']}
 *   placeholder="Search fruits..."
 *   onValueChange={setFruit}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Labeled options with disabled items
 * <Combobox
 *   options={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana', disabled: true },
 *     { value: 'cherry', label: 'Cherry' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Grouped options with separator
 * <Combobox
 *   options={[
 *     { type: 'group', label: 'Fruits', options: ['apple', 'banana'] },
 *     { type: 'separator' },
 *     { type: 'group', label: 'Vegetables', options: ['carrot', 'celery'] },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled value
 * <Combobox
 *   options={['apple', 'banana', 'cherry']}
 *   value={selectedFruit}
 *   onValueChange={setSelectedFruit}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled input value
 * <Combobox
 *   options={['apple', 'banana', 'cherry']}
 *   inputValue={query}
 *   onInputValueChange={setQuery}
 *   onValueChange={setFruit}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom filter function
 * <Combobox
 *   options={['apple', 'banana', 'cherry']}
 *   filterFn={(option, input) =>
 *     option.label.toLowerCase().startsWith(input.toLowerCase())
 *   }
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Object values
 * <Combobox<User>
 *   options={users.map(u => ({ value: u, label: u.name }))}
 *   getOptionValue={(u) => u.id}
 *   onValueChange={setSelectedUser}
 * />
 * ```
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Combobox Props
// -----------------------------------------------------------------------------

interface ComboboxProps<T = string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  /**
   * Default input value for uncontrolled input mode.
   */
  defaultInputValue?: string;
  /**
   * Default selected value for uncontrolled mode.
   */
  defaultValue?: T;
  /**
   * Whether the combobox is disabled.
   */
  disabled?: boolean;
  /**
   * Custom filter function. Receives the normalized item and the current input value.
   * Return true to keep the item visible.
   * @default Case-insensitive includes match on label.
   */
  filterFn?: (option: NormalizedItem<T>, inputValue: string) => boolean;
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
   * Controlled input value.
   */
  inputValue?: string;
  /**
   * Callback when input text changes.
   */
  onInputValueChange?: (value: string) => void;
  /**
   * Callback when selection changes.
   */
  onValueChange?: (value: T | undefined) => void;
  /**
   * Array of options to display.
   */
  options: SelectOption<T>[];
  /**
   * Placeholder text shown in the input when no value is typed.
   * @default "Search..."
   */
  placeholder?: string;
  /**
   * Controlled selected value.
   */
  value?: T;
  /**
   * Variant name for styling via `data-variant` attribute.
   */
  variantName?: string;
}

// -----------------------------------------------------------------------------
// Combobox Component
// -----------------------------------------------------------------------------

function ComboboxInner<T = string>(
  {
    className,
    defaultInputValue,
    defaultValue,
    disabled = false,
    filterFn,
    getOptionValue,
    inputValue: controlledInputValue,
    onInputValueChange,
    onValueChange,
    options,
    placeholder = "Search...",
    value,
    variantName,
    ...rest
  }: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const inputId = useId();
  const menuId = useId();

  // Process all options into flat selectable items and structured render items
  const { renderItems: allRenderItems, selectableItems: allSelectableItems } =
    useMemo(() => processOptions(options), [options]);

  // Default filter: case-insensitive includes on label
  const defaultFilterFn = useCallback(
    (item: NormalizedItem<T>, input: string) => {
      if (!input) return true;
      return item.label.toLowerCase().includes(input.toLowerCase());
    },
    [],
  );

  const effectiveFilter = filterFn ?? defaultFilterFn;

  // Track input value locally for filtering.
  // Downshift's onInputValueChange updates this, and we compute filtered items
  // from it before passing to useCombobox (standard Downshift pattern).
  const [localInputValue, setLocalInputValue] = useState(
    defaultInputValue ?? "",
  );
  const currentInputValue =
    controlledInputValue !== undefined ? controlledInputValue : localInputValue;

  // Filter items based on current input value (computed before useCombobox)
  const { filteredRenderItems, filteredSelectableItems } = useMemo(
    () =>
      filterRenderItems(allRenderItems, allSelectableItems, (item) =>
        effectiveFilter(item, currentInputValue),
      ),
    [allRenderItems, allSelectableItems, effectiveFilter, currentInputValue],
  );

  // Find controlled/initial selected item
  const controlledItem = useMemo(() => {
    if (value === undefined) return undefined;

    if (getOptionValue) {
      const valueKey = getOptionValue(value);
      return (
        allSelectableItems.find(
          (item) => getOptionValue(item.value) === valueKey,
        ) ?? null
      );
    }

    // Fallback to reference equality for primitives
    return allSelectableItems.find((item) => item.value === value) ?? null;
  }, [allSelectableItems, value, getOptionValue]);

  const initialItem = useMemo(() => {
    if (defaultValue === undefined) return null;

    if (getOptionValue) {
      const valueKey = getOptionValue(defaultValue);
      return (
        allSelectableItems.find(
          (item) => getOptionValue(item.value) === valueKey,
        ) ?? null
      );
    }

    return (
      allSelectableItems.find((item) => item.value === defaultValue) ?? null
    );
  }, [allSelectableItems, defaultValue, getOptionValue]);

  // Use Downshift useCombobox with filtered items
  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
    selectedItem,
  } = useCombobox<NormalizedItem<T>>({
    id: inputId,
    initialInputValue: defaultInputValue,
    initialSelectedItem: initialItem,
    ...(controlledInputValue !== undefined && {
      inputValue: controlledInputValue,
    }),
    isItemDisabled: (item) => item?.disabled ?? false,
    items: filteredSelectableItems,
    itemToString,
    menuId,
    onInputValueChange: ({ inputValue: newVal }) => {
      const val = newVal ?? "";
      setLocalInputValue(val);
      onInputValueChange?.(val);
    },
    onSelectedItemChange: ({ selectedItem: newItem }) => {
      onValueChange?.(newItem?.value);
    },
    selectedItem: controlledItem,
  });

  return (
    <div
      {...rest}
      className={className}
      data-ck="combobox"
      data-disabled={disabled || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-variant={variantName}
      ref={ref}
    >
      {/* Input area */}
      <div data-ck="combobox-input-wrapper">
        <input
          {...getInputProps({ disabled, id: inputId })}
          aria-disabled={disabled || undefined}
          data-ck="combobox-input"
          placeholder={placeholder}
        />
        <button
          {...getToggleButtonProps({ disabled })}
          aria-label="toggle menu"
          data-ck="combobox-trigger"
          data-state={isOpen ? "open" : "closed"}
          tabIndex={-1}
          type="button"
        />
      </div>

      {/* Dropdown content */}
      <div
        {...getMenuProps({ id: menuId })}
        data-ck="combobox-content"
        data-state={isOpen ? "open" : "closed"}
      >
        {isOpen && filteredRenderItems.length === 0 && (
          <div aria-live="polite" data-ck="combobox-empty" role="status">
            No results found
          </div>
        )}

        {isOpen &&
          filteredRenderItems.map((renderItem, idx) => {
            if (renderItem.type === "separator") {
              return (
                <div
                  key={`separator-${idx}`}
                  aria-orientation="horizontal"
                  data-ck="combobox-separator"
                  role="separator"
                />
              );
            }

            if (renderItem.type === "group-label") {
              return (
                <div
                  key={`group-${renderItem.groupIndex}`}
                  data-ck="combobox-group-label"
                  role="presentation"
                >
                  {renderItem.groupLabel}
                </div>
              );
            }

            // Item
            const { item, selectableIndex } = renderItem;
            const isSelected = selectedItem
              ? getOptionValue
                ? getOptionValue(selectedItem.value) ===
                  getOptionValue(item.value)
                : selectedItem.value === item.value
              : false;
            const isHighlighted = highlightedIndex === selectableIndex;
            const isDisabled = item.disabled ?? false;

            const itemProps = getItemProps({
              disabled: isDisabled,
              index: selectableIndex,
              item,
            });

            return (
              <div
                key={`item-${selectableIndex}`}
                {...itemProps}
                aria-disabled={isDisabled || undefined}
                aria-selected={isSelected}
                data-ck="combobox-item"
                data-disabled={isDisabled || undefined}
                data-highlighted={isHighlighted || undefined}
                data-state={isSelected ? "checked" : "unchecked"}
                role="option"
              >
                {item.label}
              </div>
            );
          })}
      </div>
    </div>
  );
}

// forwardRef erases the generic <T> parameter (TypeScript #30650).
// This cast restores it while keeping the external API fully type-safe.
const Combobox = forwardRef(ComboboxInner) as unknown as (<T = string>(
  props: ComboboxProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string };

Combobox.displayName = "Combobox";

export { Combobox, type ComboboxProps };
