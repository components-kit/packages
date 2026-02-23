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
| `aria-label` | `string` | - | Accessible label for the combobox input. Required when there is no visible label element. Prefer a visible `<label>` element when possible. |
| `autoFocus` | `boolean` | `false` | Auto-focus the input on mount |
| `clearable` | `boolean` | `false` | Show a clear button when a value is selected |
| `defaultInputValue` | `string` | - | Default input value (uncontrolled) |
| `defaultOpen` | `boolean` | `false` | Whether the dropdown is open by default on mount |
| `defaultValue` | `T` | - | Default value (uncontrolled) |
| `disableFlip` | `boolean` | `false` | Disable auto-flip to the opposite side when the dropdown overflows the viewport |
| `disabled` | `boolean` | `false` | Disables the combobox |
| `emptyContent` | `string` | `"No results found"` | Custom content displayed when no options match the filter |
| `error` | `boolean` | `false` | Whether the combobox has an error (for async search) |
| `errorContent` | `ReactNode` | `"An error occurred"` | Custom content displayed when an error occurs |
| `filterFn` | `(option, inputValue) => boolean` | - | Custom filter function (default: case-insensitive includes) |
| `getOptionValue` | `(option: T) => string \| number` | - | Function to extract a unique primitive key from option values. Required for object values where reference equality won't work. For primitive values, this is not needed. |
| `inputValue` | `string` | - | Controlled input text value |
| `loading` | `boolean` | `false` | Whether the combobox is in a loading state (for async search) |
| `loadingContent` | `ReactNode` | `"Loading..."` | Custom content displayed while loading |
| `maxDropdownHeight` | `number` | - | Maximum height of the dropdown in pixels |
| `name` | `string` | - | Form field name. Renders a hidden input for form submission |
| `onBlur` | `(event: React.FocusEvent) => void` | - | Callback when the input loses focus |
| `onFocus` | `(event: React.FocusEvent) => void` | - | Callback when the input receives focus |
| `onInputValueChange` | `(value: string) => void` | - | Callback when input text changes |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when dropdown opens or closes |
| `onValueChange` | `(value: T \| undefined) => void` | - | Callback when selection changes |
| `openOnFocus` | `boolean` | `true` | Open dropdown when input receives focus |
| `options` | `SelectOption<T>[]` | **required** | Array of options to display |
| `placeholder` | `string` | `"Search..."` | Placeholder text for the input |
| `placement` | `Placement` | `"bottom-start"` | Dropdown placement relative to trigger |
| `readOnly` | `boolean` | `false` | Read-only mode (prevents interaction) |
| `required` | `boolean` | `false` | Required field (adds `aria-required` and `data-required`) |
| `value` | `T` | - | Controlled selected value |
| `variantName` | `VariantFor<"combobox">` | - | Variant name for styling |

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
| `data-ck="combobox-clear"` | Button | - | Clear button to reset selection (when `clearable` is true) |
| `data-ck="combobox-positioner"` | Div (portal) | - | Always-rendered positioning wrapper around dropdown content |
| `data-ck="combobox-content"` | Menu | - | Dropdown menu container |
| `data-ck="combobox-item"` | Item | - | Individual option item |
| `data-slot="icon"` | Div (inside item) | - | Trailing icon slot for CSS-injected indicator (e.g. checkmark) (`aria-hidden`) |
| `data-ck="combobox-separator"` | Div | - | Visual separator between groups |
| `data-ck="combobox-group"` | Div | - | Group container (`role="group"` with `aria-labelledby`) |
| `data-ck="combobox-group-label"` | Div | - | Group heading label (`role="presentation"`) |
| `data-ck="combobox-empty"` | Div | - | Empty state ("No results found") |
| `data-ck="combobox-loading"` | Div | - | Loading state indicator (async mode) |
| `data-ck="combobox-error"` | Div | - | Error state indicator (async mode) |
| `data-ck="combobox-live"` | Div | - | Live region for selection announcements |
| `data-state` | Root, Trigger, Positioner, Content | `"open"`, `"closed"` | Dropdown state (on root, trigger, positioner, and content) |
| `data-side` | Content | `"bottom"`, `"top"`, `"left"`, `"right"` | Current placement side of the dropdown (from Floating UI) |
| `data-unmounted` | Positioner | `true` | Present when the positioner content is unmounted |
| `data-state` | Item | `"checked"`, `"unchecked"` | Whether the item is currently selected |
| `data-disabled` | Root, Item | `true` | Present when disabled (on root and items) |
| `data-highlighted` | Item | `true` | Present on the currently highlighted item |
| `data-variant` | Root | string | Variant name for styling |
| `data-loading` | Root | `true` | Present while loading (async mode) |
| `data-error` | Root | `true` | Present when error (async mode) |
| `data-has-value` | Root | `true` | Present when a value is selected |
| `data-readonly` | Root | `true` | Present when read-only |
| `data-required` | Root | `true` | Present when required |
| `data-empty` | Content | `true` | Present when dropdown has no matching items |
| `data-slot="icon"` | Div | - | Icon slot inside trigger (for CSS-injected icons) |
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
  - `aria-disabled` on disabled items and on the input when disabled
  - `role="group"` with `aria-labelledby` on option groups
  - `role="presentation"` on group labels
  - `role="status"` with `aria-live="polite"` on empty state
  - `role="separator"` on dividers
  - `aria-busy` on root element during loading (async mode)
  - `role="status"` with `aria-live="polite"` on loading indicator (async mode)
  - `role="alert"` with `aria-live="assertive"` on error message (async mode)
  - `aria-required` on input when `required` prop is set
  - `aria-orientation="vertical"` on the listbox menu
  - Live region (`data-ck="combobox-live"`) announces selection changes
  - Live region announces result count while filtering (e.g., "3 results available")
  - Clear button has `aria-label="Clear selection"`
  - `aria-hidden="true"` on icon slots (`data-slot="icon"`)

### Best Practices

#### Labels and Accessible Names

**When no visible label exists**, provide an `aria-label` for accessibility:

```tsx
<Combobox
  aria-label="Search for a city"
  options={cities}
  placeholder="Type to search..."
  variantName="default"
/>
```

**Prefer a visible label** when possible for better usability:

```tsx
<label htmlFor="city-combobox">City</label>
<Combobox
  id="city-combobox"
  options={cities}
  placeholder="Type to search..."
  variantName="default"
/>
```

#### General Best Practices

- Use `filterFn` for custom matching (e.g., fuzzy search)
- Use `getOptionValue` when working with object values
- Use groups and separators to organize large option sets
- Disable options rather than hiding them when possible
- For async/server-side search, control `options`, `loading`, and `error` externally
- Use `name` prop for native form submission without JavaScript
- Use `readOnly` when the user should see but not change the selection

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

## Read-only Mode

```tsx
<Combobox
  options={['apple', 'banana', 'cherry']}
  defaultValue="banana"
  readOnly
/>
```

## Placement

```tsx
<Combobox
  options={['apple', 'banana', 'cherry']}
  placement="top-start"
  placeholder="Opens upward..."
/>
```

## Form Integration

```tsx
<Combobox
  options={['apple', 'banana', 'cherry']}
  name="fruit"
  required
  placeholder="Select a fruit..."
/>
```

## Clearable

```tsx
<Combobox
  clearable
  options={['apple', 'banana', 'cherry']}
  placeholder="Search fruits..."
  variantName="default"
/>
```

## React Hook Form

```tsx
import { Combobox } from "@components-kit/react";
import { Controller, useForm } from "react-hook-form";

interface FormValues {
  city: string;
}

function CityPicker() {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        control={control}
        name="city"
        rules={{ required: "Please select a city" }}
        render={({ field, fieldState }) => (
          <Combobox
            options={["New York", "Los Angeles", "Chicago"]}
            value={field.value}
            onValueChange={field.onChange}
            error={!!fieldState.error}
            placeholder="Search cities..."
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

