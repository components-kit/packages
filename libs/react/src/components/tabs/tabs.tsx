"use client";

import React, { forwardRef, ReactNode, useId } from "react";

import type { VariantFor } from "../../types/register";

import { useTabs } from "./use-tabs";

/**
 * A fully accessible tabs component for organizing content into multiple panels.
 *
 * @description
 * The Tabs component implements the WAI-ARIA Tabs pattern, providing an accessible
 * way to organize related content into separate panels. Users can switch between
 * panels using mouse clicks or keyboard navigation (arrow keys, Home, End).
 *
 * @remarks
 * This component features:
 * - **Full keyboard navigation** with automatic tab activation
 * - **Roving tabindex** pattern for optimal keyboard UX
 * - **Controlled and uncontrolled** state management
 * - **Horizontal and vertical** orientation support
 * - **Icons** support for enhanced visual communication
 * - **Disabled tabs** that are skipped in navigation
 *
 * ## Accessibility
 *
 * This component follows the [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).
 *
 * ### Keyboard Support
 *
 * | Key | Description |
 * | --- | --- |
 * | `Tab` | Moves focus into and out of the tab list. When focus is on a tab, moves focus to the active tab panel. |
 * | `ArrowRight` (horizontal) / `ArrowDown` (vertical) | Moves focus to and activates the next tab. If on the last tab, stays on the last tab. |
 * | `ArrowLeft` (horizontal) / `ArrowUp` (vertical) | Moves focus to and activates the previous tab. If on the first tab, stays on the first tab. |
 * | `Home` | Moves focus to and activates the first enabled tab. |
 * | `End` | Moves focus to and activates the last enabled tab. |
 *
 * ### ARIA Roles and Attributes
 *
 * - **Tablist**: `role="tablist"` with `aria-orientation`
 * - **Tab**: `role="tab"` with `aria-selected`, `aria-controls`, `aria-disabled`
 * - **Panel**: `role="tabpanel"` with `aria-labelledby`
 * - **Roving Tabindex**: Only the focused tab has `tabIndex={0}`, others have `tabIndex={-1}`
 *
 * ## Best Practices
 *
 * - Use tabs for organizing related content that doesn't need to be viewed simultaneously
 * - Keep tab labels concise (1-2 words when possible)
 * - Don't use tabs for sequential processes (use a stepper instead)
 * - Ensure each panel has meaningful content (not just a single line)
 * - Use `variantName` to apply consistent styling across your app
 *
 * @param {TabItem[]} tabs - Array of tab items with id, label, optional icon, and disabled state
 * @param {ReactNode | ReactNode[]} children - Tab panel contents. Each child must have `data-tab-panel="id"` attribute
 * @param {string} [defaultValue] - Initial active tab ID (uncontrolled mode)
 * @param {string} [value] - Controlled active tab ID
 * @param {(tabId: string) => void} [onValueChange] - Callback fired when active tab changes
 * @param {"horizontal" | "vertical"} [orientation="horizontal"] - Tab list orientation
 * @param {VariantFor<"tabs">} [variantName] - Style variant name for CSS targeting
 *
 * @returns A fully accessible tabs component
 *
 * @example
 * // Basic uncontrolled tabs
 * <Tabs
 *   tabs={[
 *     { id: 'account', label: 'Account' },
 *     { id: 'security', label: 'Security' },
 *     { id: 'notifications', label: 'Notifications' }
 *   ]}
 *   defaultValue="account"
 * >
 *   <div data-tab-panel="account">Account settings...</div>
 *   <div data-tab-panel="security">Security settings...</div>
 *   <div data-tab-panel="notifications">Notification preferences...</div>
 * </Tabs>
 *
 * @example
 * // Controlled tabs with state
 * function ControlledExample() {
 *   const [activeTab, setActiveTab] = useState('profile');
 *
 *   return (
 *     <Tabs
 *       tabs={[
 *         { id: 'profile', label: 'Profile' },
 *         { id: 'settings', label: 'Settings' }
 *       ]}
 *       value={activeTab}
 *       onValueChange={setActiveTab}
 *     >
 *       <div data-tab-panel="profile">Profile content...</div>
 *       <div data-tab-panel="settings">Settings content...</div>
 *     </Tabs>
 *   );
 * }
 *
 * @example
 * // With icons
 * import { UserIcon, SettingsIcon, BellIcon } from 'lucide-react';
 *
 * <Tabs
 *   tabs={[
 *     { id: 'user', label: 'Profile', icon: <UserIcon /> },
 *     { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
 *     { id: 'notifications', label: 'Notifications', icon: <BellIcon /> }
 *   ]}
 *   defaultValue="user"
 * >
 *   <div data-tab-panel="user">User profile...</div>
 *   <div data-tab-panel="settings">Settings...</div>
 *   <div data-tab-panel="notifications">Notifications...</div>
 * </Tabs>
 *
 * @example
 * // Vertical orientation
 * <Tabs
 *   tabs={[
 *     { id: 'general', label: 'General' },
 *     { id: 'advanced', label: 'Advanced' }
 *   ]}
 *   orientation="vertical"
 *   defaultValue="general"
 * >
 *   <div data-tab-panel="general">General options...</div>
 *   <div data-tab-panel="advanced">Advanced options...</div>
 * </Tabs>
 *
 * @example
 * // With disabled tabs
 * <Tabs
 *   tabs={[
 *     { id: 'enabled', label: 'Available' },
 *     { id: 'disabled', label: 'Locked', disabled: true }
 *   ]}
 *   defaultValue="enabled"
 * >
 *   <div data-tab-panel="enabled">This tab is accessible</div>
 *   <div data-tab-panel="disabled">This tab is locked</div>
 * </Tabs>
 *
 * @example
 * // Dynamic tabs
 * function DynamicTabsExample() {
 *   const [tabs, setTabs] = useState([
 *     { id: '1', label: 'Tab 1' },
 *     { id: '2', label: 'Tab 2' }
 *   ]);
 *
 *   const addTab = () => {
 *     const newId = String(tabs.length + 1);
 *     setTabs([...tabs, { id: newId, label: `Tab ${newId}` }]);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={addTab}>Add Tab</button>
 *       <Tabs tabs={tabs} defaultValue="1">
 *         {tabs.map(tab => (
 *           <div key={tab.id} data-tab-panel={tab.id}>
 *             Content for {tab.label}
 *           </div>
 *         ))}
 *       </Tabs>
 *     </>
 *   );
 * }
 *
 * @example
 * // Integration with forms
 * function FormTabsExample() {
 *   const [activeTab, setActiveTab] = useState('personal');
 *
 *   return (
 *     <form>
 *       <Tabs
 *         tabs={[
 *           { id: 'personal', label: 'Personal Info' },
 *           { id: 'address', label: 'Address' },
 *           { id: 'payment', label: 'Payment' }
 *         ]}
 *         value={activeTab}
 *         onValueChange={setActiveTab}
 *       >
 *         <div data-tab-panel="personal">
 *           <input name="name" placeholder="Full Name" />
 *           <input name="email" type="email" placeholder="Email" />
 *         </div>
 *         <div data-tab-panel="address">
 *           <input name="street" placeholder="Street Address" />
 *           <input name="city" placeholder="City" />
 *         </div>
 *         <div data-tab-panel="payment">
 *           <input name="card" placeholder="Card Number" />
 *           <input name="cvv" placeholder="CVV" />
 *         </div>
 *       </Tabs>
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * @example
 * // Complex real-world example with async content
 * function DashboardTabs() {
 *   const [activeTab, setActiveTab] = useState('overview');
 *   const [data, setData] = useState(null);
 *
 *   useEffect(() => {
 *     fetchData(activeTab).then(setData);
 *   }, [activeTab]);
 *
 *   return (
 *     <Tabs
 *       tabs={[
 *         { id: 'overview', label: 'Overview', icon: <ChartIcon /> },
 *         { id: 'analytics', label: 'Analytics', icon: <BarChartIcon /> },
 *         { id: 'reports', label: 'Reports', icon: <FileTextIcon /> }
 *       ]}
 *       value={activeTab}
 *       onValueChange={setActiveTab}
 *       variantName="dashboard"
 *     >
 *       <div data-tab-panel="overview">
 *         {data ? <OverviewDashboard data={data} /> : <Loader />}
 *       </div>
 *       <div data-tab-panel="analytics">
 *         {data ? <AnalyticsDashboard data={data} /> : <Loader />}
 *       </div>
 *       <div data-tab-panel="reports">
 *         {data ? <ReportsDashboard data={data} /> : <Loader />}
 *       </div>
 *     </Tabs>
 *   );
 * }
 */

interface TabItem {
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: string | ReactNode;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode | ReactNode[];
  defaultValue?: string;
  onValueChange?: (tabId: string) => void;
  orientation?: "horizontal" | "vertical";
  tabs: TabItem[];
  value?: string;
  variantName?: VariantFor<"tabs">;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      tabs,
      value,
      variantName,
      ...rest
    },
    ref,
  ) => {
    const baseId = useId();

    const {
      activeTab,
      getPanelProps,
      getTabProps,
      handleTabClick,
      handleTabKeyDown,
    } = useTabs({
      defaultValue,
      onValueChange,
      orientation,
      tabs,
      value,
    });

    return (
      <div
        data-ck="tabs"
        data-orientation={orientation}
        data-variant={variantName}
        ref={ref}
        {...rest}
      >
        {/* Tab list */}
        <div aria-orientation={orientation} data-slot="tablist" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              {...getTabProps(tab, index, baseId)}
              type="button"
              onClick={(e) => handleTabClick(tab.id, index, e)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
            >
              {tab.icon && <span data-slot="icon">{tab.icon}</span>}
              <span data-slot="label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div data-ck="tab-panels">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const panelId =
                child.props && typeof child.props === "object"
                  ? (child.props as Record<string, unknown>)["data-tab-panel"]
                  : undefined;

              if (typeof panelId === "string") {
                return React.cloneElement(child, {
                  ...getPanelProps(panelId, baseId),
                  hidden: activeTab !== panelId,
                } as Partial<typeof child.props>);
              }
            }
            return child;
          })}
        </div>
      </div>
    );
  },
);

Tabs.displayName = "Tabs";

export { type TabItem, Tabs, type TabsProps };
