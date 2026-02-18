import { Button } from "@components-kit/react";

import { type ComponentDemo } from "../types";
import { SearchIcon } from "./shared-data";

function ButtonPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <Button variantName="primary">Primary</Button>
        <Button variantName="secondary">Secondary</Button>
        <Button variantName="destructive">Destructive</Button>
        <Button variantName="outline">Outline</Button>
        <Button variantName="ghost">Ghost</Button>
      </div>
      <div
        style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "8px" }}
      >
        <Button size="sm" variantName="primary">
          Small
        </Button>
        <Button size="md" variantName="primary">
          Medium
        </Button>
        <Button size="lg" variantName="primary">
          Large
        </Button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <Button leadingIcon={<SearchIcon />} variantName="primary">
          With Icon
        </Button>
        <Button isLoading variantName="primary">
          Loading
        </Button>
        <Button disabled variantName="primary">
          Disabled
        </Button>
      </div>
      <div>
        <Button asChild variantName="primary">
          <a
            href="https://example.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            As Link (asChild)
          </a>
        </Button>
      </div>
    </div>
  );
}

export const buttonDemo: ComponentDemo = {
  code: `import { Button } from "@components-kit/react";

{/* Variants */}
<Button variantName="primary">Primary</Button>
<Button variantName="secondary">Secondary</Button>
<Button variantName="destructive">Destructive</Button>
<Button variantName="outline">Outline</Button>
<Button variantName="ghost">Ghost</Button>

{/* Sizes */}
<Button size="sm" variantName="primary">Small</Button>
<Button size="md" variantName="primary">Medium</Button>
<Button size="lg" variantName="primary">Large</Button>

{/* With icon, loading, disabled */}
<Button leadingIcon={<SearchIcon />} variantName="primary">With Icon</Button>
<Button isLoading variantName="primary">Loading</Button>
<Button disabled variantName="primary">Disabled</Button>

{/* As link using asChild */}
<Button asChild variantName="primary">
  <a href="https://example.com">As Link (asChild)</a>
</Button>`,
  id: "button",
  name: "Button",
  preview: <ButtonPreview />,
};
