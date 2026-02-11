import { Alert } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function AlertPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Alert
        description="This is an alert description."
        heading="Alert Heading"
        variantName="default"
      />
      <Alert
        action={{ children: "Dismiss", onClick: () => alert("Dismissed") }}
        description="Alert with action button."
        heading="With Action"
        variantName="default"
      />
      <Alert
        description="Something went wrong. Please try again."
        heading="Error"
        variantName="destructive"
      />
    </div>
  );
}

export const alertDemo: ComponentDemo = {
  code: `import { Alert } from "@components-kit/react";

<Alert
  description="This is an alert description."
  heading="Alert Heading"
  variantName="default"
/>

<Alert
  action={{ children: "Dismiss", onClick: () => alert("Dismissed") }}
  description="Alert with action button."
  heading="With Action"
  variantName="default"
/>

<Alert
  description="Something went wrong. Please try again."
  heading="Error"
  variantName="destructive"
/>`,
  id: "alert",
  name: "Alert",
  preview: <AlertPreview />,
};
