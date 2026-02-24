# Switch

A toggle switch component for binary on/off choices with immediate effect.

## Usage

```tsx
import { useState } from 'react';
import { Switch } from '@components-kit/react';

const saveAutoSavePreference = (enabled: boolean) => {
  console.log('Auto-save:', enabled);
};

// Basic switch with label
<Switch id="notifications" variantName="default" />
<label htmlFor="notifications">Enable notifications</label>

// Controlled switch with immediate effect
function AutoSaveSetting() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch
      checked={enabled}
      onChange={(e) => {
        const nextValue = e.target.checked;
        setEnabled(nextValue);
        saveAutoSavePreference(nextValue);
      }}
      aria-label="Enable auto-save"
      variantName="default"
    />
  );
}

// With aria-label (no visible label)
<Switch
  aria-label="Enable dark mode"
  variantName="default"
/>

// Disabled switch
<Switch id="premium" disabled variantName="default" />
<label htmlFor="premium">Premium feature (upgrade required)</label>

// Default on (uncontrolled)
<Switch id="auto-save" defaultChecked variantName="default" />
<label htmlFor="auto-save">Auto-save enabled</label>

// With description
<div>
  <Switch
    id="analytics"
    aria-describedby="analytics-desc"
    variantName="default"
  />
  <label htmlFor="analytics">Analytics</label>
  <p id="analytics-desc">Help us improve by sharing anonymous usage data</p>
</div>
```

## Props

| Prop          | Type                   | Default | Description              |
| ------------- | ---------------------- | ------- | ------------------------ |
| `variantName` | `VariantFor<"switch">` | -       | Variant name for styling |

Also accepts all standard `input[type="checkbox"]` HTML attributes.

## Data Attributes

| Attribute       | Values                     | Description                  |
| --------------- | -------------------------- | ---------------------------- |
| `data-state`    | `"checked"`, `"unchecked"` | Current checked state        |
| `data-disabled` | `true`                     | Present when disabled        |
| `data-variant`  | string                     | The variant name for styling |

## Switch vs Checkbox

Use a **Switch** when:

- The action takes immediate effect (no form submission)
- It's a simple on/off choice (like a light switch)
- Used in settings panels or preference screens

Use a **Checkbox** when:

- Part of a form that will be submitted
- Multiple options can be selected
- There's an indeterminate/mixed state

## Accessibility

- Uses `role="switch"` for screen reader identification
- Native checkbox for keyboard support (Space to toggle)
- Always associate with a `<label>` using `id` and `htmlFor`
- Screen readers announce "on" or "off" state
- Native `disabled` attribute properly conveys state

### Settings Panel Example

```tsx
<div role="group" aria-labelledby="settings-title">
  <h3 id="settings-title">Notification Settings</h3>
  <div>
    <Switch id="email" variantName="default" />
    <label htmlFor="email">Email notifications</label>
  </div>
  <div>
    <Switch id="push" variantName="default" />
    <label htmlFor="push">Push notifications</label>
  </div>
</div>
```

### Best Practices

- Always provide a visible label or `aria-label`
- Use clear, action-oriented label text
- Place the switch consistently (before or after label)
- Ensure the switch is large enough for touch targets
