# AsyncSelect

An async select component with debounced search, loading states, and error handling, powered by Downshift.

> **Requires:** `npm install downshift`

## Usage

```tsx
import { AsyncSelect } from '@components-kit/react';

// Basic async search
<AsyncSelect
  onSearch={async (query) => {
    const res = await fetch(`/api/users?q=${query}`);
    return res.json();
  }}
  placeholder="Search users..."
  onValueChange={setUser}
/>

// With initial options
<AsyncSelect
  onSearch={searchUsers}
  initialOptions={[
    { value: 'recent1', label: 'Recently Used 1' },
    { value: 'recent2', label: 'Recently Used 2' },
  ]}
  placeholder="Search or pick recent..."
/>

// Custom debounce and min length
<AsyncSelect
  onSearch={searchProducts}
  debounceMs={500}
  minSearchLength={3}
  placeholder="Type at least 3 characters..."
/>

// With caching enabled
<AsyncSelect
  onSearch={searchCities}
  cacheResults
  placeholder="Search cities..."
/>

// Custom loading/empty/error content
<AsyncSelect
  onSearch={searchItems}
  loadingContent={<Spinner />}
  emptyContent={<p>No items match your search.</p>}
  errorContent={<p>Failed to load. Please try again.</p>}
/>

// Controlled value
const [selected, setSelected] = useState('apple');
<AsyncSelect
  onSearch={searchFruits}
  value={selected}
  onValueChange={setSelected}
/>

// Custom item rendering
<AsyncSelect
  onSearch={searchUsers}
  renderItem={({ option, isSelected, isHighlighted }) => (
    <div style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
      {option.label} {isSelected && <Check />}
    </div>
  )}
/>

// Object values with isEqual
<AsyncSelect<User>
  onSearch={async (query) => {
    const users = await fetchUsers(query);
    return users.map(u => ({ value: u, label: u.name }));
  }}
  isEqual={(a, b) => a?.id === b?.id}
  onValueChange={setSelectedUser}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSearch` | `(query: string) => Promise<SelectOption<T>[]>` | **required** | Async search function called with the current query string after debounce |
| `value` | `T` | - | Controlled selected value |
| `defaultValue` | `T` | - | Default value (uncontrolled) |
| `onValueChange` | `(value: T \| undefined) => void` | - | Callback when selection changes |
| `placeholder` | `string` | `"Search..."` | Placeholder text in the input |
| `disabled` | `boolean` | `false` | Whether the async select is disabled |
| `variantName` | `string` | - | Variant name for styling via `data-variant` |
| `isEqual` | `(a: T, b: T) => boolean` | - | Custom equality function for object values |
| `renderItem` | `(context: ItemRenderContext<T>) => ReactNode` | - | Custom item renderer |
| `debounceMs` | `number` | `300` | Debounce delay in milliseconds before triggering search |
| `minSearchLength` | `number` | `1` | Minimum characters required before triggering search |
| `initialOptions` | `SelectOption<T>[]` | - | Pre-loaded options shown before the first search |
| `loadingContent` | `ReactNode` | `"Loading..."` | Custom content displayed while loading |
| `emptyContent` | `ReactNode` | `"No results found"` | Custom content displayed when no results found |
| `errorContent` | `ReactNode` | `"An error occurred"` | Custom content displayed when an error occurs |
| `cacheResults` | `boolean` | `false` | Whether to cache search results by query string |

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
| `data-ck="async-select"` | Root | - | Identifies the root element |
| `data-ck="async-select-input-wrapper"` | Input wrapper | - | Identifies the input wrapper |
| `data-ck="async-select-input"` | Input | - | Identifies the search input |
| `data-ck="async-select-trigger"` | Toggle button | - | Identifies the toggle button |
| `data-ck="async-select-content"` | Menu | - | Identifies the dropdown content |
| `data-ck="async-select-item"` | Option | - | Identifies an option item |
| `data-ck="async-select-loading"` | Loading indicator | - | Identifies the loading state |
| `data-ck="async-select-empty"` | Empty indicator | - | Identifies the empty state |
| `data-ck="async-select-error"` | Error indicator | - | Identifies the error state |
| `data-ck="async-select-separator"` | Separator | - | Identifies a separator |
| `data-ck="async-select-group-label"` | Group label | - | Identifies a group label |
| `data-state` | Root, toggle, menu | `"open"`, `"closed"` | Dropdown open/closed state |
| `data-disabled` | Root, item | `true` | Present when disabled |
| `data-highlighted` | Item | `true` | Present on the highlighted item |
| `data-variant` | Root | string | Variant name for styling |
| `data-loading` | Root | `true` | Present while loading results |
| `data-has-error` | Root | `true` | Present when an error has occurred |
| `data-has-results` | Root | `true` | Present when results are available |

## Accessibility

- Follows WAI-ARIA Combobox pattern with async status communication
- `aria-busy` on root element during loading
- Loading indicator with `role="status"` and `aria-live="polite"` for non-intrusive updates
- Error message with `role="alert"` and `aria-live="assertive"` for immediate announcement
- Empty state with `role="status"` and `aria-live="polite"`
- Standard combobox ARIA attributes (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-selected`)
- Full keyboard navigation:
  - **Arrow Down**: Open menu / move to next item
  - **Arrow Up**: Move to previous item
  - **Enter**: Select highlighted item and close
  - **Escape**: Close menu
  - **Home/End**: Jump to first/last option
  - **Characters**: Trigger debounced search

### Best Practices

- Use `debounceMs` to balance responsiveness and server load (default 300ms)
- Set `minSearchLength` to avoid overly broad queries
- Enable `cacheResults` for repeated searches (e.g., user backspacing)
- Provide meaningful `loadingContent`, `emptyContent`, and `errorContent`
- Use `initialOptions` for common/suggested items before first search
- Use `isEqual` when working with object values
- Provide a descriptive `aria-label` if no visible label is present
