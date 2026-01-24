"use client";

import { useSelect } from "downshift";
import { forwardRef, HTMLAttributes, ReactNode, useId, useMemo } from "react";

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
 * Simple string option - value and label are the same.
 */
type StringOption = string;

/**
 * Option with explicit value and label.
 */
interface LabeledOption<T = string> {
  disabled?: boolean;
  label?: string;
  value: T;
}

/**
 * Separator in the options list.
 */
interface SeparatorOption {
  type: "separator";
}

/**
 * Grouped options with a label.
 */
interface GroupOption<T = string> {
  label: string;
  options: Array<LabeledOption<T> | StringOption>;
  type: "group";
}

/**
 * Union type for all option formats.
 */
type SelectOption<T = string> =
  | GroupOption<T>
  | LabeledOption<T>
  | SeparatorOption
  | StringOption;

/**
 * Internal normalized item representation.
 */
interface NormalizedItem<T = string> {
  disabled?: boolean;
  label: string;
  value: T;
}

/**
 * Render item for display (includes separators and group labels).
 */
type RenderItem<T = string> =
  | { groupIndex: number; groupLabel: string; type: "group-label" }
  | { item: NormalizedItem<T>; selectableIndex: number; type: "item" }
  | { type: "separator" };

/**
 * Context provided to custom trigger renderer.
 */
interface TriggerRenderContext<T = string> {
  disabled: boolean;
  isOpen: boolean;
  placeholder: string;
  selectedItem: NormalizedItem<T> | null;
}

/**
 * Context provided to custom item renderer.
 */
interface ItemRenderContext<T = string> {
  index: number;
  isDisabled: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  option: NormalizedItem<T>;
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
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Normalizes a string option to NormalizedItem<string> format.
 */
function normalizeStringOption(option: string): NormalizedItem<string> {
  return {
    disabled: false,
    label: option,
    value: option,
  };
}

/**
 * Normalizes a labeled option to NormalizedItem format.
 */
function normalizeLabeledOption<T>(option: LabeledOption<T>): NormalizedItem<T> {
  return {
    disabled: option.disabled ?? false,
    label: option.label ?? String(option.value),
    value: option.value,
  };
}

/**
 * Normalizes a single option to NormalizedItem format.
 * When T is string and option is a string, returns the string as both value and label.
 * When T is not string, option must be a LabeledOption<T>.
 */
function normalizeOption<T>(
  option: LabeledOption<T> | StringOption,
): NormalizedItem<T> {
  if (typeof option === "string") {
    // When option is a string, T must be compatible with string
    // This is a safe cast because StringOption can only be used when T extends string
    return normalizeStringOption(option) as NormalizedItem<T>;
  }
  return normalizeLabeledOption(option);
}

/**
 * Flattens options array into selectable items and render items.
 */
function processOptions<T>(options: SelectOption<T>[]): {
  renderItems: RenderItem<T>[];
  selectableItems: NormalizedItem<T>[];
} {
  const selectableItems: NormalizedItem<T>[] = [];
  const renderItems: RenderItem<T>[] = [];
  let groupIndex = 0;

  for (const option of options) {
    if (typeof option === "string") {
      const item = normalizeOption<T>(option);
      renderItems.push({
        item,
        selectableIndex: selectableItems.length,
        type: "item",
      });
      selectableItems.push(item);
    } else if ("type" in option) {
      if (option.type === "separator") {
        renderItems.push({ type: "separator" });
      } else if (option.type === "group") {
        renderItems.push({
          groupIndex: groupIndex++,
          groupLabel: option.label,
          type: "group-label",
        });
        for (const groupItem of option.options) {
          const item = normalizeOption<T>(groupItem);
          renderItems.push({
            item,
            selectableIndex: selectableItems.length,
            type: "item",
          });
          selectableItems.push(item);
        }
      }
    } else {
      // LabeledOption
      const item = normalizeOption<T>(option);
      renderItems.push({
        item,
        selectableIndex: selectableItems.length,
        type: "item",
      });
      selectableItems.push(item);
    }
  }

  return { renderItems, selectableItems };
}

/**
 * Default equality check for values.
 */
function defaultIsEqual<T>(a: T | undefined, b: T | undefined): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  if (typeof a === "string" || typeof b === "string") return a === b;
  // For objects, use JSON comparison
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Gets a string representation of the item for Downshift's itemToString.
 */
function itemToString<T>(item: NormalizedItem<T> | null): string {
  if (!item) return "";
  return item.label;
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

// Use forwardRef with generic support
const Select = forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement;

(Select as { displayName?: string }).displayName = "Select";

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export {
  type GroupOption,
  type ItemRenderContext,
  type LabeledOption,
  Select,
  type SelectOption,
  type SelectProps,
  type SeparatorOption,
  type TriggerRenderContext,
};
