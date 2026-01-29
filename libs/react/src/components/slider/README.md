# Slider

An accessible slider input component for selecting a numeric value within a range.

## Usage

```tsx
import { Slider } from '@components-kit/react';

// Basic slider with external label
<label id="volume-label">Volume</label>
<Slider aria-labelledby="volume-label" defaultValue={50} />

// With aria-label (no visible label)
<Slider aria-label="Volume" defaultValue={50} />

// Controlled slider
const [volume, setVolume] = useState(50);
<Slider aria-label="Volume" value={volume} onValueChange={setVolume} />

// Custom range and step
<Slider aria-label="Temperature" min={0} max={40} step={0.5} defaultValue={22} />

// Disabled slider
<Slider aria-label="Locked" defaultValue={30} disabled />

// With variant
<Slider aria-label="Brightness" defaultValue={75} variantName="primary" />

// With human-readable value text
<Slider
  aria-label="Priority"
  aria-valuetext="Medium priority"
  min={1}
  max={5}
  step={1}
  value={3}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Controlled value |
| `defaultValue` | `number` | `min` | Initial value for uncontrolled mode |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment between values |
| `disabled` | `boolean` | - | Disables the slider |
| `onValueChange` | `(value: number) => void` | - | Callback fired when the value changes |
| `variantName` | `string` | - | Variant name for styling |

Also accepts all standard `div` HTML attributes.

## Data Attributes

| Attribute | Applied On | Values | Description |
|-----------|-----------|--------|-------------|
| `data-ck="slider"` | Root | `"slider"` | Component identifier |
| `data-disabled` | Root | `true` | Present when disabled |
| `data-variant` | Root | string | The variant name for styling |
| `data-ck="slider-track"` | Track | `"slider-track"` | The track (bar background) element |
| `data-ck="slider-thumb"` | Thumb | `"slider-thumb"` | The draggable thumb element |

## CSS Custom Properties

| Property | Applied On | Description |
|----------|------------|-------------|
| `--slider-value` | `[data-ck="slider-thumb"]` | Computed percentage (e.g., `"50%"`) |

### Example CSS

```css
[data-ck="slider"] {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

[data-ck="slider-track"] {
  position: relative;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: 4px;
  cursor: pointer;
  touch-action: none;
}

[data-ck="slider-track"]::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: var(--slider-value, 0%);
  background: var(--color-primary);
  border-radius: 4px;
}

[data-ck="slider-thumb"] {
  position: absolute;
  top: 50%;
  left: var(--slider-value, 0%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  transform: translate(-50%, -50%);
  cursor: grab;
  outline: none;
}

[data-ck="slider-thumb"]:focus-visible {
  box-shadow: 0 0 0 3px var(--color-ring);
}

[data-ck="slider"][data-disabled] [data-ck="slider-track"] {
  cursor: not-allowed;
  opacity: 0.5;
}

[data-ck="slider"][data-disabled] [data-ck="slider-thumb"] {
  cursor: not-allowed;
}
```

## Accessibility

- Uses `role="slider"` on the thumb element with full WAI-ARIA support
- Sets `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` on the thumb
- Always associate with a `<label>` using `aria-labelledby`, or use `aria-label`
- Uses `aria-disabled` instead of native `disabled` to keep the thumb focusable

### Keyboard Support

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowUp` | Increase value by one step |
| `ArrowLeft` / `ArrowDown` | Decrease value by one step |
| `Home` | Set value to minimum |
| `End` | Set value to maximum |
| `PageUp` | Increase value by 10× step |
| `PageDown` | Decrease value by 10× step |

### Best Practices

- Always provide an accessible name via `aria-label` or `aria-labelledby`
- Use `aria-valuetext` for human-readable descriptions (e.g., "Medium priority")
- Choose a `step` that makes sense for the value range
- Ensure sufficient color contrast for the thumb and track
- Consider displaying the current value alongside the slider
