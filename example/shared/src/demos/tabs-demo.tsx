import { Tabs } from "@components-kit/react";

import { type ComponentDemo } from "../types";
import { InfoIcon, SearchIcon } from "./shared-data";

function TabsPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 8px" }}>
          Basic
        </p>
        <Tabs
          defaultValue="tab1"
          tabs={[
            { id: "tab1", label: "Account" },
            { id: "tab2", label: "Security" },
            { id: "tab3", label: "Notifications" },
          ]}
          variantName="default"
        >
          <div data-tab-panel="tab1">Account settings content</div>
          <div data-tab-panel="tab2">Security settings content</div>
          <div data-tab-panel="tab3">Notification preferences content</div>
        </Tabs>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 8px" }}>
          With Icons
        </p>
        <Tabs
          defaultValue="info"
          tabs={[
            { icon: <InfoIcon />, id: "info", label: "Info" },
            { icon: <SearchIcon />, id: "search", label: "Search" },
          ]}
          variantName="default"
        >
          <div data-tab-panel="info">Information panel</div>
          <div data-tab-panel="search">Search panel</div>
        </Tabs>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 8px" }}>
          Vertical
        </p>
        <Tabs
          defaultValue="general"
          orientation="vertical"
          tabs={[
            { id: "general", label: "General" },
            { id: "advanced", label: "Advanced" },
          ]}
          variantName="default"
        >
          <div data-tab-panel="general">General options</div>
          <div data-tab-panel="advanced">Advanced options</div>
        </Tabs>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 8px" }}>
          With Disabled Tab
        </p>
        <Tabs
          defaultValue="enabled"
          tabs={[
            { id: "enabled", label: "Available" },
            { disabled: true, id: "locked", label: "Locked" },
            { id: "other", label: "Other" },
          ]}
          variantName="default"
        >
          <div data-tab-panel="enabled">This tab is accessible</div>
          <div data-tab-panel="locked">This tab is locked</div>
          <div data-tab-panel="other">Other content</div>
        </Tabs>
      </div>
    </div>
  );
}

export const tabsDemo: ComponentDemo = {
  code: `import { Tabs } from "@components-kit/react";

<Tabs
  defaultValue="tab1"
  tabs={[
    { id: "tab1", label: "Account" },
    { id: "tab2", label: "Security" },
    { id: "tab3", label: "Notifications" },
  ]}
  variantName="default"
>
  <div data-tab-panel="tab1">Account settings content</div>
  <div data-tab-panel="tab2">Security settings content</div>
  <div data-tab-panel="tab3">Notification preferences</div>
</Tabs>

{/* Vertical */}
<Tabs
  defaultValue="general"
  orientation="vertical"
  tabs={[
    { id: "general", label: "General" },
    { id: "advanced", label: "Advanced" },
  ]}
  variantName="default"
>
  <div data-tab-panel="general">General options</div>
  <div data-tab-panel="advanced">Advanced options</div>
</Tabs>`,
  id: "tabs",
  name: "Tabs",
  preview: <TabsPreview />,
};
