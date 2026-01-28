# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog] and this project adheres to [Semantic Versioning].

## [Unreleased]

## [0.1.1] - 2026-01-26

### Fixed

- Repository URLs updated from `components-kit/components-kit` to `components-kit/packages` in package.json
- Homepage URL updated to `https://componentskit.com`
- FOUC (Flash of Unstyled Content) prevention in TanStack Router example by moving CSS loading from client-side to build-time using Vite's `transformIndexHtml` hook
- LICENSE link in README now points to correct repository

### Changed

- CSS loading pattern in examples now uses build-time HTML injection instead of client-side `useEffect`
- Documentation updated with build-time CSS injection examples for Vite applications
- TanStack Router example updated to use non-deprecated `tanstackRouter` plugin API

## [0.1.0] - 2025-01-24

### Added

- Initial release of @components-kit/react with 16 headless, accessible React components:
  - **Alert**: Contextual feedback messages with icon, heading, description, and action button support
  - **Badge**: Small status indicator for labels and counts with `asChild` composition support
  - **Button**: Polymorphic button component with loading states, icons, and `asChild` composition pattern
  - **Checkbox**: Boolean selection input with indeterminate state support
  - **Heading**: Polymorphic heading component (h1-h6) with semantic hierarchy support
  - **Icon**: Flexible icon wrapper with consistent sizing and polymorphic rendering via `as` prop
  - **Input**: Text input component with type variants (text, email, password, number, tel, url, search, date, time)
  - **RadioGroup**: Radio button group container with RadioGroupItem for single selection from multiple options
  - **Select**: Dropdown selection component with keyboard navigation and custom rendering (requires `downshift` peer dependency)
  - **Separator**: Visual divider component with horizontal and vertical orientation support
  - **Skeleton**: Loading placeholder component with customizable dimensions for content loading states
  - **Slot**: Utility component for prop merging and `asChild` pattern implementation
  - **Switch**: Binary toggle control with checked and unchecked states
  - **Table**: Data table component with sorting, pagination, selection, and row expansion (requires `@tanstack/react-table` peer dependency)
  - **Text**: Polymorphic text element supporting p, span, strong, em, and other text elements
  - **Textarea**: Multi-line text input with auto-resize support
- Full TypeScript support with exported prop types and interfaces for all components
- WAI-ARIA accessibility compliance across all components following WCAG 2.1 guidelines
- Polymorphic component support via `as` prop (Button, Heading, Icon, Text)
- Component composition pattern via `asChild` prop (Button, Badge)
- Data attribute-based styling system (`data-variant`, `data-size`, `data-state`, etc.) for framework-agnostic CSS integration
- React 18 and React 19 support with zero runtime dependencies
- Comprehensive test suite with 100+ tests using Vitest and React Testing Library
- Example applications demonstrating component usage:
  - Next.js App Router example with server-side rendering and CSS loading
  - TanStack Router example with Vite bundler
- Complete documentation:
  - Component-specific README files with usage examples and API documentation
  - CONTRIBUTING.md with development guidelines and best practices
  - Package README with installation instructions, quick start guide, and integration examples
- Development tooling:
  - ESLint configuration for code quality
  - Prettier configuration for code formatting
  - Husky pre-commit hooks for automated checks
  - TypeScript strict mode configuration

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/
[Semantic Versioning]: https://semver.org/spec/v2.0.0.html
[Unreleased]: https://github.com/components-kit/packages/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/components-kit/packages/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/components-kit/packages/releases/tag/v0.1.0
