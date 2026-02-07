import { Heading } from "@components-kit/react";

import { type ComponentDemo } from "../types";

function HeadingPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Heading as="h1" variantName="h1">
        Heading 1
      </Heading>
      <Heading as="h2" variantName="h1">
        Heading 2
      </Heading>
      <Heading as="h3" variantName="h1">
        Heading 3
      </Heading>
      <Heading as="h4" variantName="h1">
        Heading 4
      </Heading>
      <Heading as="h5" variantName="h1">
        Heading 5
      </Heading>
      <Heading as="h6" variantName="h1">
        Heading 6
      </Heading>
    </div>
  );
}

export const headingDemo: ComponentDemo = {
  code: `import { Heading } from "@components-kit/react";

<Heading as="h1" variantName="h1">Heading 1</Heading>
<Heading as="h2" variantName="h1">Heading 2</Heading>
<Heading as="h3" variantName="h1">Heading 3</Heading>
<Heading as="h4" variantName="h1">Heading 4</Heading>
<Heading as="h5" variantName="h1">Heading 5</Heading>
<Heading as="h6" variantName="h1">Heading 6</Heading>`,
  id: "heading",
  name: "Heading",
  preview: <HeadingPreview />,
};
