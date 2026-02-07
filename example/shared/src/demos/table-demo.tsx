import { Table } from "@components-kit/react";

import { type ComponentDemo } from "../types";
import { columns, users } from "./shared-data";

function TablePreview() {
  return (
    <Table
      aria-label="Users table"
      columns={columns}
      data={users}
      enablePagination
      enableSorting
      pageSize={2}
      variantName="default"
    />
  );
}

export const tableDemo: ComponentDemo = {
  code: `import { Table, type ColumnDef } from "@components-kit/react";

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

<Table
  aria-label="Users table"
  columns={columns}
  data={users}
  enablePagination
  enableSorting
  pageSize={2}
  variantName="default"
/>`,
  id: "table",
  name: "Table",
  preview: <TablePreview />,
};
