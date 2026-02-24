# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-02-24

### Added

- Select, Combobox, MultiSelect: `defaultOpen` prop to open dropdown on mount
- Combobox: `disableFlip` prop to disable Floating UI flip middleware

### Changed

- Select, Combobox, MultiSelect: positioner is now always rendered (hidden when closed) for SSR and Downshift compatibility

## [1.0.0] - 2026-02-19

### Added

- 7 new headless, accessible React components:
  - **Combobox** - Autocomplete dropdown with async item loading (requires `downshift`)
  - **MultiSelect** - Multi-value selection with token display (requires `downshift`)
  - **Pagination** - Page navigation with first/previous/next/last buttons
  - **Progress** - Determinate and indeterminate progress bar
  - **Slider** - Range input with draggable thumb and orientation variants
  - **Tabs** - Tabbed content panels with keyboard navigation
  - **Toast** - Notification toasts via Sonner integration (requires `sonner`)
- Type-safe `variantName` via register pattern (`ComponentsKitVariants`, `VariantFor<T>`)
- `useExitTransition` hook for CSS exit animations
- Exported hooks: `useDebouncedCallback`, `useExitTransition`, `useFloating`, `useFloatingSelect`
- Select, Combobox, MultiSelect: form integration, `clearable`, `readOnly`, `error`, `openOnFocus`, `placement`, `maxDropdownHeight`
- MultiSelect: `fixedValues`, `tokenSeparators`, `maxDisplayedTags`
- Icon `size` prop (`sm`, `md`, `lg`)
- Select icon slot and `placement` prop
- Table footer row support
- New optional peer dependencies: `@floating-ui/react`, `sonner`

### Changed

- Icon restructured — no longer polymorphic, always renders `<span>`
- Alert icon now applied via CSS variant instead of `icon` prop
- Table built-in pagination removed in favor of standalone Pagination component
- Select API refactored for consistency with Combobox and MultiSelect
- Slider DOM restructured to sibling pattern for accessibility

### Removed

- `AsyncSelect` — functionality merged into Combobox
- Polymorphic `as` prop removed from Button and Icon

### Fixed

- Component audit: accessibility, `data-*` attributes, and memory leak fixes
- Slider thumb drag behavior, added `orientation` and `onValueCommit`
- Button `asChild` no longer loses nested icon children

## [0.1.1] - 2026-01-26

### Fixed

- Updated repository URL to correct GitHub location (`components-kit/packages`)
- Updated homepage to `https://componentskit.com`
- Fixed LICENSE link in README

## [0.1.0] - 2025-01-24

### Added

- Initial release of @components-kit/react
- 16 headless, accessible React components:
  - **Alert** - Contextual feedback messages with icon, heading, description, and action
  - **Badge** - Small status indicator for labels and counts
  - **Button** - Polymorphic button with loading states, icons, and asChild composition
  - **Checkbox** - Boolean selection with indeterminate state support
  - **Heading** - Polymorphic heading (h1-h6) with semantic hierarchy
  - **Icon** - Flexible icon wrapper with consistent sizing
  - **Input** - Text input with type variants
  - **RadioGroup** - Radio button group with RadioGroupItem
  - **Select** - Dropdown with keyboard navigation (requires `downshift`)
  - **Separator** - Visual divider (horizontal/vertical)
  - **Skeleton** - Loading placeholder with customizable dimensions
  - **Slot** - Utility for prop merging and asChild pattern
  - **Switch** - Binary toggle control
  - **Table** - Data table with sorting, pagination, selection (requires `@tanstack/react-table`)
  - **Text** - Polymorphic text element (p, span, strong, em, etc.)
  - **Textarea** - Multi-line text input with auto-resize
- Full TypeScript support with exported prop types
- WAI-ARIA accessibility compliance
- Data attribute-based styling (`data-variant`, `data-size`, `data-state`, etc.)
- Polymorphic component support via `as` prop
- Composition pattern via `asChild` prop
- React 18 and React 19 support
