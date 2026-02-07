"use client";

import { Combobox } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";
import { type User, users } from "./shared-data";

function ComboboxPreview() {
  const [value, setValue] = useState<string>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "320px" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Basic
        </p>
        <Combobox
          options={["Apple", "Banana", "Cherry", "Date", "Elderberry"]}
          placeholder="Search fruits..."
          value={value}
          variantName="default"
          onValueChange={setValue}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Selected: {value ?? "none"}
        </p>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          With Labeled Options
        </p>
        <Combobox
          options={[
            { label: "United States", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "Canada", value: "ca" },
            { label: "Australia", value: "au" },
            { label: "Germany", value: "de" },
          ]}
          placeholder="Search countries..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Grouped
        </p>
        <Combobox
          options={[
            {
              label: "Fruits",
              options: ["Apple", "Banana", "Cherry"],
              type: "group",
            },
            {
              label: "Vegetables",
              options: ["Carrot", "Broccoli", "Spinach"],
              type: "group",
            },
          ]}
          placeholder="Search food..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Object Values
        </p>
        <Combobox<User>
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          placeholder="Search users..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled
        </p>
        <Combobox
          disabled
          options={["Apple", "Banana"]}
          placeholder="Disabled"
          variantName="default"
        />
      </div>
    </div>
  );
}

export const comboboxDemo: ComponentDemo = {
  code: `import { Combobox } from "@components-kit/react";

<Combobox
  options={["Apple", "Banana", "Cherry", "Date", "Elderberry"]}
  placeholder="Search fruits..."
  value={value}
  variantName="default"
  onValueChange={setValue}
/>

{/* Grouped */}
<Combobox
  options={[
    { label: "Fruits", options: ["Apple", "Banana"], type: "group" },
    { label: "Vegetables", options: ["Carrot", "Broccoli"], type: "group" },
  ]}
  placeholder="Search food..."
  variantName="default"
/>`,
  id: "combobox",
  name: "Combobox",
  preview: <ComboboxPreview />,
};
