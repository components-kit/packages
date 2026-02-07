"use client";

import { Input } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function InputPreview() {
  const [value, setValue] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px" }}>
      <div>
        <label htmlFor="input-demo-1">Text Input: </label>
        <Input
          id="input-demo-1"
          placeholder="Enter text..."
          value={value}
          variantName="default"
          onChange={(e) => setValue(e.target.value)}
        />
        <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
          {" "}
          Value: {value}
        </span>
      </div>
      <div>
        <label htmlFor="input-demo-2">Email: </label>
        <Input
          id="input-demo-2"
          placeholder="you@example.com"
          type="email"
          variantName="default"
        />
      </div>
      <div>
        <label htmlFor="input-demo-3">Disabled: </label>
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

const [value, setValue] = useState("");

<Input
  placeholder="Enter text..."
  value={value}
  variantName="default"
  onChange={(e) => setValue(e.target.value)}
/>

<Input placeholder="you@example.com" type="email" variantName="default" />
<Input disabled placeholder="Disabled" variantName="default" />`,
  id: "input",
  name: "Input",
  preview: <InputPreview />,
};
