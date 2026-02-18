# Badge

A small status indicator for highlighting information, counts, or labels.

## Usage

```tsx
import { Badge } from '@components-kit/react';

// Basic badge
<Badge>New</Badge>

// With size variants
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With variant styling
<Badge variantName="success">Active</Badge>
<Badge variantName="error">Failed</Badge>
<Badge variantName="warning">Pending</Badge>

// Notification count
<button aria-label="Messages, 5 unread">
  <MailIcon />
  <Badge size="sm" variantName="notification">5</Badge>
</button>

// Using asChild pattern
<Badge asChild variantName="primary">
  <button type="button">Clickable Badge</button>
</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the badge |
| `variantName` | `VariantFor<"badge">` | - | Variant name for styling |
| `asChild` | `boolean` | `false` | Merge props with child element instead of wrapping |

Also accepts all standard `span` HTML attributes.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-variant` | string | The variant name for styling |
| `data-size` | `"sm"`, `"md"`, `"lg"` | The size variant |

## Accessibility

- Badges are typically decorative and don't need special ARIA roles
- For notification counts, use `aria-label` on the parent element
- When badge conveys important status, associate it with `aria-describedby`
- Don't rely solely on color to convey meaning; use text or icons
- For dynamic badges (live counts), consider using `aria-live="polite"`

### Best Practices

- Keep badge text short (1-2 words or numbers)
- Use consistent badge colors for similar statuses
- Position badges relative to the element they describe
- Consider hiding badges with zero counts if not meaningful
