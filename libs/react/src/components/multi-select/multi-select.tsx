"use client";

import { useCombobox, useMultipleSelection } from "downshift";
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
 * A multi-select component with tag chips, type-ahead filtering, and keyboard navigation.
 *
 * @description
 * Provides a fully accessible multi-select dropdown with type-ahead filtering,
 * powered by Downshift. Selected values appear as removable tag chips inside the
 * input area.
 *
 * ## Features
 * - Props-based API for selecting multiple values from an `options` array
 * - Selected values displayed as removable tag chips
 * - Text input for filtering available options
 * - Menu stays open after selection for continuous picking
 * - Controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes
 * - Maximum selection limit via `maxSelected`
 * - Support for string and object values via generic `<T>`
 * - Option groups, separators, and disabled items
 * - Full accessibility (WAI-ARIA Combobox with multiselectable Listbox pattern)
 * - CSS-based styling via data attributes
 *
 * @remarks
 * - Built on Downshift's `useMultipleSelection` + `useCombobox` hooks
 * - Selected items are removed from the dropdown list (not shown as checked)
 * - `stateReducer` keeps menu open after Enter/click selection
 * - `selectedItem` is always `null` in useCombobox to prevent single-selection tracking
 * - Input is cleared after each selection
 * - Backspace navigates/removes tags via `useMultipleSelection`
 * - Uses `data-ck` attributes for CSS-based styling
 * - Forwards refs correctly for DOM access
 *
 * ## Keyboard Support
 *
 * | Key | Context | Action |
 * | --- | --- | --- |
 * | `ArrowDown` | Input | Open menu / move to next item |
 * | `ArrowUp` | Input | Move to previous item |
 * | `Enter` | Item highlighted | Select item, keep menu open, clear input |
 * | `Escape` | Menu open | Close menu |
 * | `Home` / `End` | Menu open | First / last item |
 * | `Backspace` | Input empty | Remove last tag |
 * | `ArrowLeft` | Input, caret at 0 | Focus last tag |
 * | `ArrowRight` | Tag focused | Focus next tag or return to input |
 * | `ArrowLeft` | Tag focused | Focus previous tag |
 * | Characters | Input | Filter options by typing |
 *
 * ## Accessibility
 *
 * This component follows the WAI-ARIA Combobox pattern with multiselectable Listbox:
 * - Follows WAI-ARIA Combobox pattern with `aria-multiselectable="true"` on listbox
 * - Tags have `aria-label="{label}, selected"` for screen readers
 * - Tag remove buttons have `aria-label="Remove {label}"`
 * - `aria-live="polite"` on empty and max-reached state messages
 * - `role="status"` on empty/max state element
 * - Roving tabindex on tags for keyboard navigation
 * - Standard combobox ARIA attributes (`aria-expanded`, `aria-controls`, etc.)
 *
 * ## Best Practices
 *
 * - Set `maxSelected` to prevent overwhelming selections
 * - Provide a descriptive `aria-label` if no visible label
 * - Use `getOptionValue` when working with object values
 * - Consider providing visible count of selections
 *
 * @param {SelectOption<T>[]} options - Array of options to display. Required.
 * @param {T[]} [value] - Controlled selected values.
 * @param {T[]} [defaultValue] - Default selected values for uncontrolled mode.
 * @param {(values: T[]) => void} [onValueChange] - Callback when selection changes.
 * @param {string} [placeholder="Search..."] - Placeholder text shown when no items selected.
 * @param {boolean} [disabled=false] - Whether the multi-select is disabled.
 * @param {string} [variantName] - Variant name for styling via `data-variant`.
 * @param {(option: T) => string | number} [getOptionValue] - Function to extract unique primitive key from option values for object values.
 * @param {(option: NormalizedItem<T>, inputValue: string) => boolean} [filterFn] - Custom filter function. Default: case-insensitive includes.
 * @param {number} [maxSelected] - Maximum number of items that can be selected.
 *
 * @example
 * ```tsx
 * // Simple string options
 * <MultiSelect
 *   options={['apple', 'banana', 'cherry', 'date']}
 *   placeholder="Pick fruits..."
 *   onValueChange={setFruits}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Labeled options with disabled items
 * <MultiSelect
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
 * // Grouped options
 * <MultiSelect
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
 * // Controlled mode
 * const [selected, setSelected] = useState<string[]>(['apple']);
 * <MultiSelect
 *   options={['apple', 'banana', 'cherry']}
 *   value={selected}
 *   onValueChange={setSelected}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Max selected limit
 * <MultiSelect
 *   options={['apple', 'banana', 'cherry', 'date', 'elderberry']}
 *   maxSelected={3}
 *   onValueChange={setFruits}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Object values
 * <MultiSelect<User>
 *   options={users.map(u => ({ value: u, label: u.name }))}
 *   getOptionValue={(u) => u.id}
 *   onValueChange={setSelectedUsers}
 * />
 * ```
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// MultiSelect Props
// -----------------------------------------------------------------------------

interface MultiSelectProps<T = string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  /**
   * Default selected values for uncontrolled mode.
   */
  defaultValue?: T[];
  /**
   * Whether the multi-select is disabled.
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
   * Maximum number of items that can be selected.
   */
  maxSelected?: number;
  /**
   * Callback when selection changes.
   */
  onValueChange?: (values: T[]) => void;
  /**
   * Array of options to display.
   */
  options: SelectOption<T>[];
  /**
   * Placeholder text shown in the input when no items are selected.
   * @default "Search..."
   */
  placeholder?: string;
  /**
   * Controlled selected values.
   */
  value?: T[];
  /**
   * Variant name for styling via `data-variant` attribute.
   */
  variantName?: string;
}

// -----------------------------------------------------------------------------
// MultiSelect Component
// -----------------------------------------------------------------------------

function MultiSelectInner<T = string>(
  {
    className,
    defaultValue,
    disabled = false,
    filterFn,
    getOptionValue,
    maxSelected,
    onValueChange,
    options,
    placeholder = "Search...",
    value,
    variantName,
    ...rest
  }: MultiSelectProps<T>,
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

  // Resolve initial selected items from defaultValue
  const initialSelectedItems = useMemo(() => {
    if (!defaultValue) return [];

    if (getOptionValue) {
      return defaultValue
        .map((val) => {
          const valueKey = getOptionValue(val);
          return allSelectableItems.find(
            (item) => getOptionValue(item.value) === valueKey,
          );
        })
        .filter((item): item is NormalizedItem<T> => item !== undefined);
    }

    return defaultValue
      .map((val) => allSelectableItems.find((item) => item.value === val))
      .filter((item): item is NormalizedItem<T> => item !== undefined);
  }, [allSelectableItems, defaultValue, getOptionValue]);

  // Resolve controlled selected items from value
  const controlledSelectedItems = useMemo(() => {
    if (value === undefined) return undefined;

    if (getOptionValue) {
      return value
        .map((val) => {
          const valueKey = getOptionValue(val);
          return allSelectableItems.find(
            (item) => getOptionValue(item.value) === valueKey,
          );
        })
        .filter((item): item is NormalizedItem<T> => item !== undefined);
    }

    return value
      .map((val) => allSelectableItems.find((item) => item.value === val))
      .filter((item): item is NormalizedItem<T> => item !== undefined);
  }, [allSelectableItems, value, getOptionValue]);

  // useMultipleSelection for tag management
  const {
    activeIndex,
    addSelectedItem,
    getDropdownProps,
    getSelectedItemProps,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection<NormalizedItem<T>>({
    initialSelectedItems,
    ...(controlledSelectedItems !== undefined && {
      selectedItems: controlledSelectedItems,
    }),
    onSelectedItemsChange: ({ selectedItems: newItems }) => {
      onValueChange?.(newItems?.map((item) => item.value) ?? []);
    },
  });

  const isAtMaxSelected =
    maxSelected !== undefined && selectedItems.length >= maxSelected;

  // Track input value locally for filtering
  const [inputValue, setInputValue] = useState("");

  // Filter: exclude already-selected items, then apply text filter
  const { filteredRenderItems, filteredSelectableItems } = useMemo(() => {
    const isItemSelected = (item: NormalizedItem<T>) => {
      if (getOptionValue) {
        const itemKey = getOptionValue(item.value);
        return selectedItems.some(
          (sel) => getOptionValue(sel.value) === itemKey,
        );
      }
      return selectedItems.some((sel) => sel.value === item.value);
    };

    return filterRenderItems(
      allRenderItems,
      allSelectableItems,
      (item) => !isItemSelected(item) && effectiveFilter(item, inputValue),
    );
  }, [
    allRenderItems,
    allSelectableItems,
    effectiveFilter,
    getOptionValue,
    inputValue,
    selectedItems,
  ]);

  // useCombobox for input + dropdown
  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
  } = useCombobox<NormalizedItem<T>>({
    id: inputId,
    inputValue,
    isItemDisabled: (item) => item?.disabled ?? false,
    items: filteredSelectableItems,
    itemToString,
    menuId,
    onInputValueChange: ({ inputValue: newVal }) => {
      setInputValue(newVal ?? "");
    },
    onStateChange: ({ selectedItem: newItem, type }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          // inputValue is tracked via onInputValueChange below
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newItem && !isAtMaxSelected) {
            addSelectedItem(newItem);
            setInputValue("");
          }
          break;
      }
    },
    selectedItem: null, // Critical: prevents single-selection tracking
    stateReducer: (_state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: 0,
            inputValue: "",
            isOpen: true, // Keep menu open after selection
          };
        default:
          return changes;
      }
    },
  });

  return (
    <div
      {...rest}
      className={className}
      data-ck="multi-select"
      data-disabled={disabled || undefined}
      data-has-value={selectedItems.length > 0 || undefined}
      data-max-reached={isAtMaxSelected || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-variant={variantName}
      ref={ref}
    >
      {/* Tags + Input area */}
      <div data-ck="multi-select-input-wrapper">
        {selectedItems.map((selectedItem, index) => (
          <span
            key={`tag-${index}`}
            {...getSelectedItemProps({ index, selectedItem })}
            aria-label={`${selectedItem.label}, selected`}
            data-active={activeIndex === index || undefined}
            data-ck="multi-select-tag"
          >
            <span>{selectedItem.label}</span>
            <button
              aria-label={`Remove ${selectedItem.label}`}
              data-ck="multi-select-tag-remove"
              disabled={disabled}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSelectedItem(selectedItem);
              }}
            />
          </span>
        ))}
        <input
          {...getInputProps(
            getDropdownProps({ disabled, preventKeyAction: isOpen }),
          )}
          aria-disabled={disabled || undefined}
          data-ck="multi-select-input"
          placeholder={selectedItems.length === 0 ? placeholder : ""}
        />
      </div>

      <button
        {...getToggleButtonProps({ disabled })}
        aria-label="toggle menu"
        data-ck="multi-select-trigger"
        data-state={isOpen ? "open" : "closed"}
        tabIndex={-1}
        type="button"
      />

      {/* Dropdown content */}
      <div
        {...getMenuProps({ id: menuId })}
        aria-multiselectable="true"
        data-ck="multi-select-content"
        data-state={isOpen ? "open" : "closed"}
      >
        {isOpen && filteredRenderItems.length === 0 && (
          <div aria-live="polite" data-ck="multi-select-empty" role="status">
            {isAtMaxSelected
              ? "Maximum selections reached"
              : "No results found"}
          </div>
        )}

        {isOpen &&
          filteredRenderItems.map((renderItem, idx) => {
            if (renderItem.type === "separator") {
              return (
                <div
                  key={`separator-${idx}`}
                  aria-orientation="horizontal"
                  data-ck="multi-select-separator"
                  role="separator"
                />
              );
            }

            if (renderItem.type === "group-label") {
              return (
                <div
                  key={`group-${renderItem.groupIndex}`}
                  data-ck="multi-select-group-label"
                  role="presentation"
                >
                  {renderItem.groupLabel}
                </div>
              );
            }

            // Item
            const { item, selectableIndex } = renderItem;
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
                aria-selected={false}
                data-ck="multi-select-item"
                data-disabled={isDisabled || undefined}
                data-highlighted={isHighlighted || undefined}
                data-state="unchecked"
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
const MultiSelect = forwardRef(MultiSelectInner) as unknown as (<T = string>(
  props: MultiSelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string };

MultiSelect.displayName = "MultiSelect";

export { MultiSelect, type MultiSelectProps };
