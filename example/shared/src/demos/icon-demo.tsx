import { Icon } from "@components-kit/react";

import { type ComponentDemo } from "../types";
import { InfoIcon, SearchIcon } from "./shared-data";

function IconPreview() {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
      <Icon size="sm">
        <InfoIcon />
      </Icon>
      <Icon>
        <InfoIcon />
      </Icon>
      <Icon size="lg">
        <SearchIcon />
      </Icon>
    </div>
  );
}

export const iconDemo: ComponentDemo = {
  code: `import { Icon } from "@components-kit/react";

<Icon size="sm">
  <InfoIcon />
</Icon>
<Icon>
  <InfoIcon />
</Icon>
<Icon size="lg">
  <SearchIcon />
</Icon>`,
  id: "icon",
  name: "Icon",
  preview: <IconPreview />,
};
