import type {
  LabeledOption,
  NormalizedItem,
  RenderItem,
  SelectOption,
  StringOption,
} from "../types/select";

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
function normalizeLabeledOption<T>(
  option: LabeledOption<T>,
): NormalizedItem<T> {
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
 * Gets a string representation of the item for Downshift's itemToString.
 */
function itemToString<T>(item: NormalizedItem<T> | null): string {
  if (!item) return "";
  return item.label;
}

/**
 * Filters render items based on a predicate applied to selectable items.
 * Preserves group labels that have at least one visible child.
 * Removes orphan separators (leading, trailing, or consecutive).
 *
 * Returns both the filtered flat selectable items (for Downshift)
 * and the filtered render items with remapped indices (for rendering).
 */
function filterRenderItems<T>(
  allRenderItems: RenderItem<T>[],
  allSelectableItems: NormalizedItem<T>[],
  predicate: (item: NormalizedItem<T>) => boolean,
): {
  filteredRenderItems: RenderItem<T>[];
  filteredSelectableItems: NormalizedItem<T>[];
} {
  // 1. Determine which selectable indices pass the predicate
  const passingIndices = new Set<number>();
  const filteredSelectableItems: NormalizedItem<T>[] = [];

  allSelectableItems.forEach((item, idx) => {
    if (predicate(item)) {
      passingIndices.add(idx);
      filteredSelectableItems.push(item);
    }
  });

  // 2. Build index mapping: old selectableIndex → new index in filteredSelectableItems
  const indexMap = new Map<number, number>();
  let newIndex = 0;
  allSelectableItems.forEach((_, idx) => {
    if (passingIndices.has(idx)) {
      indexMap.set(idx, newIndex++);
    }
  });

  // 3. Walk render items, keeping passing items and non-empty groups
  // First pass: determine which group labels have visible children
  const groupHasChildren = new Map<number, boolean>();
  let currentGroup = -1;

  for (const ri of allRenderItems) {
    if (ri.type === "group-label") {
      currentGroup = ri.groupIndex;
      groupHasChildren.set(currentGroup, false);
    } else if (ri.type === "item") {
      if (passingIndices.has(ri.selectableIndex) && currentGroup >= 0) {
        groupHasChildren.set(currentGroup, true);
      }
    } else if (ri.type === "separator") {
      currentGroup = -1;
    }
  }

  // Second pass: build filtered render items
  const rawFiltered: RenderItem<T>[] = [];
  currentGroup = -1;

  for (const ri of allRenderItems) {
    if (ri.type === "separator") {
      currentGroup = -1;
      rawFiltered.push(ri);
    } else if (ri.type === "group-label") {
      currentGroup = ri.groupIndex;
      if (groupHasChildren.get(ri.groupIndex)) {
        rawFiltered.push(ri);
      }
    } else if (ri.type === "item") {
      if (passingIndices.has(ri.selectableIndex)) {
        rawFiltered.push({
          item: ri.item,
          selectableIndex: indexMap.get(ri.selectableIndex)!,
          type: "item",
        });
      }
    }
  }

  // 4. Remove orphan separators (leading, trailing, consecutive)
  const filteredRenderItems: RenderItem<T>[] = [];
  for (let i = 0; i < rawFiltered.length; i++) {
    const ri = rawFiltered[i];
    if (ri.type === "separator") {
      // Skip if first, last, or previous was also separator
      if (filteredRenderItems.length === 0) continue;
      if (i === rawFiltered.length - 1) continue;
      const prev = filteredRenderItems[filteredRenderItems.length - 1];
      if (prev?.type === "separator") continue;
      filteredRenderItems.push(ri);
    } else {
      filteredRenderItems.push(ri);
    }
  }

  // Remove trailing separator if last item ended up being one
  if (
    filteredRenderItems.length > 0 &&
    filteredRenderItems[filteredRenderItems.length - 1].type === "separator"
  ) {
    filteredRenderItems.pop();
  }

  return { filteredRenderItems, filteredSelectableItems };
}

/**
 * Compares whether two item values are equal.
 * Uses getOptionValue for key-based comparison when provided,
 * falls back to strict equality for primitives.
 */
function areValuesEqual<T>(
  a: T,
  b: T,
  getOptionValue?: (option: T) => number | string,
): boolean {
  if (getOptionValue) {
    return getOptionValue(a) === getOptionValue(b);
  }
  return a === b;
}

/**
 * Default filter function for combobox-style components.
 * Case-insensitive substring match on the item's label.
 */
function defaultFilterFn<T>(item: NormalizedItem<T>, input: string): boolean {
  if (!input) return true;
  return item.label.toLowerCase().includes(input.toLowerCase());
}

/**
 * Finds a NormalizedItem in a list by matching against a raw value.
 * Uses getOptionValue for key-based comparison when provided,
 * falls back to strict equality for primitives.
 *
 * Returns the matching item, or null if not found.
 * Returns undefined only when the input value is itself undefined
 * (to distinguish "no controlled value" from "controlled but not found").
 */
function findItemByValue<T>(
  items: NormalizedItem<T>[],
  value: T | undefined,
  getOptionValue?: (option: T) => number | string,
): NormalizedItem<T> | null | undefined {
  if (value === undefined) return undefined;

  if (getOptionValue) {
    const valueKey = getOptionValue(value);
    return (
      items.find((item) => getOptionValue(item.value) === valueKey) ?? null
    );
  }

  return items.find((item) => item.value === value) ?? null;
}

/**
 * Finds multiple NormalizedItems by matching each value in the array.
 * Returns only the items that were found (filters out unmatched values).
 * Returns undefined when the input array is itself undefined.
 */
function findItemsByValue<T>(
  items: NormalizedItem<T>[],
  values: T[] | undefined,
  getOptionValue?: (option: T) => number | string,
): NormalizedItem<T>[] | undefined {
  if (values === undefined) return undefined;

  if (getOptionValue) {
    return values
      .map((val) => {
        const valueKey = getOptionValue(val);
        return items.find((item) => getOptionValue(item.value) === valueKey);
      })
      .filter((item): item is NormalizedItem<T> => item !== undefined);
  }

  return values
    .map((val) => items.find((item) => item.value === val))
    .filter((item): item is NormalizedItem<T> => item !== undefined);
}

export {
  areValuesEqual,
  defaultFilterFn,
  filterRenderItems,
  findItemByValue,
  findItemsByValue,
  itemToString,
  normalizeLabeledOption,
  normalizeOption,
  normalizeStringOption,
  processOptions,
};
