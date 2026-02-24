import { Text } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function TextPreview() {
  return (
    <div className="flex flex-col gap-1">
      <Text as="p" variantName="body1">
        Body 1
      </Text>
      <Text as="p" variantName="body2">
        Body 2
      </Text>
      <Text as="p" variantName="body3">
        Body 3
      </Text>
    </div>
  );
}

function TextFullPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Text as="p" variantName="body1">
        Body 1 — The quick brown fox jumps over the lazy dog.
      </Text>
      <Text as="p" variantName="body2">
        Body 2 — The quick brown fox jumps over the lazy dog.
      </Text>
      <Text as="p" variantName="body3">
        Body 3 — The quick brown fox jumps over the lazy dog.
      </Text>
    </div>
  );
}

export const textDemo: ShowcaseDemo = {
  fullPreview: <TextFullPreview />,
  id: "text",
  name: "Text",
  preview: <TextPreview />,
};
