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

# Optional - only if using Select component
npm install downshift
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

```tsx
// App.tsx or main.tsx
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_COMPONENTS_KIT_URL;
const API_KEY = import.meta.env.VITE_COMPONENTS_KIT_KEY;
const BUNDLE_URL = `${BASE_URL}/v1/public/bundle.css?key=${API_KEY}`;
const FONTS_URL = `${BASE_URL}/v1/public/fonts.txt?key=${API_KEY}`;

function App() {
  useEffect(() => {
    // Preload CSS bundle
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.href = BUNDLE_URL;
    preload.as = "style";
    document.head.appendChild(preload);

    // Load CSS bundle
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = BUNDLE_URL;
    document.head.appendChild(stylesheet);

    // Load fonts
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href = FONTS_URL;
    document.head.appendChild(fonts);
  }, []);

  return <>{/* your app */}</>;
}
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

**Polymorphic components:** Button, Heading, Icon, Text

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

| Component                                                     | Description                                                              | Optional Deps           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------- |
| [Alert](libs/react/src/components/alert/README.md)            | Contextual feedback messages with icon, heading, description, and action | -                       |
| [Badge](libs/react/src/components/badge/README.md)            | Small status indicator for labels and counts                             | -                       |
| [Button](libs/react/src/components/button/README.md)          | Polymorphic button with loading, icons, and composition support          | -                       |
| [Checkbox](libs/react/src/components/checkbox/README.md)      | Boolean selection with indeterminate state support                       | -                       |
| [Heading](libs/react/src/components/heading/README.md)        | Polymorphic heading (h1-h6) with semantic hierarchy                      | -                       |
| [Icon](libs/react/src/components/icon/README.md)              | Flexible icon wrapper with consistent sizing                             | -                       |
| [Input](libs/react/src/components/input/README.md)            | Text input with type variants                                            | -                       |
| [RadioGroup](libs/react/src/components/radio-group/README.md) | Radio button group with RadioGroupItem                                   | -                       |
| [Select](libs/react/src/components/select/README.md)          | Dropdown with keyboard navigation and custom rendering                   | `downshift`             |
| [Separator](libs/react/src/components/separator/README.md)    | Visual divider (horizontal/vertical)                                     | -                       |
| [Skeleton](libs/react/src/components/skeleton/README.md)      | Loading placeholder with customizable dimensions                         | -                       |
| [Slot](libs/react/src/components/slot/README.md)              | Utility for prop merging and asChild pattern                             | -                       |
| [Switch](libs/react/src/components/switch/README.md)          | Binary toggle control                                                    | -                       |
| [Table](libs/react/src/components/table/README.md)            | Data table with sorting, pagination, selection, and expansion            | `@tanstack/react-table` |
| [Text](libs/react/src/components/text/README.md)              | Polymorphic text element (p, span, strong, em, etc.)                     | -                       |
| [Textarea](libs/react/src/components/textarea/README.md)      | Multi-line text input with auto-resize                                   | -                       |

## Accessibility

All components follow WAI-ARIA guidelines:

- **Semantic HTML** - Proper elements and roles
- **Keyboard Navigation** - Full keyboard support (Tab, Enter, Space, Arrow keys)
- **ARIA Attributes** - Correct aria-\* attributes for screen readers
- **Focus Management** - Visible focus indicators and logical focus order

Example accessibility features:

| Component | Accessibility Features                            |
| --------- | ------------------------------------------------- |
| Alert     | `role="alert"`, `aria-live="polite"`              |
| Button    | `aria-disabled`, `aria-busy` for loading          |
| Checkbox  | Label association, `aria-invalid`                 |
| Select    | ARIA listbox pattern, type-ahead search           |
| Table     | `aria-sort`, `aria-selected`, keyboard navigation |

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
