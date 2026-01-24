# Table

A fully-featured data table component powered by TanStack Table.

> **Requires:** `npm install @tanstack/react-table`

## Usage

```tsx
import { Table, ColumnDef } from '@components-kit/react';

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

// Basic usage
<Table data={users} columns={columns} />

// With sorting
const [sorting, setSorting] = useState<SortingState>([]);
<Table
  data={users}
  columns={columns}
  enableSorting
  sorting={sorting}
  onSortingChange={setSorting}
/>

// With pagination
<Table
  data={users}
  columns={columns}
  enablePagination
  pageSize={10}
/>

// With row selection
const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
<Table
  data={users}
  columns={columns}
  enableRowSelection
  rowSelection={rowSelection}
  onRowSelectionChange={setRowSelection}
/>

// Custom cell rendering
<Table
  data={users}
  columns={[
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <Badge>{getValue()}</Badge>,
    },
  ]}
/>

// With row expansion
<Table
  data={users}
  columns={columns}
  enableExpanding
  renderSubComponent={({ row }) => (
    <div>Details for {row.original.name}</div>
  )}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | **required** | Data array to display |
| `columns` | `ColumnDef<TData>[]` | **required** | Column definitions |
| `variantName` | `string` | - | Variant name for styling |
| `caption` | `ReactNode` | - | Table caption |
| `isLoading` | `boolean` | `false` | Shows loading state |

### Sorting

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableSorting` | `boolean` | `false` | Enable column sorting |
| `sorting` | `SortingState` | - | Controlled sorting state |
| `onSortingChange` | `(sorting) => void` | - | Sorting change callback |
| `manualSorting` | `boolean` | `false` | Server-side sorting |

### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enablePagination` | `boolean` | `false` | Enable pagination |
| `pageSize` | `number` | `10` | Rows per page |
| `pageIndex` | `number` | `0` | Current page (0-indexed) |
| `pageCount` | `number` | - | Total pages (manual pagination) |
| `onPageChange` | `(index) => void` | - | Page change callback |

### Row Selection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableRowSelection` | `boolean \| (row) => boolean` | `false` | Enable selection |
| `enableMultiRowSelection` | `boolean` | `true` | Allow multi-select |
| `rowSelection` | `RowSelectionState` | - | Controlled selection state |
| `onRowSelectionChange` | `(selection) => void` | - | Selection change callback |

### Row Expansion

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableExpanding` | `boolean` | `false` | Enable row expansion |
| `expanded` | `ExpandedState` | - | Controlled expanded state |
| `onExpandedChange` | `(expanded) => void` | - | Expansion change callback |
| `renderSubComponent` | `({ row }) => ReactNode` | - | Expanded content renderer |

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-variant` | string | Variant name for styling |
| `data-component` | string | Identifies table sub-components |
| `data-loading` | `true` | Present when loading |
| `data-sort` | `"asc"`, `"desc"`, `"none"` | Column sort direction |
| `data-sortable` | `true` | Column is sortable |
| `data-selected` | `true` | Row is selected |

## Accessibility

- Proper `aria-sort` on sortable column headers
- `aria-selected` on selectable rows
- Keyboard navigation for sorting (Enter/Space on headers)
- Pagination buttons with `aria-label`

### Best Practices

- Provide `aria-label` or caption for table context
- Use semantic column headers
- Ensure sufficient color contrast
- Consider keyboard-only users for all interactions

## Type Exports

Re-exports from TanStack Table for convenience:

```tsx
import type {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  Row,
  RowSelectionState,
  SortingState,
  TableInstance,
} from '@components-kit/react';
```
