# @components-kit/react

> Headless, accessible React components with data attributes for CSS-based styling

This is the core React component library for ComponentsKit.

## Documentation

See the [main README](../../README.md) for full documentation including:

- Installation & peer dependencies
- Quick start guide
- Styling setup (Next.js, Vite)
- Component API reference
- Accessibility guide
- TypeScript usage

## Type-Safe Variants

All `variantName` props use the `VariantFor<T>` type, which accepts any `string` by default. To enable autocomplete and build-time validation, use `@components-kit/cli` to generate type augmentations:

```bash
npm install -D @components-kit/cli
npx ck init && npx ck generate
```

See the [@components-kit/cli README](../cli/README.md) for details.

## Component READMEs

Each component has its own detailed README in `src/components/<name>/README.md`:

| Component | README |
|-----------|--------|
| Alert | [README](src/components/alert/README.md) |
| Badge | [README](src/components/badge/README.md) |
| Button | [README](src/components/button/README.md) |
| Checkbox | [README](src/components/checkbox/README.md) |
| Combobox | [README](src/components/combobox/README.md) |
| Heading | [README](src/components/heading/README.md) |
| Icon | [README](src/components/icon/README.md) |
| Input | [README](src/components/input/README.md) |
| MultiSelect | [README](src/components/multi-select/README.md) |
| Pagination | [README](src/components/pagination/README.md) |
| Progress | [README](src/components/progress/README.md) |
| RadioGroup | [README](src/components/radio-group/README.md) |
| Select | [README](src/components/select/README.md) |
| Separator | [README](src/components/separator/README.md) |
| Skeleton | [README](src/components/skeleton/README.md) |
| Slider | [README](src/components/slider/README.md) |
| Slot | [README](src/components/slot/README.md) |
| Switch | [README](src/components/switch/README.md) |
| Table | [README](src/components/table/README.md) |
| Tabs | [README](src/components/tabs/README.md) |
| Text | [README](src/components/text/README.md) |
| Textarea | [README](src/components/textarea/README.md) |
| Toast | [README](src/components/toast/README.md) |
