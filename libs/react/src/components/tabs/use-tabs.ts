import { useCallback, useRef, useState } from "react";

interface TabItem {
  disabled?: boolean;
  id: string;
}

interface UseTabsOptions {
  defaultValue?: string;
  onValueChange?: (tabId: string) => void;
  orientation: "horizontal" | "vertical";
  tabs: TabItem[];
  value?: string;
}

/**
 * A headless hook for managing tab state, keyboard navigation, and ARIA prop generation.
 *
 * @description
 * The `useTabs` hook provides all the logic needed to build an accessible tabs component
 * following the WAI-ARIA Tabs pattern. It manages:
 * - Active tab state with controlled (`value`) and uncontrolled (`defaultValue`) modes
 * - Roving tabindex focus tracking for optimal keyboard UX
 * - Keyboard navigation (Arrow keys, Home, End) with automatic tab activation
 * - ARIA-compliant prop objects for tab triggers and panels via `getTabProps` and `getPanelProps`
 *
 * @remarks
 * - Uses **automatic activation**: tabs activate immediately on focus change (not manual)
 * - Arrow keys **stop at boundaries** (no wrapping/looping)
 * - Disabled tabs are **skipped** during keyboard navigation
 * - Falls back to the first enabled tab when no `defaultValue` is provided
 * - Horizontal orientation uses ArrowLeft/ArrowRight; vertical uses ArrowUp/ArrowDown
 *
 * ## Accessibility
 *
 * This hook implements the [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):
 * - **Roving tabindex**: Only the focused tab has `tabIndex={0}`, others have `tabIndex={-1}`
 * - **`aria-selected`**: Marks the active tab as selected
 * - **`aria-controls`** / **`aria-labelledby`**: Links tabs to their corresponding panels
 * - **`aria-disabled`**: Communicates disabled state to assistive technology
 * - **`role="tab"`** and **`role="tabpanel"`**: Proper ARIA roles for tabs and panels
 *
 * @param {UseTabsOptions} options - Configuration object
 * @param {TabItem[]} options.tabs - Array of tab items with `id` and optional `disabled` state
 * @param {"horizontal" | "vertical"} options.orientation - Tab list orientation, controls which arrow keys navigate
 * @param {string} [options.value] - Controlled active tab ID. When provided, internal state is bypassed.
 * @param {string} [options.defaultValue] - Initial active tab ID for uncontrolled mode
 * @param {(tabId: string) => void} [options.onValueChange] - Callback fired when the active tab changes
 *
 * @returns An object containing:
 * - `activeTab` — The currently active tab ID
 * - `focusedIndex` — The index of the currently focused tab in the `tabs` array
 * - `getTabProps` — Generates ARIA and data attribute props for a tab trigger element
 * - `getPanelProps` — Generates ARIA and data attribute props for a tab panel element
 * - `handleTabClick` — Click handler for tab trigger elements
 * - `handleTabKeyDown` — Keyboard event handler for tab trigger elements
 */
export function useTabs(options: UseTabsOptions) {
  const { defaultValue, onValueChange, orientation, tabs, value } = options;

  // Find first enabled tab
  const firstEnabledTab = tabs.find((tab) => !tab.disabled);
  const initialValue = defaultValue || firstEnabledTab?.id || tabs[0]?.id || "";

  // State
  const [activeTabInternal, setActiveTabInternal] = useState(initialValue);
  const [focusedIndex, setFocusedIndex] = useState(() => {
    const index = tabs.findIndex((tab) => tab.id === initialValue);
    return index >= 0 ? index : 0;
  });

  const activeTab = value !== undefined ? value : activeTabInternal;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Helper: Get next enabled tab index
  const getNextIndex = useCallback(
    (currentIndex: number, direction: -1 | 1): number => {
      const enabledTabs = tabs
        .map((tab, i) => ({ ...tab, index: i }))
        .filter((t) => !t.disabled);

      if (enabledTabs.length === 0) return currentIndex;

      const currentEnabledIndex = enabledTabs.findIndex(
        (t) => t.index === currentIndex,
      );

      if (currentEnabledIndex === -1) return currentIndex;

      let nextEnabledIndex = currentEnabledIndex + direction;

      // Stop at boundaries (no looping)
      if (nextEnabledIndex < 0) {
        nextEnabledIndex = 0;
      } else if (nextEnabledIndex >= enabledTabs.length) {
        nextEnabledIndex = enabledTabs.length - 1;
      }

      return enabledTabs[nextEnabledIndex].index;
    },
    [tabs],
  );

  // Helper: Activate tab
  const activateTab = useCallback(
    (tabId: string) => {
      if (value === undefined) {
        setActiveTabInternal(tabId);
      }
      onValueChange?.(tabId);
    },
    [onValueChange, value],
  );

  // Handler: Tab click
  const handleTabClick = useCallback(
    (tabId: string, index: number, e: React.MouseEvent<HTMLButtonElement>) => {
      if (tabs[index]?.disabled) {
        e.preventDefault();
        return;
      }
      setFocusedIndex(index);
      activateTab(tabId);
    },
    [activateTab, tabs],
  );

  // Handler: Keyboard navigation
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      // Prevent Enter/Space on disabled tabs
      const isDisabled = tabs[currentIndex]?.disabled;
      if (isDisabled && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        return;
      }

      const isHorizontal = orientation === "horizontal";
      const isVertical = orientation === "vertical";

      let handled = false;
      let newIndex = currentIndex;

      if (
        (isHorizontal && e.key === "ArrowRight") ||
        (isVertical && e.key === "ArrowDown")
      ) {
        newIndex = getNextIndex(currentIndex, 1);
        handled = true;
      } else if (
        (isHorizontal && e.key === "ArrowLeft") ||
        (isVertical && e.key === "ArrowUp")
      ) {
        newIndex = getNextIndex(currentIndex, -1);
        handled = true;
      } else if (e.key === "Home") {
        const firstEnabled = tabs.findIndex((t) => !t.disabled);
        if (firstEnabled >= 0) {
          newIndex = firstEnabled;
          handled = true;
        }
      } else if (e.key === "End") {
        const lastEnabled = tabs
          .map((t, i) => ({ ...t, i }))
          .reverse()
          .find((t) => !t.disabled);
        if (lastEnabled) {
          newIndex = lastEnabled.i;
          handled = true;
        }
      }

      if (handled) {
        e.preventDefault();
        setFocusedIndex(newIndex);
        tabRefs.current[newIndex]?.focus();
        // Automatic activation: activate on focus change
        activateTab(tabs[newIndex].id);
      }
    },
    [activateTab, getNextIndex, orientation, tabs],
  );

  // Prop generators
  const getTabProps = useCallback(
    (tab: TabItem, index: number, baseId: string) => ({
      "aria-controls": `${baseId}-panel-${tab.id}`,
      "aria-disabled": tab.disabled || undefined,
      "aria-selected": activeTab === tab.id,
      "data-ck": "tab",
      "data-disabled": tab.disabled || undefined,
      "data-orientation": orientation,
      "data-state": activeTab === tab.id ? "selected" : "unselected",
      id: `${baseId}-tab-${tab.id}`,
      ref: (el: HTMLButtonElement | null) => {
        tabRefs.current[index] = el;
      },
      role: "tab",
      tabIndex: focusedIndex === index ? 0 : -1,
    }),
    [activeTab, focusedIndex, orientation],
  );

  const getPanelProps = useCallback(
    (panelId: string, baseId: string) => ({
      "aria-labelledby": `${baseId}-tab-${panelId}`,
      "data-ck": "tab-panel",
      "data-orientation": orientation,
      "data-state": activeTab === panelId ? "active" : "inactive",
      id: `${baseId}-panel-${panelId}`,
      role: "tabpanel",
      tabIndex: 0,
    }),
    [activeTab, orientation],
  );

  return {
    activeTab,
    focusedIndex,
    getPanelProps,
    getTabProps,
    handleTabClick,
    handleTabKeyDown,
  };
}
