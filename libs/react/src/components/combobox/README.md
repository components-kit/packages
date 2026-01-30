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

// Custom rendering
<Combobox
  options={options}
  renderTrigger={({ inputValue, isOpen, placeholder }) => (
    <div>
      <input value={inputValue} placeholder={placeholder} />
      <ChevronDown />
    </div>
  )}
  renderItem={({ option, isSelected, isHighlighted }) => (
    <div style={{ fontWeight: isHighlighted ? 'bold' : 'normal' }}>
      {option.label} {isSelected && <Check />}
    </div>
  )}
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
| `isEqual` | `(a: T, b: T) => boolean` | - | Custom equality function for object values |
| `filterFn` | `(option, inputValue) => boolean` | - | Custom filter function (default: case-insensitive includes) |
| `renderTrigger` | `(context) => ReactNode` | - | Custom trigger renderer |
| `renderItem` | `(context) => ReactNode` | - | Custom item renderer |

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
- Use `isEqual` when working with object values
- Use groups and separators to organize large option sets
- Consider custom `renderItem` for rich option display
- Disable options rather than hiding them when possible
