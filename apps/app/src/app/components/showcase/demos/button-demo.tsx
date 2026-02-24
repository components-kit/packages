import { Button } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

import { SearchIcon } from "./shared-data";

function ButtonPreview() {
  return (
    <Button size="lg" variantName="primary">
      Button
    </Button>
  );
}

function ButtonFullPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variantName="primary">Primary</Button>
        <Button variantName="secondary">Secondary</Button>
        <Button variantName="destructive">Destructive</Button>
        <Button variantName="outline">Outline</Button>
        <Button variantName="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
      <div className="flex flex-wrap items-center gap-2">
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
    </div>
  );
}

export const buttonDemo: ShowcaseDemo = {
  fullPreview: <ButtonFullPreview />,
  id: "button",
  name: "Button",
  preview: <ButtonPreview />,
};
