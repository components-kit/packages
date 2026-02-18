"use client";

import { FloatingPortal, type Placement } from "@floating-ui/react";
import { useCombobox } from "downshift";
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { VariantFor } from "../../types/register";
import type { NormalizedItem, SelectOption } from "../../types/select";

import { useExitTransition, useFloatingSelect } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import { renderDropdownItems } from "../../utils/render-dropdown-items";
import {
  areValuesEqual,
  defaultFilterFn,
  filterRenderItems,
  findItemByValue,
  itemToString,
  processOptions,
  serializeValue,
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
 * - Configurable dropdown placement via Floating UI (`placement` prop)
 * - Clearable selection via clear button (`clearable` prop)
 * - Auto-focus on mount (`autoFocus` prop)
 * - `onBlur`/`onFocus` callbacks for form integration and validation
 * - Form integration via hidden `<input>` (`name` prop)
 * - Read-only mode that prevents interaction while showing current value
 * - Live region for screen reader selection and result count announcements
 * - Icon slot (`data-slot="icon"`) for CSS-injected icons
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
 * - `aria-required` when `required` prop is set
 * - Menu has `aria-labelledby` linking to the input
 * - Groups wrapped in `role="group"` with `aria-labelledby` linking to group label
 * - Group labels have `role="presentation"` and a unique `id` for `aria-labelledby`
 * - `role="status"` with `aria-live="polite"` on empty state for screen reader announcement
 * - `role="separator"` on dividers
 * - `aria-busy` on root element during loading (async mode)
 * - Loading indicator with `role="status"` and `aria-live="polite"` (async mode)
 * - Error message with `role="alert"` and `aria-live="assertive"` (async mode)
 * - Live region (`data-ck="combobox-live"`) announces selection changes
 *
 * ## Best Practices
 * - Provide a descriptive `aria-label` if no visible label
 * - Use `filterFn` for custom matching (e.g., fuzzy search)
 * - Use `getOptionValue` when working with object values
 * - Use groups and separators to organize large option sets
 * - For async/server-side search, control `options`, `loading`, and `error` externally
 *
 * @param {boolean} [autoFocus=false] - Whether to auto-focus the input on mount.
 * @param {boolean} [clearable=false] - Whether to show a clear button when a value is selected.
 * @param {SelectOption<T>[]} options - Array of options to display. Required.
 * @param {T} [value] - Controlled selected value.
 * @param {T} [defaultValue] - Default value for uncontrolled mode.
 * @param {(value: T | undefined) => void} [onValueChange] - Callback when selection changes.
 * @param {string} [inputValue] - Controlled input text value.
 * @param {string} [defaultInputValue] - Default input value for uncontrolled input mode.
 * @param {(value: string) => void} [onInputValueChange] - Callback when input text changes.
 * @param {string} [placeholder="Search..."] - Placeholder text for the input.
 * @param {string} [aria-label] - Accessible label for the input. Required when no visible label exists.
 * @param {boolean} [disabled=false] - Whether the combobox is disabled.
 * @param {VariantFor<"combobox">} [variantName] - Variant name for styling via `data-variant`.
 * @param {(option: T) => string | number} [getOptionValue] - Function to extract unique primitive key from option values for object values.
 * @param {(option: NormalizedItem<T>, inputValue: string) => boolean} [filterFn] - Custom filter function. Default: case-insensitive includes.
 * @param {(event: React.FocusEvent) => void} [onBlur] - Callback when the input loses focus.
 * @param {(event: React.FocusEvent) => void} [onFocus] - Callback when the input receives focus.
 * @param {boolean} [loading=false] - Whether the combobox is in a loading state (for async search).
 * @param {ReactNode} [loadingContent="Loading..."] - Custom content displayed while loading.
 * @param {boolean} [error=false] - Whether the combobox has an error (for async search or validation).
 * @param {ReactNode} [errorContent="An error occurred"] - Custom content displayed when an error occurs.
 * @param {number} [maxDropdownHeight] - Maximum height of the dropdown in pixels.
 * @param {string} [name] - Form field name. When set, renders a hidden input for form submission.
 * @param {(open: boolean) => void} [onOpenChange] - Callback when dropdown opens or closes.
 * @param {boolean} [openOnFocus=true] - Whether to open dropdown when input receives focus.
 * @param {Placement} [placement="bottom-start"] - Dropdown placement relative to the trigger (Floating UI placement).
 * @param {boolean} [readOnly=false] - Whether the combobox is read-only.
 * @param {boolean} [required=false] - Whether the combobox is required.
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
 *
 * @example
 * ```tsx
 * // Read-only mode
 * <Combobox
 *   options={['apple', 'banana', 'cherry']}
 *   defaultValue="banana"
 *   readOnly
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom placement
 * <Combobox
 *   options={['apple', 'banana', 'cherry']}
 *   placement="top-start"
 *   placeholder="Opens upward..."
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Form integration
 * <Combobox
 *   options={['apple', 'banana', 'cherry']}
 *   name="fruit"
 *   required
 *   placeholder="Select a fruit..."
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
   * Accessible label for the combobox input.
   * Required when there is no visible label element.
   * Prefer a visible <label> element when possible.
   */
  "aria-label"?: string;
  /**
   * Whether to auto-focus the input on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Whether to show a clear button when a value is selected.
   * @default false
   */
  clearable?: boolean;
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
  emptyContent?: string;
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
   * Maximum height of the dropdown in pixels.
   * When set, the dropdown height will not exceed this value.
   */
  maxDropdownHeight?: number;
  /**
   * Form field name. When set, renders a hidden `<input>` for native form submission.
   */
  name?: string;
  /**
   * Callback when the input loses focus.
   */
  onBlur?: (event: React.FocusEvent) => void;
  /**
   * Callback when the input receives focus.
   */
  onFocus?: (event: React.FocusEvent) => void;
  /**
   * Callback when input text changes.
   */
  onInputValueChange?: (value: string) => void;
  /**
   * Callback when dropdown opens or closes.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when selection changes.
   */
  onValueChange?: (value: T | undefined) => void;
  /**
   * Whether to open the dropdown when the input receives focus.
   * @default true
   */
  openOnFocus?: boolean;
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
   * Dropdown placement relative to the trigger.
   * @default "bottom-start"
   */
  placement?: Placement;
  /**
   * Whether the combobox is read-only.
   * Shows the current value but prevents interaction.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the combobox is required.
   * Adds `aria-required` and `data-required` attributes.
   * @default false
   */
  required?: boolean;
  /**
   * Controlled selected value.
   */
  value?: T;
  /**
   * Variant name for styling via `data-variant` attribute.
   */
  variantName?: VariantFor<"combobox">;
}

// -----------------------------------------------------------------------------
// Combobox Component
// -----------------------------------------------------------------------------

function ComboboxInner<T = string>(
  {
    "aria-label": ariaLabel,
    autoFocus = false,
    className,
    clearable = false,
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
    maxDropdownHeight,
    name,
    onBlur,
    onFocus,
    onInputValueChange,
    onOpenChange,
    onValueChange,
    openOnFocus = true,
    options,
    placeholder = "Search...",
    placement,
    readOnly = false,
    required = false,
    value,
    variantName,
    ...rest
  }: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const inputId = useId();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const menuNodeRef = useRef<HTMLDivElement | null>(null);
  // Tracks when menu was opened by focus to prevent the subsequent InputClick from closing it
  const openedByFocusRef = useRef(false);

  // Live region announcement state
  const [announcement, setAnnouncement] = useState("");
  const selectionTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    return () => {
      if (selectionTimerRef.current) clearTimeout(selectionTimerRef.current);
    };
  }, []);

  const isInteractive = !disabled && !readOnly;

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

  // When the menu opens, show all items regardless of input text (which may
  // still contain the selected item's label). Once the user starts typing,
  // normal filtering resumes.
  const [showAllItems, setShowAllItems] = useState(false);

  // Filter items based on current input value (computed before useCombobox)
  const { filteredRenderItems, filteredSelectableItems } = useMemo(
    () =>
      filterRenderItems(allRenderItems, allSelectableItems, (item) =>
        showAllItems ? true : effectiveFilter(item, currentInputValue),
      ),
    [allRenderItems, allSelectableItems, effectiveFilter, currentInputValue, showAllItems],
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
    openMenu,
    selectedItem,
    selectItem,
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
    onInputValueChange: ({ inputValue: newVal, type }) => {
      const val = newVal ?? "";
      setLocalInputValue(val);
      onInputValueChange?.(val);
      // User is actively typing — disable "show all" so filtering kicks in
      if (type === useCombobox.stateChangeTypes.InputChange) {
        setShowAllItems(false);
      }
    },
    onIsOpenChange: ({ isOpen: open }) => {
      if (readOnly) return;
      if (open) {
        setShowAllItems(true);
      } else {
        setShowAllItems(false);
        openedByFocusRef.current = false;
      }
      onOpenChange?.(open ?? false);
    },
    onSelectedItemChange: ({ selectedItem: newItem }) => {
      onValueChange?.(newItem?.value);
      if (newItem) {
        setAnnouncement(`${newItem.label} selected`);
        // Clear announcement after screen reader has had time to announce
        if (selectionTimerRef.current) clearTimeout(selectionTimerRef.current);
        selectionTimerRef.current = setTimeout(() => setAnnouncement(""), 1000);
      }
    },
    selectedItem: controlledItem,
    stateReducer: (_state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      if (readOnly) {
        return { ...changes, isOpen: false };
      }
      // Prevent InputClick from closing a menu that was just opened by focus.
      // The reducer may be invoked multiple times for the same action (React
      // StrictMode / Downshift internals), so we must NOT reset the ref
      // synchronously here. Schedule the reset as a microtask so all
      // invocations of this reducer see the same flag value.
      if (
        type === useCombobox.stateChangeTypes.InputClick &&
        openedByFocusRef.current
      ) {
        queueMicrotask(() => { openedByFocusRef.current = false; });
        return { ...changes, isOpen: true };
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
  const inputWrapperRef_ = useMemo(
    () => mergeRefs<HTMLDivElement>(inputWrapperRef, referenceProps.ref),
    [referenceProps.ref],
  );
  const menuRef = useMemo(
    () => mergeRefs<HTMLDivElement>(menuNodeRef, contentRef),
    [],
  );

  // Track latest isOpen in a ref so the focus handler never uses a stale closure.
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // Focus handler (openOnFocus + onFocus callback)
  const handleInputFocus = useCallback(
    (e: React.FocusEvent) => {
      if (openOnFocus && isInteractive && !isOpenRef.current) {
        openedByFocusRef.current = true;
        openMenu();
      }
      onFocus?.(e);
    },
    [openOnFocus, isInteractive, openMenu, onFocus],
  );

  // Clear selection handler
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Downshift's selectItem accepts null at runtime to clear selection,
      // but TypeScript types don't reflect this. Cast is safe here.
      selectItem(null as unknown as NormalizedItem<T>);
      setLocalInputValue("");
      onInputValueChange?.("");
      inputRef.current?.focus();
    },
    [selectItem, onInputValueChange],
  );

  // Serialize value for hidden input
  const serializedValue = useMemo(() => {
    if (!selectedItem) return "";
    return serializeValue(selectedItem.value, getOptionValue);
  }, [selectedItem, getOptionValue]);

  // Announce result count when filtering
  const announceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
    if (!currentInputValue) return undefined;
    const count = filteredSelectableItems.length;
    announceTimerRef.current = setTimeout(() => {
      setAnnouncement(`${count} result${count !== 1 ? "s" : ""} available`);
    }, 300);
    return () => {
      if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
    };
  }, [filteredSelectableItems.length, currentInputValue]);

  return (
    <div
      {...rest}
      className={className}
      aria-busy={loading || undefined}
      data-ck="combobox"
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      data-has-value={selectedItem ? true : undefined}
      data-loading={loading || undefined}
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
        data-ck="combobox-live"
        role="status"
      >
        {announcement}
      </div>

      {/* Input area */}
      <div data-ck="combobox-input-wrapper" ref={inputWrapperRef_}>
        <input
          {...getInputProps({
            autoFocus,
            disabled: disabled || readOnly,
            id: inputId,
            onBlur,
            ref: inputRef,
            ...(ariaLabel !== undefined && { "aria-label": ariaLabel }),
          })}
          aria-disabled={disabled || undefined}
          // Override Downshift's auto-generated aria-labelledby so the input
          // relies on its own content or the consumer-provided aria-label instead.
          aria-labelledby={undefined}
          aria-required={required || undefined}
          data-ck="combobox-input"
          placeholder={placeholder}
          onFocus={handleInputFocus}
        />
        {clearable && selectedItem && isInteractive && (
          <button
            aria-label="Clear selection"
            data-ck="combobox-clear"
            tabIndex={-1}
            type="button"
            onClick={handleClear}
          >
            <div aria-hidden="true" data-slot="icon" />
          </button>
        )}
        <button
          {...getToggleButtonProps({ disabled: disabled || readOnly })}
          aria-label="Toggle menu"
          data-ck="combobox-trigger"
          data-state={isOpen ? "open" : "closed"}
          tabIndex={-1}
          type="button"
        >
          <div aria-hidden="true" data-slot="icon" />
        </button>
      </div>

      {/* Dropdown content - Rendered in portal */}
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
              aria-labelledby={inputId}
              aria-orientation="vertical"
              data-ck="combobox-content"
              data-empty={(!loading && !error && filteredRenderItems.length === 0) || undefined}
              data-side={side}
              data-state={contentState}
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
                <div aria-live="assertive" data-ck="combobox-error" role="alert">
                  {errorContent}
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && filteredRenderItems.length === 0 && (
                <div aria-live="polite" data-ck="combobox-empty" role="status">
                  {emptyContent}
                </div>
              )}

              {!loading &&
                !error &&
                renderDropdownItems({
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
                  prefix: "combobox",
                  renderItems: filteredRenderItems,
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
const Combobox = forwardRef(ComboboxInner) as unknown as (<T = string>(
  props: ComboboxProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string };

Combobox.displayName = "Combobox";

export { Combobox, type ComboboxProps };
