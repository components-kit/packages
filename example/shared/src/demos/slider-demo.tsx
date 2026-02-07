"use client";

import { Slider } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function SliderPreview() {
  const [value, setValue] = useState(50);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "400px" }}>
      <div>
        <label id="slider-demo-controlled">Volume: {value}</label>
        <Slider
          aria-labelledby="slider-demo-controlled"
          value={value}
          variantName="default"
          onValueChange={setValue}
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Uncontrolled (defaultValue)
        </p>
        <Slider
          aria-label="Brightness"
          defaultValue={75}
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Custom Range & Step
        </p>
        <Slider
          aria-label="Temperature"
          defaultValue={22}
          max={40}
          min={0}
          step={0.5}
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled
        </p>
        <Slider
          aria-label="Locked slider"
          defaultValue={30}
          disabled
          variantName="default"
        />
      </div>
    </div>
  );
}

export const sliderDemo: ComponentDemo = {
  code: `import { Slider } from "@components-kit/react";
import { useState } from "react";

const [value, setValue] = useState(50);

<Slider
  aria-label="Volume"
  value={value}
  variantName="default"
  onValueChange={setValue}
/>

<Slider aria-label="Brightness" defaultValue={75} variantName="default" />

<Slider
  aria-label="Temperature"
  defaultValue={22}
  max={40}
  min={0}
  step={0.5}
  variantName="default"
/>

<Slider aria-label="Locked" defaultValue={30} disabled variantName="default" />`,
  id: "slider",
  name: "Slider",
  preview: <SliderPreview />,
};
