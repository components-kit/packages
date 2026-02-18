"use client";

import {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  RowSelectionState,
  SortingState,
  Table as TableInstance,
  useReactTable,
} from "@tanstack/react-table";
import {
  forwardRef,
  Fragment,
  ReactNode,
  TableHTMLAttributes,
  useCallback,
  useId,
  useState,
} from "react";

import type { VariantFor } from "../../types/register";

/**
 * A fully-featured data table component powered by TanStack Table.
 *
 * @description
 * Provides a props-based API for rendering data tables with sorting,
 * filtering, pagination, row selection, and row expansion. Fully accessible
 * with proper ARIA attributes and keyboard navigation.
 *
 * ## Features
 * - Sorting: Click column headers to sort, with keyboard support
 * - Pagination: Row slicing with controlled page state (compose with Pagination for UI)
 * - Filtering: Global and column-level filtering
 * - Row Selection: Single or multi-select with checkbox support
 * - Row Expansion: Expandable rows with custom sub-components
 * - Footer: Auto-renders when columns define `footer`, with custom render override
 * - Custom Rendering: Full control over headers, cells, rows, footer
 * - Accessibility: Proper ARIA attributes, keyboard navigation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Table
 *   data={users}
 *   columns={[
 *     { accessorKey: 'name', header: 'Name' },
 *     { accessorKey: 'email', header: 'Email' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With sorting
 * const [sorting, setSorting] = useState<SortingState>([]);
 *
 * <Table
 *   data={users}
 *   columns={columns}
 *   enableSorting
 *   sorting={sorting}
 *   onSortingChange={setSorting}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With pagination (compose with Pagination component for UI)
 * const [pageIndex, setPageIndex] = useState(0);
 *
 * <Table
 *   data={users}
 *   columns={columns}
 *   enablePagination
 *   pageIndex={pageIndex}
 *   pageSize={10}
 *   onPageChange={setPageIndex}
 * />
 * <Pagination
 *   page={pageIndex + 1}
 *   totalPages={Math.ceil(users.length / 10)}
 *   onPageChange={(page) => setPageIndex(page - 1)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With row selection
 * const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
 *
 * <Table
 *   data={users}
 *   columns={columns}
 *   enableRowSelection
 *   rowSelection={rowSelection}
 *   onRowSelectionChange={setRowSelection}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom cell rendering
 * <Table
 *   data={users}
 *   columns={[
 *     { accessorKey: 'name', header: 'Name' },
 *     {
 *       accessorKey: 'status',
 *       header: 'Status',
 *       cell: ({ getValue }) => <Badge>{getValue()}</Badge>,
 *     },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With row expansion
 * <Table
 *   data={users}
 *   columns={columns}
 *   enableExpanding
 *   renderSubComponent={({ row }) => (
 *     <div>Details for {row.original.name}</div>
 *   )}
 * />
 * ```
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Context provided to custom header renderer.
 */
interface HeaderRenderContext<TData> {
  table: TableInstance<TData>;
}

/**
 * Context provided to custom row renderer.
 */
interface RowRenderContext<TData> {
  index: number;
  row: Row<TData>;
}

/**
 * Context provided to custom cell renderer.
 */
interface CellRenderContext<TData, TValue> {
  cell: Cell<TData, TValue>;
}

/**
 * Context provided to sub-component renderer for expanded rows.
 */
interface SubComponentRenderContext<TData> {
  row: Row<TData>;
}

/**
 * Context provided to custom footer renderer.
 * Same shape as HeaderRenderContext (both receive the table instance).
 */
type FooterRenderContext<TData> = HeaderRenderContext<TData>;

/**
 * Props for the Table component.
 */
interface TableProps<TData> extends Omit<
  TableHTMLAttributes<HTMLTableElement>,
  "children"
> {
  /**
   * Accessible label for the table.
   */
  "aria-label"?: string;

  /**
   * ID of element that describes the table.
   */
  "aria-describedby"?: string;

  /**
   * Table caption text or element.
   */
  caption?: ReactNode;

  /**
   * Position of the caption relative to the table.
   * @default "top"
   */
  captionSide?: "bottom" | "top";

  /**
   * Column filters state for controlled filtering.
   */
  columnFilters?: ColumnFiltersState;

  /**
   * Column definitions for the table.
   * Uses TanStack Table's ColumnDef type.
   */
  columns: ColumnDef<TData, unknown>[];

  /**
   * Data array to display in the table.
   */
  data: TData[];

  /**
   * Enable column-level filtering.
   * @default false
   */
  enableColumnFilters?: boolean;

  /**
   * Enable row expansion with sub-components.
   * @default false
   */
  enableExpanding?: boolean;

  /**
   * Enable global filtering across all columns.
   * @default false
   */
  enableFiltering?: boolean;

  /**
   * Enable multi-row selection (vs single selection).
   * @default true when enableRowSelection is true
   */
  enableMultiRowSelection?: boolean;

  /**
   * Enable pagination controls.
   * @default false
   */
  enablePagination?: boolean;

  /**
   * Enable row selection with checkboxes.
   * Can be a boolean or a function to conditionally enable per row.
   * @default false
   */
  enableRowSelection?: ((row: Row<TData>) => boolean) | boolean;

  /**
   * Enable column sorting.
   * @default false
   */
  enableSorting?: boolean;

  /**
   * Expanded state for controlled expansion.
   */
  expanded?: ExpandedState;

  /**
   * Custom function to extract row ID from data.
   */
  getRowId?: (originalRow: TData, index: number) => string;

  /**
   * Function to get sub-rows for hierarchical data.
   */
  getSubRows?: (originalRow: TData) => TData[] | undefined;

  /**
   * Global filter value for controlled filtering.
   */
  globalFilter?: string;

  /**
   * Whether the table is in a loading state.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Use manual (server-side) filtering.
   * @default false
   */
  manualFiltering?: boolean;

  /**
   * Use manual (server-side) pagination.
   * @default false
   */
  manualPagination?: boolean;

  /**
   * Use manual (server-side) sorting.
   * @default false
   */
  manualSorting?: boolean;

  /**
   * Callback when column filters change.
   */
  onColumnFiltersChange?: (columnFilters: ColumnFiltersState) => void;

  /**
   * Callback when expanded state changes.
   */
  onExpandedChange?: (expanded: ExpandedState) => void;

  /**
   * Callback when global filter changes.
   */
  onGlobalFilterChange?: (globalFilter: string) => void;

  /**
   * Callback when page index changes.
   */
  onPageChange?: (pageIndex: number) => void;

  /**
   * Callback when page size changes.
   */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Callback when a row is clicked.
   */
  onRowClick?: (row: Row<TData>) => void;

  /**
   * Callback when row selection changes.
   */
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;

  /**
   * Callback when sorting changes.
   */
  onSortingChange?: (sorting: SortingState) => void;

  /**
   * Total page count for manual pagination.
   */
  pageCount?: number;

  /**
   * Current page index (zero-based) for controlled pagination.
   * @default 0
   */
  pageIndex?: number;

  /**
   * Number of rows per page.
   * @default 10
   */
  pageSize?: number;

  /**
   * Custom renderer for individual cells.
   */
  renderCell?: (context: CellRenderContext<TData, unknown>) => ReactNode;

  /**
   * Custom renderer for empty state.
   */
  renderEmpty?: () => ReactNode;

  /**
   * Custom renderer for table footer.
   */
  renderFooter?: (context: FooterRenderContext<TData>) => ReactNode;

  /**
   * Custom renderer for table header.
   */
  renderHeader?: (context: HeaderRenderContext<TData>) => ReactNode;

  /**
   * Custom renderer for loading state.
   */
  renderLoading?: () => ReactNode;

  /**
   * Custom renderer for table rows.
   */
  renderRow?: (context: RowRenderContext<TData>) => ReactNode;

  /**
   * Custom renderer for expanded row sub-component.
   */
  renderSubComponent?: (context: SubComponentRenderContext<TData>) => ReactNode;

  /**
   * Row selection state for controlled selection.
   */
  rowSelection?: RowSelectionState;

  /**
   * Sorting state for controlled sorting.
   */
  sorting?: SortingState;

  /**
   * Variant name for styling via data-variant attribute.
   */
  variantName?: VariantFor<"table">;
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Gets the aria-sort value for a column header.
 */
function getAriaSort(
  isSorted: "asc" | "desc" | false,
): "ascending" | "descending" | "none" {
  if (isSorted === "asc") return "ascending";
  if (isSorted === "desc") return "descending";
  return "none";
}

// -----------------------------------------------------------------------------
// Table Component
// -----------------------------------------------------------------------------

/**
 * Table component with props-based API powered by TanStack Table.
 */
function TableInner<TData>(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-label": ariaLabel,
    caption,
    captionSide = "top",
    className,
    columnFilters: controlledColumnFilters,
    columns,
    data,
    enableColumnFilters = false,
    enableExpanding = false,
    enableFiltering = false,
    enableMultiRowSelection = true,
    enablePagination = false,
    enableRowSelection = false,
    enableSorting = false,
    expanded: controlledExpanded,
    getRowId,
    getSubRows,
    globalFilter: controlledGlobalFilter,
    isLoading = false,
    manualFiltering = false,
    manualPagination = false,
    manualSorting = false,
    onColumnFiltersChange,
    onExpandedChange,
    onGlobalFilterChange,
    onPageChange,
    onPageSizeChange,
    onRowClick,
    onRowSelectionChange,
    onSortingChange,
    pageCount,
    pageIndex: controlledPageIndex,
    pageSize: controlledPageSize,
    renderCell: customRenderCell,
    renderEmpty,
    renderFooter: customRenderFooter,
    renderHeader: customRenderHeader,
    renderLoading,
    renderRow: customRenderRow,
    renderSubComponent,
    rowSelection: controlledRowSelection,
    sorting: controlledSorting,
    variantName,
    ...rest
  }: TableProps<TData>,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  const tableId = useId();

  // Internal state for uncontrolled mode
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(
    controlledPageSize ?? 10,
  );

  // Use controlled or internal state
  const sorting = controlledSorting ?? internalSorting;
  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const globalFilter = controlledGlobalFilter ?? internalGlobalFilter;
  const columnFilters = controlledColumnFilters ?? internalColumnFilters;
  const expanded = controlledExpanded ?? internalExpanded;
  const pageIndex = controlledPageIndex ?? internalPageIndex;
  const pageSize = controlledPageSize ?? internalPageSize ?? 10;

  // Handlers
  const handleSortingChange = useCallback(
    (updater: ((old: SortingState) => SortingState) | SortingState) => {
      const newValue =
        typeof updater === "function" ? updater(sorting) : updater;
      if (onSortingChange) {
        onSortingChange(newValue);
      } else {
        setInternalSorting(newValue);
      }
    },
    [sorting, onSortingChange],
  );

  const handleRowSelectionChange = useCallback(
    (
      updater:
        | ((old: RowSelectionState) => RowSelectionState)
        | RowSelectionState,
    ) => {
      const newValue =
        typeof updater === "function" ? updater(rowSelection) : updater;
      if (onRowSelectionChange) {
        onRowSelectionChange(newValue);
      } else {
        setInternalRowSelection(newValue);
      }
    },
    [rowSelection, onRowSelectionChange],
  );

  const handleGlobalFilterChange = useCallback(
    (updater: ((old: string) => string) | string) => {
      const newValue =
        typeof updater === "function" ? updater(globalFilter) : updater;
      if (onGlobalFilterChange) {
        onGlobalFilterChange(newValue);
      } else {
        setInternalGlobalFilter(newValue);
      }
    },
    [globalFilter, onGlobalFilterChange],
  );

  const handleColumnFiltersChange = useCallback(
    (
      updater:
        | ((old: ColumnFiltersState) => ColumnFiltersState)
        | ColumnFiltersState,
    ) => {
      const newValue =
        typeof updater === "function" ? updater(columnFilters) : updater;
      if (onColumnFiltersChange) {
        onColumnFiltersChange(newValue);
      } else {
        setInternalColumnFilters(newValue);
      }
    },
    [columnFilters, onColumnFiltersChange],
  );

  const handleExpandedChange = useCallback(
    (updater: ((old: ExpandedState) => ExpandedState) | ExpandedState) => {
      const newValue =
        typeof updater === "function" ? updater(expanded) : updater;
      if (onExpandedChange) {
        onExpandedChange(newValue);
      } else {
        setInternalExpanded(newValue);
      }
    },
    [expanded, onExpandedChange],
  );

  const handlePaginationChange = useCallback(
    (
      updater:
        | ((old: { pageIndex: number; pageSize: number }) => {
            pageIndex: number;
            pageSize: number;
          })
        | { pageIndex: number; pageSize: number },
    ) => {
      const current = { pageIndex, pageSize };
      const newValue =
        typeof updater === "function" ? updater(current) : updater;

      if (newValue.pageIndex !== pageIndex) {
        if (onPageChange) {
          onPageChange(newValue.pageIndex);
        } else {
          setInternalPageIndex(newValue.pageIndex);
        }
      }

      if (newValue.pageSize !== pageSize) {
        if (onPageSizeChange) {
          onPageSizeChange(newValue.pageSize);
        } else {
          setInternalPageSize(newValue.pageSize);
        }
      }
    },
    [pageIndex, pageSize, onPageChange, onPageSizeChange],
  );

  // Create table instance
  const table = useReactTable({
    columns,
    data,
    enableExpanding,
    enableFilters: enableFiltering || enableColumnFilters,
    enableGlobalFilter: enableFiltering,
    enableMultiRowSelection,
    enableRowSelection,
    enableSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    getFilteredRowModel:
      enableFiltering || enableColumnFilters
        ? getFilteredRowModel()
        : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getRowId,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getSubRows,
    manualFiltering,
    manualPagination,
    manualSorting,
    onColumnFiltersChange: handleColumnFiltersChange,
    onExpandedChange: handleExpandedChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    pageCount: manualPagination ? pageCount : undefined,
    state: {
      columnFilters,
      expanded,
      globalFilter,
      pagination: { pageIndex, pageSize },
      rowSelection,
      sorting,
    },
  });

  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();
  const hasFooter = columns.some((col) => col.footer !== undefined);
  const footerGroups = hasFooter ? table.getFooterGroups() : [];
  const columnCount = table.getAllColumns().length;

  return (
    <table
      {...rest}
      id={tableId}
      className={className}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      data-ck="table"
      data-loading={isLoading || undefined}
      data-variant={variantName}
      ref={ref}
    >
      {caption && (
        <caption data-caption-side={captionSide} data-ck="table-caption">
          {caption}
        </caption>
      )}

      {/* Header */}
      <thead data-ck="table-header">
        {customRenderHeader
          ? customRenderHeader({ table })
          : headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} data-ck="table-row" data-header-row>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  const sortDirection = getAriaSort(isSorted);

                  return (
                    <th
                      key={header.id}
                      aria-sort={canSort ? sortDirection : undefined}
                      colSpan={header.colSpan}
                      data-ck="table-head"
                      data-sort={canSort ? isSorted || "none" : undefined}
                      data-sortable={canSort || undefined}
                      scope="col"
                      tabIndex={canSort ? 0 : undefined}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      onKeyDown={
                        canSort
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                header.column.toggleSorting();
                              }
                            }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
      </thead>

      {/* Body */}
      <tbody data-ck="table-body">
        {isLoading ? (
          <tr data-ck="table-row" data-loading-row>
            <td colSpan={columnCount} data-ck="table-cell">
              {renderLoading ? renderLoading() : "Loading..."}
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr data-ck="table-row" data-empty-row>
            <td colSpan={columnCount} data-ck="table-cell">
              {renderEmpty ? renderEmpty() : "No data available"}
            </td>
          </tr>
        ) : (
          rows.map((row, index) => {
            const isSelected = row.getIsSelected();
            const isExpanded = row.getIsExpanded();

            if (customRenderRow) {
              return (
                <Fragment key={row.id}>
                  {customRenderRow({ index, row })}
                  {enableExpanding && isExpanded && renderSubComponent && (
                    <tr data-ck="table-row" data-expanded-row>
                      <td
                        colSpan={row.getVisibleCells().length}
                        data-ck="table-cell"
                      >
                        {renderSubComponent({ row })}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            }

            return (
              <Fragment key={row.id}>
                <tr
                  aria-selected={enableRowSelection ? isSelected : undefined}
                  data-ck="table-row"
                  data-clickable={onRowClick ? true : undefined}
                  data-selected={isSelected || undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} data-ck="table-cell">
                      {customRenderCell
                        ? customRenderCell({ cell })
                        : flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                    </td>
                  ))}
                </tr>
                {enableExpanding && isExpanded && renderSubComponent && (
                  <tr data-ck="table-row" data-expanded-row>
                    <td
                      colSpan={row.getVisibleCells().length}
                      data-ck="table-cell"
                    >
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })
        )}
      </tbody>

      {/* Footer */}
      {(customRenderFooter || hasFooter) && (
        <tfoot data-ck="table-footer">
          {customRenderFooter
            ? customRenderFooter({ table })
            : footerGroups.map((footerGroup) => (
                <tr key={footerGroup.id} data-ck="table-row" data-footer-row>
                  {footerGroup.headers.map((footer) => (
                    <td
                      key={footer.id}
                      colSpan={footer.colSpan}
                      data-ck="table-cell"
                    >
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                            footer.column.columnDef.footer,
                            footer.getContext(),
                          )}
                    </td>
                  ))}
                </tr>
              ))}
        </tfoot>
      )}
    </table>
  );
}

// Use forwardRef with generic support
const Table = forwardRef(TableInner) as <TData>(
  props: TableProps<TData> & { ref?: React.ForwardedRef<HTMLTableElement> },
) => React.ReactElement;

(Table as { displayName?: string }).displayName = "Table";

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export {
  type CellRenderContext,
  type FooterRenderContext,
  type HeaderRenderContext,
  type RowRenderContext,
  type SubComponentRenderContext,
  Table,
  type TableProps,
};

// Re-export useful TanStack Table types for convenience
export type {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  Row,
  RowSelectionState,
  SortingState,
  Table as TableInstance,
} from "@tanstack/react-table";
