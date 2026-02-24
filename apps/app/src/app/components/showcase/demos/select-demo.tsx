import { Select } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function SelectPreview() {
  return (
    <Select
      defaultValue="Banana"
      options={["Apple", "Banana", "Cherry", "Date"]}
      placeholder="Select a fruit..."
      variantName="default"
    />
  );
}

function SelectFullPreview() {
  return (
    <div className="w-full max-w-xs">
      <p className="mb-1 text-sm text-neutral-500">Favorite fruit</p>
      <Select
        defaultValue="Banana"
        options={["Apple", "Banana", "Cherry", "Date"]}
        placeholder="Select a fruit..."
        variantName="default"
      />
    </div>
  );
}

export const selectDemo: ShowcaseDemo = {
  fullPreview: <SelectFullPreview />,
  id: "select",
  name: "Select",
  preview: <SelectPreview />,
};
