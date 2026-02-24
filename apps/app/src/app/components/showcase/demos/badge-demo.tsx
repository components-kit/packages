import { Badge } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function BadgePreview() {
  return (
    <Badge size="lg" variantName="default">
      Badge
    </Badge>
  );
}

function BadgeFullPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variantName="default">Default</Badge>
        <Badge variantName="secondary">Secondary</Badge>
        <Badge variantName="destructive">Destructive</Badge>
        <Badge variantName="outline">Outline</Badge>
        <Badge variantName="success">Success</Badge>
        <Badge variantName="warning">Warning</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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

export const badgeDemo: ShowcaseDemo = {
  fullPreview: <BadgeFullPreview />,
  id: "badge",
  name: "Badge",
  preview: <BadgePreview />,
};
