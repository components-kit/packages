# MultiSelect

A multi-select component with tag chips, type-ahead filtering, and keyboard navigation, powered by Downshift.

> **Requires:** `npm install downshift`

## Usage

```tsx
import { MultiSelect } from '@components-kit/react';

// Simple string options
<MultiSelect
  options={['apple', 'banana', 'cherry', 'date']}
  placeholder="Pick fruits..."
  onValueChange={setFruits}
/>

// Labeled options with disabled items
<MultiSelect
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
  ]}
/>

// Grouped options
<MultiSelect
  options={[
    { type: 'group', label: 'Fruits', options: ['apple', 'banana'] },
    { type: 'separator' },
    { type: 'group', label: 'Vegetables', options: ['carrot', 'celery'] },
  ]}
/>

// Controlled mode
const [selected, setSelected] = useState<string[]>(['apple']);
<MultiSelect
  options={['apple', 'banana', 'cherry']}
  value={selected}
  onValueChange={setSelected}
/>

// Max selected limit
<MultiSelect
  options={['apple', 'banana', 'cherry', 'date', 'elderberry']}
  maxSelected={3}
  onValueChange={setFruits}
/>
```

## Props

| Prop             | Type                              | Default       | Description                                                                                                                                                              |
| ---------------- | --------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`        | `SelectOption<T>[]`               | **required**  | Array of options to display                                                                                                                                              |
| `value`          | `T[]`                             | -             | Controlled selected values                                                                                                                                               |
| `defaultValue`   | `T[]`                             | -             | Default selected values (uncontrolled)                                                                                                                                   |
| `onValueChange`  | `(values: T[]) => void`           | -             | Callback when selection changes                                                                                                                                          |
| `placeholder`    | `string`                          | `"Search..."` | Placeholder text shown when no items selected                                                                                                                            |
| `disabled`       | `boolean`                         | `false`       | Disables the multi-select                                                                                                                                                |
| `variantName`    | `string`                          | -             | Variant name for styling                                                                                                                                                 |
| `getOptionValue` | `(option: T) => string \| number` | -             | Function to extract a unique primitive key from option values. Required for object values where reference equality won't work. For primitive values, this is not needed. |
| `filterFn`       | `(option, inputValue) => boolean` | -             | Custom filter function (default: case-insensitive includes)                                                                                                              |
| `maxSelected`    | `number`                          | -             | Maximum number of items that can be selected                                                                                                                             |
| `emptyContent`   | `ReactNode`                       | `"No results found"` | Custom content displayed when no options match the filter                                                                                                          |
| `maxReachedContent` | `ReactNode`                    | `"Maximum selections reached"` | Custom content displayed when maximum selections reached                                                                                                |
| `inputValue`     | `string`                          | -             | Controlled input text value                                                                                                                                              |
| `defaultInputValue` | `string`                       | -             | Default input value (uncontrolled)                                                                                                                                       |
| `onInputValueChange` | `(value: string) => void`     | -             | Callback when input text changes                                                                                                                                         |

Also accepts all standard `div` HTML attributes.

## Option Types

```tsx
// String option
'apple'

// Labeled option
{ value: 'apple', label: 'Apple', disabled?: boolean }

// Group
{ type: 'group', label: 'Fruits', options: [...] }

// Separator
{ type: 'separator' }
```

## Object Values

When working with object values, you need to provide a `getOptionValue` function to extract a unique primitive identifier:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

function UserMultiSelect() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  return (
    <MultiSelect<User>
      options={users.map((user) => ({
        value: user,
        label: user.name,
      }))}
      value={selectedUsers}
      onValueChange={setSelectedUsers}
      getOptionValue={(user) => user.id}
      placeholder="Select team members..."
    />
  );
}
```

The `getOptionValue` function is used internally to:

- Compare options for equality (avoiding reference comparison issues)
- Track which items are selected
- Determine which items to highlight in the dropdown

## CSS Customization

Use data attributes to style the multi-select component:

```css
/* Style the input wrapper with tags */
[data-ck="multi-select-input-wrapper"] {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

/* Style the tags/chips */
[data-ck="multi-select-tag"] {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--color-tag-bg);
  border-radius: 4px;
  font-size: 14px;
}

/* Style the tag remove button */
[data-ck="multi-select-tag-remove"]::after {
  content: "×";
  font-size: 18px;
  line-height: 1;
}

[data-ck="multi-select-tag-remove"]:hover {
  color: var(--color-danger);
}

/* Style highlighted items */
[data-ck="multi-select-item"][data-highlighted] {
  background: var(--color-highlight);
}

/* Style the input field */
[data-ck="multi-select-input"] {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
}
```

## Data Attributes

| Attribute                              | Element                | Values               | Description                                 |
| -------------------------------------- | ---------------------- | -------------------- | ------------------------------------------- |
| `data-ck="multi-select"`               | Root                   | -                    | Identifies the root container               |
| `data-ck="multi-select-input-wrapper"` | Wrapper                | -                    | Container for tags and input                |
| `data-ck="multi-select-tag"`           | Tag                    | -                    | Individual selected tag chip                |
| `data-ck="multi-select-tag-remove"`    | Button                 | -                    | Remove button inside a tag                  |
| `data-ck="multi-select-input"`         | Input                  | -                    | Text input for filtering                    |
| `data-ck="multi-select-trigger"`       | Button                 | -                    | Toggle button for dropdown                  |
| `data-ck="multi-select-content"`       | Menu                   | -                    | Dropdown menu container                     |
| `data-ck="multi-select-item"`          | Item                   | -                    | Individual dropdown item                    |
| `data-ck="multi-select-empty"`         | Div                    | -                    | Empty state / max-reached message           |
| `data-ck="multi-select-separator"`     | Div                    | -                    | Visual separator between groups             |
| `data-ck="multi-select-group"`         | Div                    | -                    | Group container (`role="group"` with `aria-labelledby`) |
| `data-ck="multi-select-group-label"`   | Div                    | -                    | Group label heading (`role="presentation"`) |
| `data-state`                           | Root, Trigger, Content | `"open"`, `"closed"` | Dropdown open/close state                   |
| `data-disabled`                        | Root, Item             | `true`               | Present when disabled                       |
| `data-highlighted`                     | Item                   | `true`               | Present on keyboard-highlighted item        |
| `data-variant`                         | Root                   | string               | Variant name for styling                    |
| `data-has-value`                       | Root                   | `true`               | Present when at least one item is selected  |
| `data-max-reached`                     | Root                   | `true`               | Present when `maxSelected` limit is reached |
| `data-active`                          | Tag                    | `true`               | Present on the currently focused tag        |

## Accessibility

- Follows WAI-ARIA Combobox pattern with `aria-multiselectable="true"` on the listbox
- Menu has `aria-labelledby` linking to the input
- Groups use `role="group"` with `aria-labelledby` linking to the group label

### Keyboard Support

| Key            | Context           | Action                                   |
| -------------- | ----------------- | ---------------------------------------- |
| `ArrowDown`    | Input             | Open menu / move to next item            |
| `ArrowUp`      | Input             | Move to previous item                    |
| `Enter`        | Item highlighted  | Select item, keep menu open, clear input |
| `Escape`       | Menu open         | Close menu                               |
| `Home` / `End` | Menu open         | Jump to first / last item                |
| `Backspace`    | Input empty       | Remove last selected tag                 |
| `ArrowLeft`    | Input, caret at 0 | Focus last tag                           |
| `ArrowRight`   | Tag focused       | Focus next tag or return to input        |
| `ArrowLeft`    | Tag focused       | Focus previous tag                       |
| Characters     | Input             | Filter options by typing                 |

- Tags have `aria-label="{label}, selected"` for screen readers
- Tag remove buttons have `aria-label="Remove {label}"`
- `aria-live="polite"` on empty and max-reached state messages
- `role="status"` on empty/max state element
- Roving tabindex on tags for keyboard navigation
- Standard combobox ARIA attributes (`aria-expanded`, `aria-controls`, etc.)

### Best Practices

- Set `maxSelected` to prevent overwhelming selections
- Provide a descriptive `aria-label` if no visible label
- Use `getOptionValue` when working with object values
- Consider providing visible count of selections
- Use groups and separators to organize related options
- Disable options rather than hiding them when possible
