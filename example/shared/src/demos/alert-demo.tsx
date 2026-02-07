import { Alert } from "@components-kit/react";

import { type ComponentDemo } from "../types";
import { InfoIcon } from "./shared-data";

function AlertPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Alert
        description="This is an alert description."
        heading="Alert Heading"
        icon={<InfoIcon />}
        variantName="primary"
      />
      <Alert
        action={{ children: "Dismiss", onClick: () => alert("Dismissed") }}
        description="Alert with action button."
        heading="With Action"
        variantName="primary"
      />
    </div>
  );
}

export const alertDemo: ComponentDemo = {
  code: `import { Alert } from "@components-kit/react";

<Alert
  description="This is an alert description."
  heading="Alert Heading"
  icon={<InfoIcon />}
  variantName="primary"
/>

<Alert
  action={{ children: "Dismiss", onClick: () => alert("Dismissed") }}
  description="Alert with action button."
  heading="With Action"
  variantName="primary"
/>`,
  id: "alert",
  name: "Alert",
  preview: <AlertPreview />,
};
