# Pagination

An accessible pagination component supporting both numeric page navigation (offset mode) and cursor-based pagination.

## Usage

```tsx
import { Pagination } from '@components-kit/react';

// Basic offset mode (uncontrolled)
<Pagination totalPages={10} defaultPage={1} />

// Controlled offset mode
const [page, setPage] = useState(1);
<Pagination totalPages={10} page={page} onPageChange={setPage} />

// With custom siblings
<Pagination totalPages={20} defaultPage={10} siblings={2} />

// With first/last buttons
<Pagination totalPages={50} defaultPage={1} showFirstLast />

// Cursor-based mode
<Pagination
  hasNextPage={data.hasNext}
  hasPreviousPage={data.hasPrevious}
  onNext={() => fetchNext()}
  onPrevious={() => fetchPrevious()}
/>

// Cursor mode with first/last buttons
<Pagination
  hasNextPage={true}
  hasPreviousPage={true}
  onNext={() => fetchNext()}
  onPrevious={() => fetchPrevious()}
  showFirstLast
  onFirst={() => fetchFirst()}
  onLast={() => fetchLast()}
/>

// Disabled
<Pagination totalPages={10} defaultPage={3} disabled />

// With variant
<Pagination totalPages={10} defaultPage={1} variantName="compact" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `totalPages` | `number` | - | Total pages. Enables offset mode when provided. |
| `page` | `number` | - | Controlled current page (1-based) |
| `defaultPage` | `number` | `1` | Initial page for uncontrolled mode |
| `onPageChange` | `(page: number) => void` | - | Callback on page change (offset mode) |
| `siblings` | `number` | `1` | Sibling pages on each side of current |
| `disabled` | `boolean` | - | Disables all buttons |
| `showFirstLast` | `boolean` | `false` | Show first/last navigation buttons |
| `variantName` | `VariantFor<"pagination">` | - | Variant name for styling |
| `hasNextPage` | `boolean` | - | Next page available (cursor mode) |
| `hasPreviousPage` | `boolean` | - | Previous page available (cursor mode) |
| `onNext` | `() => void` | - | Next callback (cursor mode) |
| `onPrevious` | `() => void` | - | Previous callback (cursor mode) |
| `onFirst` | `() => void` | - | First callback (both modes) |
| `onLast` | `() => void` | - | Last callback (both modes) |
| `hasFirstPage` | `boolean` | - | First page available (cursor mode, defaults to `hasPreviousPage`) |
| `hasLastPage` | `boolean` | - | Last page available (cursor mode, defaults to `hasNextPage`) |

Also accepts all standard `nav` HTML attributes.

## Data Attributes

| Attribute | Applied On | Values | Description |
|-----------|-----------|--------|-------------|
| `data-ck="pagination"` | Root | `"pagination"` | Component identifier |
| `data-mode` | Root | `"offset"`, `"cursor"` | Current pagination mode |
| `data-variant` | Root | string | Variant name for styling |
| `data-disabled` | Root, buttons | `true` | Present when disabled |
| `data-ck="pagination-list"` | List | `"pagination-list"` | Button list container |
| `data-ck="pagination-page"` | Page button | `"pagination-page"` | Page number button |
| `data-ck="pagination-previous"` | Prev button | `"pagination-previous"` | Previous navigation button |
| `data-ck="pagination-next"` | Next button | `"pagination-next"` | Next navigation button |
| `data-ck="pagination-first"` | First button | `"pagination-first"` | First navigation button |
| `data-ck="pagination-last"` | Last button | `"pagination-last"` | Last navigation button |
| `data-ck="pagination-ellipsis"` | Ellipsis | `"pagination-ellipsis"` | Truncation indicator |
| `data-state` | Page button | `"active"`, `"inactive"` | Current page state |
| `data-slot="page-item"` | List items | `"page-item"` | Structural slot |

## Accessibility

Uses `<nav>` landmark with `aria-label="Pagination"` following the WAI-ARIA navigation landmark pattern.

### ARIA Attributes

- **Current page**: `aria-current="page"` marks the active page button
- **Page labels**: `"Page N, current page"` or `"Go to page N"` for descriptive identification
- **Navigation labels**: `"Go to previous page"`, `"Go to next page"`, `"Go to first page"`, `"Go to last page"`
- **Disabled**: `aria-disabled="true"` keeps buttons focusable for assistive technology
- **Ellipsis**: `aria-hidden="true"` hides decorative truncation indicators

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Move focus between pagination buttons |
| `Enter` | Activate the focused button |
| `Space` | Activate the focused button |

### WCAG 2.2 AA Compliance

| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 2.1.1 Keyboard | A | All buttons keyboard-operable |
| 2.4.3 Focus Order | A | Logical DOM focus sequence |
| 2.5.8 Target Size | AA | Ensure minimum 24x24px button targets |
| 1.4.3 Contrast | AA | Ensure 4.5:1 text contrast ratio |
| 4.1.2 Name, Role, Value | A | All buttons have accessible names and roles |

### Best Practices

- Use offset mode when the total page count is known
- Use cursor mode for infinite scroll or streaming data patterns
- Provide a unique `aria-label` when multiple pagination components exist on the same page
- Ensure button targets are at minimum 24x24 CSS pixels (WCAG 2.5.8)
- Ensure sufficient color contrast between active/inactive states (WCAG 1.4.3)
- After dynamic page load, manage focus to the new content area in your application
