# Table

A fully-featured data table component powered by TanStack Table.

> **Requires:** `npm install @tanstack/react-table`

## Usage

```tsx
import { useState } from 'react';
import { Pagination, Table } from '@components-kit/react';
import type { ColumnDef, RowSelectionState, SortingState } from '@components-kit/react';

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

const users: User[] = [
  { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
  { id: '2', name: 'John Smith', email: 'john@example.com' },
];

// Basic usage
<Table data={users} columns={columns} />

// With row selection
function SelectableUsersTable() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return (
    <Table
      data={users}
      columns={columns}
      enableRowSelection
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
    />
  );
}

// With sorting + pagination UI
function SortablePaginatedUsersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  return (
    <>
      <Table
        data={users}
        columns={columns}
        enableSorting
        sorting={sorting}
        onSortingChange={setSorting}
        enablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
      />
      <Pagination
        page={pageIndex + 1}
        totalPages={Math.ceil(users.length / pageSize)}
        onPageChange={(page) => setPageIndex(page - 1)}
      />
    </>
  );
}

// Custom cell rendering
<Table
  data={users}
  columns={[
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <span data-status={getValue() as string}>{getValue() as string}</span>
      ),
    },
  ]}
/>

// With column footers
<Table
  data={users}
  columns={[
    { accessorKey: 'name', header: 'Name', footer: 'Total' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'amount', header: 'Amount', footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + row.getValue<number>('amount'), 0
      );
      return `$${total}`;
    }},
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

### Core

| Prop               | Type                  | Default      | Description                           |
| ------------------ | --------------------- | ------------ | ------------------------------------- |
| `data`             | `TData[]`             | **required** | Data array to display                 |
| `columns`          | `ColumnDef<TData>[]`  | **required** | Column definitions                    |
| `caption`          | `ReactNode`           | -            | Table caption content                 |
| `captionSide`      | `"top" \| "bottom"`   | `"top"`      | Caption position                      |
| `isLoading`        | `boolean`             | `false`      | Shows loading state row               |
| `variantName`      | `VariantFor<"table">` | -            | Variant name for styling              |
| `aria-label`       | `string`              | -            | Accessible label for the table        |
| `aria-describedby` | `string`              | -            | ID of an element describing the table |

### Data / Identity

| Prop         | Type                                    | Default | Description                               |
| ------------ | --------------------------------------- | ------- | ----------------------------------------- |
| `getRowId`   | `(originalRow, index) => string`        | -       | Custom row ID extraction                  |
| `getSubRows` | `(originalRow) => TData[] \| undefined` | -       | Returns nested rows for hierarchical data |

### Sorting

| Prop              | Type                | Default | Description              |
| ----------------- | ------------------- | ------- | ------------------------ |
| `enableSorting`   | `boolean`           | `false` | Enable column sorting    |
| `sorting`         | `SortingState`      | -       | Controlled sorting state |
| `onSortingChange` | `(sorting) => void` | -       | Sorting change callback  |
| `manualSorting`   | `boolean`           | `false` | Server-side sorting      |

### Filtering

| Prop                    | Type                                          | Default | Description                    |
| ----------------------- | --------------------------------------------- | ------- | ------------------------------ |
| `enableFiltering`       | `boolean`                                     | `false` | Enable filtering features      |
| `enableColumnFilters`   | `boolean`                                     | `false` | Enable per-column filters      |
| `globalFilter`          | `string`                                      | -       | Controlled global filter value |
| `columnFilters`         | `ColumnFiltersState`                          | -       | Controlled column filters      |
| `onGlobalFilterChange`  | `(globalFilter: string) => void`              | -       | Global filter change callback  |
| `onColumnFiltersChange` | `(columnFilters: ColumnFiltersState) => void` | -       | Column filters change callback |
| `manualFiltering`       | `boolean`                                     | `false` | Server-side filtering          |

### Pagination

The Table handles pagination **data logic** (row slicing) but does not render pagination UI. Compose with the `Pagination` component for navigation controls.

| Prop               | Type              | Default | Description                     |
| ------------------ | ----------------- | ------- | ------------------------------- |
| `enablePagination` | `boolean`         | `false` | Enable pagination (row slicing) |
| `pageSize`         | `number`          | `10`    | Rows per page                   |
| `pageIndex`        | `number`          | `0`     | Current page (0-indexed)        |
| `pageCount`        | `number`          | -       | Total pages (manual pagination) |
| `onPageChange`     | `(index) => void` | -       | Page change callback            |
| `onPageSizeChange` | `(size) => void`  | -       | Page size change callback       |
| `manualPagination` | `boolean`         | `false` | Server-side pagination          |

### Row Selection

| Prop                      | Type                          | Default | Description                |
| ------------------------- | ----------------------------- | ------- | -------------------------- |
| `enableRowSelection`      | `boolean \| (row) => boolean` | `false` | Enable selection           |
| `enableMultiRowSelection` | `boolean`                     | `true`  | Allow multi-select         |
| `rowSelection`            | `RowSelectionState`           | -       | Controlled selection state |
| `onRowSelectionChange`    | `(selection) => void`         | -       | Selection change callback  |
| `onRowClick`              | `(row) => void`               | -       | Row click callback         |

### Footer

The table footer renders automatically when any column definition includes a `footer` property. No enable prop needed.

| Prop           | Type                       | Default | Description                                       |
| -------------- | -------------------------- | ------- | ------------------------------------------------- |
| `renderFooter` | `({ table }) => ReactNode` | -       | Custom footer renderer (overrides column footers) |

### Row Expansion

| Prop                 | Type                     | Default | Description               |
| -------------------- | ------------------------ | ------- | ------------------------- |
| `enableExpanding`    | `boolean`                | `false` | Enable row expansion      |
| `expanded`           | `ExpandedState`          | -       | Controlled expanded state |
| `onExpandedChange`   | `(expanded) => void`     | -       | Expansion change callback |
| `renderSubComponent` | `({ row }) => ReactNode` | -       | Expanded content renderer |

### Custom Renderers

| Prop            | Type                            | Default | Description                 |
| --------------- | ------------------------------- | ------- | --------------------------- |
| `renderHeader`  | `({ table }) => ReactNode`      | -       | Custom header renderer      |
| `renderCell`    | `({ cell }) => ReactNode`       | -       | Custom cell renderer        |
| `renderRow`     | `({ row, index }) => ReactNode` | -       | Custom row renderer         |
| `renderLoading` | `() => ReactNode`               | -       | Custom loading row renderer |
| `renderEmpty`   | `() => ReactNode`               | -       | Custom empty row renderer   |

## Data Attributes

| Attribute           | Values                      | Description              |
| ------------------- | --------------------------- | ------------------------ |
| `data-variant`      | string                      | Variant name for styling |
| `data-caption-side` | `"top"`, `"bottom"`         | Caption position         |
| `data-clickable`    | `true`                      | Row has click handler    |
| `data-loading`      | `true`                      | Present when loading     |
| `data-sort`         | `"asc"`, `"desc"`, `"none"` | Column sort direction    |
| `data-sortable`     | `true`                      | Column is sortable       |
| `data-selected`     | `true`                      | Row is selected          |
| `data-footer-row`   | present                     | Row is a footer row      |

## Accessibility

- Proper `aria-sort` on sortable column headers
- `aria-selected` on selectable rows
- Keyboard navigation for sorting (Enter/Space on headers)

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
} from "@components-kit/react";
```
