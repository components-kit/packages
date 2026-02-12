"use client";

import { FloatingPortal } from "@floating-ui/react";
import { useCombobox } from "downshift";
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { NormalizedItem, SelectOption } from "../../types/select";

import { useFloatingSelect } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import {
  areValuesEqual,
  defaultFilterFn,
  filterRenderItems,
  findItemByValue,
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
 * - Async/server-side search via controlled `options` + `loading`/`error` props
 * - Loading and error states with customizable content and ARIA live regions
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
 * Dropdown is rendered inside a `FloatingPortal` and positioned via
 * `useFloatingSelect` (Floating UI) with flip, shift, and size middleware.
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
 * - Menu has `aria-labelledby` linking to the input
 * - Groups wrapped in `role="group"` with `aria-labelledby` linking to group label
 * - Group labels have `role="presentation"` and a unique `id` for `aria-labelledby`
 * - `role="status"` with `aria-live="polite"` on empty state for screen reader announcement
 * - `role="separator"` on dividers
 * - `aria-busy` on root element during loading (async mode)
 * - Loading indicator with `role="status"` and `aria-live="polite"` (async mode)
 * - Error message with `role="alert"` and `aria-live="assertive"` (async mode)
 *
 * ## Best Practices
 * - Provide a descriptive `aria-label` if no visible label
 * - Use `filterFn` for custom matching (e.g., fuzzy search)
 * - Use `getOptionValue` when working with object values
 * - Use groups and separators to organize large option sets
 * - For async/server-side search, control `options`, `loading`, and `error` externally
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
 * @param {boolean} [loading=false] - Whether the combobox is in a loading state (for async search).
 * @param {ReactNode} [loadingContent="Loading..."] - Custom content displayed while loading.
 * @param {boolean} [error=false] - Whether the combobox has an error (for async search).
 * @param {ReactNode} [errorContent="An error occurred"] - Custom content displayed when an error occurs.
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
 *
 * @example
 * ```tsx
 * // Async / server-side search
 * const [options, setOptions] = useState([]);
 * const [loading, setLoading] = useState(false);
 * const [error, setError] = useState(false);
 *
 * const handleSearch = async (query) => {
 *   setLoading(true);
 *   setError(false);
 *   try {
 *     const results = await fetch(`/api/search?q=${query}`);
 *     setOptions(await results.json());
 *   } catch {
 *     setError(true);
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 *
 * <Combobox
 *   options={options}
 *   loading={loading}
 *   error={error}
 *   onInputValueChange={handleSearch}
 *   placeholder="Search..."
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
   * Custom content to display when no options match the filter.
   * @default "No results found"
   */
  emptyContent?: ReactNode;
  /**
   * Whether the combobox has an error (for async/server-side search).
   * When true, displays `errorContent` instead of options.
   * @default false
   */
  error?: boolean;
  /**
   * Custom content to display when an error occurs.
   * @default "An error occurred"
   */
  errorContent?: ReactNode;
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
   * Whether the combobox is in a loading state (for async/server-side search).
   * When true, displays `loadingContent` instead of options.
   * @default false
   */
  loading?: boolean;
  /**
   * Custom content to display while loading.
   * @default "Loading..."
   */
  loadingContent?: ReactNode;
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
    emptyContent = "No results found",
    error = false,
    errorContent = "An error occurred",
    filterFn,
    getOptionValue,
    inputValue: controlledInputValue,
    loading = false,
    loadingContent = "Loading...",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const menuNodeRef = useRef<HTMLDivElement | null>(null);

  // Process all options into flat selectable items and structured render items
  const { renderItems: allRenderItems, selectableItems: allSelectableItems } =
    useMemo(() => processOptions(options, inputId), [options, inputId]);

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
  const controlledItem = useMemo(
    () => findItemByValue(allSelectableItems, value, getOptionValue),
    [allSelectableItems, value, getOptionValue],
  );

  const initialItem = useMemo(
    () =>
      findItemByValue(allSelectableItems, defaultValue, getOptionValue) ?? null,
    [allSelectableItems, defaultValue, getOptionValue],
  );

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

  // Use Floating UI for positioning
  const { floatingProps, referenceProps } = useFloatingSelect({ isOpen });

  // Merge refs (memoized to avoid new callbacks on every render)
  const containerRef_ = useMemo(
    () => mergeRefs<HTMLDivElement>(containerRef, ref),
    [ref],
  );
  const inputWrapperRef_ = useMemo(
    () => mergeRefs<HTMLDivElement>(inputWrapperRef, referenceProps.ref),
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
      aria-busy={loading || undefined}
      data-ck="combobox"
      data-disabled={disabled || undefined}
      data-has-error={error || undefined}
      data-loading={loading || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-variant={variantName}
      ref={containerRef_}
    >
      {/* Input area */}
      <div data-ck="combobox-input-wrapper" ref={inputWrapperRef_}>
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

      {/* Dropdown content - Rendered in portal */}
      <FloatingPortal>
        {isOpen && (
          <div
            {...getMenuProps({ id: menuId, ref: menuRef })}
            style={floatingProps.style}
            aria-labelledby={inputId}
            data-ck="combobox-content"
            data-state="open"
          >
            {/* Loading state */}
            {loading && (
              <div
                aria-label="Loading results"
                aria-live="polite"
                data-ck="combobox-loading"
                role="status"
              >
                {loadingContent}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div
                aria-live="assertive"
                data-ck="combobox-error"
                role="alert"
              >
                {errorContent}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredRenderItems.length === 0 && (
              <div aria-live="polite" data-ck="combobox-empty" role="status">
                {emptyContent}
              </div>
            )}

            {!loading && !error && filteredRenderItems.map((renderItem, idx) => {
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

              if (renderItem.type === "group") {
                return (
                  <div
                    key={`group-${renderItem.groupIndex}`}
                    aria-labelledby={renderItem.groupLabelId}
                    data-ck="combobox-group"
                    role="group"
                  >
                    <div
                      id={renderItem.groupLabelId}
                      data-ck="combobox-group-label"
                      role="presentation"
                    >
                      {renderItem.groupLabel}
                    </div>
                    {renderItem.items.map(({ item, selectableIndex }) => {
                      const isSelected = selectedItem
                        ? areValuesEqual(selectedItem.value, item.value, getOptionValue)
                        : false;
                      const isHighlighted = highlightedIndex === selectableIndex;
                      const isDisabled = item.disabled ?? false;

                      return (
                        <div
                          key={`item-${selectableIndex}`}
                          {...getItemProps({
                            disabled: isDisabled,
                            index: selectableIndex,
                            item,
                          })}
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
                );
              }

              // Standalone item (not in a group)
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
        )}
      </FloatingPortal>
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
