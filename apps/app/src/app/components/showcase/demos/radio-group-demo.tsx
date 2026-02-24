import { RadioGroup, RadioGroupItem } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function RadioGroupPreview() {
  return (
    <RadioGroup aria-label="Select plan" variantName="default">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <RadioGroupItem
            id="rg-1"
            defaultChecked
            name="radio-demo"
            value="1"
          />
          <label className="leading-none" htmlFor="rg-1">
            <span className="text-sm leading-none">Free</span>
            <span className="mt-1 block text-xs text-neutral-500">
              Up to 3 projects, basic features.
            </span>
          </label>
        </div>
        <div className="flex items-start gap-2">
          <RadioGroupItem id="rg-2" name="radio-demo" value="2" />
          <label className="leading-none" htmlFor="rg-2">
            <span className="text-sm leading-none">Pro</span>
            <span className="mt-1 block text-xs text-neutral-500">
              Unlimited projects, priority support.
            </span>
          </label>
        </div>
      </div>
    </RadioGroup>
  );
}

function RadioGroupFullPreview() {
  return (
    <RadioGroup aria-label="Select plan" variantName="default">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <RadioGroupItem
            id="rg-full-1"
            defaultChecked
            name="radio-demo-full"
            value="1"
          />
          <label className="leading-none" htmlFor="rg-full-1">
            <span className="text-sm leading-none">Free</span>
            <span className="mt-1 block text-xs text-neutral-500">
              Up to 3 projects, basic features.
            </span>
          </label>
        </div>
        <div className="flex items-start gap-2">
          <RadioGroupItem
            id="rg-full-2"
            name="radio-demo-full"
            value="2"
          />
          <label className="leading-none" htmlFor="rg-full-2">
            <span className="text-sm leading-none">Pro</span>
            <span className="mt-1 block text-xs text-neutral-500">
              Unlimited projects, priority support.
            </span>
          </label>
        </div>
        <div className="flex items-start gap-2">
          <RadioGroupItem
            id="rg-full-3"
            disabled
            name="radio-demo-full"
            value="3"
          />
          <label
            className="leading-none text-neutral-400"
            htmlFor="rg-full-3"
          >
            <span className="text-sm leading-none">Enterprise</span>
            <span className="mt-1 block text-xs">
              Custom solutions, dedicated support.
            </span>
          </label>
        </div>
      </div>
    </RadioGroup>
  );
}

export const radioGroupDemo: ShowcaseDemo = {
  fullPreview: <RadioGroupFullPreview />,
  id: "radio-group",
  name: "RadioGroup",
  preview: <RadioGroupPreview />,
};
