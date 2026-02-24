import { Alert } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function AlertPreview() {
  return (
    <div className="w-full">
      <Alert
        description="Please review the latest changes before deploying to production."
        heading="Update available"
        variantName="default"
      />
    </div>
  );
}

function AlertFullPreview() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <Alert
        description="This is an informational alert."
        heading="Default"
        variantName="default"
      />
      <Alert
        action={{ children: "Retry", onClick: () => {} }}
        description="Something went wrong. Please try again."
        heading="Error"
        variantName="destructive"
      />
      <Alert
        action={{ children: "View", onClick: () => {} }}
        description="Your changes have been saved successfully."
        heading="Success"
        variantName="success"
      />
      <Alert
        action={{ children: "Review", onClick: () => {} }}
        description="Please review your input before proceeding."
        heading="Warning"
        variantName="warning"
      />
    </div>
  );
}

export const alertDemo: ShowcaseDemo = {
  fullPreview: <AlertFullPreview />,
  id: "alert",
  name: "Alert",
  preview: <AlertPreview />,
};
