# Combobox

A searchable select component with type-ahead filtering, keyboard navigation, and async/server-side search support, powered by Downshift.

> **Requires:** `npm install downshift @floating-ui/react`

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

## Async / Server-Side Search

Combobox supports async search via controlled `options`, `loading`, and `error` props. You manage fetch logic externally; Combobox renders the appropriate UI states.

```tsx
import { Combobox } from '@components-kit/react';
import { useCallback, useRef, useState } from 'react';

function AsyncSearch() {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) { setOptions([]); return; }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/search?q=${query}`);
      setOptions(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Combobox
      options={options}
      loading={loading}
      error={error}
      onInputValueChange={handleSearch}
      placeholder="Search..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
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
| `emptyContent` | `ReactNode` | `"No results found"` | Custom content displayed when no options match the filter |
| `loading` | `boolean` | `false` | Whether the combobox is in a loading state (for async search) |
| `loadingContent` | `ReactNode` | `"Loading..."` | Custom content displayed while loading |
| `error` | `boolean` | `false` | Whether the combobox has an error (for async search) |
| `errorContent` | `ReactNode` | `"An error occurred"` | Custom content displayed when an error occurs |

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
| --- | --- | --- | --- |
| `data-ck="combobox"` | Root | - | Root combobox container |
| `data-ck="combobox-input-wrapper"` | Wrapper | - | Wrapper around input and toggle button |
| `data-ck="combobox-input"` | Input | - | Text input element |
| `data-ck="combobox-trigger"` | Button | - | Toggle button to open/close menu |
| `data-ck="combobox-content"` | Menu | - | Dropdown menu container |
| `data-ck="combobox-item"` | Item | - | Individual option item |
| `data-ck="combobox-separator"` | Div | - | Visual separator between groups |
| `data-ck="combobox-group"` | Div | - | Group container (`role="group"` with `aria-labelledby`) |
| `data-ck="combobox-group-label"` | Div | - | Group heading label (`role="presentation"`) |
| `data-ck="combobox-empty"` | Div | - | Empty state ("No results found") |
| `data-ck="combobox-loading"` | Div | - | Loading state indicator (async mode) |
| `data-ck="combobox-error"` | Div | - | Error state indicator (async mode) |
| `data-state` | Root, Trigger, Content | `"open"`, `"closed"` | Dropdown state (on root, trigger, and content) |
| `data-disabled` | Root, Item | `true` | Present when disabled (on root and items) |
| `data-highlighted` | Item | `true` | Present on the currently highlighted item |
| `data-variant` | Root | string | Variant name for styling |
| `data-loading` | Root | `true` | Present while loading (async mode) |
| `data-has-error` | Root | `true` | Present when error (async mode) |
| `aria-busy` | Root | `true` | Present while loading (a11y, async mode) |

## Accessibility

Follows WAI-ARIA Combobox Pattern with Listbox Popup.

### Keyboard Support

| Key | Action |
| --- | --- |
| `ArrowDown` | Open menu / move to next item |
| `ArrowUp` | Move to previous item |
| `Enter` | Select highlighted item and close |
| `Escape` | Close menu |
| `Home` | Jump to first item |
| `End` | Jump to last item |
| Characters | Filter options by typing |

- ARIA attributes:
  - `role="combobox"` on the input element
  - `role="listbox"` with `aria-labelledby` on the dropdown menu
  - `role="option"` with `aria-selected` on items
  - `aria-expanded` toggles with menu open/closed state
  - `aria-controls` links input to listbox
  - `aria-disabled` on disabled items
  - `role="group"` with `aria-labelledby` on option groups
  - `role="status"` on empty state for screen reader announcement
  - `role="separator"` on dividers
  - `aria-busy` on root element during loading (async mode)
  - `role="status"` with `aria-live="polite"` on loading indicator (async mode)
  - `role="alert"` with `aria-live="assertive"` on error message (async mode)

### Best Practices

- Provide a descriptive `aria-label` if no visible label
- Use `filterFn` for custom matching (e.g., fuzzy search)
- Use `getOptionValue` when working with object values
- Use groups and separators to organize large option sets
- Disable options rather than hiding them when possible
- For async/server-side search, control `options`, `loading`, and `error` externally

## Object Values

When working with object values, use `getOptionValue` to extract a unique primitive key for proper selection comparison:

```tsx
import { Combobox } from "@components-kit/react";

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Carol Williams", email: "carol@example.com" },
];

function UserPicker() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  return (
    <Combobox
      options={users.map((user) => ({
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

/* Style loading state */
[data-ck="combobox-loading"] {
  padding: 8px;
  color: var(--color-muted);
}

/* Style error state */
[data-ck="combobox-error"] {
  padding: 8px;
  color: var(--color-error);
}
```
