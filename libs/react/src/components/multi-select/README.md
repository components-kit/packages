# MultiSelect

A multi-select component with tag chips, type-ahead filtering, and keyboard navigation, powered by Downshift. Selected items remain visible in the dropdown with checked/unchecked state — click to toggle selection.

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

// Clearable with clear-all button
<MultiSelect
  options={['React', 'Vue', 'Angular', 'Svelte']}
  clearable
  onValueChange={setFrameworks}
/>

// Fixed non-removable tags
<MultiSelect
  options={['React', 'Vue', 'Angular', 'Svelte']}
  clearable
  fixedValues={['React']}
  defaultValue={['React', 'Vue']}
/>

// Token separators (paste comma-separated values)
<MultiSelect
  options={['React', 'Vue', 'Angular', 'Svelte']}
  tokenSeparators={[',', ';']}
  placeholder="Type or paste comma-separated..."
/>

// Read-only mode
<MultiSelect
  options={['React', 'Vue', 'Angular']}
  value={['React', 'Vue']}
  readOnly
/>

// Error state
<MultiSelect
  options={['React', 'Vue', 'Angular']}
  error
  placeholder="Invalid selection..."
/>

// Custom placement (opens upward)
<MultiSelect
  options={['React', 'Vue', 'Angular']}
  placement="top-start"
  placeholder="Opens upward..."
/>

// Tag overflow with "+N more"
<MultiSelect
  options={['React', 'Vue', 'Angular', 'Svelte', 'Solid']}
  maxDisplayedTags={2}
  defaultValue={['React', 'Vue', 'Angular', 'Svelte']}
/>

// Form integration (hidden inputs)
<form>
  <MultiSelect
    options={['React', 'Vue', 'Angular']}
    name="frameworks"
    required
  />
</form>
```

## Props

| Prop             | Type                              | Default       | Description                                                                                                                                                              |
| ---------------- | --------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `aria-label`     | `string`                          | -             | Accessible label for the multi-select input. Required when there is no visible label element. Prefer a visible `<label>` element when possible.                          |
| `autoFocus`      | `boolean`                         | `false`       | Auto-focus the input on mount                                                                                                                                            |
| `onBlur`         | `(event: React.FocusEvent) => void` | -          | Callback when the input loses focus                                                                                                                                      |
| `onFocus`        | `(event: React.FocusEvent) => void` | -          | Callback when the input receives focus                                                                                                                                   |
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
| `clearable`      | `boolean`                         | `false`       | Show a clear-all button when items are selected                                                                                                                          |
| `emptyContent`   | `string`                          | `"No results found"` | Text displayed when no options match the filter                                                                                                                    |
| `error`          | `boolean`                         | `false`       | Marks the multi-select as invalid (adds `data-error`)                                                                                                                    |
| `fixedValues`    | `T[]`                             | -             | Values that cannot be removed (tags rendered without remove button)                                                                                                      |
| `maxDisplayedTags` | `number`                        | -             | Maximum tags to display before showing "+N more"                                                                                                                         |
| `maxDropdownHeight` | `number`                       | -             | Maximum dropdown height in pixels (caps available viewport space)                                                                                                        |
| `maxReachedContent` | `string`                       | `"Maximum selections reached"` | Text displayed when maximum selections reached                                                                                                          |
| `name`           | `string`                          | -             | Form field name. When set, renders hidden inputs for native form submission                                                                                              |
| `onOpenChange`   | `(open: boolean) => void`         | -             | Callback when the dropdown opens or closes                                                                                                                               |
| `openOnFocus`    | `boolean`                         | `true`        | Open the dropdown when the input receives focus                                                                                                                          |
| `placement`      | `Placement`                       | `"bottom-start"` | Dropdown placement relative to trigger ([Floating UI values](https://floating-ui.com/docs/computePosition#placement))                                                 |
| `readOnly`       | `boolean`                         | `false`       | Read-only mode — visually normal but prevents interaction                                                                                                                |
| `required`       | `boolean`                         | `false`       | Marks the multi-select as required (`aria-required` + `data-required`)                                                                                                   |
| `tokenSeparators` | `string[]`                       | -             | Characters that trigger token creation on type/paste (e.g., `[",", ";"]`)                                                                                                |
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

## React Hook Form

Use `Controller` to integrate with [React Hook Form](https://react-hook-form.com/). The `value`/`onValueChange` props map directly to RHF's `field.value`/`field.onChange`, and the `error` prop maps to `fieldState.error`:

```tsx
import { MultiSelect } from "@components-kit/react";
import { Controller, useForm } from "react-hook-form";

interface FormValues {
  frameworks: string[];
}

function MultiSelectForm() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { frameworks: [] },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        control={control}
        name="frameworks"
        rules={{ validate: (v) => v.length > 0 || "Select at least one" }}
        render={({ field, fieldState }) => (
          <MultiSelect
            options={["React", "Vue", "Angular", "Svelte"]}
            value={field.value}
            onValueChange={field.onChange}
            error={!!fieldState.error}
            placeholder="Select frameworks..."
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Data Attributes

| Attribute                              | Element                | Values               | Description                                 |
| -------------------------------------- | ---------------------- | -------------------- | ------------------------------------------- |
| `data-ck="multi-select"`               | Root                   | -                    | Identifies the root container               |
| `data-ck="multi-select-input-wrapper"` | Wrapper                | -                    | Outer container for the input area          |
| `data-ck="multi-select-tags"`          | Div                    | -                    | Wraps tags, overflow badge, and input (flex-wrapping area, sibling to action buttons) |
| `data-ck="multi-select-tag"`           | Tag                    | -                    | Individual selected tag chip                |
| `data-ck="multi-select-tag-remove"`    | Button                 | -                    | Remove button inside a tag                  |
| `data-ck="multi-select-input"`         | Input                  | -                    | Text input for filtering                    |
| `data-ck="multi-select-trigger"`       | Button                 | -                    | Toggle button for dropdown                  |
| `data-ck="multi-select-content"`       | Menu                   | -                    | Dropdown menu container                     |
| `data-ck="multi-select-item"`          | Item                   | -                    | Individual dropdown item                    |
| `data-slot="icon"`                     | Div (inside item)      | -                    | Trailing icon slot for CSS-injected indicator (`aria-hidden`) |
| `data-ck="multi-select-empty"`         | Div                    | -                    | Empty state / max-reached message           |
| `data-ck="multi-select-separator"`     | Div                    | -                    | Visual separator between groups             |
| `data-ck="multi-select-group"`         | Div                    | -                    | Group container (`role="group"` with `aria-labelledby`) |
| `data-ck="multi-select-group-label"`   | Div                    | -                    | Group label heading (`role="presentation"`) |
| `data-ck="multi-select-clear"`         | Button                 | -                    | Clear-all button (when `clearable` is true) |
| `data-ck="multi-select-live"`          | Div                    | -                    | Live region for screen reader announcements (must be styled sr-only) |
| `data-ck="multi-select-tag-overflow"`  | Span                   | -                    | "+N more" overflow indicator (`aria-label` describes hidden count) |
| `data-state`                           | Root, Trigger, Content | `"open"`, `"closed"` | Dropdown open/close state                   |
| `data-side`                            | Content                | `"bottom"`, `"top"`, `"left"`, `"right"` | Current placement side of the dropdown (from Floating UI) |
| `data-state`                           | Item                   | `"checked"`, `"unchecked"` | Whether the item is currently selected |
| `data-active`                          | Tag                    | `true`               | Present on the currently focused tag        |
| `data-disabled`                        | Root, Item             | `true`               | Present when disabled                       |
| `data-empty`                           | Content                | `true`               | Present on menu when no options are visible |
| `data-error`                           | Root                   | `true`               | Present when `error` prop is true           |
| `data-fixed`                           | Tag                    | `true`               | Present on tags that cannot be removed      |
| `data-has-value`                       | Root                   | `true`               | Present when at least one item is selected  |
| `data-highlighted`                     | Item                   | `true`               | Present on keyboard-highlighted item        |
| `data-max-reached`                     | Root                   | `true`               | Present when `maxSelected` limit is reached |
| `data-readonly`                        | Root                   | `true`               | Present when `readOnly` prop is true        |
| `data-required`                        | Root                   | `true`               | Present when `required` prop is true        |
| `data-variant`                         | Root                   | string               | Variant name for styling                    |

## Accessibility

Follows WAI-ARIA Combobox pattern with multiselectable Listbox.

### Keyboard Support

| Key            | Context           | Action                                   |
| -------------- | ----------------- | ---------------------------------------- |
| `ArrowDown`    | Input             | Open menu / move to next item            |
| `ArrowUp`      | Input             | Move to previous item                    |
| `Enter`        | Item highlighted  | Toggle item selection, keep menu open, clear input |
| `Escape`       | Menu open         | Close menu                               |
| `Home` / `End` | Menu open         | Jump to first / last item                |
| `Backspace`    | Input empty       | Remove last selected tag                 |
| `ArrowLeft`    | Input, caret at 0 | Focus last tag                           |
| `ArrowRight`   | Tag focused       | Focus next tag or return to input        |
| `ArrowLeft`    | Tag focused       | Focus previous tag                       |
| Characters     | Input             | Filter options by typing                 |

- ARIA attributes:
  - `role="combobox"` on the input element
  - `role="listbox"` with `aria-multiselectable="true"` on the dropdown menu
  - `aria-labelledby` on the menu linking to the input
  - `role="option"` with `aria-selected` on items
  - `aria-expanded` toggles with menu open/closed state
  - `aria-controls` links input to listbox
  - `aria-disabled` on disabled items and on the input when disabled
  - `aria-required` on input when `required` prop is set
  - `aria-orientation="vertical"` on the listbox menu
  - `role="group"` with `aria-labelledby` on option groups
  - `role="presentation"` on group labels
  - `role="separator"` on dividers
  - `role="status"` with `aria-live="polite"` on empty and max-reached state messages
  - Live region (`data-ck="multi-select-live"`) announces selection changes
  - Live region announces result count while filtering (e.g., "3 results available")
  - Live region announces selection/deselection changes with total count
  - Tags have `aria-label="{label}, selected"` for screen readers
  - Tag remove buttons have `aria-label="Remove {label}"`
  - Clear button has `aria-label="Clear all selections"`
  - Roving tabindex on tags for keyboard navigation
  - Overflow badge has descriptive `aria-label` for screen readers
  - `aria-hidden="true"` on icon slots (`data-slot="icon"`)

### Best Practices

#### Labels and Accessible Names

**When no visible label exists**, provide an `aria-label` for accessibility:

```tsx
<MultiSelect
  aria-label="Select team members"
  options={teamMembers}
  placeholder="Choose members..."
  variantName="default"
/>
```

**Prefer a visible label** when possible for better usability:

```tsx
<label htmlFor="team-select">Team Members</label>
<MultiSelect
  id="team-select"
  options={teamMembers}
  placeholder="Choose members..."
  variantName="default"
/>
```

#### General Best Practices

- Set `maxSelected` to prevent overwhelming selections
- Use `getOptionValue` when working with object values
- Consider providing visible count of selections
- Use groups and separators to organize related options
- Disable options rather than hiding them when possible
- Use `onBlur` for form validation and touched-state tracking
- Use `autoFocus` in modals or focused workflows where immediate interaction is expected
