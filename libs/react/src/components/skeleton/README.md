# Skeleton

A placeholder loading component that indicates content is being loaded.

## Usage

```tsx
import { Skeleton } from '@components-kit/react';

// Basic skeleton with dimensions
<Skeleton width="200px" height="100px" />

// Full-width skeleton
<Skeleton width="100%" height="20px" />

// Text line skeleton
<Skeleton width="80%" height="1em" />

// Avatar skeleton (circular via className)
<Skeleton
  width="48px"
  height="48px"
  className="rounded-full"
/>

// Card skeleton layout
<div className="card">
  <Skeleton width="100%" height="200px" /> {/* Image */}
  <Skeleton width="60%" height="24px" />  {/* Title */}
  <Skeleton width="100%" height="16px" /> {/* Description */}
  <Skeleton width="100%" height="16px" />
  <Skeleton width="40%" height="16px" />
</div>

// With accessibility
<div aria-busy="true" aria-label="Loading content">
  <Skeleton width="100%" height="20px" />
  <Skeleton width="80%" height="20px" />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | - | Width of the skeleton (e.g., "200px", "100%") |
| `height` | `string` | - | Height of the skeleton (e.g., "100px", "1em") |
| `variantName` | `VariantFor<"skeleton">` | - | Variant name for styling |

Also accepts all standard `div` HTML attributes.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-variant` | string | The variant name for styling |

## Accessibility

This component includes `aria-hidden="true"` by default because skeletons are decorative placeholders. The loading state should be communicated at a higher level (on the parent container).

```tsx
// Container with loading state
<div aria-busy="true" aria-label="Loading user profile">
  <Skeleton width="48px" height="48px" />
  <Skeleton width="150px" height="20px" />
</div>

// With live region for screen readers
<div aria-live="polite">
  {isLoading ? (
    <Skeleton width="100%" height="200px" />
  ) : (
    <Content />
  )}
</div>
```

If you need to override the default `aria-hidden`, you can pass `aria-hidden={false}`.

### Best Practices

- Skeletons are hidden from screen readers by default (`aria-hidden="true"`)
- Use `aria-busy="true"` on the container being loaded
- Use `aria-label` to describe what content is loading
- Match skeleton dimensions to expected content size
- Use consistent animation across the application
- Group related skeletons with `aria-busy` on the container
- Avoid excessive skeleton complexity; keep layouts simple
