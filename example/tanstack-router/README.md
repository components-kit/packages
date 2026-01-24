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
- **@tanstack/react-table** (for Table component)
- **downshift** (for Select component)

## Getting Started

### Prerequisites

- Node.js >= 16
- pnpm (recommended)

### Installation

```bash
cd packages/example/tanstack-router
pnpm install
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
    __root.tsx          # Root layout route
    index.tsx           # Home page (component showcase)
```

## Key Implementation Notes

### No "use client" Needed

Unlike Next.js, Vite applications don't require the `"use client"` directive since all code runs on the client by default.

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
