"use client";

import { RadioGroup, RadioGroupItem } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function RadioGroupPreview() {
  const [value, setValue] = useState("option1");

  return (
    <div>
      <RadioGroup aria-label="Select option" variantName="default">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div>
            <RadioGroupItem
              id="rg-demo-1"
              checked={value === "option1"}
              name="radio-demo"
              value="option1"
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="rg-demo-1"> Option 1</label>
          </div>
          <div>
            <RadioGroupItem
              id="rg-demo-2"
              checked={value === "option2"}
              name="radio-demo"
              value="option2"
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="rg-demo-2"> Option 2</label>
          </div>
          <div>
            <RadioGroupItem
              id="rg-demo-3"
              checked={value === "option3"}
              name="radio-demo"
              value="option3"
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="rg-demo-3"> Option 3</label>
          </div>
        </div>
      </RadioGroup>
      <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
        Selected: {value}
      </p>
    </div>
  );
}

export const radioGroupDemo: ComponentDemo = {
  code: `import { RadioGroup, RadioGroupItem } from "@components-kit/react";
import { useState } from "react";

const [value, setValue] = useState("option1");

<RadioGroup aria-label="Select option" variantName="default">
  <RadioGroupItem
    checked={value === "option1"}
    name="radio"
    value="option1"
    onChange={(e) => setValue(e.target.value)}
  />
  <RadioGroupItem
    checked={value === "option2"}
    name="radio"
    value="option2"
    onChange={(e) => setValue(e.target.value)}
  />
</RadioGroup>`,
  id: "radio-group",
  name: "RadioGroup",
  preview: <RadioGroupPreview />,
};
