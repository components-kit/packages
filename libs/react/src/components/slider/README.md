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

// With onValueCommit (fires only when drag ends)
<Slider aria-label="Volume" defaultValue={50} onValueCommit={(v) => saveToServer(v)} />

// Custom range and step
<Slider aria-label="Temperature" min={0} max={40} step={0.5} defaultValue={22} />

// Vertical slider
<Slider aria-label="Volume" defaultValue={50} orientation="vertical" />

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
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction of the slider |
| `onValueChange` | `(value: number) => void` | - | Callback fired when the value changes (on every move) |
| `onValueCommit` | `(value: number) => void` | - | Callback fired when the user finishes a pointer interaction (on pointer up) |
| `variantName` | `string` | - | Variant name for styling |

Also accepts all standard `div` HTML attributes.

## Data Attributes

| Attribute | Applied On | Values | Description |
|-----------|-----------|--------|-------------|
| `data-ck="slider"` | Root | `"slider"` | Component identifier |
| `data-disabled` | Root | `true` | Present when disabled |
| `data-orientation` | Root | `"horizontal"` \| `"vertical"` | The slider orientation |
| `data-variant` | Root | string | The variant name for styling |
| `data-ck="slider-track"` | Track | `"slider-track"` | The track (bar background) element |
| `data-ck="slider-range"` | Range | `"slider-range"` | The filled portion of the track |
| `data-ck="slider-thumb"` | Thumb | `"slider-thumb"` | The draggable thumb element |

## Accessibility

- Uses `role="slider"` on the thumb element with full WAI-ARIA support
- Sets `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` on the thumb
- Sets `aria-orientation` on the thumb to communicate layout direction
- Forwards `aria-label`, `aria-labelledby`, `aria-valuetext`, and `aria-describedby` to the thumb element
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
- Use `onValueCommit` for expensive operations (e.g., network requests) that should only run when the user finishes dragging
