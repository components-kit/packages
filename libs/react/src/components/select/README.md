# Select

A dropdown select component with keyboard navigation, powered by Downshift.

> **Requires:** `npm install downshift`

## Usage

```tsx
import { Select } from '@components-kit/react';

// Simple string options
<Select
  options={['apple', 'banana', 'cherry']}
  placeholder="Select a fruit..."
  onValueChange={setFruit}
/>

// Labeled options with disabled items
<Select
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
  ]}
  variantName="default"
/>

// Grouped options
<Select
  options={[
    { type: 'group', label: 'Fruits', options: ['apple', 'banana'] },
    { type: 'separator' },
    { type: 'group', label: 'Vegetables', options: ['carrot', 'celery'] },
  ]}
/>
```

## Props

| Prop             | Type                              | Default       | Description                                                                                                                                                              |
| ---------------- | --------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`        | `SelectOption<T>[]`               | **required**  | Array of options to display                                                                                                                                              |
| `value`          | `T`                               | -             | Controlled value                                                                                                                                                         |
| `defaultValue`   | `T`                               | -             | Default value (uncontrolled)                                                                                                                                             |
| `onValueChange`  | `(value: T \| undefined) => void` | -             | Callback when selection changes                                                                                                                                          |
| `placeholder`    | `string`                          | `"Select..."` | Placeholder text                                                                                                                                                         |
| `disabled`       | `boolean`                         | `false`       | Disables the select                                                                                                                                                      |
| `variantName`    | `string`                          | -             | Variant name for styling                                                                                                                                                 |
| `getOptionValue` | `(option: T) => string \| number` | -             | Function to extract a unique primitive key from option values. Required for object values where reference equality won't work. For primitive values, this is not needed. |

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

When using object values, provide a `getOptionValue` function to extract a unique primitive key:

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

<Select<User>
  options={users.map((u) => ({ value: u, label: u.name }))}
  getOptionValue={(user) => user.id}
  onValueChange={setSelectedUser}
  placeholder="Select a user..."
/>;
```

The `getOptionValue` function is required for object values because React uses reference equality by default, which won't work when options are recreated. By extracting a unique primitive key (like an `id`), the component can correctly identify which option is selected even when the object references change.

## Data Attributes

| Attribute          | Values               | Description                 |
| ------------------ | -------------------- | --------------------------- |
| `data-variant`     | string               | Variant name for styling    |
| `data-state`       | `"open"`, `"closed"` | Dropdown state              |
| `data-disabled`    | `true`               | Present when disabled       |
| `data-component`   | string               | Identifies sub-components   |
| `data-highlighted` | `true`               | Present on highlighted item |

## CSS Customization

Use data attributes to style the select component:

```css
/* Add chevron to trigger */
[data-ck="select-trigger"]::after {
  content: "▼";
  margin-left: 8px;
  transition: transform 0.2s;
}

[data-ck="select-trigger"][data-state="open"]::after {
  transform: rotate(180deg);
}

/* Add checkmark to selected items */
[data-ck="select-item"][data-state="checked"]::before {
  content: "✓";
  margin-right: 8px;
  color: var(--color-primary);
}

/* Style highlighted items */
[data-ck="select-item"][data-highlighted] {
  background: var(--color-highlight);
}

/* Style disabled items */
[data-ck="select-item"][data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Accessibility

- Follows WAI-ARIA Listbox pattern
- Full keyboard navigation:
  - **Arrow Up/Down**: Navigate options
  - **Enter/Space**: Select option
  - **Escape**: Close dropdown
  - **Home/End**: Jump to first/last option
- Type-ahead character search
- Proper ARIA attributes for screen readers

### Best Practices

- Provide a descriptive `aria-label` if no visible label
- Use groups to organize related options
- Consider using separators for visual grouping
- Disable options rather than hiding them when possible
