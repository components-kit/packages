# Icon

A polymorphic icon container for rendering icons with controlled dimensions.

## Usage

```tsx
import { Icon } from '@components-kit/react';

// Basic icon with SVG
<Icon width="24px" height="24px">
  <svg viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
</Icon>

// Decorative icon (hidden from screen readers)
<Icon aria-hidden="true" width="16px" height="16px">
  <CheckmarkSvg />
</Icon>
<span>Success</span>

// Meaningful icon with accessible label
<Icon aria-label="Warning" role="img" width="20px" height="20px">
  <WarningSvg />
</Icon>

// Icon button with accessibility
<button aria-label="Close dialog">
  <Icon aria-hidden="true">
    <CloseSvg />
  </Icon>
</button>

// With variant styling
<Icon variantName="primary" width="32px" height="32px">
  <StarSvg />
</Icon>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `ElementType` | `"span"` | HTML element to render as (polymorphic) |
| `width` | `string` | `"20px"` | Width of the icon container |
| `height` | `string` | `"20px"` | Height of the icon container |
| `variantName` | `string` | - | Variant name for styling |

Also accepts all HTML attributes for the rendered element.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-variant` | string | The variant name for styling |

## Accessibility

### Decorative Icons

Icons next to text that describes the same thing should be hidden:

```tsx
<Icon aria-hidden="true">
  <MailIcon />
</Icon>
<span>Email</span>
```

### Meaningful Icons

Icons that convey information need accessible labels:

```tsx
<Icon aria-label="Email sent successfully" role="img">
  <CheckIcon />
</Icon>
```

### Icon Buttons

Always provide `aria-label` on the button, not the icon:

```tsx
<button aria-label="Delete item">
  <Icon aria-hidden="true">
    <TrashIcon />
  </Icon>
</button>
```

### Best Practices

- Use `aria-hidden="true"` for decorative icons to reduce screen reader noise
- Ensure sufficient color contrast for icon visibility
- Don't rely solely on color to convey icon meaning
- Keep icon sizes appropriate for touch targets (minimum 44x44px for interactive)
- Use consistent icon sizes throughout the application
