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
        action={{ children: "Retry", onClick: () => alert("Retrying...") }}
        description="Something went wrong. Please try again."
        heading="Error"
        variantName="destructive"
      />
      <Alert
        action={{ children: "View", onClick: () => alert("Viewing...") }}
        description="Your changes have been saved successfully."
        heading="Success"
        variantName="success"
      />
      <Alert
        action={{ children: "Review", onClick: () => alert("Reviewing...") }}
        description="Please review your input before proceeding."
        heading="Warning"
        variantName="warning"
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
  action={{ children: "Retry", onClick: () => alert("Retrying...") }}
  description="Something went wrong. Please try again."
  heading="Error"
  variantName="destructive"
/>

<Alert
  action={{ children: "View", onClick: () => alert("Viewing...") }}
  description="Your changes have been saved successfully."
  heading="Success"
  variantName="success"
/>

<Alert
  action={{ children: "Review", onClick: () => alert("Reviewing...") }}
  description="Please review your input before proceeding."
  heading="Warning"
  variantName="warning"
/>`,
  id: "alert",
  name: "Alert",
  preview: <AlertPreview />,
};
