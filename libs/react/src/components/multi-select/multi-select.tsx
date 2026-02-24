"use client";

import { FloatingPortal, type Placement } from "@floating-ui/react";
import { useCombobox, useMultipleSelection } from "downshift";
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

import type { VariantFor } from "../../types/register";
import type { NormalizedItem, SelectOption } from "../../types/select";

import { useExitTransition, useFloatingSelect } from "../../hooks";
import { mergeRefs } from "../../utils/merge-refs";
import { renderDropdownItems } from "../../utils/render-dropdown-items";
import {
  areValuesEqual,
  defaultFilterFn,
  filterRenderItems,
  findItemsByValue,
  itemToString,
  processOptions,
  serializeValue,
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
 * - Icon slot (`data-slot="icon"`) for CSS-injected chevron and close indicators
 * - Configurable dropdown placement via Floating UI
 * - Custom portal root via `menuPortal` prop
 * - Clear all button via `clearable` prop
 * - Tag overflow with `maxDisplayedTags` prop
 * - Token separators for paste support
 * - Fixed non-removable tags via `fixedValues`
 * - Read-only mode for view-only contexts
 * - Form integration via `name` prop with hidden inputs
 *
 * @remarks
 * - Built on Downshift's `useMultipleSelection` + `useCombobox` hooks
 * - Selected items remain visible in the dropdown with checked/unchecked state (toggle to deselect)
 * - `stateReducer` keeps menu open after Enter/click selection
 * - `selectedItem` is always `null` in useCombobox to prevent single-selection tracking
 * - Input is cleared after each selection
 * - Backspace navigates/removes tags via `useMultipleSelection`
 * - Dropdown is rendered inside a `FloatingPortal` (portal root customizable via
 *   `menuPortal` prop) and positioned via `useFloatingSelect` (Floating UI) with
 *   flip, shift, and size middleware
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
 * | `Backspace` | Input empty | Remove last tag (unless fixed) |
 * | `ArrowLeft` | Input, caret at 0 | Focus last tag |
 * | `ArrowRight` | Tag focused | Focus next tag or return to input |
 * | `ArrowLeft` | Tag focused | Focus previous tag |
 * | Characters | Input | Filter options by typing |
 *
 * ## Accessibility
 *
 * This component follows the WAI-ARIA Combobox pattern with multiselectable Listbox:
 * - Follows WAI-ARIA Combobox pattern with `aria-multiselectable="true"` on listbox
 * - Listbox has `aria-orientation="vertical"`
 * - Menu has `aria-labelledby` linking to the input
 * - Groups wrapped in `role="group"` with `aria-labelledby` linking to group label
 * - Group labels have `role="presentation"` and a unique `id` for `aria-labelledby`
 * - Tags have `aria-label="{label}, selected"` for screen readers
 * - Tag remove buttons have `aria-label="Remove {label}"`
 * - `aria-live="polite"` on empty and max-reached state messages
 * - `role="status"` on empty/max state element
 * - Live region announces selection changes to screen readers
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
 * @param {T[]} [defaultValue] - Default values for uncontrolled mode.
 * @param {(values: T[]) => void} [onValueChange] - Callback when selection changes.
 * @param {boolean} [defaultOpen=false] - Whether the dropdown is open by default on mount.
 * @param {string} [placeholder="Search..."] - Placeholder text shown when no items selected.
 * @param {string} [aria-label] - Accessible label for the input. Required when no visible label exists.
 * @param {boolean} [autoFocus=false] - Auto-focus the input on mount.
 * @param {boolean} [disabled=false] - Whether the multi-select is disabled.
 * @param {VariantFor<"multi_select">} [variantName] - Variant name for styling via `data-variant`.
 * @param {(option: T) => string | number} [getOptionValue] - Function to extract unique primitive key from option values for object values.
 * @param {(option: NormalizedItem<T>, inputValue: string) => boolean} [filterFn] - Custom filter function. Default: case-insensitive includes match on label.
 * @param {number} [maxSelected] - Maximum number of items that can be selected.
 * @param {boolean} [clearable=false] - Show a clear-all button when items are selected.
 * @param {string} [emptyContent="No results found"] - Text displayed when no options match the filter.
 * @param {string} [maxReachedContent="Maximum selections reached"] - Text displayed when max selections reached.
 * @param {boolean} [error=false] - Whether the multi-select is in an error state.
 * @param {T[]} [fixedValues] - Values that cannot be removed. Tags render without remove button.
 * @param {number} [maxDisplayedTags] - Maximum tags to display before showing "+N more".
 * @param {number} [maxDropdownHeight] - Maximum height of the dropdown in pixels.
 * @param {HTMLElement | null} [menuPortal] - Explicit portal root for the dropdown. Defaults to `document.body`.
 * @param {string} [name] - Form field name. When set, renders hidden inputs for form submission.
 * @param {(event: React.FocusEvent) => void} [onBlur] - Callback when input loses focus.
 * @param {(event: React.FocusEvent) => void} [onFocus] - Callback when input receives focus.
 * @param {(open: boolean) => void} [onOpenChange] - Callback when dropdown opens or closes.
 * @param {boolean} [openOnFocus=true] - Whether to open dropdown when input receives focus.
 * @param {Placement} [placement="bottom-start"] - Dropdown placement relative to the trigger (Floating UI placement).
 * @param {boolean} [readOnly=false] - Whether the multi-select is read-only.
 * @param {boolean} [required=false] - Whether the multi-select is required.
 * @param {string[]} [tokenSeparators] - Characters that split typed or pasted text into selections.
 * @param {string} [inputValue] - Controlled input text value.
 * @param {string} [defaultInputValue] - Default input value for uncontrolled input mode.
 * @param {(value: string) => void} [onInputValueChange] - Callback when input text changes.
 *
 * @example
 * ```tsx
 * // Simple string options
 * <MultiSelect
 *   options={['React', 'Vue', 'Angular', 'Svelte']}
 *   placeholder="Select frameworks..."
 *   onValueChange={setFrameworks}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Clearable with fixed values
 * <MultiSelect
 *   options={['React', 'Vue', 'Angular', 'Svelte']}
 *   clearable
 *   fixedValues={['React']}
 *   defaultValue={['React', 'Vue']}
 *   onValueChange={setFrameworks}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Token separators (paste support)
 * <MultiSelect
 *   options={['React', 'Vue', 'Angular', 'Svelte']}
 *   tokenSeparators={[',', ';']}
 *   placeholder="Type or paste comma-separated..."
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Form integration
 * <form>
 *   <MultiSelect
 *     options={['React', 'Vue', 'Angular']}
 *     name="frameworks"
 *     required
 *   />
 * </form>
 * ```
 *
 * @example
 * ```tsx
 * // Read-only mode
 * <MultiSelect
 *   options={['React', 'Vue', 'Angular']}
 *   value={['React', 'Vue']}
 *   readOnly
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom placement (opens upward)
 * <MultiSelect
 *   options={['React', 'Vue', 'Angular']}
 *   placement="top-start"
 *   placeholder="Opens upward..."
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
   * Accessible label for the multi-select input.
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
   * Whether to show a clear all button when items are selected.
   * @default false
   */
  clearable?: boolean;
  /**
   * Default input value for uncontrolled input mode.
   */
  defaultInputValue?: string;
  /**
   * Whether the dropdown is open by default on mount.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Default selected values for uncontrolled mode.
   */
  defaultValue?: T[];
  /**
   * Whether the multi-select is disabled.
   */
  disabled?: boolean;
  /**
   * Text to display when no options match the filter.
   * @default "No results found"
   */
  emptyContent?: string;
  /**
   * Whether the multi-select is in an error state.
   * Renders `data-error` attribute on root for CSS styling.
   */
  error?: boolean;
  /**
   * Custom filter function. Receives the normalized item and the current input value.
   * Return true to keep the item visible.
   * @default Case-insensitive includes match on label.
   */
  filterFn?: (option: NormalizedItem<T>, inputValue: string) => boolean;
  /**
   * Values that are fixed and cannot be removed.
   * Tags with these values will not have a remove button and cannot be
   * removed via Backspace or clear all.
   */
  fixedValues?: T[];
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
   * Maximum number of tags to display before showing "+N more".
   * All items remain selected — this is display-only.
   */
  maxDisplayedTags?: number;
  /**
   * Maximum height of the dropdown in pixels.
   * When set, the dropdown height will not exceed this value.
   */
  maxDropdownHeight?: number;
  /**
   * Text to display when the maximum number of selections is reached.
   * @default "Maximum selections reached"
   */
  maxReachedContent?: string;
  /**
   * Maximum number of items that can be selected.
   */
  maxSelected?: number;
  /**
   * Explicit portal root for the dropdown positioner.
   * When provided, the menu is portaled into this element.
   */
  menuPortal?: HTMLElement | null;
  /**
   * Form field name. When set, renders hidden inputs for native form submission.
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
   * Callback when the dropdown opens or closes.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when selection changes.
   */
  onValueChange?: (values: T[]) => void;
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
   * Placeholder text shown in the input when no items are selected.
   * @default "Search..."
   */
  placeholder?: string;
  /**
   * Placement of the dropdown relative to the trigger.
   * Uses Floating UI placement values.
   * @default "bottom-start"
   */
  placement?: Placement;
  /**
   * Whether the multi-select is read-only.
   * Unlike disabled, the component is not greyed out but does not allow interaction.
   */
  readOnly?: boolean;
  /**
   * Whether the multi-select is required.
   * Applies `aria-required` and `data-required` for form validation styling.
   */
  required?: boolean;
  /**
   * Characters that split typed or pasted text into multiple selections.
   * Each matching option (case-insensitive label match) is added as a selection.
   * Unrecognized tokens are silently ignored.
   *
   * @example
   * tokenSeparators={[",", ";"]}
   */
  tokenSeparators?: string[];
  /**
   * Controlled selected values.
   */
  value?: T[];
  /**
   * Variant name for styling via `data-variant` attribute.
   */
  variantName?: VariantFor<"multi_select">;
}

// -----------------------------------------------------------------------------
// MultiSelect Component
// -----------------------------------------------------------------------------

function MultiSelectInner<T = string>(
  {
    "aria-label": ariaLabel,
    autoFocus = false,
    className,
    clearable = false,
    defaultInputValue,
    defaultOpen = false,
    defaultValue,
    disabled = false,
    emptyContent = "No results found",
    error = false,
    filterFn,
    fixedValues,
    getOptionValue,
    inputValue: controlledInputValue,
    maxDisplayedTags,
    maxDropdownHeight,
    maxReachedContent = "Maximum selections reached",
    maxSelected,
    menuPortal,
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
    tokenSeparators,
    value,
    variantName,
    ...rest
  }: MultiSelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const inputId = useId();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuNodeRef = useRef<HTMLDivElement | null>(null);
  // Tracks when menu was opened by focus to prevent the subsequent InputClick from closing it
  const openedByFocusRef = useRef(false);

  // Live region announcement state
  const [announcement, setAnnouncement] = useState("");

  // Process all options into flat selectable items and structured render items
  const { renderItems: allRenderItems, selectableItems: allSelectableItems } =
    useMemo(() => processOptions(options, inputId), [options, inputId]);

  const effectiveFilter = filterFn ?? defaultFilterFn;

  // Resolve initial selected items from defaultValue
  const initialSelectedItems = useMemo(
    () =>
      findItemsByValue(allSelectableItems, defaultValue, getOptionValue) ?? [],
    [allSelectableItems, defaultValue, getOptionValue],
  );

  // Resolve controlled selected items from value
  const controlledSelectedItems = useMemo(
    () => findItemsByValue(allSelectableItems, value, getOptionValue),
    [allSelectableItems, value, getOptionValue],
  );

  // Helper to check if a value is fixed
  const isFixedValue = useCallback(
    (itemValue: T) => {
      if (!fixedValues || fixedValues.length === 0) return false;
      return fixedValues.some((fv) =>
        areValuesEqual(fv, itemValue, getOptionValue),
      );
    },
    [fixedValues, getOptionValue],
  );

  // useMultipleSelection for tag management
  const {
    activeIndex,
    addSelectedItem,
    getDropdownProps,
    getSelectedItemProps,
    removeSelectedItem,
    selectedItems,
    setSelectedItems,
  } = useMultipleSelection<NormalizedItem<T>>({
    initialSelectedItems,
    ...(controlledSelectedItems !== undefined && {
      selectedItems: controlledSelectedItems,
    }),
    onSelectedItemsChange: ({ selectedItems: newItems }) => {
      onValueChange?.(newItems?.map((item) => item.value) ?? []);
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      // Prevent removing fixed items via Backspace
      if (
        type ===
          useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace ||
        type === useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete
      ) {
        const removedItem = state.selectedItems[state.activeIndex];
        if (removedItem && isFixedValue(removedItem.value)) {
          return state; // Block removal
        }
      }
      // Prevent removing fixed items via function call (Backspace on empty input)
      if (
        type === useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace
      ) {
        const lastItem = state.selectedItems[state.selectedItems.length - 1];
        if (lastItem && isFixedValue(lastItem.value)) {
          return state; // Block removal
        }
      }
      return changes;
    },
  });

  const isAtMaxSelected =
    maxSelected !== undefined && selectedItems.length >= maxSelected;

  // Check if a given item is currently selected
  const isItemSelected = useCallback(
    (item: NormalizedItem<T>) =>
      selectedItems.some((sel) =>
        areValuesEqual(sel.value, item.value, getOptionValue),
      ),
    [selectedItems, getOptionValue],
  );

  // Effective disabled: intrinsic disabled OR unselected-when-max-reached
  const effectiveIsItemDisabled = useCallback(
    (item: NormalizedItem<T>) => {
      if (item?.disabled) return true;
      if (isAtMaxSelected && !isItemSelected(item)) return true;
      return false;
    },
    [isAtMaxSelected, isItemSelected],
  );

  const isInteractive = !disabled && !readOnly;

  // Track previous selectedItems length for announcement
  const prevSelectedItemsRef = useRef(selectedItems);
  const announcementTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const prev = prevSelectedItemsRef.current;
    if (prev !== selectedItems) {
      if (selectedItems.length > prev.length) {
        // Item added
        const added = selectedItems.find(
          (item) =>
            !prev.some((p) =>
              areValuesEqual(p.value, item.value, getOptionValue),
            ),
        );
        if (added) {
          setAnnouncement(
            `${added.label} selected, ${selectedItems.length} item${selectedItems.length !== 1 ? "s" : ""} selected`,
          );
          // Clear announcement after screen reader has had time to announce
          if (announcementTimerRef.current)
            clearTimeout(announcementTimerRef.current);
          announcementTimerRef.current = setTimeout(
            () => setAnnouncement(""),
            1000,
          );
        }
      } else if (selectedItems.length < prev.length) {
        // Item removed
        const removed = prev.find(
          (item) =>
            !selectedItems.some((s) =>
              areValuesEqual(s.value, item.value, getOptionValue),
            ),
        );
        if (removed) {
          setAnnouncement(
            `${removed.label} deselected, ${selectedItems.length} item${selectedItems.length !== 1 ? "s" : ""} selected`,
          );
          // Clear announcement after screen reader has had time to announce
          if (announcementTimerRef.current)
            clearTimeout(announcementTimerRef.current);
          announcementTimerRef.current = setTimeout(
            () => setAnnouncement(""),
            1000,
          );
        }
      }
      prevSelectedItemsRef.current = selectedItems;
    }

    return () => {
      if (announcementTimerRef.current)
        clearTimeout(announcementTimerRef.current);
    };
  }, [selectedItems, getOptionValue]);

  // Track input value locally for filtering
  const [localInputValue, setLocalInputValue] = useState(
    defaultInputValue ?? "",
  );
  const inputValue =
    controlledInputValue !== undefined ? controlledInputValue : localInputValue;

  // Token separator processing
  const processTokens = useCallback(
    (text: string) => {
      if (!tokenSeparators || tokenSeparators.length === 0) return false;

      const hasAnySeparator = tokenSeparators.some((sep) => text.includes(sep));
      if (!hasAnySeparator) return false;

      // Build regex from separators. Escaping handles most regex metacharacters.
      // Assumes typical separators like ',', ';', ' '. Edge cases with ']' or '^'
      // inside character classes are handled correctly by the escape pattern.
      const escapedSeps = tokenSeparators.map((s) =>
        s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      );
      const regex = new RegExp(`[${escapedSeps.join("")}]`);
      const tokens = text
        .split(regex)
        .map((t) => t.trim())
        .filter(Boolean);

      const currentItems = [...selectedItems];
      for (const token of tokens) {
        if (maxSelected !== undefined && currentItems.length >= maxSelected)
          break;

        // Find matching option by label (case-insensitive)
        const match = allSelectableItems.find(
          (item) =>
            item.label.toLowerCase() === token.toLowerCase() &&
            !currentItems.some((sel) =>
              areValuesEqual(sel.value, item.value, getOptionValue),
            ),
        );
        if (match) {
          currentItems.push(match);
        }
      }

      if (currentItems.length > selectedItems.length) {
        // Add all matched items in a single update to fire onValueChange once
        setSelectedItems(currentItems);
        setLocalInputValue("");
        return true;
      }
      return false;
    },
    [
      allSelectableItems,
      getOptionValue,
      maxSelected,
      selectedItems,
      setSelectedItems,
      tokenSeparators,
    ],
  );

  // Filter by text input (selected items remain visible in the dropdown)
  const { filteredRenderItems, filteredSelectableItems } = useMemo(() => {
    return filterRenderItems(allRenderItems, allSelectableItems, (item) =>
      effectiveFilter(item, inputValue),
    );
  }, [allRenderItems, allSelectableItems, effectiveFilter, inputValue]);

  // Announce result count when filtering
  const resultCountTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (resultCountTimerRef.current) clearTimeout(resultCountTimerRef.current);
    if (!inputValue) return undefined;
    const count = filteredSelectableItems.length;
    resultCountTimerRef.current = setTimeout(() => {
      setAnnouncement(`${count} result${count !== 1 ? "s" : ""} available`);
    }, 300);
    return () => {
      if (resultCountTimerRef.current)
        clearTimeout(resultCountTimerRef.current);
    };
  }, [filteredSelectableItems.length, inputValue]);

  // useCombobox for input + dropdown
  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    isOpen,
    openMenu,
  } = useCombobox<NormalizedItem<T>>({
    id: inputId,
    initialIsOpen: defaultOpen,
    ...(controlledInputValue !== undefined && {
      inputValue: controlledInputValue,
    }),
    ...(defaultInputValue !== undefined && {
      initialInputValue: defaultInputValue,
    }),
    isItemDisabled: effectiveIsItemDisabled,
    items: filteredSelectableItems,
    itemToString,
    menuId,
    onInputValueChange: ({ inputValue: newVal }) => {
      const val = newVal ?? "";

      // Try token separator processing
      if (tokenSeparators && tokenSeparators.length > 0 && processTokens(val)) {
        return;
      }

      setLocalInputValue(val);
      onInputValueChange?.(val);
    },
    onIsOpenChange: ({ isOpen: open }) => {
      if (readOnly) return;
      if (!open) {
        openedByFocusRef.current = false;
      }
      onOpenChange?.(open ?? false);
    },
    onStateChange: ({ selectedItem: newItem, type }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newItem) {
            if (isItemSelected(newItem)) {
              // Toggle off: deselect (unless fixed)
              if (!isFixedValue(newItem.value)) {
                setSelectedItems(
                  selectedItems.filter(
                    (sel) =>
                      !areValuesEqual(sel.value, newItem.value, getOptionValue),
                  ),
                );
              }
            } else if (!isAtMaxSelected) {
              // Toggle on: select
              addSelectedItem(newItem);
            }
            setLocalInputValue("");
          }
          break;
      }
    },
    selectedItem: null, // Critical: prevents single-selection tracking
    stateReducer: (state, actionAndChanges) => {
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
        queueMicrotask(() => {
          openedByFocusRef.current = false;
        });
        return { ...changes, isOpen: true };
      }
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            inputValue: "",
            isOpen: true, // Keep menu open after selection
          };
        default:
          return changes;
      }
    },
  });

  // Use Floating UI for positioning
  const { floatingProps, referenceProps } = useFloatingSelect({
    isOpen,
    maxDropdownHeight,
    placement,
  });
  const side = floatingProps.placement.split("-")[0];
  const menuPortalRoot =
    menuPortal ?? (typeof document !== "undefined" ? document.body : null);

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
  // inputRef is used for focus management (clear all, tag removal)
  // It's set via the getInputProps ref callback below, not directly on the element

  // Track latest isOpen in a ref so the focus handler never uses a stale closure.
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // Open on focus handler
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

  // Clear all handler (excludes fixed values)
  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isInteractive) return;
      if (fixedValues && fixedValues.length > 0) {
        const fixedItems = selectedItems.filter((item) =>
          isFixedValue(item.value),
        );
        setSelectedItems(fixedItems);
      } else {
        setSelectedItems([]);
      }
      inputRef.current?.focus();
    },
    [isInteractive, fixedValues, selectedItems, isFixedValue, setSelectedItems],
  );

  // Focus input after tag removal via remove button
  const handleTagRemove = useCallback(
    (e: React.MouseEvent, item: NormalizedItem<T>) => {
      e.stopPropagation();
      removeSelectedItem(item);
      inputRef.current?.focus();
    },
    [removeSelectedItem],
  );

  // Handle paste for token separators
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!tokenSeparators || tokenSeparators.length === 0) return;
      const pasted = e.clipboardData.getData("text");
      if (processTokens(pasted)) {
        e.preventDefault();
      }
    },
    [tokenSeparators, processTokens],
  );

  // Determine which tags to display
  const displayedTags =
    maxDisplayedTags !== undefined && selectedItems.length > maxDisplayedTags
      ? selectedItems.slice(0, maxDisplayedTags)
      : selectedItems;
  const overflowCount =
    maxDisplayedTags !== undefined
      ? Math.max(0, selectedItems.length - maxDisplayedTags)
      : 0;

  const hasNonFixedItems = selectedItems.some(
    (item) => !isFixedValue(item.value),
  );

  const isEmpty = filteredRenderItems.length === 0;

  return (
    <div
      {...rest}
      className={className}
      data-ck="multi-select"
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      data-has-value={selectedItems.length > 0 || undefined}
      data-max-reached={isAtMaxSelected || undefined}
      data-readonly={readOnly || undefined}
      data-required={required || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-variant={variantName}
      ref={containerRef_}
    >
      {/* Hidden inputs for form submission */}
      {name &&
        selectedItems.map((item, index) => (
          <input
            key={`hidden-${index}`}
            name={name}
            type="hidden"
            value={serializeValue(item.value, getOptionValue)}
          />
        ))}

      {/* Live region for screen reader announcements */}
      <div
        aria-atomic="true"
        aria-live="polite"
        data-ck="multi-select-live"
        role="status"
      >
        {announcement}
      </div>

      {/* Tags + Input area */}
      <div
        data-ck="multi-select-input-wrapper"
        onClick={(e) => {
          if (e.target === e.currentTarget && isInteractive) {
            inputRef.current?.focus();
          }
        }}
        ref={inputWrapperRef_}
      >
        <div data-ck="multi-select-tags">
          {displayedTags.map((selectedItem, index) => {
            const isFixed = isFixedValue(selectedItem.value);
            return (
              <span
                key={`tag-${index}`}
                {...getSelectedItemProps({ index, selectedItem })}
                aria-label={`${selectedItem.label}, selected`}
                data-active={activeIndex === index || undefined}
                data-ck="multi-select-tag"
                data-fixed={isFixed || undefined}
              >
                <span>{selectedItem.label}</span>
                {!isFixed && !readOnly && (
                  <button
                    aria-label={`Remove ${selectedItem.label}`}
                    data-ck="multi-select-tag-remove"
                    disabled={disabled}
                    type="button"
                    onClick={(e) => handleTagRemove(e, selectedItem)}
                  >
                    <div aria-hidden="true" data-slot="icon" />
                  </button>
                )}
              </span>
            );
          })}
          {overflowCount > 0 && (
            <span
              aria-label={`${overflowCount} more selected item${overflowCount !== 1 ? "s" : ""} not shown`}
              data-ck="multi-select-tag-overflow"
            >
              +{overflowCount} more
            </span>
          )}
          <input
            {...getInputProps(
              getDropdownProps({
                autoFocus,
                disabled: disabled || readOnly,
                onBlur,
                preventKeyAction: false,
                ref: inputRef,
                ...(ariaLabel !== undefined && { "aria-label": ariaLabel }),
              }),
            )}
            aria-disabled={disabled || undefined}
            // Override Downshift's auto-generated aria-labelledby so the input
            // relies on its own content or the consumer-provided aria-label instead.
            aria-labelledby={undefined}
            aria-required={required || undefined}
            data-ck="multi-select-input"
            placeholder={selectedItems.length === 0 ? placeholder : ""}
            readOnly={readOnly}
            onFocus={handleInputFocus}
            onPaste={handlePaste}
          />
        </div>
        {/* Clear all button */}
        {clearable &&
          hasNonFixedItems &&
          selectedItems.length > 0 &&
          isInteractive && (
            <button
              aria-label="Clear all selections"
              data-ck="multi-select-clear"
              tabIndex={-1}
              type="button"
              onClick={handleClearAll}
            >
              <div aria-hidden="true" data-slot="icon" />
            </button>
          )}
        <button
          {...getToggleButtonProps({ disabled: disabled || readOnly })}
          aria-label="Toggle menu"
          data-ck="multi-select-trigger"
          data-state={isOpen ? "open" : "closed"}
          tabIndex={-1}
          type="button"
        >
          <div aria-hidden="true" data-slot="icon" />
        </button>
      </div>

      {/* Dropdown content - Always rendered in portal so Downshift's getMenuProps
           ref is never unmounted (required for click-outside detection and SSR). */}
      <FloatingPortal root={menuPortalRoot ?? undefined}>
        <div
          style={{
            ...floatingProps.style,
            ...(!isMounted && { visibility: "hidden" }),
            ...(!isOpen && { pointerEvents: "none" }),
          }}
          data-ck="multi-select-positioner"
          data-state={isOpen ? "open" : "closed"}
          data-unmounted={!isMounted || undefined}
          ref={floatingProps.ref}
        >
          <div
            {...getMenuProps(
              { id: menuId, ref: menuRef },
              { suppressRefError: true },
            )}
            aria-labelledby={inputId}
            aria-multiselectable="true"
            aria-orientation="vertical"
            data-ck="multi-select-content"
            data-empty={isEmpty || undefined}
            data-side={side}
            data-state={contentState}
          >
            {isMounted && (
              <>
                {isEmpty && (
                  <div
                    aria-live="polite"
                    data-ck="multi-select-empty"
                    role="status"
                  >
                    {isAtMaxSelected ? maxReachedContent : emptyContent}
                  </div>
                )}

                {renderDropdownItems({
                  getItemProps,
                  highlightedIndex,
                  isItemDisabled: effectiveIsItemDisabled,
                  isItemSelected,
                  prefix: "multi-select",
                  renderItems: filteredRenderItems,
                })}
              </>
            )}
          </div>
        </div>
      </FloatingPortal>
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
