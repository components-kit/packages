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
          variantName="outline"
          onClick={() => toast({ title: "Success", variantName: "default" })}
        >
          Basic Toast
        </Button>
        <Button
          variantName="outline"
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
          variantName="outline"
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
          variantName="outline"
          onClick={() =>
            toast({
              description: "Your changes have been saved successfully.",
              title: "Success",
              variantName: "success",
            })
          }
        >
          Success
        </Button>
        <Button
          variantName="outline"
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
          variantName="outline"
          onClick={() =>
            toast({
              description: "Please review your input.",
              title: "Warning",
              variantName: "warning",
            })
          }
        >
          Warning
        </Button>
        <Button
          variantName="outline"
          onClick={() =>
            toast({
              description: "An error occurred.",
              title: "Error",
              variantName: "destructive",
            })
          }
        >
          Error
        </Button>
        <Button
          variantName="outline"
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
          variantName="outline"
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

toast({ title: "Basic toast", variantName: "default" });

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

{/* Semantic variants */}
toast({ title: "Success", description: "Saved successfully.", variantName: "success" });
toast({ title: "Warning", description: "Please review.", variantName: "warning" });
toast({ title: "Error", description: "An error occurred.", variantName: "destructive" });`,
  id: "toast",
  name: "Toast",
  preview: <ToastPreview />,
};
