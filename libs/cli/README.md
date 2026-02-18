# @components-kit/cli

> CLI tool for generating type-safe variant definitions from the ComponentsKit API

## Installation

```bash
npm install -D @components-kit/cli
```

## Quick Start

```bash
# 1. Create config file
npx ck init

# 2. Generate types
npx ck generate
```

This creates `types/components-kit.d.ts` which augments `@components-kit/react` with your project's variant names, enabling autocomplete and build-time validation for `variantName` props.

## Commands

### `ck init`

Creates a `components-kit.config.json` with default settings:

```json
{
  "apiUrl": "https://api.componentskit.com",
  "output": "types/components-kit.d.ts"
}
```

### `ck generate`

Fetches component variants from the API and generates a TypeScript declaration file.

```bash
# Use config defaults
npx ck generate

# Override API URL
npx ck generate --api-url http://localhost:8080

# Override output path
npx ck generate --output src/types/variants.d.ts

# Check mode (for CI/CD) — exits with code 1 if types are out of date
npx ck generate --check
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <path>` | Output file path | From config or `types/components-kit.d.ts` |
| `--api-url <url>` | API base URL | From config or `https://api.componentskit.com` |
| `--check` | Check if types are up to date (CI/CD) | `false` |

## Generated Output

The generated `.d.ts` file augments the `ComponentsKitVariants` interface via TypeScript module declaration merging:

```ts
// types/components-kit.d.ts (auto-generated)
declare module "@components-kit/react" {
  interface ComponentsKitVariants {
    button: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "icon";
    badge: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
    // ... all components
  }
}

export {};
```

Once generated, `variantName` props narrow from `string` to the specific union:

```tsx
// Autocomplete suggests "primary", "secondary", etc.
<Button variantName="primary">Submit</Button>

// TypeScript error: Type '"invalid"' is not assignable
<Button variantName="invalid">Submit</Button>
```

## tsconfig Setup

Ensure the generated file is included in your TypeScript compilation:

```json
{
  "include": ["src", "types"]
}
```

## Configuration

The `components-kit.config.json` file supports:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiUrl` | `string` | `"https://api.componentskit.com"` | API base URL for fetching variants |
| `output` | `string` | `"types/components-kit.d.ts"` | Output path for generated types |

## CI/CD Integration

Use `--check` to verify types are up to date in your CI pipeline:

```yaml
# GitHub Actions example
- name: Check variant types
  run: npx ck generate --check
```

This exits with code 1 if the generated file would differ from the existing one, prompting developers to run `ck generate` locally.
