# Tabs

A fully accessible tabs component for organizing content into multiple panels.

## Usage

```tsx
import { Tabs } from '@components-kit/react';

// Basic uncontrolled tabs
<Tabs
  tabs={[
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' }
  ]}
  defaultValue="account"
>
  <div data-tab-panel="account">Account settings...</div>
  <div data-tab-panel="security">Security settings...</div>
  <div data-tab-panel="notifications">Notification preferences...</div>
</Tabs>

// Controlled tabs with state
function ControlledExample() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs
      tabs={[
        { id: 'profile', label: 'Profile' },
        { id: 'settings', label: 'Settings' }
      ]}
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <div data-tab-panel="profile">Profile content...</div>
      <div data-tab-panel="settings">Settings content...</div>
    </Tabs>
  );
}

// With icons
import { UserIcon, SettingsIcon, BellIcon } from 'lucide-react';

<Tabs
  tabs={[
    { id: 'user', label: 'Profile', icon: <UserIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon /> }
  ]}
  defaultValue="user"
>
  <div data-tab-panel="user">User profile...</div>
  <div data-tab-panel="settings">Settings...</div>
  <div data-tab-panel="notifications">Notifications...</div>
</Tabs>

// Vertical orientation
<Tabs
  tabs={[
    { id: 'general', label: 'General' },
    { id: 'advanced', label: 'Advanced' }
  ]}
  orientation="vertical"
  defaultValue="general"
>
  <div data-tab-panel="general">General options...</div>
  <div data-tab-panel="advanced">Advanced options...</div>
</Tabs>

// With disabled tabs
<Tabs
  tabs={[
    { id: 'enabled', label: 'Available' },
    { id: 'disabled', label: 'Locked', disabled: true },
    { id: 'other', label: 'Other' }
  ]}
  defaultValue="enabled"
>
  <div data-tab-panel="enabled">This tab is accessible</div>
  <div data-tab-panel="disabled">This tab is locked</div>
  <div data-tab-panel="other">Other content</div>
</Tabs>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | **required** | Array of tab items |
| `children` | `ReactNode` | **required** | Panel content. Each child must have a `data-tab-panel` attribute matching a tab `id`. |
| `defaultValue` | `string` | - | Initial active tab ID (uncontrolled mode) |
| `value` | `string` | - | Controlled active tab ID |
| `onValueChange` | `(tabId: string) => void` | - | Callback fired when active tab changes |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Tab list orientation |
| `variantName` | `string` | - | Variant name for styling |

Also accepts all standard `div` HTML attributes.

### TabItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique tab identifier |
| `label` | `string \| ReactNode` | **required** | Tab label content |
| `icon` | `ReactNode` | - | Icon element displayed before the label |
| `disabled` | `boolean` | - | Disables the tab |

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-ck` | `"tabs"` | Root container identifier |
| `data-ck` | `"tab"` | Tab trigger identifier |
| `data-ck` | `"tab-panel"` | Tab panel identifier |
| `data-variant` | string | The variant name for styling |
| `data-orientation` | `"horizontal"`, `"vertical"` | Tab list orientation |
| `data-state` | `"selected"`, `"unselected"` | Tab trigger selection state |
| `data-state` | `"active"`, `"inactive"` | Tab panel visibility state |
| `data-disabled` | `true` | Present when tab is disabled |
| `data-slot` | `"tablist"` | Identifies the tab list container |
| `data-slot` | `"icon"` | Identifies the icon slot within a tab |
| `data-slot` | `"label"` | Identifies the label slot within a tab |

## Accessibility

Follows the [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

### Keyboard Support

| Key | Description |
|-----|-------------|
| `Tab` | Moves focus into the tab list (to the active tab), then to the active panel |
| `ArrowRight` (horizontal) / `ArrowDown` (vertical) | Moves focus to and activates the next enabled tab. Stops at the last tab. |
| `ArrowLeft` (horizontal) / `ArrowUp` (vertical) | Moves focus to and activates the previous enabled tab. Stops at the first tab. |
| `Home` | Moves focus to and activates the first enabled tab |
| `End` | Moves focus to and activates the last enabled tab |

### ARIA Roles and Attributes

- **Tablist**: `role="tablist"` with `aria-orientation`
- **Tab**: `role="tab"` with `aria-selected`, `aria-controls`, `aria-disabled`
- **Panel**: `role="tabpanel"` with `aria-labelledby`, `tabIndex={0}`
- **Roving Tabindex**: Only the focused tab has `tabIndex={0}`, others have `tabIndex={-1}`

### Best Practices

- Use tabs for related content that doesn't need to be viewed simultaneously
- Keep tab labels concise (1-2 words when possible)
- Don't use tabs for sequential processes (use a stepper instead)
- Each panel child must have a `data-tab-panel` attribute matching a tab `id`
- Use `variantName` to apply consistent styling across your app
- Provide an `aria-label` on the root element if multiple tab groups exist on the same page
