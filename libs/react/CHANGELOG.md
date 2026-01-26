# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-01-26

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
