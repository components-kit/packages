"use client";

import { Input } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function InputPreview() {
  const [value, setValue] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "320px",
      }}
    >
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Text Input
        </p>
        <Input
          id="input-demo-1"
          placeholder="Enter text..."
          value={value}
          variantName="default"
          onChange={(e) => setValue(e.target.value)}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "4px 0 0" }}>
          Value: {value}
        </p>
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Email
        </p>
        <Input
          id="input-demo-2"
          placeholder="you@example.com"
          type="email"
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Disabled
        </p>
        <Input
          id="input-demo-3"
          disabled
          placeholder="Disabled"
          variantName="default"
        />
      </div>
    </div>
  );
}

export const inputDemo: ComponentDemo = {
  code: `import { Input } from "@components-kit/react";
import { useState } from "react";

function SearchField() {
  const [value, setValue] = useState("");

  return (
    <Input
      aria-label="Search"
      inputMode="search"
      placeholder="Search components..."
      value={value}
      variantName="default"
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

<Input placeholder="you@example.com" type="email" variantName="default" />
<Input disabled placeholder="Disabled" variantName="default" />`,
  id: "input",
  name: "Input",
  preview: <InputPreview />,
};
