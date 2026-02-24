import { Checkbox } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function CheckboxPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <Checkbox id="cb-1" defaultChecked variantName="default" />
        <label className="leading-none" htmlFor="cb-1">
          <span className="text-sm leading-none">Email notifications</span>
          <span className="mt-1 block text-xs text-neutral-500">
            Receive emails about account activity.
          </span>
        </label>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="cb-2" variantName="default" />
        <label className="leading-none" htmlFor="cb-2">
          <span className="text-sm leading-none">Marketing updates</span>
          <span className="mt-1 block text-xs text-neutral-500">
            Get notified about new features and tips.
          </span>
        </label>
      </div>
    </div>
  );
}

function CheckboxFullPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <Checkbox id="cb-full-1" defaultChecked variantName="default" />
        <label className="leading-none" htmlFor="cb-full-1">
          <span className="text-sm leading-none">Email notifications</span>
          <span className="mt-1 block text-xs text-neutral-500">
            Receive emails about account activity.
          </span>
        </label>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="cb-full-2" variantName="default" />
        <label className="leading-none" htmlFor="cb-full-2">
          <span className="text-sm leading-none">Marketing updates</span>
          <span className="mt-1 block text-xs text-neutral-500">
            Get notified about new features and tips.
          </span>
        </label>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="cb-full-3" disabled variantName="default" />
        <label
          className="leading-none text-neutral-400"
          htmlFor="cb-full-3"
        >
          <span className="text-sm leading-none">SMS alerts</span>
          <span className="mt-1 block text-xs">
            Receive text messages for urgent updates.
          </span>
        </label>
      </div>
    </div>
  );
}

export const checkboxDemo: ShowcaseDemo = {
  fullPreview: <CheckboxFullPreview />,
  id: "checkbox",
  name: "Checkbox",
  preview: <CheckboxPreview />,
};
