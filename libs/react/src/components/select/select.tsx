"use client";

import { useSelect } from "downshift";
import { forwardRef, HTMLAttributes, useId, useMemo } from "react";

import type { NormalizedItem, SelectOption } from "../../types/select";

import { itemToString, processOptions } from "../../utils/select";

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
 * - Support for string and object values
 * - Full accessibility (WAI-ARIA Listbox pattern)
 * - CSS-based styling via data attributes
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
   * Default value for uncontrolled mode.
   */
  defaultValue?: T;
  /**
   * Whether the select is disabled.
   */
  disabled?: boolean;
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
   * Callback when selection changes.
   */
  onValueChange?: (value: T | undefined) => void;
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
    className,
    defaultValue,
    disabled = false,
    getOptionValue,
    onValueChange,
    options,
    placeholder = "Select...",
    value,
    variantName,
    ...rest
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const triggerId = useId();
  const menuId = useId();

  // Process options into selectable items and render items
  const { renderItems, selectableItems } = useMemo(
    () => processOptions(options),
    [options],
  );

  // Find controlled/initial selected item
  const controlledItem = useMemo(() => {
    if (value === undefined) return undefined;

    if (getOptionValue) {
      const valueKey = getOptionValue(value);
      return (
        selectableItems.find(
          (item) => getOptionValue(item.value) === valueKey,
        ) ?? null
      );
    }

    // Fallback to reference equality for primitives
    return selectableItems.find((item) => item.value === value) ?? null;
  }, [selectableItems, value, getOptionValue]);

  const initialItem = useMemo(() => {
    if (defaultValue === undefined) return null;

    if (getOptionValue) {
      const valueKey = getOptionValue(defaultValue);
      return (
        selectableItems.find(
          (item) => getOptionValue(item.value) === valueKey,
        ) ?? null
      );
    }

    return selectableItems.find((item) => item.value === defaultValue) ?? null;
  }, [selectableItems, defaultValue, getOptionValue]);

  // Use Downshift for state management
  const {
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
    selectedItem,
  } = useSelect<NormalizedItem<T>>({
    id: triggerId,
    initialSelectedItem: initialItem,
    isItemDisabled: (item) => item?.disabled ?? false,
    items: selectableItems,
    itemToString,
    menuId,
    onSelectedItemChange: ({ selectedItem: newItem }) => {
      onValueChange?.(newItem?.value);
    },
    selectedItem: controlledItem,
  });

  return (
    <div
      {...rest}
      className={className}
      data-ck="select"
      data-disabled={disabled || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-variant={variantName}
      ref={ref}
    >
      {/* Trigger */}
      <button
        {...getToggleButtonProps({ disabled, id: triggerId })}
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        data-ck="select-trigger"
        data-state={isOpen ? "open" : "closed"}
        type="button"
      >
        <span
          data-ck="select-value"
          data-placeholder={!selectedItem ? "" : undefined}
        >
          {selectedItem?.label ?? placeholder}
        </span>
      </button>

      {/* Content */}
      <div
        {...getMenuProps({ id: menuId })}
        aria-labelledby={triggerId}
        data-ck="select-content"
        data-state={isOpen ? "open" : "closed"}
      >
        {isOpen &&
          renderItems.map((renderItem, idx) => {
            if (renderItem.type === "separator") {
              return (
                <div
                  key={`separator-${idx}`}
                  aria-orientation="horizontal"
                  data-ck="select-separator"
                  role="separator"
                />
              );
            }

            if (renderItem.type === "group-label") {
              return (
                <div
                  key={`group-${renderItem.groupIndex}`}
                  data-ck="select-group-label"
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
                data-ck="select-item"
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
const Select = forwardRef(SelectInner) as unknown as (<T = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string };

Select.displayName = "Select";

export { Select, type SelectProps };
