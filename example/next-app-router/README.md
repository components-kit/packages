# Next.js App Router Example

Server-Side Rendering (SSR) example using @components-kit/react with Next.js 15.

## Overview

This example demonstrates using ComponentsKit components in a Next.js App Router application with React Server Components support.

## Tech Stack

- **Next.js** 15.x (App Router)
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
cd packages/example/next-app-router
pnpm install
```

### Environment Setup

This example loads environment variables from `packages/example/.env` (via `next.config.ts`).

From the repository root:

```bash
cp example/.env.example example/.env
```

Then update `example/.env` with your ComponentsKit values:

```bash
NEXT_PUBLIC_COMPONENTS_KIT_URL=https://api.componentskit.com
NEXT_PUBLIC_COMPONENTS_KIT_KEY=your_api_key_here
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the example.

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
  app/
    layout.tsx    # Root layout + CSS/font bundle loading + <Toaster />
    page.tsx      # Component showcase page
    globals.css   # Global styles / CSS reset
next.config.ts   # Loads ../.env and transpiles local workspace packages
```

## Key Implementation Notes

### "use client" Directive

ComponentsKit components use client-side React features (hooks, event handlers). When using them in Server Components, you need to wrap them or use in client components:

```tsx
'use client';

import { Button } from '@components-kit/react';

export function MyComponent() {
  return <Button variantName="primary">Click me</Button>;
}
```

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

## Learn More

- [ComponentsKit Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
