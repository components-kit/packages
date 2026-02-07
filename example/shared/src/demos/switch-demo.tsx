"use client";

import { Switch } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function SwitchPreview() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <Switch
          id="sw-demo-1"
          checked={checked}
          variantName="default"
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label htmlFor="sw-demo-1">
          {" "}
          Controlled (checked: {String(checked)})
        </label>
      </div>
      <div>
        <Switch id="sw-demo-2" defaultChecked variantName="default" />
        <label htmlFor="sw-demo-2"> Default checked</label>
      </div>
      <div>
        <Switch id="sw-demo-3" disabled variantName="default" />
        <label htmlFor="sw-demo-3"> Disabled</label>
      </div>
    </div>
  );
}

export const switchDemo: ComponentDemo = {
  code: `import { Switch } from "@components-kit/react";
import { useState } from "react";

const [checked, setChecked] = useState(false);

<Switch
  checked={checked}
  variantName="default"
  onChange={(e) => setChecked(e.target.checked)}
/>

<Switch defaultChecked variantName="default" />
<Switch disabled variantName="default" />`,
  id: "switch",
  name: "Switch",
  preview: <SwitchPreview />,
};
