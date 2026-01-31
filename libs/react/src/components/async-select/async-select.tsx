"use client";

import { FloatingPortal } from "@floating-ui/react";
import { useCombobox } from "downshift";
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { NormalizedItem, SelectOption } from "../../types/select";

import { useDebouncedCallback, useFloatingSelect } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import {
  areValuesEqual,
  findItemByValue,
  itemToString,
  processOptions,
} from "../../utils/select";

/**
 * An async select component with debounced search, loading states, and keyboard navigation.
 *
 * @description
 * Provides a fully accessible async dropdown select with debounced search,
 * loading/error/empty states, and keyboard navigation, powered by Downshift.
 *
 * ## Features
 * - Props-based API with async `onSearch` function for remote option fetching
 * - Debounced search with configurable delay (`debounceMs`, default 300ms)
 * - Minimum search length threshold (`minSearchLength`, default 1)
 * - Loading, error, and empty states with customizable content
 * - Optional result caching by query string (`cacheResults`)
 * - Race condition handling via request counter
 * - Pre-loaded options via `initialOptions`
 * - Controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes
 * - Support for string and object values via generic `<T>`
 * - Option groups, separators, and disabled items
 * - Full accessibility (WAI-ARIA Combobox pattern with live regions)
 * - CSS-based styling via data attributes
 *
 * @remarks
 * This component features:
 * - Built on Downshift's `useCombobox` hook
 * - Uses `setTimeout` for debouncing (cleared on unmount)
 * - Incremented `requestIdRef` guards against stale async responses
 * - Cache uses `Map<string, SelectOption<T>[]>` (not LRU — unbounded)
 * - Errors are caught and surfaced via `role="alert"` + `aria-live="assertive"`
 * - Loading state uses `role="status"` + `aria-live="polite"`
 * - Root element carries `aria-busy` during loading
 * - Dropdown is rendered inside a `FloatingPortal` and positioned via
 *   `useFloatingSelect` (Floating UI) with flip, shift, and size middleware
 * - Uses `data-ck` attributes for CSS-based styling
 * - Forwards refs correctly for DOM access
 *
 * ## Keyboard Support
 *
 * | Key | Action |
 * | --- | --- |
 * | `ArrowDown` | Open menu / move to next item |
 * | `ArrowUp` | Move to previous item |
 * | `Enter` | Select highlighted item and close |
 * | `Escape` | Close menu |
 * | `Home` | Move to first item |
 * | `End` | Move to last item |
 * | Characters | Trigger debounced search |
 *
 * ## Accessibility
 *
 * This component follows the WAI-ARIA Combobox pattern with async status communication:
 * - `aria-busy` on root element during loading
 * - Loading indicator with `role="status"` and `aria-live="polite"` for non-intrusive updates
 * - Error message with `role="alert"` and `aria-live="assertive"` for immediate announcement
 * - Empty state with `role="status"` and `aria-live="polite"`
 * - Standard combobox ARIA attributes (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-selected`)
 *
 * ## Best Practices
 *
 * - Use `debounceMs` to balance responsiveness and server load (default 300ms)
 * - Set `minSearchLength` to avoid overly broad queries
 * - Enable `cacheResults` for repeated searches (e.g., user backspacing)
 * - Provide meaningful `loadingContent`, `emptyContent`, and `errorContent`
 * - Use `initialOptions` for common/suggested items before first search
 * - Use `getOptionValue` when working with object values
 *
 * @param {(query: string) => Promise<SelectOption<T>[]>} onSearch - Async search function. Required. Called with the current query string after debounce.
 * @param {T} [value] - Controlled selected value.
 * @param {T} [defaultValue] - Default value for uncontrolled mode.
 * @param {(value: T | undefined) => void} [onValueChange] - Callback when selection changes.
 * @param {string} [placeholder="Search..."] - Placeholder text in the input.
 * @param {boolean} [disabled=false] - Whether the async select is disabled.
 * @param {string} [variantName] - Variant name for styling via `data-variant`.
 * @param {(option: T) => string | number} [getOptionValue] - Function to extract unique primitive key from option values for object values.
 * @param {number} [debounceMs=300] - Debounce delay in milliseconds before triggering search.
 * @param {number} [minSearchLength=1] - Minimum characters required before triggering search.
 * @param {SelectOption<T>[]} [initialOptions] - Pre-loaded options shown before the first search.
 * @param {ReactNode} [loadingContent="Loading..."] - Custom content displayed while loading.
 * @param {ReactNode} [emptyContent="No results found"] - Custom content displayed when no results found.
 * @param {ReactNode} [errorContent="An error occurred"] - Custom content displayed when an error occurs.
 * @param {boolean} [cacheResults=false] - Whether to cache search results by query string.
 *
 * @example
 * // Basic async search
 * <AsyncSelect
 *   onSearch={async (query) => {
 *     const res = await fetch(`/api/users?q=${query}`);
 *     return res.json();
 *   }}
 *   placeholder="Search users..."
 *   onValueChange={setUser}
 * />
 *
 * @example
 * // With initial options
 * <AsyncSelect
 *   onSearch={searchUsers}
 *   initialOptions={[
 *     { value: 'recent1', label: 'Recently Used 1' },
 *     { value: 'recent2', label: 'Recently Used 2' },
 *   ]}
 *   placeholder="Search or pick recent..."
 * />
 *
 * @example
 * // Custom debounce and min length
 * <AsyncSelect
 *   onSearch={searchProducts}
 *   debounceMs={500}
 *   minSearchLength={3}
 *   placeholder="Type at least 3 characters..."
 * />
 *
 * @example
 * // With caching enabled
 * <AsyncSelect
 *   onSearch={searchCities}
 *   cacheResults
 *   placeholder="Search cities..."
 * />
 *
 * @example
 * // Custom loading/empty/error content
 * <AsyncSelect
 *   onSearch={searchItems}
 *   loadingContent={<Spinner />}
 *   emptyContent={<p>No items match your search.</p>}
 *   errorContent={<p>Failed to load. Please try again.</p>}
 * />
 *
 * @example
 * // Controlled value
 * const [selected, setSelected] = useState('apple');
 * <AsyncSelect
 *   onSearch={searchFruits}
 *   value={selected}
 *   onValueChange={setSelected}
 * />
 *
 * @example
 * // Object values
 * <AsyncSelect<User>
 *   onSearch={async (query) => {
 *     const users = await fetchUsers(query);
 *     return users.map(u => ({ value: u, label: u.name }));
 *   }}
 *   getOptionValue={(u) => u.id}
 *   onValueChange={setSelectedUser}
 * />
 */

// -----------------------------------------------------------------------------
// AsyncSelect Props
// -----------------------------------------------------------------------------

interface AsyncSelectProps<T = string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  /**
   * Whether to cache search results by query string.
   * @default false
   */
  cacheResults?: boolean;
  /**
   * Debounce delay in milliseconds before triggering search.
   * @default 300
   */
  debounceMs?: number;
  /**
   * Default selected value for uncontrolled mode.
   */
  defaultValue?: T;
  /**
   * Whether the async select is disabled.
   */
  disabled?: boolean;
  /**
   * Custom content to display when no results are found.
   * @default "No results found"
   */
  emptyContent?: ReactNode;
  /**
   * Custom content to display when an error occurs.
   * @default "An error occurred"
   */
  errorContent?: ReactNode;
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
   * Pre-loaded options shown before the first search.
   */
  initialOptions?: SelectOption<T>[];
  /**
   * Custom content to display while loading.
   * @default "Loading..."
   */
  loadingContent?: ReactNode;
  /**
   * Minimum number of characters required before triggering search.
   * @default 1
   */
  minSearchLength?: number;
  /**
   * Async search function. Called with the current query string.
   * Should return an array of options matching the query.
   */
  onSearch: (query: string) => Promise<SelectOption<T>[]>;
  /**
   * Callback when selection changes.
   */
  onValueChange?: (value: T | undefined) => void;
  /**
   * Placeholder text shown in the input.
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
// AsyncSelect Component
// -----------------------------------------------------------------------------

function AsyncSelectInner<T = string>(
  {
    cacheResults = false,
    className,
    debounceMs = 300,
    defaultValue,
    disabled = false,
    emptyContent = "No results found",
    errorContent = "An error occurred",
    getOptionValue,
    initialOptions,
    loadingContent = "Loading...",
    minSearchLength = 1,
    onSearch,
    onValueChange,
    placeholder = "Search...",
    value,
    variantName,
    ...rest
  }: AsyncSelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const inputId = useId();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const menuNodeRef = useRef<HTMLDivElement | null>(null);

  // Async state
  const [asyncOptions, setAsyncOptions] = useState<SelectOption<T>[]>(
    initialOptions ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Cache and request tracking refs
  const cacheRef = useRef<Map<string, SelectOption<T>[]>>(new Map());
  const requestIdRef = useRef(0);

  const MAX_CACHE_SIZE = 50;

  // Process current options
  const { renderItems, selectableItems } = useMemo(
    () => processOptions(asyncOptions),
    [asyncOptions],
  );

  // Debounced async search (fires after debounceMs delay)
  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const results = await onSearch(query);
      // Guard against stale responses
      if (currentRequestId !== requestIdRef.current) return;
      if (cacheResults) {
        if (cacheRef.current.size >= MAX_CACHE_SIZE) {
          const firstKey = cacheRef.current.keys().next().value;
          if (firstKey !== undefined) cacheRef.current.delete(firstKey);
        }
        cacheRef.current.set(query, results);
      }
      setAsyncOptions(results);
      setLoading(false);
      setError(null);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;
      setAsyncOptions([]);
      setLoading(false);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, debounceMs);

  // Search handler with min-length and cache checks
  const handleSearch = useCallback(
    (query: string) => {
      if (query.length < minSearchLength) {
        setAsyncOptions(initialOptions ?? []);
        setLoading(false);
        setError(null);
        return;
      }

      if (cacheResults && cacheRef.current.has(query)) {
        setAsyncOptions(cacheRef.current.get(query)!);
        setLoading(false);
        setError(null);
        return;
      }

      setError(null);
      debouncedSearch(query);
    },
    [debouncedSearch, minSearchLength, cacheResults, initialOptions],
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

  // Use Downshift useCombobox
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
    initialSelectedItem: initialItem,
    isItemDisabled: (item) => item?.disabled ?? false,
    items: selectableItems,
    itemToString,
    menuId,
    onInputValueChange: ({ inputValue: newVal }) => {
      handleSearch(newVal ?? "");
    },
    onSelectedItemChange: ({ selectedItem: newItem }) => {
      onValueChange?.(newItem?.value);
    },
    selectedItem: controlledItem,
  });

  const hasResults = selectableItems.length > 0;

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
      data-ck="async-select"
      data-disabled={disabled || undefined}
      data-has-error={error ? true : undefined}
      data-has-results={hasResults || undefined}
      data-loading={loading || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-variant={variantName}
      ref={containerRef_}
    >
      {/* Input area */}
      <div data-ck="async-select-input-wrapper" ref={inputWrapperRef_}>
        <input
          {...getInputProps({ disabled, id: inputId })}
          aria-disabled={disabled || undefined}
          data-ck="async-select-input"
          placeholder={placeholder}
        />
        <button
          {...getToggleButtonProps({ disabled })}
          aria-label="toggle menu"
          data-ck="async-select-trigger"
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
            data-ck="async-select-content"
            data-state="open"
          >
            {/* Loading state */}
            {loading && (
              <div
                aria-label="Loading results"
                aria-live="polite"
                data-ck="async-select-loading"
                role="status"
              >
                {loadingContent}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div
                aria-live="assertive"
                data-ck="async-select-error"
                role="alert"
              >
                {errorContent}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && !hasResults && (
              <div
                aria-live="polite"
                data-ck="async-select-empty"
                role="status"
              >
                {emptyContent}
              </div>
            )}

            {/* Results */}
            {!loading &&
              !error &&
              renderItems.map((renderItem, idx) => {
                if (renderItem.type === "separator") {
                  return (
                    <div
                      key={`separator-${idx}`}
                      aria-orientation="horizontal"
                      data-ck="async-select-separator"
                      role="separator"
                    />
                  );
                }

                if (renderItem.type === "group-label") {
                  return (
                    <div
                      key={`group-${renderItem.groupIndex}`}
                      data-ck="async-select-group-label"
                      role="presentation"
                    >
                      {renderItem.groupLabel}
                    </div>
                  );
                }

                // Item
                const { item, selectableIndex } = renderItem;
                const isSelected = selectedItem
                  ? areValuesEqual(
                      selectedItem.value,
                      item.value,
                      getOptionValue,
                    )
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
                    data-ck="async-select-item"
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
const AsyncSelect = forwardRef(AsyncSelectInner) as unknown as (<T = string>(
  props: AsyncSelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string };

AsyncSelect.displayName = "AsyncSelect";

export { AsyncSelect, type AsyncSelectProps };
