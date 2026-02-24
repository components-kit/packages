# Text

A polymorphic text component for rendering styled text with semantic HTML.

## Usage

```tsx
import { Text } from '@components-kit/react';

// Basic paragraph (default)
<Text>This is a paragraph of text.</Text>

// Inline text with span
<Text as="span">Inline text</Text>

// With variant styling
<Text as="p" variantName="body-large">
  Large body text for emphasis.
</Text>

// Caption text
<Text as="small" variantName="caption">
  Caption or fine print text
</Text>

// Important text with semantic strong
<Text as="strong" variantName="bold">
  Important information
</Text>

// Emphasized text
<Text as="em">Emphasized content</Text>

// Form label
<Text as="label" htmlFor="email-input">
  Email Address
</Text>
<input id="email-input" type="email" />
```

## Props

| Prop          | Type                 | Default | Description                             |
| ------------- | -------------------- | ------- | --------------------------------------- |
| `as`          | `ElementType`        | `"p"`   | HTML element to render as (polymorphic) |
| `variantName` | `VariantFor<"text">` | -       | Variant name for styling                |

Also accepts all HTML attributes for the rendered element.

## Data Attributes

| Attribute      | Values | Description                  |
| -------------- | ------ | ---------------------------- |
| `data-variant` | string | The variant name for styling |

## Common Elements

| Element  | Use Case                                  |
| -------- | ----------------------------------------- |
| `p`      | Paragraphs of text (default)              |
| `span`   | Inline text without semantic meaning      |
| `strong` | Important text (not just bold styling)    |
| `em`     | Emphasized text (not just italic styling) |
| `small`  | Side comments, disclaimers, fine print    |
| `label`  | Form input labels (use with `htmlFor`)    |
| `div`    | Block-level text container                |

## Accessibility

Choose elements based on semantic meaning:

| Element    | Meaning                                           |
| ---------- | ------------------------------------------------- |
| `<p>`      | Paragraph of content                              |
| `<strong>` | Important text (announced by screen readers)      |
| `<em>`     | Emphasized text (announced by screen readers)     |
| `<small>`  | Side comments or fine print                       |
| `<label>`  | Form input labels (use `htmlFor` for association) |

### Best Practices

- Choose the element based on semantic meaning, not visual appearance
- Use `variantName` for visual variations independently of semantics
- Avoid using `<div>` or `<span>` when a semantic element is appropriate
- For interactive text, use `<button>` or `<a>` instead

### Form Labels

```tsx
<Text as="label" htmlFor="email">
  Email Address
</Text>
<Input id="email" type="email" />
```
