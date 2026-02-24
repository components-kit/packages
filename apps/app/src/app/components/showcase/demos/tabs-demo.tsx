import { Tabs } from "@components-kit/react";

import type { ShowcaseDemo } from "../types";

function TabsPreview() {
  return (
    <div className="w-full">
      <Tabs
        defaultValue="account"
        tabs={[
          { id: "account", label: "Account" },
          { id: "security", label: "Security" },
        ]}
        variantName="default"
      >
        <div data-tab-panel="account">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-neutral-500">Account settings content.</p>
          </div>
        </div>
        <div data-tab-panel="security">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-neutral-500">Security settings content.</p>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function TabsFullPreview() {
  return (
    <div className="w-full max-w-md">
      <Tabs
        defaultValue="account"
        tabs={[
          { id: "account", label: "Account" },
          { id: "security", label: "Security" },
          { id: "billing", label: "Billing" },
        ]}
        variantName="default"
      >
        <div data-tab-panel="account">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-neutral-500">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>
        <div data-tab-panel="security">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-neutral-500">
              Update your password and security preferences.
            </p>
          </div>
        </div>
        <div data-tab-panel="billing">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-neutral-500">
              View your billing history and manage payment methods.
            </p>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export const tabsDemo: ShowcaseDemo = {
  fullPreview: <TabsFullPreview />,
  id: "tabs",
  name: "Tabs",
  preview: <TabsPreview />,
};
