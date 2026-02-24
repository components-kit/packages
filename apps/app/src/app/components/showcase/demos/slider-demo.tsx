import { Slider } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function SliderPreview() {
  return <Slider aria-label="Volume" defaultValue={50} variantName="default" />;
}

function SliderFullPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Slider aria-label="Volume" defaultValue={50} variantName="default" />
    </div>
  );
}

export const sliderDemo: ShowcaseDemo = {
  fullPreview: <SliderFullPreview />,
  id: "slider",
  name: "Slider",
  preview: <SliderPreview />,
};
