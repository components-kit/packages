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

// Custom rendering
<Select
  options={options}
  renderTrigger={({ selectedItem, placeholder }) => (
    <span>{selectedItem?.label || placeholder} <ChevronDown /></span>
  )}
  renderItem={({ option, isSelected }) => (
    <div>{option.label} {isSelected && <Check />}</div>
  )}
/>

// Object values with custom equality
<Select<User>
  options={users.map(u => ({ value: u, label: u.name }))}
  isEqual={(a, b) => a?.id === b?.id}
  onValueChange={setSelectedUser}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption<T>[]` | **required** | Array of options to display |
| `value` | `T` | - | Controlled value |
| `defaultValue` | `T` | - | Default value (uncontrolled) |
| `onValueChange` | `(value: T \| undefined) => void` | - | Callback when selection changes |
| `placeholder` | `string` | `"Select..."` | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the select |
| `variantName` | `string` | - | Variant name for styling |
| `isEqual` | `(a: T, b: T) => boolean` | - | Custom equality function for object values |
| `renderTrigger` | `(context) => ReactNode` | - | Custom trigger renderer |
| `renderItem` | `(context) => ReactNode` | - | Custom item renderer |

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
| `data-variant` | string | Variant name for styling |
| `data-state` | `"open"`, `"closed"` | Dropdown state |
| `data-disabled` | `true` | Present when disabled |
| `data-component` | string | Identifies sub-components |
| `data-highlighted` | `true` | Present on highlighted item |

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
