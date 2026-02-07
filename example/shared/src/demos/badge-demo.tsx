import { Badge } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function BadgePreview() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <Badge variantName="primary">Primary</Badge>
      <Badge size="sm" variantName="primary">
        Small
      </Badge>
      <Badge size="lg" variantName="primary">
        Large
      </Badge>
    </div>
  );
}

export const badgeDemo: ComponentDemo = {
  code: `import { Badge } from "@components-kit/react";

<Badge variantName="primary">Primary</Badge>
<Badge size="sm" variantName="primary">Small</Badge>
<Badge size="lg" variantName="primary">Large</Badge>`,
  id: "badge",
  name: "Badge",
  preview: <BadgePreview />,
};
