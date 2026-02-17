# Toast

A toast notification function powered by Sonner for displaying temporary messages and alerts with semantic markup and accessibility features.

## Installation

This component requires the `sonner` package as a peer dependency:

```bash
npm install sonner
# or
pnpm add sonner
# or
yarn add sonner
```

## Usage

```tsx
import { toast } from '@components-kit/react';  // Import toast from components-kit
import { Toaster } from 'sonner';                // Import Toaster from sonner

// Add Toaster to your app root (in layout.tsx or _app.tsx)
<Toaster />

// Basic toast with title
toast({
  title: "Settings saved",
  variantName: "success"
});

// Toast with title and description
toast({
  title: "Update available",
  description: "A new version of the app is ready to install.",
  variantName: "info"
});

// Toast with action button
toast({
  title: "Item deleted",
  description: "The item has been removed from your list.",
  button: {
    label: "Undo",
    onClick: () => restoreItem()
  },
  variantName: "info"
});

// Toast with custom duration
toast({
  title: "Session expiring soon",
  description: "Your session will expire in 5 minutes.",
  duration: 10000, // 10 seconds
  variantName: "warning"
});

// Title only (minimal)
toast({
  title: "Quick notification",
  variantName: "success"
});

// With rich content (ReactNode)
toast({
  title: "Installation complete",
  description: (
    <div>
      <p>Version 2.0.0 has been installed.</p>
      <ul>
        <li>Performance improvements</li>
        <li>New features</li>
        <li>Bug fixes</li>
      </ul>
    </div>
  ),
  button: {
    label: "View changelog",
    onClick: () => openChangelog()
  },
  variantName: "success"
});

// Different positions
toast({
  title: "Top center notification",
  position: "top-center",
  variantName: "info"
});
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| ReactNode` | **Required** | Main title of the toast |
| `description` | `string \| ReactNode` | - | Body content of the toast |
| `button` | `Omit<ButtonProps, "asChild" \| "children" \| "size" \| "variantName"> & { label: string }` | - | Action button configuration. Uses the shared `Button` component with `size="sm"`. Accepts Button props (`isLoading`, `leadingIcon`, `trailingIcon`, etc.) plus a required `label`. Button variant is controlled by the parent toast's `variantName` via CSS. Toast auto-dismisses on click. |
| `variantName` | `string` | - | Variant name for styling |
| `duration` | `number` | `4000` | Time in ms before auto-dismiss |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | Toast position on screen |
| `dismissible` | `boolean` | `true` | Whether toast can be dismissed by user (swipe) |

Inherits additional props from Sonner's `ExternalToast` type (className, style, id, etc.).

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-ck` | `"toast"` | Toast container identifier |
| `data-ck` | `"button"` | Button element identifier (set by Button component) |
| `data-size` | `"sm"` | Button size (always `"sm"` in toast) |
| `data-variant` | `string` | The variant name for styling |
| `data-has-title` | `true` \| `undefined` | Present when title is provided |
| `data-has-description` | `true` \| `undefined` | Present when description is provided |
| `data-has-action` | `true` \| `undefined` | Present when button is provided |
| `data-slot` | `"icon"`, `"content"`, `"title"`, `"description"`, `"actions"`, `"action"` | Identifies internal slots for targeted styling |

## Accessibility

- Uses `role="status"` for screen reader announcements
- Uses `aria-live="polite"` to announce without interrupting current speech
- Icon slot is marked `aria-hidden="true"` (decorative)
- Action button is fully keyboard accessible:
  - Uses shared `Button` component with built-in keyboard support, `aria-disabled`, and `aria-busy`
  - Has `type="button"` to prevent form submission
  - Focusable and activatable with Space/Enter keys
  - Has visible text label from `button.label` prop
  - Supports `isLoading`, `leadingIcon`, and `trailingIcon` props
  - Button variant is controlled by the parent toast's `variantName` via CSS
- Title and description are announced by screen readers
- Auto-dismiss doesn't interrupt user interaction

### Best Practices

- Keep toast messages concise and scannable (1-2 short sentences)
- Use appropriate variant to match message severity (success, error, warning, info)
- Provide action button only when immediate user response is needed
- Don't use toasts for critical information - use alerts or dialogs instead
- Consider toast frequency - avoid overwhelming users with notifications
- Test with screen readers to ensure announcements are clear
- Remember reduced motion preferences are handled by Sonner automatically

## Sonner Integration

This component uses Sonner for toast management. You must include the `<Toaster />` component in your app root.

**Important:** Import `<Toaster />` directly from `sonner`, not from `@components-kit/react`. This prevents "use client" boundary issues in Next.js server components.

```tsx
import { Toaster } from 'sonner'; // Import from sonner, not @components-kit/react

export default function App() {
  return (
    <>
      <Toaster />
      {/* Your app content */}
    </>
  );
}
```

**For Next.js App Router:**

```tsx
// app/layout.tsx
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
```

**Why import `<Toaster />` from sonner directly?**
- Keeps your layout as a server component (Next.js optimization)
- Avoids forcing client-side rendering where not needed
- Reduces bundle size by not re-exporting third-party components

**Note:** The `toast()` function is imported from `@components-kit/react`, not from sonner. This is your custom implementation with semantic markup, data attributes, and accessibility features.

## Manual Dismissal

The toast function returns an ID that can be used for manual dismissal:

```tsx
import { toast } from '@components-kit/react';
import { toast as sonnerToast } from 'sonner';

const toastId = toast({
  title: "Processing...",
  description: "Please wait while we complete your request.",
  duration: Infinity // Won't auto-dismiss
});

// Later, dismiss manually using Sonner's dismiss method
sonnerToast.dismiss(toastId);

// Or dismiss all toasts
sonnerToast.dismiss();
```

## Common Patterns

### Success Notification

```tsx
toast({
  title: "Changes saved",
  description: "Your settings have been updated successfully.",
  variantName: "success"
});
```

### Error with Retry Action

```tsx
toast({
  title: "Failed to save",
  description: "An error occurred while saving your changes.",
  button: {
    label: "Retry",
    onClick: () => saveAgain()
  },
  variantName: "error",
  duration: 8000 // Longer duration for errors
});
```

### Warning with Action

```tsx
toast({
  title: "Unsaved changes",
  description: "You have unsaved changes that will be lost.",
  button: {
    label: "Save now",
    onClick: () => saveChanges()
  },
  variantName: "warning"
});
```

### Info with Link

```tsx
toast({
  title: "New feature available",
  description: (
    <span>
      Check out our <a href="/features">new features page</a>.
    </span>
  ),
  variantName: "info"
});
```

### Processing with Manual Dismiss

```tsx
import { toast as sonnerToast } from 'sonner';

const toastId = toast({
  title: "Processing payment...",
  description: "Please do not close this window.",
  duration: Infinity,
  variantName: "info"
});

// When processing completes
processPayment()
  .then(() => {
    sonnerToast.dismiss(toastId);
    toast({
      title: "Payment successful",
      description: "Your payment has been processed.",
      variantName: "success"
    });
  })
  .catch(() => {
    sonnerToast.dismiss(toastId);
    toast({
      title: "Payment failed",
      description: "There was an error processing your payment.",
      variantName: "error"
    });
  });
```
