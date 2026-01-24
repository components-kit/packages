# Alert

Displays contextual feedback messages with optional icon, heading, description, and action button.

## Usage

```tsx
import { Alert } from '@components-kit/react';

// Basic alert
<Alert
  heading="Information"
  description="Your settings have been updated."
  variantName="info"
/>

// With icon
<Alert
  icon={<InfoIcon />}
  heading="Success!"
  description="Your changes have been saved."
  variantName="success"
/>

// With action button
<Alert
  icon={<WarningIcon />}
  heading="Warning"
  description="Your session will expire in 5 minutes."
  action={{
    children: "Extend Session",
    onClick: handleExtend,
    variantName: "outline"
  }}
  variantName="warning"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | - | Icon element (decorative, hidden from screen readers) |
| `heading` | `ReactNode` | - | Main heading/title of the alert |
| `description` | `ReactNode` | - | Body content of the alert |
| `action` | `Omit<ButtonProps, "as" \| "size">` | - | Action button props (size fixed to "sm") |
| `variantName` | `string` | - | Variant name for styling |

Also accepts all standard `div` HTML attributes.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-variant` | string | The variant name for styling |
| `data-has-icon` | `true` | Present when icon is provided |
| `data-has-heading` | `true` | Present when heading is provided |
| `data-has-action` | `true` | Present when action is provided |
| `data-slot` | `"icon"`, `"content"`, `"heading"`, `"description"`, `"action"` | Identifies internal slots |

## Accessibility

- Uses `role="alert"` for immediate screen reader announcement
- Uses `aria-live="polite"` to announce updates without interruption
- Icon is marked `aria-hidden="true"` (decorative)
- Action button inherits full keyboard accessibility from Button component

### Best Practices

- Keep alert messages concise and actionable
- Use appropriate variant to match message severity
- Provide a clear action when user response is needed
- Don't overuse alerts - they should convey important information
