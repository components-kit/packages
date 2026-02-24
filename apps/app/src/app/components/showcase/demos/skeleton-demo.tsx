import { Skeleton } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function SkeletonPreview() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="shrink-0 overflow-hidden rounded-full">
          <Skeleton height="40px" variantName="default" width="40px" />
        </div>
        <Skeleton height="20px" variantName="default" width="60%" />
      </div>
      <Skeleton height="12px" variantName="default" width="100%" />
      <Skeleton height="12px" variantName="default" width="85%" />
      <Skeleton height="12px" variantName="default" width="70%" />
    </div>
  );
}

export const skeletonDemo: ShowcaseDemo = {
  fullPreview: <SkeletonPreview />,
  id: "skeleton",
  name: "Skeleton",
  preview: <SkeletonPreview />,
};
