# Icon

An icon wrapper component for consistent icon sizing and styling.

## Usage

```tsx
import { Icon } from '@components-kit/react';

// Basic icon wrapping a Lucide icon
<Icon>
  <Search />
</Icon>

// Small icon
<Icon size="sm">
  <Check />
</Icon>

// Large icon with variant
<Icon size="lg" variantName="primary">
  <Star />
</Icon>

// Decorative icon (aria-hidden="true" is the default)
<Icon size="sm">
  <CheckmarkIcon />
</Icon>
<span>Success</span>

// Meaningful icon with accessible label (override aria-hidden)
<Icon aria-hidden={false} aria-label="Warning" role="img">
  <AlertTriangle />
</Icon>

// Icon button (aria-hidden="true" is automatic on Icon)
<button aria-label="Close dialog">
  <Icon size="sm">
    <X />
  </Icon>
</button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | The size of the icon |
| `variantName` | `string` | - | Variant name for styling |
| `children` | `ReactNode` | - | The icon content (e.g., Lucide icon component) |

Accepts all standard `<span>` HTML attributes except `style`.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-ck` | `"icon"` | Component identifier |
| `data-size` | `"sm"`, `"md"`, `"lg"` | The size variant |
| `data-variant` | string | The variant name for styling |

## Accessibility

This component includes `aria-hidden="true"` by default because most icons are decorative.

### Decorative Icons (Default)

Icons next to text that describes the same thing are hidden automatically:

```tsx
<Icon>
  <MailIcon />
</Icon>
<span>Email</span>
```

### Meaningful Icons

Icons that convey information need to override `aria-hidden` and add accessible labels:

```tsx
<Icon aria-hidden={false} aria-label="Email sent successfully" role="img">
  <CheckIcon />
</Icon>
```

### Icon Buttons

Keep the default `aria-hidden="true"` on the icon and provide `aria-label` on the button:

```tsx
<button aria-label="Delete item">
  <Icon>
    <TrashIcon />
  </Icon>
</button>
```

### Best Practices

- Decorative icons are hidden by default (`aria-hidden="true"`)
- For meaningful icons, use `aria-hidden={false}` with `aria-label`
- Ensure sufficient color contrast for icon visibility
- Don't rely solely on color to convey icon meaning
- Keep icon sizes appropriate for touch targets (minimum 44x44px for interactive)
- Use consistent icon sizes throughout the application
