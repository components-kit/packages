import { Text } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function TextPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Text as="p" variantName="body1">
        This is body text (p).
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

<Text as="p" variantName="body1">Body text</Text>
<Text as="span" variantName="body1">Span text</Text>
<Text as="strong" variantName="body1">Bold text</Text>
<Text as="em" variantName="body1">Italic text</Text>`,
  id: "text",
  name: "Text",
  preview: <TextPreview />,
};
