# ComponentsKit

[![npm version](https://img.shields.io/npm/v/@components-kit/react.svg)](https://www.npmjs.com/package/@components-kit/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> Headless, accessible React components with data attributes for CSS-based styling

Bi-directional Figma design system sync. CSS ships instantly—no code, no redeploy, no maintenance.

## Highlights

- **Headless/Unstyled** - Zero built-in styles, full control via `data-*` attributes
- **Accessible** - WAI-ARIA compliant with keyboard navigation support
- **Zero Dependencies** - Only peer dependencies (React, optional table/select libs)
- **TypeScript First** - Full type safety with exported interfaces
- **Polymorphic** - Render components as different HTML elements
- **Composable** - `asChild` pattern for flexible component composition

## Installation

```bash
npm install @components-kit/react
```

### Peer Dependencies

```bash
# Required
npm install react react-dom

# Optional - only if using Table component
npm install @tanstack/react-table

# Optional - only if using Select, Combobox, or MultiSelect
npm install downshift @floating-ui/react

# Optional - only if using Toast component
npm install sonner
```

## Quick Start

```tsx
import { Button, Input, Heading } from "@components-kit/react";

function App() {
  return (
    <div>
      <Heading as="h1" variantName="title">
        Welcome
      </Heading>
      <Input
        type="email"
        placeholder="Enter your email"
        variantName="default"
      />
      <Button variantName="primary" size="md">
        Get Started
      </Button>
    </div>
  );
}
```

## Styling Setup

ComponentsKit components are headless (unstyled). To apply styles, load the CSS bundle from the ComponentsKit API.

### 1. Get Your API Key

Sign up at [componentskit.com](https://componentskit.com) to get your API key.

### 2. Environment Variables

Create a `.env` file in your project root:

```bash
# For Next.js
NEXT_PUBLIC_COMPONENTS_KIT_URL=https://api.componentskit.com
NEXT_PUBLIC_COMPONENTS_KIT_KEY=your_api_key_here

# For Vite
VITE_COMPONENTS_KIT_URL=https://api.componentskit.com
VITE_COMPONENTS_KIT_KEY=your_api_key_here
```

### 3. Load Styles

#### Next.js App Router

```tsx
// app/layout.tsx
const BASE_URL = process.env.NEXT_PUBLIC_COMPONENTS_KIT_URL;
const API_KEY = process.env.NEXT_PUBLIC_COMPONENTS_KIT_KEY;
const BUNDLE_URL = `${BASE_URL}/v1/public/bundle.css?key=${API_KEY}`;
const FONTS_URL = `${BASE_URL}/v1/public/fonts.txt?key=${API_KEY}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link as="style" href={BUNDLE_URL} rel="preload" />
        <link href={BUNDLE_URL} rel="stylesheet" />
        <link href={FONTS_URL} rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### Vite / React SPA

Use Vite's `transformIndexHtml` hook to inject CSS at build time, preventing flash of unstyled content (FOUC):

```ts
// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  const BASE_URL = env.VITE_COMPONENTS_KIT_URL ?? "";
  const API_KEY = env.VITE_COMPONENTS_KIT_KEY ?? "";

  return {
    plugins: [
      react(),
      {
        name: "inject-components-kit-assets",
        transformIndexHtml(html) {
          return html
            .replace(
              /__BUNDLE_URL__/g,
              `${BASE_URL}/v1/public/bundle.css?key=${API_KEY}`,
            )
            .replace(
              /__FONTS_URL__/g,
              `${BASE_URL}/v1/public/fonts.txt?key=${API_KEY}`,
            );
        },
      },
    ],
  };
});
```

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <!-- Preconnect for fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Preload and load CSS bundle (render-blocking) -->
    <link rel="preload" href="__BUNDLE_URL__" as="style" />
    <link rel="stylesheet" href="__BUNDLE_URL__" />

    <!-- Load fonts -->
    <link rel="stylesheet" href="__FONTS_URL__" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Core Concepts

### Headless Components with Data Attributes

All components are unstyled and expose `data-*` attributes for CSS-based styling:

```tsx
<Button variantName="primary" size="lg" isLoading>
  Submit
</Button>
```

Renders with these attributes for styling:

```html
<button data-variant="primary" data-size="lg" data-loading="true">
  Submit
</button>
```

### Polymorphic Components

Some components support the `as` prop to render as different HTML elements:

```tsx
// Renders as <h2>
<Heading as="h2" variantName="section-title">Section</Heading>

// Renders as <span>
<Text as="span" variantName="caption">Inline text</Text>

// Renders as <a>
<Button as="a" href="/home" variantName="link">Go Home</Button>
```

**Polymorphic components:** Button, Heading, Text

### Composition with asChild

Components supporting `asChild` merge their props onto their child element:

```tsx
import { Button } from "@components-kit/react";
import Link from "next/link";

// Button behavior with Link rendering
<Button asChild variantName="primary">
  <Link href="/dashboard">Dashboard</Link>
</Button>;
```

**Components with asChild:** Button, Badge

## Components

| Component                                                       | Description                                                                                                  | Optional Deps                     |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| [Alert](libs/react/src/components/alert/README.md)              | Contextual feedback messages with heading, description, and action                                           | -                                 |
| [Badge](libs/react/src/components/badge/README.md)              | Small status indicator for labels and counts                                                                 | -                                 |
| [Button](libs/react/src/components/button/README.md)            | Polymorphic button with loading, icons, and composition support                                              | -                                 |
| [Checkbox](libs/react/src/components/checkbox/README.md)        | Boolean selection with indeterminate state support                                                           | -                                 |
| [Heading](libs/react/src/components/heading/README.md)          | Polymorphic heading (h1-h6) with semantic hierarchy                                                          | -                                 |
| [Icon](libs/react/src/components/icon/README.md)                | Icon wrapper with size variants (sm/md/lg) for icon library components                                       | -                                 |
| [Input](libs/react/src/components/input/README.md)              | Text input with type variants                                                                                | -                                 |
| [Pagination](libs/react/src/components/pagination/README.md)    | Accessible pagination with offset (numeric) and cursor-based modes                                           | -                                 |
| [Progress](libs/react/src/components/progress/README.md)        | Linear progress bar with label, determinate/indeterminate modes                                              | -                                 |
| [RadioGroup](libs/react/src/components/radio-group/README.md)   | Radio button group with RadioGroupItem                                                                       | -                                 |
| [Select](libs/react/src/components/select/README.md)            | Dropdown select with keyboard navigation, type-ahead, placement, form integration, read-only, and error states | `downshift`, `@floating-ui/react` |
| [Combobox](libs/react/src/components/combobox/README.md)        | Searchable select with text input filtering, clearable, placement, form integration, read-only, error states, and async support | `downshift`, `@floating-ui/react` |
| [MultiSelect](libs/react/src/components/multi-select/README.md) | Multi-value select with tags, filtering, keyboard navigation, clearable, fixed tags, token separators, form integration, and error states | `downshift`, `@floating-ui/react` |
| [Separator](libs/react/src/components/separator/README.md)      | Visual divider (horizontal/vertical)                                                                         | -                                 |
| [Skeleton](libs/react/src/components/skeleton/README.md)        | Loading placeholder with customizable dimensions                                                             | -                                 |
| [Slider](libs/react/src/components/slider/README.md)            | Range input with keyboard navigation and pointer drag support                                                | -                                 |
| [Slot](libs/react/src/components/slot/README.md)                | Utility for prop merging and asChild pattern                                                                 | -                                 |
| [Switch](libs/react/src/components/switch/README.md)            | Binary toggle control                                                                                        | -                                 |
| [Table](libs/react/src/components/table/README.md)              | Data table with sorting, pagination (data slicing), selection, and expansion. Compose with Pagination for UI | `@tanstack/react-table`           |
| [Text](libs/react/src/components/text/README.md)                | Polymorphic text element (p, span, strong, em, etc.)                                                         | -                                 |
| [Textarea](libs/react/src/components/textarea/README.md)        | Multi-line text input with auto-resize                                                                       | -                                 |
| [Toast](libs/react/src/components/toast/README.md)              | Toast notification function with semantic markup                                                             | `sonner`                          |
| [Tabs](libs/react/src/components/tabs/README.md)                | Accessible tabs for organizing content into panels                                                           | -                                 |

## Toast Component Setup

The Toast component requires special setup since it uses [Sonner](https://sonner.emilkowal.ski/) for toast management.

### Installation

```bash
npm install sonner
```

### Setup

Import `<Toaster />` from `sonner` (not from `@components-kit/react`) and add it to your app root:

```tsx
// Next.js App Router - app/layout.tsx
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

```tsx
// Vite / React SPA - App.tsx
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      {/* your app */}
    </>
  );
}
```

### Usage

Import the `toast` function from `@components-kit/react`:

```tsx
import { toast } from "@components-kit/react";

function MyComponent() {
  return (
    <button
      onClick={() =>
        toast({
          title: "Success",
          description: "Your changes have been saved.",
          variantName: "success",
        })
      }
    >
      Save Changes
    </button>
  );
}
```

With action button:

```tsx
toast({
  title: "Item deleted",
  description: "The item has been removed from your list.",
  button: {
    label: "Undo",
    onClick: () => console.log("Undo clicked"),
  },
  variantName: "info",
});
```

## Accessibility

All components follow WAI-ARIA guidelines:

- **Semantic HTML** - Proper elements and roles
- **Keyboard Navigation** - Full keyboard support (Tab, Enter, Space, Arrow keys)
- **ARIA Attributes** - Correct aria-\* attributes for screen readers
- **Focus Management** - Visible focus indicators and logical focus order

Example accessibility features:

| Component   | Accessibility Features                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Alert       | `role="alert"`, `aria-live="polite"`                                                                                                                                     |
| Button      | `aria-disabled`, `aria-busy` for loading                                                                                                                                 |
| Checkbox    | Label association, `aria-invalid`                                                                                                                                        |
| Progress    | `role="progressbar"`, `aria-valuenow/min/max`, `aria-labelledby` for label                                                                                               |
| Select      | WAI-ARIA Listbox pattern, type-ahead search, `aria-haspopup="listbox"`, `aria-orientation="vertical"`, grouped options with `role="group"` + `aria-labelledby`, live region for selection changes |
| Combobox    | WAI-ARIA Combobox pattern, `aria-expanded`, `aria-controls`, `aria-required`, `aria-orientation="vertical"`, `aria-labelledby` on menu, grouped options with `role="group"` + `aria-labelledby`, `aria-busy` during loading, `role="alert"` on error, live region for selection and result count changes |
| MultiSelect | WAI-ARIA Combobox pattern, `aria-multiselectable`, `aria-orientation="vertical"`, `aria-required`, `aria-labelledby` on menu, grouped options with `role="group"` + `aria-labelledby`, tag keyboard navigation, live region for selection changes |
| Slider      | `role="slider"`, `aria-valuenow/min/max`, keyboard navigation                                                                                                            |
| Table       | `aria-sort`, `aria-selected`, keyboard navigation                                                                                                                        |
| Pagination  | `<nav>` landmark, `aria-current="page"`, `aria-disabled`, keyboard navigation                                                                                            |
| Toast       | `role="status"`, `aria-live="polite"`, Button component with `aria-disabled`, `aria-busy`, keyboard support |
| Tabs        | WAI-ARIA Tabs pattern, roving tabindex, `aria-orientation`                                                  |

## TypeScript

All components export their prop types:

```tsx
import { Button, ButtonProps } from "@components-kit/react";
import type { ColumnDef } from "@components-kit/react"; // Re-exported from TanStack

// Extend props
interface MyButtonProps extends ButtonProps {
  analyticsId: string;
}

// Generic components
import { Table } from "@components-kit/react";

interface User {
  id: string;
  name: string;
  email: string;
}

<Table<User> data={users} columns={columns} />;
```

## Examples

### Next.js App Router (SSR)

See the [Next.js example](example/next-app-router/README.md) for Server-Side Rendering with React Server Components.

### TanStack Router + Vite (CSR)

See the [TanStack Router example](example/tanstack-router/README.md) for Client-Side Rendering with Vite.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see [LICENSE](LICENSE) for details.
