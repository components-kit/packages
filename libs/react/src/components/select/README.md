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

// Custom placement (opens upward)
<Select
  options={['apple', 'banana', 'cherry']}
  placement="top-start"
  placeholder="Opens upward..."
/>
```

## Props

| Prop             | Type                              | Default          | Description                                                                                                                                                              |
| ---------------- | --------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `aria-label`     | `string`                          | -                | Accessible label for the trigger button. Required when there is no visible label element. Prefer a visible `<label>` element when possible.                              |
| `autoFocus`      | `boolean`                         | `false`          | Auto-focus the trigger on mount                                                                                                                                          |
| `options`        | `SelectOption<T>[]`               | **required**     | Array of options to display                                                                                                                                              |
| `placement`      | `Placement`                       | `"bottom-start"` | Dropdown placement relative to trigger ([Floating UI values](https://floating-ui.com/docs/computePosition#placement))                                                    |
| `value`          | `T`                               | -                | Controlled value                                                                                                                                                         |
| `defaultValue`   | `T`                               | -                | Default value (uncontrolled)                                                                                                                                             |
| `onValueChange`  | `(value: T \| undefined) => void` | -                | Callback when selection changes                                                                                                                                          |
| `placeholder`    | `string`                          | `"Select..."`    | Placeholder text                                                                                                                                                         |
| `disabled`       | `boolean`                         | `false`          | Disables the select                                                                                                                                                      |
| `emptyContent`   | `string`                          | `"No options"`   | Text displayed when there are no options                                                                                                                                 |
| `error`          | `boolean`                         | `false`          | Marks the select as invalid (adds `data-error`)                                                                                                                          |
| `maxDropdownHeight` | `number`                       | -                | Maximum dropdown height in pixels (caps available viewport space)                                                                                                        |
| `name`           | `string`                          | -                | Form field name. When set, renders a hidden input for native form submission                                                                                             |
| `onOpenChange`   | `(open: boolean) => void`         | -                | Callback when the dropdown opens or closes                                                                                                                               |
| `openOnFocus`    | `boolean`                         | `true`           | Open the dropdown when the trigger receives focus                                                                                                                        |
| `readOnly`       | `boolean`                         | `false`          | Read-only mode — visually normal but prevents interaction                                                                                                                |
| `required`       | `boolean`                         | `false`          | Marks the select as required (`aria-required` + `data-required`)                                                                                                         |
| `variantName`    | `VariantFor<"select">`            | -                | Variant name for styling                                                                                                                                                 |
| `getOptionValue` | `(option: T) => string \| number` | -                | Function to extract a unique primitive key from option values. Required for object values where reference equality won't work. For primitive values, this is not needed. |

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

## React Hook Form

Use `Controller` to integrate with [React Hook Form](https://react-hook-form.com/). The `value`/`onValueChange` props map directly to RHF's `field.value`/`field.onChange`, and the `error` prop maps to `fieldState.error`:

```tsx
import { Select } from "@components-kit/react";
import { Controller, useForm } from "react-hook-form";

interface FormValues {
  fruit: string;
}

function SelectForm() {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        control={control}
        name="fruit"
        rules={{ required: "Please select a fruit" }}
        render={({ field, fieldState }) => (
          <Select
            options={["Apple", "Banana", "Cherry"]}
            value={field.value}
            onValueChange={field.onChange}
            error={!!fieldState.error}
            placeholder="Select a fruit..."
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Data Attributes

| Attribute                      | Element                      | Values                                           | Description                                                          |
| ------------------------------ | ---------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `data-ck="select"`             | Root                         | -                                                | Component identifier                                                 |
| `data-ck="select-trigger"`     | Button                       | -                                                | Trigger button                                                       |
| `data-ck="select-value"`       | Span                         | -                                                | Value display area                                                   |
| `data-slot="icon"`             | Div (inside trigger)         | -                                                | Icon slot for CSS-injected chevron indicator (`aria-hidden`)         |
| `data-ck="select-content"`     | Menu                         | -                                                | Dropdown menu container                                              |
| `data-ck="select-item"`        | Item                         | -                                                | Individual option item                                               |
| `data-slot="icon"`             | Div (inside item)            | -                                                | Trailing icon slot for CSS-injected indicator (e.g. checkmark) (`aria-hidden`) |
| `data-ck="select-separator"`   | Div                          | -                                                | Visual separator between groups                                      |
| `data-ck="select-group"`       | Div                          | -                                                | Group container (`role="group"` with `aria-labelledby`)              |
| `data-ck="select-group-label"` | Div                          | -                                                | Group heading label (`role="presentation"`)                          |
| `data-ck="select-live"`        | Div                          | -                                                | Live region for screen reader announcements (must be styled sr-only) |
| `data-ck="select-empty"`       | Div                          | -                                                | Empty state message when no options available                        |
| `data-state`                   | Root, Trigger, Content, Item | `"open"`, `"closed"`, `"checked"`, `"unchecked"` | Open/close state on root/trigger/content; checked/unchecked on items |
| `data-side`                    | Content                      | `"bottom"`, `"top"`, `"left"`, `"right"`         | Current placement side of the dropdown (from Floating UI)            |
| `data-disabled`                | Root, Item                   | `true`                                           | Present when disabled                                                |
| `data-empty`                   | Content                      | `true`                                           | Present on menu when no options are visible                          |
| `data-error`                   | Root                         | `true`                                           | Present when `error` prop is true                                    |
| `data-has-value`               | Root                         | `true`                                           | Present when an item is selected                                     |
| `data-highlighted`             | Item                         | `true`                                           | Present on the currently highlighted item                            |
| `data-placeholder`             | Value                        | `""`                                             | Present when showing placeholder text                                |
| `data-readonly`                | Root                         | `true`                                           | Present when `readOnly` prop is true                                 |
| `data-required`                | Root                         | `true`                                           | Present when `required` prop is true                                 |
| `data-variant`                 | Root                         | string                                           | Variant name for styling                                             |

## Accessibility

Follows WAI-ARIA Listbox Pattern.

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

- ARIA attributes:
  - `role="listbox"` with `aria-labelledby` on the dropdown menu
  - `role="option"` with `aria-selected` on items
  - `aria-haspopup="listbox"` on the trigger button
  - `aria-expanded` toggles with menu open/closed state
  - `aria-controls` links trigger to listbox
  - `aria-disabled` on disabled items
  - `aria-label` on the trigger when provided via prop
  - `aria-required` on the trigger when `required` prop is set
  - `aria-orientation="vertical"` on the listbox menu
  - `role="group"` with `aria-labelledby` on option groups
  - `role="presentation"` on group labels
  - `role="separator"` with `aria-orientation="horizontal"` on dividers
  - `role="status"` with `aria-live="polite"` on empty state
  - Live region (`data-ck="select-live"`) announces selection changes
  - `aria-hidden="true"` on icon slots (`data-slot="icon"`)

### Best Practices

#### Labels and Accessible Names

**When no visible label exists**, provide an `aria-label` for accessibility:

```tsx
<Select
  aria-label="Choose your country"
  options={countries}
  placeholder="Select..."
  variantName="default"
/>
```

**Prefer a visible label** when possible for better usability:

```tsx
<label htmlFor="country-select">Country</label>
<Select
  id="country-select"
  options={countries}
  placeholder="Select..."
  variantName="default"
/>
```

#### General Best Practices

- Use groups to organize related options
- Consider using separators for visual grouping
- Disable options rather than hiding them when possible
- Use `getOptionValue` when working with object values
