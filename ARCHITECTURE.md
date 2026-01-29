# ComponentsKit Architecture

## Overall Overview

**ComponentsKit** is a modern, headless React component library designed for accessibility and TypeScript safety. It's a monorepo with:

- **20 accessible components** with zero production dependencies
- **Headless/unstyled design** — all styling via `data-*` attributes for CSS
- **Figma design system sync** — CSS updates without code redeployment
- **Polymorphic components** — render as any HTML element via `as` prop

---

## Detailed Breakdown

### Package Structure

| Location | Purpose |
|----------|---------|
| `libs/react/` | Main component library (`@components-kit/react`) |
| `example/next-app-router/` | Next.js 15 SSR example |
| `example/tanstack-router/` | Vite + TanStack Router CSR example |

### Components (20 total)

| Component | Lines | Complexity | Key Features |
|-----------|-------|------------|--------------|
| Table | 870+ | High | Sorting, pagination, filtering, row selection (TanStack Table) |
| Select | 550 | High | Dropdown with groups, type-ahead, keyboard nav (Downshift) |
| Tabs | ~300 | Medium | Roving tabindex, keyboard nav, controlled/uncontrolled (useTabs hook) |
| Slot | 267 | Medium | Enables `asChild` pattern, smart prop merging |
| Icon | 178 | Medium | Polymorphic, aria-hidden by default |
| Button | 168 | Medium | Polymorphic, asChild, loading states |
| Toast | ~150 | Medium | Sonner integration, semantic markup, action button |
| Textarea | ~150 | Low | Auto-resize support |
| Progress | ~150 | Low | Label, determinate/indeterminate, CSS custom property |
| Input | ~120 | Low | Text input variants |
| Checkbox | ~120 | Low | Indeterminate state |
| Switch | ~100 | Low | Toggle control |
| RadioGroup | ~100 | Low | Radio group pattern |
| Alert | ~80 | Low | Icon, heading, description, action |
| Badge | ~60 | Low | Status indicator, asChild |
| Heading | ~50 | Low | Polymorphic h1-h6 |
| Text | ~50 | Low | Polymorphic text |
| Separator | ~40 | Low | Visual divider |
| Skeleton | ~40 | Low | Loading placeholder |
| Slider | ~200 | Medium | Keyboard nav, pointer drag, controlled/uncontrolled (useSlider hook) |

### Core Patterns

1. **Polymorphic** — Components render as different elements: `<Button as="a">`
2. **AsChild** — Merge props with children via Slot: `<Button asChild><Link/></Button>`
3. **Data Attributes** — Styling hooks: `data-variant`, `data-size`, `data-loading`
4. **Accessibility** — ARIA compliant, keyboard navigation, semantic HTML

---

## Architecture Chart

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          COMPONENTSKIT MONOREPO                          │
│                              /packages                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   libs/react    │      │ example/next-   │      │ example/tanstack│
│ @components-kit │      │   app-router    │      │     -router     │
│     /react      │      │   (Next.js 15)  │      │  (Vite + CSR)   │
└────────┬────────┘      └─────────────────┘      └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           src/components/                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Button    │  │   Select    │  │    Table    │  │    Slot     │    │
│  │ polymorphic │  │  downshift  │  │  tanstack   │  │   asChild   │    │
│  │   asChild   │  │   groups    │  │   sorting   │  │ prop merge  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Input    │  │  Textarea   │  │  Checkbox   │  │   Switch    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ RadioGroup  │  │    Alert    │  │    Badge    │  │    Icon     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Heading   │  │    Text     │  │  Separator  │  │  Skeleton   │    │
│  │ polymorphic │  │ polymorphic │  │             │  │             │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Toast    │  │    Tabs     │  │  Progress   │  │   Slider    │    │
│  │   sonner    │  │ roving tab  │  │  label/a11y │  │  drag/keys  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           src/utils/ & types/                            │
├─────────────────────────────────────────────────────────────────────────┤
│  forward-ref.ts ─── polymorphicForwardRef(), createPolymorphicComponent │
│  types/index.ts ─── PolymorphicComponentProps, PolymorphicRef           │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            OUTPUT (data-*)                               │
├─────────────────────────────────────────────────────────────────────────┤
│  <button data-variant="primary" data-size="lg" data-loading="true">     │
│                              ↓                                           │
│  CSS from Figma Design System (loaded at runtime or build-time)          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Dependency Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    PEER DEPENDENCIES                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Required:                  Optional:                                    │
│  ┌─────────────┐           ┌─────────────┐  ┌──────────────┐  ┌────────┐│
│  │  React 18+  │           │  downshift  │  │ @tanstack/   │  │ sonner ││
│  │  or 19      │           │   (9.0+)    │  │ react-table  │  │ (2.0+) ││
│  └──────┬──────┘           └──────┬──────┘  └──────┬───────┘  └───┬────┘│
│         │                         │                 │              │     │
│         ▼                         ▼                 ▼              ▼     │
│  All Components              Select only       Table only     Toast only │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
packages/
├── libs/react/                      # Main library
│   ├── src/
│   │   ├── components/              # 20 component directories
│   │   │   ├── alert/
│   │   │   ├── badge/
│   │   │   ├── button/
│   │   │   ├── checkbox/
│   │   │   ├── heading/
│   │   │   ├── icon/
│   │   │   ├── input/
│   │   │   ├── progress/
│   │   │   ├── radio-group/
│   │   │   ├── select/
│   │   │   ├── separator/
│   │   │   ├── skeleton/
│   │   │   ├── slider/
│   │   │   ├── slot/
│   │   │   ├── switch/
│   │   │   ├── table/
│   │   │   ├── tabs/
│   │   │   ├── text/
│   │   │   ├── textarea/
│   │   │   └── toast/
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── utils/                   # Utility functions
│   │   └── index.tsx                # Main export barrel
│   ├── package.json
│   └── tsup.config.ts               # Build configuration
├── example/
│   ├── next-app-router/             # Next.js 15 SSR example
│   └── tanstack-router/             # Vite CSR example
├── package.json                     # Root workspace config
├── pnpm-workspace.yaml
├── tsconfig.json
├── vitest.config.ts
└── eslint.config.mjs
```

---

## Key Design Decisions

1. **Headless/Unstyled First** — No CSS dependencies, enabling clean separation of concerns and Figma sync
2. **Zero Dependencies** — Only peer dependencies, minimal bundle footprint
3. **TypeScript-First** — Full type safety with exported interfaces and generics
4. **Polymorphic by Design** — Most components support the `as` prop for flexibility
5. **Composition Pattern** — Slot/asChild pattern enables powerful component composition
6. **Data Attributes for Styling** — Clean, CSS-friendly attributes (`data-variant`, `data-size`, etc.)
7. **Semantic HTML** — Proper elements and roles for accessibility
8. **Accessibility Default** — ARIA attributes, keyboard navigation built-in by default

---

## Scripts

```bash
pnpm build        # Build @components-kit/react
pnpm dev          # Watch mode development
pnpm lint         # Run ESLint
pnpm test:run     # Run tests once
pnpm test:ui      # Run tests with UI dashboard
```
