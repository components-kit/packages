# Contributing to ComponentsKit

Thank you for your interest in contributing to ComponentsKit! We welcome contributions from the community.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building an inclusive community where everyone can contribute.

## Getting Started

### Prerequisites

- Node.js >= 16
- pnpm >= 8 (we use pnpm for package management)

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/components-kit.git
cd components-kit/packages
```

3. Install dependencies:

```bash
pnpm install
```

4. Verify setup by running tests:

```bash
pnpm test:run
```

## Contribution Workflow

We use a **fork-based workflow** (standard for open-source projects):

1. **Fork** the repository to your GitHub account
2. **Clone** your fork locally
3. **Create a branch** for your changes
4. **Push** to your fork
5. **Open a PR** to the `main` branch

### Step-by-Step

```bash
# 1. Fork via GitHub UI, then clone your fork
git clone https://github.com/YOUR_USERNAME/packages.git
cd packages

# 2. Add upstream remote (to sync with main repo)
git remote add upstream https://github.com/components-kit/packages.git

# 3. Create a feature branch
git checkout -b feat/my-new-feature

# 4. Make changes, then commit using conventional commits
git commit -m "feat: add new feature"

# 5. Push to your fork
git push origin feat/my-new-feature

# 6. Open a Pull Request via GitHub UI
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development mode with watch |
| `pnpm build` | Build the library |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:ui` | Run tests with UI |
| `pnpm test:run` | Run tests once |
| `pnpm lint` | Run ESLint |

### Project Structure

```
packages/
  libs/react/
    src/
      components/       # Component source files
        button/
          button.tsx
          button.test.tsx
          index.ts
          README.md
      types/            # TypeScript type definitions
      utils/            # Utility functions
      index.tsx         # Main exports
  example/
    next-app-router/    # Next.js example
    tanstack-router/    # Vite + TanStack Router example
```

## Creating a Component

### File Structure

Each component should have its own folder with:

```
component-name/
  component-name.tsx       # Component implementation
  component-name.test.tsx  # Tests
  index.ts                 # Exports
  README.md                # Documentation
```

### Code Style Guidelines

1. **Use `forwardRef`** - All components must forward refs for DOM access

```tsx
"use client";

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />;
});

Button.displayName = "Button";
```

2. **Data Attributes** - Use `data-*` attributes for styling hooks

```tsx
<button
  data-ck="button"
  data-variant={variantName}
  data-size={size}
  data-loading={isLoading || undefined}
>
```

3. **JSDoc Documentation** - Add comprehensive JSDoc comments

```tsx
/**
 * A button component with loading and icon support.
 *
 * @description
 * Detailed description of the component...
 *
 * ## Accessibility
 * - Keyboard navigation details
 * - ARIA attributes used
 *
 * @example
 * <Button variantName="primary">Click me</Button>
 */
```

4. **TypeScript** - Export both component and props type

```tsx
export { Button, type ButtonProps };
```

### Accessibility Requirements

All components must:

- Use semantic HTML elements
- Include proper ARIA attributes
- Support keyboard navigation
- Work with screen readers
- Follow WAI-ARIA guidelines

## Testing

### Running Tests

```bash
# Watch mode
pnpm test

# Interactive UI
pnpm test:ui

# Single run (CI)
pnpm test:run
```

### Writing Tests

We use Vitest with React Testing Library:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies data attributes', () => {
    render(<Button variantName="primary" size="lg">Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'lg');
  });
});
```

## Pull Request Process

### Branch Naming

Use descriptive branch names:

- `feat/button-loading-state` - New features
- `fix/input-focus-ring` - Bug fixes
- `docs/readme-update` - Documentation
- `refactor/select-cleanup` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add loading state to Button component
fix: correct focus ring color on Input
docs: update Select component examples
test: add Checkbox indeterminate state tests
refactor: simplify Table pagination logic
```

### PR Checklist

Before submitting a pull request, ensure:

- [ ] Tests pass (`pnpm test:run`)
- [ ] Linting passes (`pnpm lint`)
- [ ] New components have README.md
- [ ] Props are documented with JSDoc
- [ ] Accessibility guidelines are followed
- [ ] Changes are exported from index.tsx if needed

**Note:** You do NOT need to update CHANGELOG.md - maintainers handle this at release time.

### Review Process

1. Create a pull request with a clear description
2. Link any related issues
3. Wait for CI checks to pass
4. Address review feedback
5. Once approved, maintainers will merge

## CHANGELOG Maintenance

### Policy: Maintainer-Updated at Release Time

**Contributors do NOT need to update CHANGELOG.md in their PRs.** The CHANGELOG is maintained by project maintainers at release time.

### Why This Approach?

- Reduces merge conflicts during active development
- Lower overhead for external contributors
- Maintainers review all changes holistically at release time
- Your Conventional Commit messages help us track changes

### What Contributors Should Do

Instead of updating CHANGELOG, please:

1. **Write clear Conventional Commits** - We use your commit messages to build the CHANGELOG:
   ```
   feat: add loading state to Button
   fix: correct focus ring on Input
   docs: update README examples
   ```

2. **Describe changes in your PR** - Provide a clear description of what changed and why

3. **Link related issues** - Reference any issues your PR addresses

### For Maintainers: Release Process

When cutting a new release:

1. Review all merged PRs and commits since last release:
   ```bash
   git log v0.1.1..HEAD --oneline
   ```

2. Update CHANGELOG.md with all changes in appropriate sections (Added, Changed, Fixed, etc.)

3. Follow [Keep a Changelog](https://keepachangelog.com/) format

4. Create release commit:
   ```bash
   # Edit CHANGELOG.md and libs/react/CHANGELOG.md
   # Bump version in package.json files
   git add CHANGELOG.md libs/react/CHANGELOG.md libs/react/package.json
   git commit -m "chore: release v0.1.2"
   git tag v0.1.2
   git push && git push --tags
   ```

5. Publish to npm: `npm publish`

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- Component name and version
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment details
- Code sample or reproduction link

### Feature Requests

For new features:

- Describe the use case
- Explain the proposed API
- Consider accessibility implications
- Include examples if possible

## License

By contributing to ComponentsKit, you agree that your contributions will be licensed under the [MIT License](LICENSE).
