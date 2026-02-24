import { Input } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function InputPreview() {
  return (
    <Input
      defaultValue="John Doe"
      placeholder="Enter your name..."
      variantName="default"
    />
  );
}

function InputFullPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div>
        <p className="mb-1 text-sm text-neutral-500">Full name</p>
        <Input
          defaultValue="John Doe"
          placeholder="Enter your name..."
          variantName="default"
        />
      </div>
      <div>
        <p className="mb-1 text-sm text-neutral-500">Email</p>
        <Input
          placeholder="you@example.com"
          type="email"
          variantName="default"
        />
      </div>
    </div>
  );
}

export const inputDemo: ShowcaseDemo = {
  fullPreview: <InputFullPreview />,
  id: "input",
  name: "Input",
  preview: <InputPreview />,
};
