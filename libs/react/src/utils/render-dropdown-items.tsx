import { type ReactElement } from "react";

import type { NormalizedItem, RenderItem } from "../types/select";

/**
 * Configuration for the shared dropdown item renderer.
 */
interface RenderDropdownItemsOptions<T> {
  /**
   * Downshift's getItemProps function.
   */
  getItemProps: (options: {
    disabled: boolean;
    index: number;
    item: NormalizedItem<T>;
  }) => Record<string, unknown>;
  /**
   * Current highlighted index from Downshift.
   */
  highlightedIndex: number;
  /**
   * Returns whether an item is disabled beyond its own `disabled` property.
   * Used to visually disable items (e.g. unselected items when maxSelected is reached).
   * When omitted, only `item.disabled` is considered.
   */
  isItemDisabled?: (item: NormalizedItem<T>) => boolean;
  /**
   * Returns whether an item is selected.
   * When omitted, all items are treated as unselected.
   */
  isItemSelected?: (item: NormalizedItem<T>) => boolean;
  /**
   * data-ck prefix, e.g. "select", "multi-select", "combobox".
   */
  prefix: string;
  /**
   * The render items to map over.
   */
  renderItems: RenderItem<T>[];
}

/**
 * Renders the dropdown item list shared by Select, MultiSelect, and Combobox.
 *
 * Handles three render item types: separator, group, and standalone item.
 * Returns an array of React elements to be rendered inside the dropdown menu.
 */
function renderDropdownItems<T>({
  getItemProps,
  highlightedIndex,
  isItemDisabled,
  isItemSelected,
  prefix,
  renderItems,
}: RenderDropdownItemsOptions<T>): ReactElement[] {
  const elements: ReactElement[] = [];

  const renderOption = (item: NormalizedItem<T>, selectableIndex: number) => {
    const isSelected = isItemSelected ? isItemSelected(item) : false;
    const isHighlighted = highlightedIndex === selectableIndex;
    const isDisabled = isItemDisabled ? isItemDisabled(item) : (item.disabled ?? false);

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
        data-ck={`${prefix}-item`}
        data-disabled={isDisabled || undefined}
        data-highlighted={isHighlighted || undefined}
        data-state={isSelected ? "checked" : "unchecked"}
        role="option"
      >
        {item.label}
        <div aria-hidden="true" data-slot="icon" />
      </div>
    );
  };

  for (let idx = 0; idx < renderItems.length; idx++) {
    const renderItem = renderItems[idx];

    if (renderItem.type === "separator") {
      elements.push(
        <div
          key={`separator-${idx}`}
          aria-orientation="horizontal"
          data-ck={`${prefix}-separator`}
          role="separator"
        />,
      );
      continue;
    }

    if (renderItem.type === "group") {
      elements.push(
        <div
          key={`group-${renderItem.groupIndex}`}
          aria-labelledby={renderItem.groupLabelId}
          data-ck={`${prefix}-group`}
          role="group"
        >
          <div
            id={renderItem.groupLabelId}
            data-ck={`${prefix}-group-label`}
            role="presentation"
          >
            {renderItem.groupLabel}
          </div>
          {renderItem.items.map(({ item, selectableIndex }) =>
            renderOption(item, selectableIndex),
          )}
        </div>,
      );
      continue;
    }

    // Standalone item
    elements.push(renderOption(renderItem.item, renderItem.selectableIndex));
  }

  return elements;
}

export { renderDropdownItems, type RenderDropdownItemsOptions };
