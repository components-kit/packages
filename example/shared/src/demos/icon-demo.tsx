import { Icon } from "@components-kit/react";

import { type ComponentDemo } from "../types";
import { InfoIcon, SearchIcon } from "./shared-data";

function IconPreview() {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
      <Icon aria-hidden="true" height="16px" width="16px">
        <InfoIcon />
      </Icon>
      <Icon aria-hidden="true" height="24px" width="24px">
        <InfoIcon />
      </Icon>
      <Icon aria-hidden="true" height="32px" width="32px">
        <InfoIcon />
      </Icon>
      <Icon aria-hidden="true" height="48px" width="48px">
        <SearchIcon />
      </Icon>
    </div>
  );
}

export const iconDemo: ComponentDemo = {
  code: `import { Icon } from "@components-kit/react";

<Icon aria-hidden="true" height="16px" width="16px">
  <InfoIcon />
</Icon>
<Icon aria-hidden="true" height="24px" width="24px">
  <InfoIcon />
</Icon>
<Icon aria-hidden="true" height="32px" width="32px">
  <InfoIcon />
</Icon>
<Icon aria-hidden="true" height="48px" width="48px">
  <SearchIcon />
</Icon>`,
  id: "icon",
  name: "Icon",
  preview: <IconPreview />,
};
