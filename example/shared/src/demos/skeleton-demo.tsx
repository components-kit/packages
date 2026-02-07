import { Skeleton } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function SkeletonPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Skeleton height="20px" variantName="default" width="200px" />
      <Skeleton height="16px" variantName="default" width="150px" />
      <Skeleton height="100px" variantName="default" width="100px" />
    </div>
  );
}

export const skeletonDemo: ComponentDemo = {
  code: `import { Skeleton } from "@components-kit/react";

<Skeleton height="20px" variantName="default" width="200px" />
<Skeleton height="16px" variantName="default" width="150px" />
<Skeleton height="100px" variantName="default" width="100px" />`,
  id: "skeleton",
  name: "Skeleton",
  preview: <SkeletonPreview />,
};
