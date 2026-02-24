import { Icon } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

import { SearchIcon } from "./shared-data";

function IconPreview() {
  return (
    <div className="flex items-center gap-4">
      <Icon size="sm">
        <SearchIcon />
      </Icon>
      <Icon size="md">
        <SearchIcon />
      </Icon>
      <Icon size="lg">
        <SearchIcon />
      </Icon>
    </div>
  );
}

export const iconDemo: ShowcaseDemo = {
  fullPreview: <IconPreview />,
  id: "icon",
  name: "Icon",
  preview: <IconPreview />,
};
