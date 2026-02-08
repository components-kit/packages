"use client";

import { Slider } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function SliderPreview() {
  const [value, setValue] = useState(50);
  const [committed, setCommitted] = useState<number | null>(null);

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
          With onValueCommit{committed !== null ? `: committed ${committed}` : ""}
        </p>
        <Slider
          aria-label="Commit example"
          defaultValue={50}
          variantName="default"
          onValueCommit={setCommitted}
        />
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
            Vertical
          </p>
          <Slider
            aria-label="Vertical slider"
            defaultValue={60}
            orientation="vertical"
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

// onValueCommit fires only when drag ends
<Slider
  aria-label="Volume"
  defaultValue={50}
  variantName="default"
  onValueCommit={(v) => saveToServer(v)}
/>

// Vertical orientation
<Slider
  aria-label="Volume"
  defaultValue={60}
  orientation="vertical"
  variantName="default"
/>

<Slider aria-label="Locked" defaultValue={30} disabled variantName="default" />`,
  id: "slider",
  name: "Slider",
  preview: <SliderPreview />,
};
