# Progress

A linear progress bar component for displaying determinate or indeterminate progress.

## Usage

```tsx
import { Progress } from '@components-kit/react';

// With label
<Progress label="Uploading files..." value={50} variantName="default" />

// Determinate progress (50%)
<Progress value={50} aria-label="Upload progress" />

// Indeterminate progress (loading)
<Progress label="Loading content..." variantName="default" />

// Custom range
<Progress label="Steps completed" min={0} max={200} value={75} variantName="default" />

// With variant
<Progress label="Upload complete" value={100} variantName="success" />

// With human-readable value text
<Progress
  label="Steps completed"
  value={3}
  min={0}
  max={10}
  aria-valuetext="Step 3 of 10"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | - | Label text displayed above the progress bar |
| `value` | `number \| null` | - | Current value. Null/undefined = indeterminate |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `variantName` | `string` | - | Variant name for styling |

Also accepts all standard `div` HTML attributes.

## Data Attributes

| Attribute | Applied On | Values | Description |
|-----------|-----------|--------|-------------|
| `data-ck="progress"` | Root | `"progress"` | Component identifier |
| `data-has-label` | Root | `true` | Present when label is provided |
| `data-variant` | Root | string | The variant name for styling |
| `data-slot="label"` | Label | `"label"` | Label sub-element |
| `data-ck="progress-track"` | Track | `"progress-track"` | The track (bar background) element |
| `data-state` | Track | `"determinate"`, `"indeterminate"` | Current progress mode |
| `data-value` | Track | number | Current value (determinate only) |
| `data-max` | Track | number | Maximum value |
| `data-ck="progress-indicator"` | Indicator | `"progress-indicator"` | The fill indicator element |

## Accessibility

- Uses `role="progressbar"` on the track element with full WAI-ARIA support
- Sets `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` (determinate only)
- Omits `aria-valuenow` in indeterminate mode per WAI-ARIA spec
- When `label` is provided, `aria-labelledby` is automatically set on the progressbar
- Alternatively, provide `aria-label` or `aria-labelledby` for an accessible name

### Best Practices

- Provide a visible `label` or an accessible name via `aria-label` / `aria-labelledby`
- Use `aria-valuetext` for human-readable descriptions (e.g., "Step 3 of 10")
- Use indeterminate mode when the completion percentage is unknown
- Ensure sufficient color contrast for the progress indicator
