# TanStack Router + Vite Example

Client-Side Rendering (CSR) example using @components-kit/react with Vite and TanStack Router.

## Overview

This example demonstrates using ComponentsKit components in a Vite-powered single-page application with TanStack Router for client-side routing.

## Tech Stack

- **Vite** 6.x
- **TanStack Router** 1.x
- **React** 19.x
- **TypeScript** 5.x
- **@components-kit/react** (local)
- **@floating-ui/react** (for Select, Combobox, MultiSelect)
- **@tanstack/react-table** (for Table component)
- **downshift** (for Select, Combobox, MultiSelect)
- **sonner** (for Toast component)

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended)

### Installation

```bash
cd packages/example/tanstack-router
pnpm install
```

### Environment Setup

This example loads environment variables from `packages/example/.env` (via Vite `envDir: ".."`).

From the repository root:

```bash
cp example/.env.example example/.env
```

Then update `example/.env` with your ComponentsKit values:

```bash
VITE_COMPONENTS_KIT_URL=https://api.componentskit.com
VITE_COMPONENTS_KIT_KEY=your_api_key_here
```

### Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view the example.

### Production Build

```bash
pnpm build
pnpm preview
```

## Project Structure

```
src/
  main.tsx              # Application entry point
  routeTree.gen.ts      # Auto-generated route tree
  index.css             # Global styles
  routes/
    __root.tsx          # Root layout route (+ <Toaster />)
    index.tsx           # Home page (component showcase)
index.html              # HTML with CSS/fonts placeholders
vite.config.ts          # Vite config with envDir + build-time URL injection
```

## Key Implementation Notes

### No "use client" Needed

Unlike Next.js, Vite applications don't require the `"use client"` directive since all code runs on the client by default.

### CSS and Fonts Loading

CSS and fonts are loaded at build time using Vite's `transformIndexHtml` hook to prevent flash of unstyled content (FOUC):

1. **index.html** contains placeholder URLs (`__BUNDLE_URL__`, `__FONTS_URL__`)
2. **vite.config.ts** replaces placeholders with actual URLs at build/dev time
3. CSS links in `<head>` are render-blocking, ensuring styles load before content

```ts
// vite.config.ts
{
  name: "inject-components-kit-assets",
  transformIndexHtml(html) {
    return html
      .replace(/__BUNDLE_URL__/g, `${BASE_URL}/v1/public/bundle.min.css?key=${API_KEY}`)
      .replace(/__FONTS_URL__/g, `${BASE_URL}/v1/public/fonts.css?key=${API_KEY}`);
  },
}
```

### File-Based Routing

TanStack Router uses file-based routing with explicit route definitions:

```tsx
// routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return <div>...</div>;
}
```

### Auto Code Splitting

TanStack Router Vite plugin enables automatic code splitting for routes, improving initial load performance.

### Optional Dependencies

This example includes all optional peer dependencies needed by the showcased components:

- `@tanstack/react-table` - Required for the Table component
- `downshift` - Required for Select, Combobox, and MultiSelect
- `@floating-ui/react` - Required for Select, Combobox, and MultiSelect positioning
- `sonner` - Required for the Toast component

## Component Showcase

The example demonstrates 22 components:

1. **Alert** - Contextual feedback with icon, heading, action
2. **Badge** - Status indicators with size variants
3. **Button** - With icons, loading states, asChild pattern
4. **Checkbox** - Controlled and uncontrolled modes
5. **Combobox** - Searchable select with filtering
6. **Heading** - Semantic heading levels (h1-h6)
7. **Icon** - Icon wrapper with sizing
8. **Input** - Text, email, and other input types
9. **MultiSelect** - Multi-value selection with tags
10. **Pagination** - Accessible pagination patterns
11. **Progress** - Determinate and indeterminate progress states
12. **RadioGroup** - Single selection from options
13. **Select** - Dropdown with keyboard navigation
14. **Separator** - Horizontal and vertical dividers
15. **Skeleton** - Loading placeholders
16. **Slider** - Range input with keyboard support
17. **Switch** - Toggle controls
18. **Table** - Data table with sorting, pagination
19. **Tabs** - Accessible tabbed panels with keyboard navigation
20. **Text** - Semantic text elements
21. **Textarea** - Multi-line input with auto-resize
22. **Toast** - Notifications with Sonner integration

## Comparison with Next.js

| Aspect | This Example (Vite) | Next.js Example |
|--------|---------------------|-----------------|
| **Rendering** | CSR (Client-Side) | SSR (Server-Side) |
| **Build Tool** | Vite | Next.js built-in |
| **Routing** | TanStack Router | File-based (App Router) |
| **Dev Server** | Fast HMR | Fast Refresh |
| **Use Case** | SPAs, client-heavy apps | Full-stack, SEO apps |

## Learn More

- [ComponentsKit Documentation](../../README.md)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Vite Documentation](https://vitejs.dev)
