# Textarea

A multi-line text input component with automatic height adjustment.

## Usage

```tsx
import { useState } from 'react';
import { Textarea } from '@components-kit/react';

// Basic textarea with label
<label htmlFor="message">Message</label>
<Textarea
  id="message"
  placeholder="Enter your message"
  variantName="default"
/>

// With minimum rows
<Textarea
  rows={3}
  placeholder="Write your bio..."
  variantName="default"
/>

// Controlled textarea with live character count
function BioField() {
  const [value, setValue] = useState('');

  return (
    <>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={500}
        aria-describedby="bio-count"
        placeholder="Write your bio..."
        variantName="default"
      />
      <span id="bio-count">{value.length}/500 characters</span>
    </>
  );
}

// With validation error
<Textarea
  aria-invalid="true"
  aria-describedby="error-message"
  variantName="error"
/>
<span id="error-message">This field is required</span>

// Disabled state
<Textarea
  disabled
  value="This content cannot be edited"
  variantName="default"
/>

// Form integration
<form onSubmit={(e) => e.preventDefault()}>
  <label htmlFor="feedback">Feedback</label>
  <Textarea
    id="feedback"
    name="feedback"
    required
    minLength={10}
    placeholder="Tell us what we can improve"
    variantName="default"
  />
</form>
```

## Props

| Prop          | Type                     | Default | Description              |
| ------------- | ------------------------ | ------- | ------------------------ |
| `variantName` | `VariantFor<"textarea">` | -       | Variant name for styling |

Also accepts all standard `textarea` HTML attributes.

## Features

### Auto-Resize

The textarea automatically adjusts its height as content grows:

- Height adjusts to fit content on every input
- Initial height set on mount and when value changes
- Minimum height controlled by `rows` prop

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

### Form Example

```tsx
<form>
  <div>
    <label htmlFor="feedback">Your Feedback</label>
    <Textarea
      id="feedback"
      name="feedback"
      required
      aria-required="true"
      aria-describedby="feedback-hint"
      placeholder="Tell us what you think..."
      variantName="default"
    />
    <span id="feedback-hint">
      Please provide detailed feedback (minimum 10 characters)
    </span>
  </div>
</form>
```

### Best Practices

- Always provide a visible label or `aria-label`
- Use placeholder as a hint, not a label replacement
- Provide character count feedback for `maxLength` constraints
- Use `rows` to hint at expected content length
- Consider disabling manual resize when auto-resize is sufficient
