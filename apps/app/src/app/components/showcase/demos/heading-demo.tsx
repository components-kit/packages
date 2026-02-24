import { Heading } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function HeadingPreview() {
  return (
    <div className="flex flex-col gap-1">
      <Heading as="h3" variantName="h3">
        Heading 1
      </Heading>
      <Heading as="h4" variantName="h4">
        Heading 2
      </Heading>
      <Heading as="h5" variantName="h5">
        Heading 3
      </Heading>
    </div>
  );
}

function HeadingFullPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Heading as="h1" variantName="h1">
        Heading 1
      </Heading>
      <Heading as="h2" variantName="h2">
        Heading 2
      </Heading>
      <Heading as="h3" variantName="h3">
        Heading 3
      </Heading>
      <Heading as="h4" variantName="h4">
        Heading 4
      </Heading>
      <Heading as="h5" variantName="h5">
        Heading 5
      </Heading>
      <Heading as="h6" variantName="h6">
        Heading 6
      </Heading>
    </div>
  );
}

export const headingDemo: ShowcaseDemo = {
  fullPreview: <HeadingFullPreview />,
  id: "heading",
  name: "Heading",
  preview: <HeadingPreview />,
};
