"use client";

import { useSelect } from "downshift";
import { forwardRef, HTMLAttributes, ReactNode, useId, useMemo } from "react";

import type {
  ItemRenderContext,
  NormalizedItem,
  SelectOption,
} from "../../types/select";

import {
  defaultIsEqual,
  itemToString,
  processOptions,
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
 * - Support for string and object values
 * - Custom trigger and item rendering via render props
 * - Full accessibility (WAI-ARIA Listbox pattern)
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
 * // Custom rendering
 * <Select
 *   options={options}
 *   renderTrigger={({ selectedItem, placeholder }) => (
 *     <span>{selectedItem?.label || placeholder} <ChevronDown /></span>
 *   )}
 *   renderItem={({ option, isSelected }) => (
 *     <div>{option.label} {isSelected && <Check />}</div>
 *   )}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Object values
 * <Select<User>
 *   options={users.map(u => ({ value: u, label: u.name }))}
 *   isEqual={(a, b) => a?.id === b?.id}
 *   onValueChange={setSelectedUser}
 * />
 * ```
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Context provided to custom trigger renderer.
 */
interface TriggerRenderContext<T = string> {
  disabled: boolean;
  isOpen: boolean;
  placeholder: string;
  selectedItem: NormalizedItem<T> | null;
}

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
   * Function to compare two values for equality.
   * Required for object values where reference equality won't work.
   */
  isEqual?: (a: T | undefined, b: T | undefined) => boolean;
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
   * Custom item renderer.
   */
  renderItem?: (context: ItemRenderContext<T>) => ReactNode;
  /**
   * Custom trigger content renderer.
   */
  renderTrigger?: (context: TriggerRenderContext<T>) => ReactNode;
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
    isEqual = defaultIsEqual,
    onValueChange,
    options,
    placeholder = "Select...",
    renderItem: customRenderItem,
    renderTrigger: customRenderTrigger,
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
    return selectableItems.find((item) => isEqual(item.value, value)) ?? null;
  }, [selectableItems, value, isEqual]);

  const initialItem = useMemo(() => {
    if (defaultValue === undefined) return null;
    return (
      selectableItems.find((item) => isEqual(item.value, defaultValue)) ?? null
    );
  }, [selectableItems, defaultValue, isEqual]);

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

  // Trigger render context
  const triggerContext: TriggerRenderContext<T> = {
    disabled,
    isOpen,
    placeholder,
    selectedItem,
  };

  // Default trigger content
  const defaultTriggerContent = (
    <span
      data-ck="select-value"
      data-placeholder={!selectedItem ? "" : undefined}
    >
      {selectedItem?.label ?? placeholder}
    </span>
  );

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
        {customRenderTrigger
          ? customRenderTrigger(triggerContext)
          : defaultTriggerContent}
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
              ? isEqual(selectedItem.value, item.value)
              : false;
            const isHighlighted = highlightedIndex === selectableIndex;
            const isDisabled = item.disabled ?? false;

            const itemContext: ItemRenderContext<T> = {
              index: selectableIndex,
              isDisabled,
              isHighlighted,
              isSelected,
              option: item,
            };

            const itemProps = getItemProps({
              disabled: isDisabled,
              index: selectableIndex,
              item,
            });

            if (customRenderItem) {
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
                  {customRenderItem(itemContext)}
                </div>
              );
            }

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

export { Select, type SelectProps, type TriggerRenderContext };
