import { Button, toast } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function ToastPreview() {
  return (
    <div className="w-full">
      <div
        data-ck="toast"
        data-has-description
        data-has-title
        data-variant="default"
        role="status"
      >
        <div aria-hidden="true" data-slot="icon" />
        <div data-slot="content">
          <div data-slot="title">Settings saved</div>
          <div data-slot="description">
            Your changes have been applied successfully.
          </div>
        </div>
      </div>
    </div>
  );
}

function ToastFullPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variantName="outline"
        onClick={() =>
          toast({
            description: "Your changes have been applied successfully.",
            title: "Settings saved",
            variantName: "default",
          })
        }
      >
        Show toast
      </Button>
    </div>
  );
}

export const toastDemo: ShowcaseDemo = {
  fullPreview: <ToastFullPreview />,
  id: "toast",
  name: "Toast",
  preview: <ToastPreview />,
};
