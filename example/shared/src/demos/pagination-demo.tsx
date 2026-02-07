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
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Offset Mode (Uncontrolled)
        </p>
        <Pagination defaultPage={1} totalPages={10} />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Offset Mode (Controlled)
        </p>
        <Pagination
          page={page}
          totalPages={10}
          onPageChange={setPage}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Current page: {page}
        </p>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Custom Siblings
        </p>
        <Pagination defaultPage={10} siblings={2} totalPages={20} />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          With First/Last Buttons
        </p>
        <Pagination defaultPage={5} showFirstLast totalPages={50} />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Cursor Mode
        </p>
        <Pagination
          hasNextPage={cursorPage < 5}
          hasPreviousPage={cursorPage > 1}
          onNext={() => setCursorPage((p) => Math.min(p + 1, 5))}
          onPrevious={() => setCursorPage((p) => Math.max(p - 1, 1))}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Cursor page: {cursorPage}
        </p>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled
        </p>
        <Pagination defaultPage={3} disabled totalPages={10} />
      </div>
    </div>
  );
}

export const paginationDemo: ComponentDemo = {
  code: `import { Pagination } from "@components-kit/react";

{/* Offset mode */}
<Pagination defaultPage={1} totalPages={10} />

{/* Controlled */}
<Pagination page={page} totalPages={10} onPageChange={setPage} />

{/* With first/last buttons */}
<Pagination defaultPage={5} showFirstLast totalPages={50} />

{/* Cursor mode */}
<Pagination
  hasNextPage={hasNext}
  hasPreviousPage={hasPrev}
  onNext={() => fetchNext()}
  onPrevious={() => fetchPrev()}
/>`,
  id: "pagination",
  name: "Pagination",
  preview: <PaginationPreview />,
};
