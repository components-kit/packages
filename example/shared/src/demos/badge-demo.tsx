import { Badge } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function BadgePreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Badge variantName="default">Default</Badge>
        <Badge variantName="secondary">Secondary</Badge>
        <Badge variantName="destructive">Destructive</Badge>
        <Badge variantName="outline">Outline</Badge>
        <Badge variantName="success">Success</Badge>
        <Badge variantName="warning">Warning</Badge>
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Badge size="sm" variantName="default">
          Small
        </Badge>
        <Badge size="md" variantName="default">
          Medium
        </Badge>
        <Badge size="lg" variantName="default">
          Large
        </Badge>
      </div>
    </div>
  );
}

export const badgeDemo: ComponentDemo = {
  code: `import { Badge } from "@components-kit/react";

{/* Variants */}
<Badge variantName="default">Default</Badge>
<Badge variantName="secondary">Secondary</Badge>
<Badge variantName="destructive">Destructive</Badge>
<Badge variantName="outline">Outline</Badge>
<Badge variantName="success">Success</Badge>
<Badge variantName="warning">Warning</Badge>

{/* Sizes */}
<Badge size="sm" variantName="default">Small</Badge>
<Badge size="md" variantName="default">Medium</Badge>
<Badge size="lg" variantName="default">Large</Badge>`,
  id: "badge",
  name: "Badge",
  preview: <BadgePreview />,
};
