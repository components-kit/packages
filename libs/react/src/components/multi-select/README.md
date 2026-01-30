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

// Custom tag rendering
<MultiSelect
  options={['apple', 'banana', 'cherry']}
  renderTag={({ item, removeItem }) => (
    <span className="custom-tag">
      {item.label} <button onClick={removeItem}>x</button>
    </span>
  )}
/>

// Custom item rendering
<MultiSelect
  options={['apple', 'banana', 'cherry']}
  renderItem={({ option, isHighlighted }) => (
    <div style={{ fontWeight: isHighlighted ? 'bold' : 'normal' }}>
      {option.label}
    </div>
  )}
/>

// Object values with isEqual
<MultiSelect<User>
  options={users.map(u => ({ value: u, label: u.name }))}
  isEqual={(a, b) => a?.id === b?.id}
  onValueChange={setSelectedUsers}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption<T>[]` | **required** | Array of options to display |
| `value` | `T[]` | - | Controlled selected values |
| `defaultValue` | `T[]` | - | Default selected values (uncontrolled) |
| `onValueChange` | `(values: T[]) => void` | - | Callback when selection changes |
| `placeholder` | `string` | `"Search..."` | Placeholder text shown when no items selected |
| `disabled` | `boolean` | `false` | Disables the multi-select |
| `variantName` | `string` | - | Variant name for styling |
| `isEqual` | `(a: T, b: T) => boolean` | - | Custom equality function for object values |
| `filterFn` | `(option, inputValue) => boolean` | - | Custom filter function (default: case-insensitive includes) |
| `maxSelected` | `number` | - | Maximum number of items that can be selected |
| `renderItem` | `(context) => ReactNode` | - | Custom dropdown item renderer |
| `renderTag` | `(context) => ReactNode` | - | Custom tag/chip renderer |

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

## Data Attributes

| Attribute | Element | Values | Description |
|-----------|---------|--------|-------------|
| `data-ck="multi-select"` | Root | - | Identifies the root container |
| `data-ck="multi-select-input-wrapper"` | Wrapper | - | Container for tags and input |
| `data-ck="multi-select-tag"` | Tag | - | Individual selected tag chip |
| `data-ck="multi-select-tag-remove"` | Button | - | Remove button inside a tag |
| `data-ck="multi-select-input"` | Input | - | Text input for filtering |
| `data-ck="multi-select-trigger"` | Button | - | Toggle button for dropdown |
| `data-ck="multi-select-content"` | Menu | - | Dropdown menu container |
| `data-ck="multi-select-item"` | Item | - | Individual dropdown item |
| `data-ck="multi-select-empty"` | Div | - | Empty state / max-reached message |
| `data-ck="multi-select-separator"` | Div | - | Visual separator between groups |
| `data-ck="multi-select-group-label"` | Div | - | Group label heading |
| `data-state` | Root, Trigger, Content | `"open"`, `"closed"` | Dropdown open/close state |
| `data-disabled` | Root, Item | `true` | Present when disabled |
| `data-highlighted` | Item | `true` | Present on keyboard-highlighted item |
| `data-variant` | Root | string | Variant name for styling |
| `data-has-value` | Root | `true` | Present when at least one item is selected |
| `data-max-reached` | Root | `true` | Present when `maxSelected` limit is reached |
| `data-active` | Tag | `true` | Present on the currently focused tag |

## Accessibility

- Follows WAI-ARIA Combobox pattern with `aria-multiselectable="true"` on the listbox
- Full keyboard navigation:
  - **Arrow Down/Up**: Navigate dropdown items
  - **Enter**: Select highlighted item (menu stays open)
  - **Escape**: Close dropdown
  - **Home/End**: Jump to first/last item
  - **Backspace** (input empty): Remove last selected tag
  - **Arrow Left** (input, caret at 0): Focus last tag
  - **Arrow Right** (tag focused): Focus next tag or return to input
  - **Arrow Left** (tag focused): Focus previous tag
  - **Characters**: Filter options by typing
- Tags have `aria-label="{label}, selected"` for screen readers
- Tag remove buttons have `aria-label="Remove {label}"`
- `aria-live="polite"` on empty and max-reached state messages
- `role="status"` on empty/max state element
- Roving tabindex on tags for keyboard navigation
- Standard combobox ARIA attributes (`aria-expanded`, `aria-controls`, etc.)

### Best Practices

- Set `maxSelected` to prevent overwhelming selections
- Provide a descriptive `aria-label` if no visible label
- Use `renderTag` for custom chip appearance
- Use `isEqual` when working with object values
- Consider providing visible count of selections
- Use groups and separators to organize related options
- Disable options rather than hiding them when possible
