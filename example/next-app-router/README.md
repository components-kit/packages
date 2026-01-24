# Next.js App Router Example

Server-Side Rendering (SSR) example using @components-kit/react with Next.js 15.

## Overview

This example demonstrates using ComponentsKit components in a Next.js App Router application with React Server Components support.

## Tech Stack

- **Next.js** 15.x (App Router)
- **React** 19.x
- **TypeScript** 5.x
- **@components-kit/react** (local)
- **@tanstack/react-table** (for Table component)
- **downshift** (for Select component)

## Getting Started

### Prerequisites

- Node.js >= 16
- pnpm (recommended)

### Installation

```bash
cd packages/example/next-app-router
pnpm install
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
    layout.tsx    # Root layout with metadata
    page.tsx      # Component showcase page
    globals.css   # Global styles / CSS reset
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

This example includes both optional peer dependencies:

- `@tanstack/react-table` - Required for the Table component
- `downshift` - Required for the Select component

## Component Showcase

The example demonstrates all 16 components:

1. **Alert** - Contextual feedback with icon, heading, action
2. **Badge** - Status indicators with size variants
3. **Button** - With icons, loading states, asChild pattern
4. **Checkbox** - Controlled and uncontrolled modes
5. **Heading** - Semantic heading levels (h1-h6)
6. **Icon** - Icon wrapper with sizing
7. **Input** - Text, email, and other input types
8. **RadioGroup** - Single selection from options
9. **Select** - Dropdown with keyboard navigation
10. **Separator** - Horizontal and vertical dividers
11. **Skeleton** - Loading placeholders
12. **Slot** - Composition utility (used internally)
13. **Switch** - Toggle controls
14. **Table** - Data table with sorting, pagination
15. **Text** - Semantic text elements
16. **Textarea** - Multi-line input with auto-resize

## Learn More

- [ComponentsKit Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
