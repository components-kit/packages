"use client";

import { Textarea } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function TextareaPreview() {
  const [value, setValue] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
      <div>
        <label htmlFor="ta-demo-1">Message: </label>
        <Textarea
          id="ta-demo-1"
          placeholder="Type here..."
          rows={3}
          value={value}
          variantName="default"
          onChange={(e) => setValue(e.target.value)}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "4px 0 0" }}>
          Value: {value}
        </p>
      </div>
      <div>
        <label htmlFor="ta-demo-2">Disabled: </label>
        <Textarea
          id="ta-demo-2"
          disabled
          placeholder="Disabled"
          rows={2}
          variantName="default"
        />
      </div>
    </div>
  );
}

export const textareaDemo: ComponentDemo = {
  code: `import { Textarea } from "@components-kit/react";
import { useState } from "react";

const [value, setValue] = useState("");

<Textarea
  placeholder="Type here..."
  rows={3}
  value={value}
  variantName="default"
  onChange={(e) => setValue(e.target.value)}
/>

<Textarea disabled placeholder="Disabled" rows={2} variantName="default" />`,
  id: "textarea",
  name: "Textarea",
  preview: <TextareaPreview />,
};
