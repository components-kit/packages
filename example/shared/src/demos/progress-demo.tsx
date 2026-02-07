import { Progress } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function ProgressPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          With Label
        </p>
        <Progress label="Uploading files..." value={50} variantName="default" />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          80% Progress
        </p>
        <Progress label="Processing..." value={80} variantName="default" />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Custom Range (3 of 5)
        </p>
        <Progress
          aria-valuetext="Step 3 of 5"
          label="Steps completed"
          max={5}
          min={0}
          value={3}
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Complete
        </p>
        <Progress label="Complete" value={100} variantName="default" />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Indeterminate (loading)
        </p>
        <Progress label="Loading..." variantName="default" />
      </div>
    </div>
  );
}

export const progressDemo: ComponentDemo = {
  code: `import { Progress } from "@components-kit/react";

<Progress label="Uploading files..." value={50} variantName="default" />
<Progress label="Processing..." value={80} variantName="default" />
<Progress label="Steps completed" max={5} min={0} value={3} variantName="default" />
<Progress label="Complete" value={100} variantName="default" />
<Progress label="Loading..." variantName="default" />`,
  id: "progress",
  name: "Progress",
  preview: <ProgressPreview />,
};
