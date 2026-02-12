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
 * Render item for display (includes separators, groups, and standalone items).
 */
type RenderItem<T = string> =
  | {
      groupIndex: number;
      groupLabel: string;
      groupLabelId: string;
      items: Array<{ item: NormalizedItem<T>; selectableIndex: number }>;
      type: "group";
    }
  | { item: NormalizedItem<T>; selectableIndex: number; type: "item" }
  | { type: "separator" };

export {
  type GroupOption,
  type LabeledOption,
  type NormalizedItem,
  type RenderItem,
  type SelectOption,
  type SeparatorOption,
  type StringOption,
};
