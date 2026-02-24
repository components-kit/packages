# Input

A text input component for single-line user input with support for various input types.

## Usage

```tsx
import { useState } from 'react';
import { Input } from '@components-kit/react';

// Basic text input with label
<label htmlFor="name">Name</label>
<Input id="name" placeholder="Enter your name" variantName="default" />

// Email input
<label htmlFor="email">Email</label>
<Input
  id="email"
  type="email"
  placeholder="you@example.com"
  variantName="default"
/>

// Controlled input
function SearchField() {
  const [value, setValue] = useState('');

  return (
    <Input
      aria-label="Search"
      inputMode="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search components..."
      variantName="default"
    />
  );
}

// With validation error
<label htmlFor="email">Email</label>
<Input
  id="email"
  aria-describedby="email-error"
  aria-invalid="true"
  type="email"
  variantName="error"
/>
<span id="email-error">Please enter a valid email</span>

// Number input with constraints
<label htmlFor="quantity">Quantity</label>
<Input
  id="quantity"
  type="number"
  min="1"
  max="100"
  step="1"
  variantName="default"
/>

// Form integration
<form onSubmit={(e) => e.preventDefault()}>
  <label htmlFor="username">Username</label>
  <Input
    id="username"
    name="username"
    autoComplete="username"
    required
    variantName="default"
  />
</form>
```

## Props

| Prop          | Type                  | Default  | Description                                      |
| ------------- | --------------------- | -------- | ------------------------------------------------ |
| `type`        | `string`              | `"text"` | Input type (text, email, password, number, etc.) |
| `variantName` | `VariantFor<"input">` | -        | Variant name for styling                         |

Also accepts all standard `input` HTML attributes.

## Data Attributes

| Attribute      | Values | Description                  |
| -------------- | ------ | ---------------------------- |
| `data-variant` | string | The variant name for styling |

## Accessibility

- Always associate with a `<label>` using `id` and `htmlFor`
- Use `aria-describedby` to link to helper text or error messages
- Use `aria-invalid="true"` to indicate validation errors
- Use `aria-required="true"` or native `required` for required fields
- Ensure sufficient color contrast for text and borders

### Best Practices

- Always provide a visible label or `aria-label`
- Use placeholder as a hint, not a label replacement
- Use appropriate input type for the data (email, tel, url, etc.)
- Consider using `autocomplete` for common fields
- Use `inputMode` for mobile keyboard optimization
