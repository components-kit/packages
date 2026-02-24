import { Progress } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function ProgressPreview() {
  return <Progress label="Uploading..." value={60} variantName="default" />;
}

function ProgressFullPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress label="Uploading..." value={60} variantName="default" />
      <Progress label="Almost done" value={90} variantName="default" />
      <Progress label="Complete" value={100} variantName="default" />
    </div>
  );
}

export const progressDemo: ShowcaseDemo = {
  fullPreview: <ProgressFullPreview />,
  id: "progress",
  name: "Progress",
  preview: <ProgressPreview />,
};
