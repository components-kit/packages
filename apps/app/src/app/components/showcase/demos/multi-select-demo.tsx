import { MultiSelect } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function MultiSelectPreview() {
  return (
    <MultiSelect
      defaultValue={["React", "Vue", "Angular"]}
      options={["React", "Vue", "Angular", "Svelte"]}
      placeholder="Select frameworks..."
      variantName="default"
    />
  );
}

function MultiSelectFullPreview() {
  return (
    <div className="w-full max-w-xs">
      <p className="mb-1 text-sm text-neutral-500">Select frameworks</p>
      <MultiSelect
        defaultValue={["React", "Vue", "Angular"]}
        options={["React", "Vue", "Angular", "Svelte"]}
        placeholder="Select frameworks..."
        variantName="default"
      />
    </div>
  );
}

export const multiSelectDemo: ShowcaseDemo = {
  fullPreview: <MultiSelectFullPreview />,
  id: "multi-select",
  name: "MultiSelect",
  preview: <MultiSelectPreview />,
};
