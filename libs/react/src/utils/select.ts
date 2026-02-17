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
 * Groups are emitted as a single render item containing their label and child items.
 *
 * @param options - Array of options to process.
 * @param baseId - Base ID for generating deterministic group label IDs (for aria-labelledby).
 */
function processOptions<T>(options: SelectOption<T>[], baseId: string = ""): {
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
        const currentGroupIndex = groupIndex++;
        const groupItems: Array<{ item: NormalizedItem<T>; selectableIndex: number }> = [];
        for (const groupItem of option.options) {
          const item = normalizeOption<T>(groupItem);
          groupItems.push({
            item,
            selectableIndex: selectableItems.length,
          });
          selectableItems.push(item);
        }
        renderItems.push({
          groupIndex: currentGroupIndex,
          groupLabel: option.label,
          groupLabelId: `${baseId}-group-${currentGroupIndex}`,
          items: groupItems,
          type: "group",
        });
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
 * Preserves groups that have at least one visible child (with filtered children).
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

  // 3. Walk render items, filtering groups and standalone items
  const rawFiltered: RenderItem<T>[] = [];

  for (const ri of allRenderItems) {
    if (ri.type === "separator") {
      rawFiltered.push(ri);
    } else if (ri.type === "group") {
      // Filter children within the group
      const filteredGroupItems = ri.items
        .filter((child) => passingIndices.has(child.selectableIndex))
        .map((child) => ({
          item: child.item,
          selectableIndex: indexMap.get(child.selectableIndex)!,
        }));

      // Only keep group if it has visible children
      if (filteredGroupItems.length > 0) {
        rawFiltered.push({
          groupIndex: ri.groupIndex,
          groupLabel: ri.groupLabel,
          groupLabelId: ri.groupLabelId,
          items: filteredGroupItems,
          type: "group",
        });
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

/**
 * Serializes an option value to a string for form submission.
 * Uses getOptionValue when provided, otherwise coerces via String().
 */
function serializeValue<T>(
  value: T,
  getOptionValue?: (option: T) => number | string,
): string {
  if (getOptionValue) return String(getOptionValue(value));
  return String(value);
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
  serializeValue,
};
