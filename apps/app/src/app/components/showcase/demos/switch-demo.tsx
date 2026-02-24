import { Switch } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function SwitchPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="sw-1" defaultChecked variantName="default" />
        <label className="text-sm" htmlFor="sw-1">
          Enabled
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-2" variantName="default" />
        <label className="text-sm" htmlFor="sw-2">
          Disabled
        </label>
      </div>
    </div>
  );
}

function SwitchFullPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <Switch id="sw-full-1" defaultChecked variantName="default" />
        <label className="leading-none" htmlFor="sw-full-1">
          <span className="text-sm leading-none">Dark mode</span>
          <span className="mt-1 block text-xs text-neutral-500">
            Switch to dark color scheme.
          </span>
        </label>
      </div>
      <div className="flex items-start gap-2">
        <Switch id="sw-full-2" variantName="default" />
        <label className="leading-none" htmlFor="sw-full-2">
          <span className="text-sm leading-none">Notifications</span>
          <span className="mt-1 block text-xs text-neutral-500">
            Receive push notifications.
          </span>
        </label>
      </div>
      <div className="flex items-start gap-2">
        <Switch id="sw-full-3" disabled variantName="default" />
        <label className="leading-none text-neutral-500" htmlFor="sw-full-3">
          <span className="text-sm leading-none">Auto-save</span>
          <span className="mt-1 block text-xs">
            Automatically save changes.
          </span>
        </label>
      </div>
    </div>
  );
}

export const switchDemo: ShowcaseDemo = {
  fullPreview: <SwitchFullPreview />,
  id: "switch",
  name: "Switch",
  preview: <SwitchPreview />,
};
