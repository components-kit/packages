import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { ColumnDef, RowSelectionState, SortingState, Table } from "./table";

// Test data types
interface User {
  email: string;
  id: number;
  name: string;
  role: string;
}

// Sample test data
const testData: User[] = [
  { email: "alice@example.com", id: 1, name: "Alice", role: "Admin" },
  { email: "bob@example.com", id: 2, name: "Bob", role: "User" },
  { email: "charlie@example.com", id: 3, name: "Charlie", role: "User" },
];

// Sample columns
const testColumns: ColumnDef<User, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

describe("Table Component", () => {
  describe("Basic Rendering", () => {
    it("renders table with data and columns", () => {
      render(<Table columns={testColumns} data={testData} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute("data-ck", "table");

      // Check headers
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();

      // Check data rows
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("bob@example.com")).toBeInTheDocument();
      // Multiple "User" roles exist, so use getAllBy
      expect(screen.getAllByText("User")).toHaveLength(2);
    });

    it("renders empty state when no data", () => {
      render(<Table columns={testColumns} data={[]} />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("renders custom empty state", () => {
      render(
        <Table
          columns={testColumns}
          data={[]}
          renderEmpty={() => <span>No users found</span>}
        />
      );

      expect(screen.getByText("No users found")).toBeInTheDocument();
    });

    it("renders loading state", () => {
      render(<Table columns={testColumns} data={testData} isLoading />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByRole("table")).toHaveAttribute("data-loading", "true");
    });

    it("renders custom loading state", () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          isLoading
          renderLoading={() => <span>Fetching data...</span>}
        />
      );

      expect(screen.getByText("Fetching data...")).toBeInTheDocument();
    });

    it("renders caption", () => {
      render(
        <Table caption="User Directory" columns={testColumns} data={testData} />
      );

      const caption = screen.getByText("User Directory");
      expect(caption).toBeInTheDocument();
      expect(caption.tagName).toBe("CAPTION");
    });

    it("applies variantName as data-variant", () => {
      render(
        <Table columns={testColumns} data={testData} variantName="striped" />
      );

      expect(screen.getByRole("table")).toHaveAttribute(
        "data-variant",
        "striped"
      );
    });

    it("passes through HTML attributes", () => {
      render(
        <Table
          className="custom-table"
          aria-label="User table"
          columns={testColumns}
          data={testData}
          data-testid="my-table"
        />
      );

      const table = screen.getByTestId("my-table");
      expect(table).toHaveAttribute("aria-label", "User table");
      expect(table).toHaveClass("custom-table");
    });

    it("forwards ref to table element", () => {
      const ref = React.createRef<HTMLTableElement>();
      render(<Table columns={testColumns} data={testData} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLTableElement);
      expect(ref.current?.tagName).toBe("TABLE");
    });

    it("has displayName", () => {
      expect((Table as { displayName?: string }).displayName).toBe("Table");
    });
  });

  describe("Sorting", () => {
    it("renders sortable headers when enabled", () => {
      const { container } = render(
        <Table columns={testColumns} data={testData} enableSorting />
      );

      const headers = container.querySelectorAll("th");
      headers.forEach((header) => {
        expect(header).toHaveAttribute("data-sortable", "true");
        expect(header).toHaveAttribute("aria-sort", "none");
        expect(header).toHaveAttribute("tabindex", "0");
      });
    });

    it("sorts data when clicking header", async () => {
      const user = userEvent.setup();
      render(<Table columns={testColumns} data={testData} enableSorting />);

      const nameHeader = screen.getByText("Name");
      await user.click(nameHeader);

      expect(nameHeader.closest("th")).toHaveAttribute(
        "aria-sort",
        "ascending"
      );
      expect(nameHeader.closest("th")).toHaveAttribute("data-sort", "asc");
    });

    it("toggles sort direction on repeated clicks", async () => {
      const user = userEvent.setup();
      render(<Table columns={testColumns} data={testData} enableSorting />);

      const nameHeader = screen.getByText("Name");

      // First click - ascending
      await user.click(nameHeader);
      expect(nameHeader.closest("th")).toHaveAttribute(
        "aria-sort",
        "ascending"
      );

      // Second click - descending
      await user.click(nameHeader);
      expect(nameHeader.closest("th")).toHaveAttribute(
        "aria-sort",
        "descending"
      );

      // Third click - none
      await user.click(nameHeader);
      expect(nameHeader.closest("th")).toHaveAttribute("aria-sort", "none");
    });

    it("supports keyboard sorting with Enter", async () => {
      const user = userEvent.setup();
      render(<Table columns={testColumns} data={testData} enableSorting />);

      const nameHeader = screen.getByText("Name").closest("th")!;
      nameHeader.focus();
      await user.keyboard("{Enter}");

      expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    });

    it("supports keyboard sorting with Space", async () => {
      const user = userEvent.setup();
      render(<Table columns={testColumns} data={testData} enableSorting />);

      const nameHeader = screen.getByText("Name").closest("th")!;
      nameHeader.focus();
      await user.keyboard(" ");

      expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    });

    it("calls onSortingChange in controlled mode", async () => {
      const onSortingChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Table
          columns={testColumns}
          data={testData}
          enableSorting
          sorting={[]}
          onSortingChange={onSortingChange}
        />
      );

      await user.click(screen.getByText("Name"));
      expect(onSortingChange).toHaveBeenCalledWith([
        { desc: false, id: "name" },
      ]);
    });

    it("respects controlled sorting state", () => {
      const sorting: SortingState = [{ desc: true, id: "email" }];

      render(
        <Table
          columns={testColumns}
          data={testData}
          enableSorting
          sorting={sorting}
        />
      );

      const emailHeader = screen.getByText("Email").closest("th");
      expect(emailHeader).toHaveAttribute("aria-sort", "descending");
      expect(emailHeader).toHaveAttribute("data-sort", "desc");
    });
  });

  describe("Pagination", () => {
    const manyUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
      email: `user${i + 1}@example.com`,
      id: i + 1,
      name: `User ${i + 1}`,
      role: i % 3 === 0 ? "Admin" : "User",
    }));

    it("renders pagination controls when enabled", () => {
      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageSize={10}
        />
      );

      expect(screen.getByLabelText("Go to first page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to last page")).toBeInTheDocument();
      expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
    });

    it("limits rows to pageSize", () => {
      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageSize={5}
        />
      );

      // Should only show 5 rows + loading/empty rows
      const rows = screen.getAllByRole("row");
      // 1 header row + 5 data rows + 1 footer row (pagination)
      expect(rows.length).toBe(7);
    });

    it("navigates to next page", async () => {
      const user = userEvent.setup();
      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageSize={10}
        />
      );

      await user.click(screen.getByLabelText("Go to next page"));
      expect(screen.getByText(/Page 2 of 3/)).toBeInTheDocument();
    });

    it("navigates to previous page", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageIndex={1}
          pageSize={10}
          onPageChange={onPageChange}
        />
      );

      await user.click(screen.getByLabelText("Go to previous page"));
      expect(onPageChange).toHaveBeenCalledWith(0);
    });

    it("navigates to first page", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageIndex={2}
          pageSize={10}
          onPageChange={onPageChange}
        />
      );

      await user.click(screen.getByLabelText("Go to first page"));
      expect(onPageChange).toHaveBeenCalledWith(0);
    });

    it("navigates to last page", async () => {
      const user = userEvent.setup();
      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageSize={10}
        />
      );

      await user.click(screen.getByLabelText("Go to last page"));
      expect(screen.getByText(/Page 3 of 3/)).toBeInTheDocument();
    });

    it("disables first/previous on first page", () => {
      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageSize={10}
        />
      );

      expect(screen.getByLabelText("Go to first page")).toBeDisabled();
      expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
      expect(screen.getByLabelText("Go to next page")).not.toBeDisabled();
      expect(screen.getByLabelText("Go to last page")).not.toBeDisabled();
    });

    it("disables next/last on last page", () => {
      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageIndex={2}
          pageSize={10}
        />
      );

      expect(screen.getByLabelText("Go to first page")).not.toBeDisabled();
      expect(screen.getByLabelText("Go to previous page")).not.toBeDisabled();
      expect(screen.getByLabelText("Go to next page")).toBeDisabled();
      expect(screen.getByLabelText("Go to last page")).toBeDisabled();
    });

    it("calls onPageChange in controlled mode", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Table
          columns={testColumns}
          data={manyUsers}
          enablePagination
          pageIndex={0}
          pageSize={10}
          onPageChange={onPageChange}
        />
      );

      await user.click(screen.getByLabelText("Go to next page"));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  describe("Row Selection", () => {
    const columnsWithSelection: ColumnDef<User, unknown>[] = [
      {
        cell: ({ row }) => (
          <input
            checked={row.getIsSelected()}
            type="checkbox"
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        header: ({ table }) => (
          <input
            checked={table.getIsAllRowsSelected()}
            type="checkbox"
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        id: "select",
      },
      ...testColumns,
    ];

    it("supports row selection", async () => {
      const user = userEvent.setup();
      render(
        <Table
          columns={columnsWithSelection}
          data={testData}
          enableRowSelection
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[1]); // First data row checkbox

      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveAttribute("aria-selected", "true");
      expect(rows[1]).toHaveAttribute("data-selected", "true");
    });

    it("supports select all", async () => {
      const user = userEvent.setup();
      render(
        <Table
          columns={columnsWithSelection}
          data={testData}
          enableRowSelection
        />
      );

      const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
      await user.click(selectAllCheckbox);

      const rows = screen.getAllByRole("row");
      // Skip header row (index 0)
      expect(rows[1]).toHaveAttribute("aria-selected", "true");
      expect(rows[2]).toHaveAttribute("aria-selected", "true");
      expect(rows[3]).toHaveAttribute("aria-selected", "true");
    });

    it("calls onRowSelectionChange in controlled mode", async () => {
      const onRowSelectionChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Table
          columns={columnsWithSelection}
          data={testData}
          enableRowSelection
          rowSelection={{}}
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[1]);

      expect(onRowSelectionChange).toHaveBeenCalled();
    });

    it("respects controlled selection state", () => {
      // With getRowId, the key in rowSelection should match the returned ID
      const rowSelection: RowSelectionState = { "1": true };

      render(
        <Table
          columns={columnsWithSelection}
          data={testData}
          enableRowSelection
          getRowId={(row) => String(row.id)}
          rowSelection={rowSelection}
        />
      );

      const rows = screen.getAllByRole("row");
      // Row with id=1 is Alice (first data row, index 1 in the rows array)
      expect(rows[1]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Row Click", () => {
    it("calls onRowClick when row is clicked", async () => {
      const onRowClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Table
          columns={testColumns}
          data={testData}
          onRowClick={onRowClick}
        />
      );

      const rows = screen.getAllByRole("row");
      await user.click(rows[1]); // First data row

      expect(onRowClick).toHaveBeenCalledTimes(1);
      expect(onRowClick.mock.calls[0][0].original).toEqual(testData[0]);
    });

    it("applies cursor pointer style when onRowClick is provided", () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          onRowClick={() => {}}
        />
      );

      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveStyle({ cursor: "pointer" });
    });
  });

  describe("Custom Cell Rendering", () => {
    it("supports custom cell renderer via column def", () => {
      const columnsWithCustomCell: ColumnDef<User, unknown>[] = [
        { accessorKey: "name", header: "Name" },
        {
          accessorKey: "role",
          cell: ({ getValue }) => (
            <span data-testid="custom-role">{String(getValue())}</span>
          ),
          header: "Role",
        },
      ];

      render(<Table columns={columnsWithCustomCell} data={testData} />);

      expect(screen.getAllByTestId("custom-role")).toHaveLength(3);
    });

    it("supports custom header renderer via column def", () => {
      const columnsWithCustomHeader: ColumnDef<User, unknown>[] = [
        {
          accessorKey: "name",
          header: () => <span data-testid="custom-header">Full Name</span>,
        },
      ];

      render(<Table columns={columnsWithCustomHeader} data={testData} />);

      expect(screen.getByTestId("custom-header")).toHaveTextContent(
        "Full Name"
      );
    });
  });

  describe("Custom Render Props", () => {
    it("supports renderRow for custom row rendering", () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          renderRow={({ row }) => (
            <tr key={row.id} data-testid={`custom-row-${row.original.id}`}>
              <td colSpan={3}>{row.original.name}</td>
            </tr>
          )}
        />
      );

      expect(screen.getByTestId("custom-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("custom-row-2")).toBeInTheDocument();
      expect(screen.getByTestId("custom-row-3")).toBeInTheDocument();
    });

    it("supports renderCell for custom cell rendering", () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          renderCell={({ cell }) => (
            <span data-testid="custom-cell">{String(cell.getValue())}</span>
          )}
        />
      );

      const customCells = screen.getAllByTestId("custom-cell");
      expect(customCells.length).toBe(9); // 3 rows × 3 columns
    });

    it("supports renderHeader for custom header rendering", () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          renderHeader={({ table }) => (
            <tr data-testid="custom-header-row">
              {table.getFlatHeaders().map((header) => (
                <th key={header.id}>{String(header.column.columnDef.header)}</th>
              ))}
            </tr>
          )}
        />
      );

      expect(screen.getByTestId("custom-header-row")).toBeInTheDocument();
    });
  });

  describe("Filtering", () => {
    it("filters data with globalFilter", () => {
      render(
        <Table
          columns={testColumns}
          data={testData}
          enableFiltering
          globalFilter="Alice"
        />
      );

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    });

    it("shows only matching rows when globalFilter is set", () => {
      // Test that filtering works when the component is rendered with a filter
      render(
        <Table
          columns={testColumns}
          data={testData}
          enableFiltering
          globalFilter="alice"
        />
      );

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    });
  });

  describe("Row Expansion", () => {
    const columnsWithExpander: ColumnDef<User, unknown>[] = [
      {
        cell: ({ row }) => (
          <button
            data-testid={`expander-${row.original.id}`}
            type="button"
            onClick={() => row.toggleExpanded()}
          >
            {row.getIsExpanded() ? "−" : "+"}
          </button>
        ),
        header: "",
        id: "expander",
      },
      ...testColumns,
    ];

    it("renders expanded row content", async () => {
      const user = userEvent.setup();

      render(
        <Table
          columns={columnsWithExpander}
          data={testData}
          enableExpanding
          renderSubComponent={({ row }) => (
            <div data-testid={`expanded-${row.original.id}`}>
              Details for {row.original.name}
            </div>
          )}
        />
      );

      // Click expander for first row
      await user.click(screen.getByTestId("expander-1"));

      expect(screen.getByTestId("expanded-1")).toBeInTheDocument();
      expect(screen.getByText("Details for Alice")).toBeInTheDocument();
    });

    it("collapses expanded row on second click", async () => {
      const user = userEvent.setup();

      render(
        <Table
          columns={columnsWithExpander}
          data={testData}
          enableExpanding
          renderSubComponent={({ row }) => (
            <div data-testid={`expanded-${row.original.id}`}>
              Details for {row.original.name}
            </div>
          )}
        />
      );

      const expander = screen.getByTestId("expander-1");

      // Expand
      await user.click(expander);
      expect(screen.getByTestId("expanded-1")).toBeInTheDocument();

      // Collapse
      await user.click(expander);
      expect(screen.queryByTestId("expanded-1")).not.toBeInTheDocument();
    });
  });

  describe("Data Attributes", () => {
    it("applies correct data-ck attributes", () => {
      const { container } = render(
        <Table caption="Test" columns={testColumns} data={testData} />
      );

      expect(container.querySelector('[data-ck="table"]')).toBeInTheDocument();
      expect(container.querySelector('[data-ck="table-caption"]')).toBeInTheDocument();
      expect(container.querySelector('[data-ck="table-header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-ck="table-body"]')).toBeInTheDocument();
      expect(container.querySelector('[data-ck="table-row"]')).toBeInTheDocument();
      expect(container.querySelector('[data-ck="table-head"]')).toBeInTheDocument();
      expect(container.querySelector('[data-ck="table-cell"]')).toBeInTheDocument();
    });

    it("applies data-header-row to header rows", () => {
      const { container } = render(
        <Table columns={testColumns} data={testData} />
      );

      const headerRow = container.querySelector("thead tr");
      expect(headerRow).toHaveAttribute("data-header-row");
    });
  });

  describe("Accessibility", () => {
    it("has proper table semantics", () => {
      render(
        <Table
          aria-label="User directory"
          caption="List of users"
          columns={testColumns}
          data={testData}
        />
      );

      const table = screen.getByRole("table", { name: "User directory" });
      expect(table).toBeInTheDocument();

      expect(screen.getAllByRole("columnheader")).toHaveLength(3);
      expect(screen.getAllByRole("cell")).toHaveLength(9);
      expect(screen.getAllByRole("row")).toHaveLength(4); // 1 header + 3 data
    });

    it("applies scope=col to header cells", () => {
      const { container } = render(
        <Table columns={testColumns} data={testData} />
      );

      const headers = container.querySelectorAll("th");
      headers.forEach((header) => {
        expect(header).toHaveAttribute("scope", "col");
      });
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <p id="table-desc">This table shows user information</p>
          <Table
            aria-describedby="table-desc"
            columns={testColumns}
            data={testData}
          />
        </>
      );

      expect(screen.getByRole("table")).toHaveAttribute(
        "aria-describedby",
        "table-desc"
      );
    });
  });

  describe("getRowId", () => {
    it("uses custom getRowId for row identification", () => {
      const onRowSelectionChange = vi.fn();

      render(
        <Table
          columns={testColumns}
          data={testData}
          enableRowSelection
          getRowId={(row) => `user-${row.id}`}
          rowSelection={{ "user-1": true }}
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty columns array", () => {
      render(<Table columns={[]} data={testData} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("handles single column", () => {
      const singleColumn: ColumnDef<User, unknown>[] = [
        { accessorKey: "name", header: "Name" },
      ];

      render(<Table columns={singleColumn} data={testData} />);

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("handles single row", () => {
      render(<Table columns={testColumns} data={[testData[0]]} />);

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
  });
});
