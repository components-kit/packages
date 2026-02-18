import { Text } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function TextPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Text as="p" variantName="body1">
        Body 1 — 16px, regular weight, line-height 1.625.
      </Text>
      <Text as="p" variantName="body2">
        Body 2 — 14px, regular weight, line-height 1.5.
      </Text>
      <Text as="p" variantName="body3">
        Body 3 — 12px, regular weight, line-height 1.5.
      </Text>
      <Text as="span" variantName="body1">
        This is span text.
      </Text>
      <Text as="strong" variantName="body1">
        This is bold text (strong).
      </Text>
      <Text as="em" variantName="body1">
        This is italic text (em).
      </Text>
    </div>
  );
}

export const textDemo: ComponentDemo = {
  code: `import { Text } from "@components-kit/react";

{/* Variants */}
<Text as="p" variantName="body1">Body 1 — 16px</Text>
<Text as="p" variantName="body2">Body 2 — 14px</Text>
<Text as="p" variantName="body3">Body 3 — 12px</Text>

{/* Polymorphic elements */}
<Text as="span" variantName="body1">Span text</Text>
<Text as="strong" variantName="body1">Bold text</Text>
<Text as="em" variantName="body1">Italic text</Text>`,
  id: "text",
  name: "Text",
  preview: <TextPreview />,
};
