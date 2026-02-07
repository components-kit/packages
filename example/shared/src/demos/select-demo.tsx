"use client";

import { Select } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";
import { type User, users } from "./shared-data";

function SelectPreview() {
  const [value, setValue] = useState<string>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "320px" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Basic
        </p>
        <Select
          options={["Apple", "Banana", "Cherry", "Date"]}
          placeholder="Select a fruit..."
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
          Labeled Options
        </p>
        <Select
          options={[
            { label: "United States", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "Canada", value: "ca" },
            { label: "Australia", value: "au" },
          ]}
          placeholder="Select a country..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Grouped Options
        </p>
        <Select
          options={[
            {
              label: "Fruits",
              options: ["Apple", "Banana", "Cherry"],
              type: "group",
            },
            { type: "separator" },
            {
              label: "Vegetables",
              options: ["Carrot", "Broccoli", "Spinach"],
              type: "group",
            },
          ]}
          placeholder="Select food..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Object Values
        </p>
        <Select<User>
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          placeholder="Select a user..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled
        </p>
        <Select
          disabled
          options={["Apple", "Banana"]}
          placeholder="Disabled"
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Empty Options
        </p>
        <Select
          emptyContent="No items available"
          options={[]}
          placeholder="No options..."
          variantName="default"
        />
      </div>
    </div>
  );
}

export const selectDemo: ComponentDemo = {
  code: `import { Select } from "@components-kit/react";

{/* Basic */}
<Select
  options={["Apple", "Banana", "Cherry", "Date"]}
  placeholder="Select a fruit..."
  value={value}
  variantName="default"
  onValueChange={setValue}
/>

{/* Labeled Options */}
<Select
  options={[
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
  ]}
  placeholder="Select a country..."
  variantName="default"
/>

{/* Grouped Options */}
<Select
  options={[
    { label: "Fruits", options: ["Apple", "Banana"], type: "group" },
    { type: "separator" },
    { label: "Vegetables", options: ["Carrot", "Broccoli"], type: "group" },
  ]}
  placeholder="Select food..."
  variantName="default"
/>`,
  id: "select",
  name: "Select",
  preview: <SelectPreview />,
};
