# RadioGroup

A container and radio input components for single selection from multiple options.

## Usage

```tsx
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@components-kit/react';

// Basic radio group
<RadioGroup aria-label="Select option" variantName="default">
  <div>
    <RadioGroupItem id="option1" name="option" value="1" defaultChecked />
    <label htmlFor="option1">Option 1</label>
  </div>
  <div>
    <RadioGroupItem id="option2" name="option" value="2" />
    <label htmlFor="option2">Option 2</label>
  </div>
  <div>
    <RadioGroupItem id="option3" name="option" value="3" disabled />
    <label htmlFor="option3">Option 3 (disabled)</label>
  </div>
</RadioGroup>

// With fieldset and legend (recommended)
<fieldset>
  <legend>Choose your plan</legend>
  <RadioGroup variantName="default">
    <div>
      <RadioGroupItem id="basic" name="plan" value="basic" />
      <label htmlFor="basic">Basic - $9/month</label>
    </div>
    <div>
      <RadioGroupItem id="pro" name="plan" value="pro" />
      <label htmlFor="pro">Pro - $19/month</label>
    </div>
  </RadioGroup>
</fieldset>

// Controlled
function ControlledPreferences() {
  const [selected, setSelected] = useState('email');

  return (
    <RadioGroup aria-label="Notification preference">
      <div>
        <RadioGroupItem
          id="pref-email"
          name="preference"
          value="email"
          checked={selected === 'email'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <label htmlFor="pref-email">Email</label>
      </div>
      <div>
        <RadioGroupItem
          id="pref-push"
          name="preference"
          value="push"
          checked={selected === 'push'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <label htmlFor="pref-push">Push</label>
      </div>
    </RadioGroup>
  );
}
```

## RadioGroup Props

| Prop          | Type                        | Default | Description              |
| ------------- | --------------------------- | ------- | ------------------------ |
| `variantName` | `VariantFor<"radio_group">` | -       | Variant name for styling |

Also accepts all standard `div` HTML attributes.

## RadioGroupItem Props

Accepts all standard `input[type="radio"]` HTML attributes.

## Data Attributes

| Attribute      | Values | Description                                    |
| -------------- | ------ | ---------------------------------------------- |
| `data-variant` | string | The variant name for styling (RadioGroup only) |

## Accessibility

- RadioGroup uses `role="radiogroup"` for screen reader identification
- Requires accessible label via `aria-label` or `aria-labelledby`
- Arrow keys navigate between radio buttons (native browser behavior)
- Tab key moves focus to/from the radio group as a whole
- Space key selects the focused radio button
- Only one radio button in a group can be selected

### Important

- All RadioGroupItem components must share the same `name` attribute
- Use `<fieldset>` and `<legend>` for better semantic structure

### Best Practices

- Always provide a visible label or `aria-label` for the group
- Ensure all radio items have the same `name` attribute
- Consider providing a default selection when appropriate
- Don't use radio groups for yes/no questions (use checkbox or switch)
