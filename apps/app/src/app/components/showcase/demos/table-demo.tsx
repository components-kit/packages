import { Table } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

import { columns, users } from "./shared-data";

function TablePreview() {
  return (
    <div className="w-full overflow-x-auto">
      <Table
        aria-label="Users table"
        columns={columns}
        data={users.slice(0, 1)}
        variantName="default"
      />
    </div>
  );
}

export const tableDemo: ShowcaseDemo = {
  fullPreview: <TablePreview />,
  id: "table",
  name: "Table",
  preview: <TablePreview />,
};
