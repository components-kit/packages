# Heading

A polymorphic heading component for rendering semantic headings (h1-h6) with flexible styling.

## Usage

```tsx
import { Heading } from '@components-kit/react';

// Basic h1 heading (default)
<Heading>Page Title</Heading>

// Semantic h2 heading
<Heading as="h2">Section Title</Heading>

// All heading levels
<Heading as="h1">Main Title</Heading>
<Heading as="h2">Section</Heading>
<Heading as="h3">Subsection</Heading>
<Heading as="h4">Sub-subsection</Heading>
<Heading as="h5">Minor heading</Heading>
<Heading as="h6">Smallest heading</Heading>

// With variant styling
<Heading as="h2" variantName="display">
  Large Display Heading
</Heading>

// Visual-only heading (not part of document outline)
<Heading
  as="div"
  role="heading"
  aria-level={2}
  variantName="h2"
>
  Visual Heading
</Heading>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `ElementType` | `"h1"` | HTML element to render as (polymorphic) |
| `variantName` | `VariantFor<"heading">` | - | Variant name for styling |

Also accepts all HTML attributes for the rendered element.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-variant` | string | The variant name for styling |

## Accessibility

Proper heading hierarchy is essential for screen reader navigation:

- Use only **one `<h1>`** per page (main page title)
- Maintain proper heading order: h1 → h2 → h3 (don't skip levels)
- Screen readers use headings to navigate, so use them meaningfully
- Headings should describe the content that follows

### Visual-Only Headings

For headings that look like headings but shouldn't affect document structure:

```tsx
<Heading
  as="div"
  role="heading"
  aria-level={2}
  variantName="h2"
>
  Visual Heading Only
</Heading>
```

### Best Practices

- Match the `as` prop to document outline level, not visual style
- Use `variantName` to control appearance independently of semantic level
- Example: An h2 can look like an h1 visually using `variantName="h1"`
