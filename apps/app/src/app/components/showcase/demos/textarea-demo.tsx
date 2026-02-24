import { Textarea } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function TextareaPreview() {
  return (
    <Textarea
      defaultValue="Headless components styled entirely through data attributes."
      placeholder="Enter your message..."
      rows={3}
      variantName="default"
    />
  );
}

function TextareaFullPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <p className="mb-1 text-sm text-neutral-500">Message</p>
        <Textarea
          placeholder="Enter your message..."
          rows={3}
          variantName="default"
        />
      </div>
      <div>
        <p className="mb-1 text-sm text-neutral-500">Bio</p>
        <Textarea
          defaultValue="Headless components styled entirely through data attributes."
          rows={3}
          variantName="default"
        />
      </div>
      <div>
        <p className="mb-1 text-sm text-neutral-500">Notes (disabled)</p>
        <Textarea
          disabled
          placeholder="Cannot edit"
          rows={2}
          variantName="default"
        />
      </div>
    </div>
  );
}

export const textareaDemo: ShowcaseDemo = {
  fullPreview: <TextareaFullPreview />,
  id: "textarea",
  name: "Textarea",
  preview: <TextareaPreview />,
};
