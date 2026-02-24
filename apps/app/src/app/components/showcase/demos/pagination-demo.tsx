import { Pagination } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function PaginationPreview() {
  return (
    <Pagination defaultPage={3} totalPages={10} variantName="default" />
  );
}

export const paginationDemo: ShowcaseDemo = {
  fullPreview: <PaginationPreview />,
  id: "pagination",
  name: "Pagination",
  preview: <PaginationPreview />,
};
