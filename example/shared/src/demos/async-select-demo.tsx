"use client";

import { AsyncSelect } from "@components-kit/react";
import { useCallback, useState } from "react";

import { type ComponentDemo } from "../types";
import { type User, users } from "./shared-data";

function AsyncSelectPreview() {
  const [value, setValue] = useState<string>();

  const mockSearch = useCallback(
    async (query: string): Promise<{ label: string; value: string }[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allFruits = [
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry" },
        { label: "Date", value: "date" },
        { label: "Elderberry", value: "elderberry" },
        { label: "Fig", value: "fig" },
        { label: "Grape", value: "grape" },
        { label: "Honeydew", value: "honeydew" },
      ];
      return allFruits.filter((f) =>
        f.label.toLowerCase().includes(query.toLowerCase()),
      );
    },
    [],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "320px" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Basic Search
        </p>
        <AsyncSelect
          placeholder="Search fruits..."
          value={value}
          variantName="default"
          onSearch={mockSearch}
          onValueChange={setValue}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Selected: {value ?? "none"}
        </p>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          With Initial Options
        </p>
        <AsyncSelect
          initialOptions={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          placeholder="Search or pick..."
          variantName="default"
          onSearch={mockSearch}
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Custom Debounce
        </p>
        <AsyncSelect
          debounceMs={500}
          minSearchLength={2}
          placeholder="Type 2+ chars..."
          variantName="default"
          onSearch={mockSearch}
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          With Caching
        </p>
        <AsyncSelect
          cacheResults
          placeholder="Cached search..."
          variantName="default"
          onSearch={mockSearch}
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Object Values
        </p>
        <AsyncSelect<User>
          getOptionValue={(u) => u.id}
          initialOptions={users.map((u) => ({ label: u.name, value: u }))}
          placeholder="Search users..."
          variantName="default"
          onSearch={async (query) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return users
              .filter((u) =>
                u.name.toLowerCase().includes(query.toLowerCase()),
              )
              .map((u) => ({ label: u.name, value: u }));
          }}
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled
        </p>
        <AsyncSelect
          disabled
          placeholder="Disabled"
          variantName="default"
          onSearch={mockSearch}
        />
      </div>
    </div>
  );
}

export const asyncSelectDemo: ComponentDemo = {
  code: `import { AsyncSelect } from "@components-kit/react";

const onSearch = async (query: string) => {
  const res = await fetch(\`/api/search?q=\${query}\`);
  return res.json(); // [{ label: "...", value: "..." }]
};

<AsyncSelect
  placeholder="Search fruits..."
  value={value}
  variantName="default"
  onSearch={onSearch}
  onValueChange={setValue}
/>

{/* With initial options */}
<AsyncSelect
  initialOptions={[{ label: "Apple", value: "apple" }]}
  placeholder="Search or pick..."
  variantName="default"
  onSearch={onSearch}
/>

{/* With caching */}
<AsyncSelect cacheResults placeholder="Cached..." variantName="default" onSearch={onSearch} />`,
  id: "async-select",
  name: "AsyncSelect",
  preview: <AsyncSelectPreview />,
};
