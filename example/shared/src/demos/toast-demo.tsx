import { Button, toast } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function ToastPreview() {
  return (
    <div>
      <p
        style={{
          color: "#64748b",
          fontSize: "0.75rem",
          margin: "0 0 12px",
        }}
      >
        Note: Toast uses Sonner. The {"<Toaster />"} component must be added to
        your root layout.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <Button
          variantName="primary"
          onClick={() =>
            toast({ title: "Success", variantName: "default" })
          }
        >
          Basic Toast
        </Button>
        <Button
          variantName="primary"
          onClick={() =>
            toast({
              description: "Your changes have been saved successfully.",
              title: "Settings saved",
              variantName: "default",
            })
          }
        >
          With Description
        </Button>
        <Button
          variantName="primary"
          onClick={() =>
            toast({
              button: {
                label: "Undo",
                onClick: () => alert("Undo action clicked"),
              },
              description: "The item has been removed from your list.",
              title: "Item deleted",
              variantName: "default",
            })
          }
        >
          With Action
        </Button>
        <Button
          variantName="primary"
          onClick={() =>
            toast({
              description: "This is an informational message.",
              title: "Information",
              variantName: "default",
            })
          }
        >
          Info
        </Button>
        <Button
          variantName="primary"
          onClick={() =>
            toast({
              description: "Please review your input.",
              title: "Warning",
              variantName: "default",
            })
          }
        >
          Warning
        </Button>
        <Button
          variantName="primary"
          onClick={() =>
            toast({
              description: "An error occurred.",
              title: "Error",
              variantName: "default",
            })
          }
        >
          Error
        </Button>
        <Button
          variantName="primary"
          onClick={() =>
            toast({
              description: "This toast appears at the top right.",
              position: "top-right",
              title: "Top Right",
              variantName: "default",
            })
          }
        >
          Top Right
        </Button>
        <Button
          variantName="primary"
          onClick={() =>
            toast({
              title: "Quick notification",
              variantName: "default",
            })
          }
        >
          Title Only
        </Button>
      </div>
    </div>
  );
}

export const toastDemo: ComponentDemo = {
  code: `import { toast } from "@components-kit/react";
// Add <Toaster /> from "sonner" in your root layout

toast({ title: "Success", variantName: "default" });

toast({
  description: "Your changes have been saved.",
  title: "Settings saved",
  variantName: "default",
});

toast({
  button: { label: "Undo", onClick: () => {} },
  description: "Item removed.",
  title: "Deleted",
  variantName: "default",
});

toast({
  position: "top-right",
  title: "Top Right",
  variantName: "default",
});`,
  id: "toast",
  name: "Toast",
  preview: <ToastPreview />,
};
