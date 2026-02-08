"use client";

import { Pagination, Table } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";
import { columns, users } from "./shared-data";

const PAGE_SIZE = 2;

function TablePreview() {
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = Math.ceil(users.length / PAGE_SIZE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Table
        aria-label="Users table"
        columns={columns}
        data={users}
        enablePagination
        enableSorting
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        variantName="default"
        onPageChange={setPageIndex}
      />
      <Pagination
        page={pageIndex + 1}
        totalPages={totalPages}
        variantName="default"
        onPageChange={(page) => setPageIndex(page - 1)}
      />
    </div>
  );
}

export const tableDemo: ComponentDemo = {
  code: `import { Pagination, Table, type ColumnDef } from "@components-kit/react";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

const PAGE_SIZE = 2;

function MyTable() {
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = Math.ceil(users.length / PAGE_SIZE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Table
        aria-label="Users table"
        columns={columns}
        data={users}
        enablePagination
        enableSorting
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        onPageChange={setPageIndex}
        variantName="default"
      />
      <Pagination
        page={pageIndex + 1}
        totalPages={totalPages}
        onPageChange={(page) => setPageIndex(page - 1)}
        variantName="default"
      />
    </div>
  );
}`,
  id: "table",
  name: "Table",
  preview: <TablePreview />,
};
