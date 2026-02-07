"use client";

import { MultiSelect } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";
import { type User, users } from "./shared-data";

function MultiSelectPreview() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "320px" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Basic
        </p>
        <MultiSelect
          options={["React", "Vue", "Angular", "Svelte", "Solid"]}
          placeholder="Select frameworks..."
          value={value}
          variantName="default"
          onValueChange={setValue}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Selected: {value.length > 0 ? value.join(", ") : "none"}
        </p>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          With Max Selection (3)
        </p>
        <MultiSelect
          maxSelected={3}
          options={["Red", "Blue", "Green", "Yellow", "Purple", "Orange"]}
          placeholder="Pick up to 3 colors..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Grouped
        </p>
        <MultiSelect
          options={[
            {
              label: "Frontend",
              options: ["React", "Vue", "Angular"],
              type: "group",
            },
            {
              label: "Backend",
              options: ["Node.js", "Python", "Go"],
              type: "group",
            },
          ]}
          placeholder="Select technologies..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Object Values
        </p>
        <MultiSelect<User>
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          placeholder="Select users..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled
        </p>
        <MultiSelect
          disabled
          options={["React", "Vue"]}
          placeholder="Disabled"
          variantName="default"
        />
      </div>
    </div>
  );
}

export const multiSelectDemo: ComponentDemo = {
  code: `import { MultiSelect } from "@components-kit/react";

<MultiSelect
  options={["React", "Vue", "Angular", "Svelte", "Solid"]}
  placeholder="Select frameworks..."
  value={value}
  variantName="default"
  onValueChange={setValue}
/>

{/* With max selection */}
<MultiSelect
  maxSelected={3}
  options={["Red", "Blue", "Green", "Yellow"]}
  placeholder="Pick up to 3..."
  variantName="default"
/>

{/* Grouped */}
<MultiSelect
  options={[
    { label: "Frontend", options: ["React", "Vue"], type: "group" },
    { label: "Backend", options: ["Node.js", "Go"], type: "group" },
  ]}
  placeholder="Select technologies..."
  variantName="default"
/>`,
  id: "multi-select",
  name: "MultiSelect",
  preview: <MultiSelectPreview />,
};
