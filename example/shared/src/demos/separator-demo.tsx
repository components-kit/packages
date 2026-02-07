import { Separator } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function SeparatorPreview() {
  return (
    <div>
      <p style={{ margin: "0 0 8px" }}>Content above</p>
      <Separator />
      <p style={{ margin: "8px 0" }}>Content below</p>
      <Separator />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "8px",
          height: "24px",
          marginTop: "16px",
        }}
      >
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Middle</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  );
}

export const separatorDemo: ComponentDemo = {
  code: `import { Separator } from "@components-kit/react";

{/* Horizontal */}
<Separator />

{/* Vertical */}
<div style={{ display: "flex", alignItems: "center", gap: "8px", height: "24px" }}>
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Middle</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>`,
  id: "separator",
  name: "Separator",
  preview: <SeparatorPreview />,
};
