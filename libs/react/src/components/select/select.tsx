"use client";

import { FloatingPortal } from "@floating-ui/react";
import { useSelect } from "downshift";
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useId,
  useMemo,
  useRef,
} from "react";

import type { NormalizedItem, SelectOption } from "../../types/select";

import { useFloatingSelect } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import {
  areValuesEqual,
  findItemByValue,
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
 * - Support for string and object values via generic `<T>`
 * - Empty state with customizable content
 * - Full accessibility (WAI-ARIA Listbox pattern)
 * - CSS-based styling via data attributes
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
 * - Items have `role="option"` with `aria-selected` and `aria-disabled`
 * - Empty state uses `role="status"` with `aria-live="polite"` for screen reader announcement
 * - Separators use `role="separator"` with `aria-orientation="horizontal"`
 *
 * ## Best Practices
 *
 * - Provide a descriptive `aria-label` if no visible label is present
 * - Use groups and separators to organize large option sets
 * - Use `getOptionValue` when working with object values
 * - Disable options rather than hiding them when possible
 * - Provide custom `emptyContent` for a better user experience when no options match
 *
 * @param {SelectOption<T>[]} options - Array of options to display. Required.
 * @param {T} [value] - Controlled selected value.
 * @param {T} [defaultValue] - Default value for uncontrolled mode.
 * @param {(value: T | undefined) => void} [onValueChange] - Callback when selection changes.
 * @param {string} [placeholder="Select..."] - Placeholder text shown when no value is selected.
 * @param {boolean} [disabled=false] - Whether the select is disabled.
 * @param {string} [variantName] - Variant name for styling via `data-variant`.
 * @param {(option: T) => string | number} [getOptionValue] - Function to extract unique primitive key from option values for object values.
 * @param {ReactNode} [emptyContent="No options"] - Custom content to display when there are no options.
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
   * Custom content to display when there are no options.
   * @default "No options"
   */
  emptyContent?: ReactNode;
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
    emptyContent = "No options",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const menuNodeRef = useRef<HTMLDivElement | null>(null);

  // Process options into selectable items and render items
  const { renderItems, selectableItems } = useMemo(
    () => processOptions(options),
    [options],
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

  // Use Floating UI for positioning
  const { floatingProps, referenceProps } = useFloatingSelect({ isOpen });

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
    () => mergeRefs<HTMLDivElement>(menuNodeRef, floatingProps.ref),
    [floatingProps.ref],
  );

  return (
    <div
      {...rest}
      className={className}
      data-ck="select"
      data-disabled={disabled || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-variant={variantName}
      ref={containerRef_}
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
        ref={triggerRef}
      >
        <span
          data-ck="select-value"
          data-placeholder={!selectedItem ? "" : undefined}
        >
          {selectedItem?.label ?? placeholder}
        </span>
      </button>

      {/* Content - Rendered in portal */}
      <FloatingPortal>
        {isOpen && (
          <div
            {...getMenuProps({ id: menuId, ref: menuRef })}
            style={floatingProps.style}
            aria-labelledby={triggerId}
            data-ck="select-content"
            data-state="open"
          >
            {renderItems.length === 0 && (
              <div aria-live="polite" data-ck="select-empty" role="status">
                {emptyContent}
              </div>
            )}

            {renderItems.map((renderItem, idx) => {
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
                ? areValuesEqual(selectedItem.value, item.value, getOptionValue)
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
