"use client";

import { Pagination } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function PaginationPreview() {
  const [page, setPage] = useState(1);
  const [cursorPage, setCursorPage] = useState(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Offset Mode (Uncontrolled)
        </p>
        <Pagination defaultPage={1} totalPages={10} variantName="default" />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Offset Mode (Controlled)
        </p>
        <Pagination
          page={page}
          totalPages={10}
          variantName="default"
          onPageChange={setPage}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Current page: {page}
        </p>
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Custom Siblings
        </p>
        <Pagination
          defaultPage={10}
          siblings={2}
          totalPages={20}
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          With First/Last Buttons
        </p>
        <Pagination
          defaultPage={5}
          showFirstLast
          totalPages={50}
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Cursor Mode
        </p>
        <Pagination
          hasNextPage={cursorPage < 5}
          hasPreviousPage={cursorPage > 1}
          variantName="default"
          onNext={() => setCursorPage((p) => Math.min(p + 1, 5))}
          onPrevious={() => setCursorPage((p) => Math.max(p - 1, 1))}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Cursor page: {cursorPage}
        </p>
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Disabled
        </p>
        <Pagination
          defaultPage={3}
          disabled
          totalPages={10}
          variantName="default"
        />
      </div>
    </div>
  );
}

export const paginationDemo: ComponentDemo = {
  code: `import { Pagination } from "@components-kit/react";
import { useState } from "react";

const fetchNext = () => {};
const fetchPrevious = () => {};
const fetchFirst = () => {};
const fetchLast = () => {};
const hasNext = true;
const hasPrev = false;

function ControlledPagination() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} totalPages={10} variantName="default" onPageChange={setPage} />;
}

{/* Offset mode */}
<Pagination defaultPage={1} totalPages={10} variantName="default" />

{/* Controlled */}
<ControlledPagination />

{/* With first/last buttons */}
<Pagination defaultPage={5} showFirstLast totalPages={50} variantName="default" />

{/* Cursor mode */}
<Pagination
  hasNextPage={hasNext}
  hasPreviousPage={hasPrev}
  onNext={() => fetchNext()}
  onPrevious={() => fetchPrevious()}
  onFirst={() => fetchFirst()}
  onLast={() => fetchLast()}
  variantName="default"
/>`,
  id: "pagination",
  name: "Pagination",
  preview: <PaginationPreview />,
};
