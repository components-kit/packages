# Separator

A visual divider component for separating content sections.

## Usage

```tsx
import { Separator } from '@components-kit/react';

// Horizontal separator (default)
<Separator />

// Vertical separator
<Separator orientation="vertical" />

// With custom styling
<Separator className="my-4 border-gray-300" />

// Decorative separator (hidden from screen readers)
<Separator aria-hidden="true" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Orientation of the separator |

Also accepts all standard `hr` HTML attributes.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-orientation` | `"horizontal"`, `"vertical"` | The orientation |

## Accessibility

- Uses `role="separator"` for explicit accessibility
- Sets `aria-orientation` to communicate orientation to assistive technologies
- The `<hr>` element is inherently accessible as a thematic break
- For decorative separators, use `aria-hidden="true"`

### Best Practices

- Use semantic separators when content sections are thematically different
- Use decorative separators (`aria-hidden="true"`) for purely visual spacing
- Ensure sufficient color contrast for visibility
