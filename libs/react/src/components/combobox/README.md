# Combobox

A searchable select component with type-ahead filtering and keyboard navigation, powered by Downshift.

> **Requires:** `npm install downshift`

## Usage

```tsx
import { Combobox } from '@components-kit/react';

// Simple string options
<Combobox
  options={['apple', 'banana', 'cherry']}
  placeholder="Search fruits..."
  onValueChange={setFruit}
/>

// Labeled options with disabled items
<Combobox
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
  ]}
  variantName="default"
/>

// Grouped options with separator
<Combobox
  options={[
    { type: 'group', label: 'Fruits', options: ['apple', 'banana'] },
    { type: 'separator' },
    { type: 'group', label: 'Vegetables', options: ['carrot', 'celery'] },
  ]}
/>

// Controlled value
<Combobox
  options={['apple', 'banana', 'cherry']}
  value={selectedFruit}
  onValueChange={setSelectedFruit}
/>

// Controlled input value
<Combobox
  options={['apple', 'banana', 'cherry']}
  inputValue={query}
  onInputValueChange={setQuery}
  onValueChange={setFruit}
/>

// Custom filter function
<Combobox
  options={['apple', 'banana', 'cherry']}
  filterFn={(option, input) =>
    option.label.toLowerCase().startsWith(input.toLowerCase())
  }
/>

```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption<T>[]` | **required** | Array of options to display |
| `value` | `T` | - | Controlled selected value |
| `defaultValue` | `T` | - | Default value (uncontrolled) |
| `onValueChange` | `(value: T \| undefined) => void` | - | Callback when selection changes |
| `inputValue` | `string` | - | Controlled input text value |
| `defaultInputValue` | `string` | - | Default input value (uncontrolled) |
| `onInputValueChange` | `(value: string) => void` | - | Callback when input text changes |
| `placeholder` | `string` | `"Search..."` | Placeholder text for the input |
| `disabled` | `boolean` | `false` | Disables the combobox |
| `variantName` | `string` | - | Variant name for styling |
| `getOptionValue` | `(option: T) => string \| number` | - | Function to extract a unique primitive key from option values. Required for object values where reference equality won't work. For primitive values, this is not needed. |
| `filterFn` | `(option, inputValue) => boolean` | - | Custom filter function (default: case-insensitive includes) |

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

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-ck="combobox"` | - | Root combobox container |
| `data-ck="combobox-input-wrapper"` | - | Wrapper around input and toggle button |
| `data-ck="combobox-input"` | - | Text input element |
| `data-ck="combobox-trigger"` | - | Toggle button to open/close menu |
| `data-ck="combobox-content"` | - | Dropdown menu container |
| `data-ck="combobox-item"` | - | Individual option item |
| `data-ck="combobox-separator"` | - | Visual separator between groups |
| `data-ck="combobox-group-label"` | - | Group heading label |
| `data-ck="combobox-empty"` | - | Empty state ("No results found") |
| `data-state` | `"open"`, `"closed"` | Dropdown state (on root, trigger, and content) |
| `data-disabled` | `true` | Present when disabled (on root and items) |
| `data-highlighted` | `true` | Present on the currently highlighted item |
| `data-variant` | string | Variant name for styling |

## Accessibility

- Follows WAI-ARIA Combobox Pattern with Listbox Popup
- Full keyboard navigation:
  - **Arrow Down**: Open menu / move to next item
  - **Arrow Up**: Move to previous item
  - **Enter**: Select highlighted item and close
  - **Escape**: Close menu
  - **Home/End**: Jump to first/last item
  - **Characters**: Filter options by typing
- ARIA attributes:
  - `role="combobox"` on the input element
  - `role="listbox"` on the dropdown menu
  - `role="option"` with `aria-selected` on items
  - `aria-expanded` toggles with menu open/closed state
  - `aria-controls` links input to listbox
  - `aria-disabled` on disabled items
  - `role="status"` on empty state for screen reader announcement
  - `role="separator"` on dividers

### Best Practices

- Provide a descriptive `aria-label` if no visible label
- Use `filterFn` for custom matching (e.g., fuzzy search)
- Use `getOptionValue` when working with object values
- Use groups and separators to organize large option sets
- Disable options rather than hiding them when possible

## Object Values

When working with object values, use `getOptionValue` to extract a unique primitive key for proper selection comparison:

```tsx
import { Combobox } from '@components-kit/react';

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com' },
];

function UserPicker() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  return (
    <Combobox
      options={users.map(user => ({
        value: user,
        label: `${user.name} (${user.email})`,
      }))}
      value={selectedUser}
      onValueChange={setSelectedUser}
      getOptionValue={(user) => user.id}
      placeholder="Search users..."
      filterFn={(option, inputValue) => {
        const user = option.value;
        return (
          user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.email.toLowerCase().includes(inputValue.toLowerCase())
        );
      }}
    />
  );
}
```

The `getOptionValue` function is essential for object values because:
- It enables proper selection comparison without relying on reference equality
- It provides a stable, unique identifier for each option
- It works correctly with controlled and uncontrolled modes

## CSS Customization

Use data attributes to style the combobox component:

```css
/* Style the input wrapper */
[data-ck="combobox-input-wrapper"] {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

/* Style the input */
[data-ck="combobox-input"] {
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
}

/* Style the toggle button */
[data-ck="combobox-trigger"]::after {
  content: "▼";
  transition: transform 0.2s;
}

[data-ck="combobox-trigger"][data-state="open"]::after {
  transform: rotate(180deg);
}

/* Style highlighted items */
[data-ck="combobox-item"][data-highlighted] {
  background: var(--color-highlight);
}

/* Style selected items */
[data-ck="combobox-item"][data-state="checked"]::before {
  content: "✓";
  margin-right: 8px;
}
```
