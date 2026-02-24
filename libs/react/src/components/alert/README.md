# Alert

Displays contextual feedback messages with heading, description, and action button. The icon is controlled by the variant via CSS.

## Usage

```tsx
import { Alert } from '@components-kit/react';

const handleExtend = () => {
  console.log('Session extended');
};

// Basic alert
<Alert
  heading="Information"
  description="Your settings have been updated."
  variantName="info"
/>

// With action button
<Alert
  heading="Warning"
  description="Your session will expire in 5 minutes."
  action={{
    children: "Extend Session",
    onClick: handleExtend,
  }}
  variantName="warning"
/>
```

## Props

| Prop          | Type                                                 | Default | Description                                                                                                         |
| ------------- | ---------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| `heading`     | `ReactNode`                                          | -       | Main heading/title of the alert                                                                                     |
| `description` | `ReactNode`                                          | -       | Body content of the alert                                                                                           |
| `action`      | `Omit<ButtonProps, "as" \| "size" \| "variantName">` | -       | Action button props (size fixed to "sm"). Button variant is controlled by the parent alert's `variantName` via CSS. |
| `variantName` | `VariantFor<"alert">`                                | -       | Variant name for styling                                                                                            |

Also accepts all standard `div` HTML attributes.

## Data Attributes

| Attribute          | Values                                                          | Description                      |
| ------------------ | --------------------------------------------------------------- | -------------------------------- |
| `data-variant`     | string                                                          | The variant name for styling     |
| `data-has-heading` | `true`                                                          | Present when heading is provided |
| `data-has-action`  | `true`                                                          | Present when action is provided  |
| `data-slot`        | `"icon"`, `"content"`, `"heading"`, `"description"`, `"action"` | Identifies internal slots        |

## Accessibility

- Uses `role="alert"` for immediate screen reader announcement
- Uses `aria-live="polite"` to announce updates without interruption
- Icon slot is always rendered with `aria-hidden="true"` (controlled via CSS per variant)
- Action button inherits full keyboard accessibility from Button component

### Best Practices

- Keep alert messages concise and actionable
- Use appropriate variant to match message severity
- Provide a clear action when user response is needed
- Don't overuse alerts — they should convey important information
