# Button

A polymorphic button component with support for loading states, icons, and composition.

## Usage

```tsx
import { Button } from '@components-kit/react';

// Basic button
<Button variantName="primary">Submit</Button>

// With icons
<Button leadingIcon={<SearchIcon />} variantName="secondary">
  Search
</Button>

// Loading state
<Button isLoading variantName="primary">
  Saving...
</Button>

// Icon-only button (requires aria-label)
<Button aria-label="Search" leadingIcon={<SearchIcon />} variantName="ghost" />

// Polymorphic - render as link
<Button as="a" href="/home" variantName="outline">
  Go Home
</Button>

// Composition with asChild
<Button asChild variantName="primary">
  <a href="/dashboard">Dashboard</a>
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `ElementType` | `"button"` | HTML element to render as (polymorphic) |
| `asChild` | `boolean` | `false` | Merge props with child element |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the button |
| `variantName` | `string` | - | Variant name for styling |
| `isLoading` | `boolean` | `false` | Shows loading state, disables button |
| `disabled` | `boolean` | - | Disables the button |
| `fullWidth` | `boolean` | - | Makes button full width |
| `leadingIcon` | `ReactNode` | - | Icon before button text |
| `trailingIcon` | `ReactNode` | - | Icon after button text |

Also accepts all standard `button` HTML attributes.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-variant` | string | The variant name for styling |
| `data-size` | `"sm"`, `"md"`, `"lg"` | The size variant |
| `data-loading` | `true` | Present when loading |
| `data-disabled` | `true` | Present when disabled |
| `data-full-width` | `true` | Present when full width |

## Accessibility

- Uses semantic `<button>` element for proper keyboard navigation
- Uses `aria-disabled` instead of native `disabled` to keep button focusable
- Sets `aria-busy="true"` during loading for screen reader announcement
- Prevents interactions when disabled via event handlers

### Icon-Only Buttons

When using only an icon without visible text, you **must** provide `aria-label`:

```tsx
<Button aria-label="Close dialog" leadingIcon={<CloseIcon />} />
```

### Best Practices

- Use `type="button"` for non-submit buttons (default)
- Provide loading feedback text when appropriate
- Ensure sufficient color contrast
- Keep button labels concise and action-oriented
