import { Combobox } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function ComboboxPreview() {
  return (
    <Combobox
      defaultValue="Cherry"
      options={["Apple", "Banana", "Cherry", "Date"]}
      placeholder="Search fruits..."
      variantName="default"
    />
  );
}

function ComboboxFullPreview() {
  return (
    <div className="w-full max-w-xs">
      <p className="mb-1 text-sm text-neutral-500">Search fruits</p>
      <Combobox
        defaultValue="Cherry"
        options={["Apple", "Banana", "Cherry", "Date"]}
        placeholder="Search fruits..."
        variantName="default"
      />
    </div>
  );
}

export const comboboxDemo: ShowcaseDemo = {
  fullPreview: <ComboboxFullPreview />,
  id: "combobox",
  name: "Combobox",
  preview: <ComboboxPreview />,
};
