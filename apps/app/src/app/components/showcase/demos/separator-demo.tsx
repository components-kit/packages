import { Separator } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function SeparatorPreview() {
  return (
    <div className="w-full">
      <p className="mb-2 text-sm">Content above</p>
      <Separator />
      <p className="my-2 text-sm">Content below</p>
      <Separator />
    </div>
  );
}

export const separatorDemo: ShowcaseDemo = {
  fullPreview: <SeparatorPreview />,
  id: "separator",
  name: "Separator",
  preview: <SeparatorPreview />,
};
