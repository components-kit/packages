"use client";

import { Checkbox } from "@components-kit/react";
import { useState } from "react";

import { type ComponentDemo } from "../types";

function CheckboxPreview() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <Checkbox
          id="cb-demo-1"
          checked={checked}
          variantName="default"
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label htmlFor="cb-demo-1">
          {" "}
          Controlled (checked: {String(checked)})
        </label>
      </div>
      <div>
        <Checkbox id="cb-demo-2" defaultChecked variantName="default" />
        <label htmlFor="cb-demo-2"> Default checked</label>
      </div>
      <div>
        <Checkbox id="cb-demo-3" disabled variantName="default" />
        <label htmlFor="cb-demo-3"> Disabled</label>
      </div>
    </div>
  );
}

export const checkboxDemo: ComponentDemo = {
  code: `import { Checkbox } from "@components-kit/react";
import { useState } from "react";

function MarketingOptIn() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      checked={checked}
      variantName="default"
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}

<Checkbox defaultChecked variantName="default" />
<Checkbox disabled variantName="default" />`,
  id: "checkbox",
  name: "Checkbox",
  preview: <CheckboxPreview />,
};
