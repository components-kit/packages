# Checkbox

A checkbox input component for boolean selections with indeterminate state support.

## Usage

```tsx
import { Checkbox } from '@components-kit/react';

// Basic checkbox with label
<Checkbox id="terms" variantName="default" />
<label htmlFor="terms">I accept the terms</label>

// Controlled checkbox
const [checked, setChecked] = useState(false);
<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
  variantName="default"
/>

// Disabled state
<Checkbox id="disabled" disabled variantName="default" />
<label htmlFor="disabled">Disabled option</label>

// With validation error
<Checkbox
  id="accept"
  aria-describedby="accept-error"
  aria-invalid="true"
  variantName="error"
/>
<span id="accept-error">You must accept the terms</span>

// Indeterminate state (select all pattern)
const checkboxRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  if (checkboxRef.current) {
    checkboxRef.current.indeterminate = someChecked && !allChecked;
  }
}, [someChecked, allChecked]);
<Checkbox ref={checkboxRef} checked={allChecked} onChange={handleSelectAll} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variantName` | `string` | - | Variant name for styling |

Also accepts all standard `input[type="checkbox"]` HTML attributes.

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-variant` | string | The variant name for styling |

## Accessibility

- Uses native `<input type="checkbox">` for built-in keyboard support
- Always associate with a `<label>` using `id` and `htmlFor`
- Use `aria-describedby` to link to helper text or error messages
- Use `aria-invalid="true"` to indicate validation errors
- Supports Space key for toggling (native behavior)
- Indeterminate state is announced by screen readers

### Checkbox Groups

```tsx
<fieldset>
  <legend>Select your interests</legend>
  <Checkbox id="sports" name="interests" value="sports" />
  <label htmlFor="sports">Sports</label>
  <Checkbox id="music" name="interests" value="music" />
  <label htmlFor="music">Music</label>
</fieldset>
```

### Best Practices

- Always provide a visible label or `aria-label`
- Group related checkboxes with `<fieldset>` and `<legend>`
- Use indeterminate state for "select all" patterns
- Don't use checkboxes for mutually exclusive options (use radio instead)
