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

| Prop             | Type                              | Default        | Description                                                                                                                                                              |
| ---------------- | --------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`        | `SelectOption<T>[]`               | **required**   | Array of options to display                                                                                                                                              |
| `value`          | `T`                               | -              | Controlled value                                                                                                                                                         |
| `defaultValue`   | `T`                               | -              | Default value (uncontrolled)                                                                                                                                             |
| `onValueChange`  | `(value: T \| undefined) => void` | -              | Callback when selection changes                                                                                                                                          |
| `placeholder`    | `string`                          | `"Select..."`  | Placeholder text                                                                                                                                                         |
| `disabled`       | `boolean`                         | `false`        | Disables the select                                                                                                                                                      |
| `emptyContent`   | `ReactNode`                       | `"No options"` | Custom content displayed when there are no options                                                                                                                       |
| `variantName`    | `string`                          | -              | Variant name for styling                                                                                                                                                 |
| `getOptionValue` | `(option: T) => string \| number` | -              | Function to extract a unique primitive key from option values. Required for object values where reference equality won't work. For primitive values, this is not needed. |

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

| Attribute                      | Element                      | Values                                           | Description                                                          |
| ------------------------------ | ---------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `data-ck="select"`             | Root                         | -                                                | Component identifier                                                 |
| `data-ck="select-trigger"`     | Button                       | -                                                | Trigger button                                                       |
| `data-ck="select-value"`       | Span                         | -                                                | Value display area                                                   |
| `data-ck="select-content"`     | Menu                         | -                                                | Dropdown menu container                                              |
| `data-ck="select-item"`        | Item                         | -                                                | Individual option item                                               |
| `data-ck="select-separator"`   | Div                          | -                                                | Visual separator between groups                                      |
| `data-ck="select-group-label"` | Div                          | -                                                | Group heading label                                                  |
| `data-ck="select-empty"`       | Div                          | -                                                | Empty state message                                                  |
| `data-state`                   | Root, Trigger, Content, Item | `"open"`, `"closed"`, `"checked"`, `"unchecked"` | Open/close state on root/trigger/content; checked/unchecked on items |
| `data-disabled`                | Root, Item                   | `true`                                           | Present when disabled                                                |
| `data-highlighted`             | Item                         | `true`                                           | Present on the currently highlighted item                            |
| `data-variant`                 | Root                         | string                                           | Variant name for styling                                             |
| `data-placeholder`             | Value                        | `""`                                             | Present when showing placeholder text                                |

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
- Trigger has `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`
- Menu has `role="listbox"` with `aria-labelledby` linking to the trigger
- Items have `role="option"` with `aria-selected` and `aria-disabled`
- Empty state uses `role="status"` with `aria-live="polite"`
- Separators use `role="separator"` with `aria-orientation="horizontal"`

### Keyboard Support

| Key         | Action                              |
| ----------- | ----------------------------------- |
| `ArrowDown` | Open menu / move to next item       |
| `ArrowUp`   | Move to previous item               |
| `Enter`     | Select highlighted item and close   |
| `Space`     | Open menu / select highlighted item |
| `Escape`    | Close menu                          |
| `Home`      | Jump to first item                  |
| `End`       | Jump to last item                   |
| Characters  | Type-ahead search by character      |

### Best Practices

- Provide a descriptive `aria-label` if no visible label
- Use groups to organize related options
- Consider using separators for visual grouping
- Disable options rather than hiding them when possible
- Provide custom `emptyContent` for a better user experience
- Use `getOptionValue` when working with object values
