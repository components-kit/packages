import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Tabs } from "./tabs";

describe("Tabs - Basic Rendering", () => {
  const basicTabs = [
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
    { id: "tab3", label: "Tab 3" },
  ];

  it("renders tabs and panels correctly", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(3);
  });

  it("shows initial active tab based on defaultValue", () => {
    render(
      <Tabs defaultValue="tab2" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
  });

  it("displays labels correctly", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("displays icons when provided", () => {
    const tabsWithIcons = [
      { icon: <span>🏠</span>, id: "tab1", label: "Tab 1" },
      { id: "tab2", label: "Tab 2" },
    ];

    render(
      <Tabs defaultValue="tab1" tabs={tabsWithIcons}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    expect(screen.getByText("🏠")).toBeInTheDocument();
  });

  it("hides inactive panels with hidden attribute", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels[0]).not.toHaveAttribute("hidden");
    expect(panels[1]).toHaveAttribute("hidden");
    expect(panels[2]).toHaveAttribute("hidden");
  });

  it("falls back to first enabled tab when no defaultValue", () => {
    render(
      <Tabs tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tabs - Data Attributes", () => {
  const basicTabs = [
    { id: "tab1", label: "Tab 1" },
    { disabled: true, id: "tab2", label: "Tab 2" },
  ];

  it("parent has data-ck='tabs'", () => {
    const { container } = render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const parent = container.firstChild as HTMLElement;
    expect(parent).toHaveAttribute("data-ck", "tabs");
  });

  it("parent has data-orientation", () => {
    const { container } = render(
      <Tabs defaultValue="tab1" orientation="horizontal" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const parent = container.firstChild as HTMLElement;
    expect(parent).toHaveAttribute("data-orientation", "horizontal");
  });

  it("parent has data-variant when provided", () => {
    const { container } = render(
      <Tabs defaultValue="tab1" tabs={basicTabs} variantName="primary">
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const parent = container.firstChild as HTMLElement;
    expect(parent).toHaveAttribute("data-variant", "primary");
  });

  it("tablist has data-slot='tablist'", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("data-slot", "tablist");
  });

  it("tabs have data-ck='tab'", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute("data-ck", "tab");
    });
  });

  it("tabs have data-state (selected/unselected)", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("data-state", "selected");
    expect(tabs[1]).toHaveAttribute("data-state", "unselected");
  });

  it("tabs have data-disabled when disabled", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).not.toHaveAttribute("data-disabled");
    expect(tabs[1]).toHaveAttribute("data-disabled");
  });

  it("panels have data-ck='tab-panel'", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    panels.forEach((panel) => {
      expect(panel).toHaveAttribute("data-ck", "tab-panel");
    });
  });

  it("panels have data-state (active/inactive)", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels[0]).toHaveAttribute("data-state", "active");
    expect(panels[1]).toHaveAttribute("data-state", "inactive");
  });
});

describe("Tabs - Uncontrolled State", () => {
  const basicTabs = [
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
    { id: "tab3", label: "Tab 3" },
  ];

  it("defaultValue sets initial active tab", () => {
    render(
      <Tabs defaultValue="tab2" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("clicking tab changes active tab", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[2]);

    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("onValueChange callback fires with correct tab ID", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Tabs defaultValue="tab1" tabs={basicTabs} onValueChange={handleChange}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]);

    expect(handleChange).toHaveBeenCalledWith("tab2");
  });

  it("works without defaultValue (selects first enabled)", () => {
    render(
      <Tabs tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tabs - Controlled State", () => {
  const basicTabs = [
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
  ];

  it("value prop controls active tab", () => {
    render(
      <Tabs tabs={basicTabs} value="tab2">
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("clicking tab doesn't change state without external update", async () => {
    const user = userEvent.setup();

    render(
      <Tabs tabs={basicTabs} value="tab1">
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]);

    // Should remain on tab1 since value is controlled
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("onValueChange callback fires", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Tabs tabs={basicTabs} value="tab1" onValueChange={handleChange}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]);

    expect(handleChange).toHaveBeenCalledWith("tab2");
  });

  it("changing value prop updates active tab", () => {
    const { rerender } = render(
      <Tabs tabs={basicTabs} value="tab1">
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    let tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    rerender(
      <Tabs tabs={basicTabs} value="tab2">
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    tabs = screen.getAllByRole("tab");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tabs - Click Interaction", () => {
  const basicTabs = [
    { id: "tab1", label: "Tab 1" },
    { disabled: true, id: "tab2", label: "Tab 2" },
    { id: "tab3", label: "Tab 3" },
  ];

  it("clicking tab activates it", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[2]);

    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
  });

  it("clicking disabled tab does nothing", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]); // Disabled tab

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("clicking tab moves focus to it", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[2]);

    expect(tabs[2]).toHaveFocus();
  });

  it("click event is prevented on disabled tabs", () => {
    const handleClick = vi.fn();

    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2" onClick={handleClick}>
          Content 2
        </div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[1]); // Disabled tab

    // Event should be prevented, so it shouldn't propagate
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("clicking already active tab keeps it active", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[0]);

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tabs - Keyboard Navigation", () => {
  const basicTabs = [
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
    { id: "tab3", label: "Tab 3" },
  ];

  describe("Horizontal orientation", () => {
    it("ArrowRight moves to next tab", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1" orientation="horizontal" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[0].focus();
      await user.keyboard("{ArrowRight}");

      expect(tabs[1]).toHaveFocus();
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });

    it("ArrowLeft moves to previous tab", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab2" orientation="horizontal" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[1].focus();
      await user.keyboard("{ArrowLeft}");

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });

    it("ArrowUp/ArrowDown don't change tabs", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1" orientation="horizontal" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[0].focus();
      await user.keyboard("{ArrowDown}");

      expect(tabs[0]).toHaveAttribute("aria-selected", "true");

      await user.keyboard("{ArrowUp}");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });

    it("stops at last tab (no wrap)", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab3" orientation="horizontal" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[2].focus();
      await user.keyboard("{ArrowRight}");

      expect(tabs[2]).toHaveFocus();
      expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    });

    it("stops at first tab (no wrap)", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1" orientation="horizontal" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[0].focus();
      await user.keyboard("{ArrowLeft}");

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Vertical orientation", () => {
    it("ArrowDown moves to next tab", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1" orientation="vertical" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[0].focus();
      await user.keyboard("{ArrowDown}");

      expect(tabs[1]).toHaveFocus();
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });

    it("ArrowUp moves to previous tab", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab2" orientation="vertical" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[1].focus();
      await user.keyboard("{ArrowUp}");

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });

    it("ArrowLeft/ArrowRight don't change tabs", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1" orientation="vertical" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[0].focus();
      await user.keyboard("{ArrowRight}");

      expect(tabs[0]).toHaveAttribute("aria-selected", "true");

      await user.keyboard("{ArrowLeft}");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Both orientations", () => {
    it("Home key jumps to first enabled tab", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab3" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[2].focus();
      await user.keyboard("{Home}");

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });

    it("End key jumps to last enabled tab", async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[0].focus();
      await user.keyboard("{End}");

      expect(tabs[2]).toHaveFocus();
      expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    });

    it("skips disabled tabs automatically", async () => {
      const user = userEvent.setup();
      const tabsWithDisabled = [
        { id: "tab1", label: "Tab 1" },
        { disabled: true, id: "tab2", label: "Tab 2" },
        { id: "tab3", label: "Tab 3" },
      ];

      render(
        <Tabs defaultValue="tab1" tabs={tabsWithDisabled}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[0].focus();
      await user.keyboard("{ArrowRight}");

      expect(tabs[2]).toHaveFocus();
      expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    });

    it("Enter/Space on disabled tab does nothing", async () => {
      const user = userEvent.setup();
      const tabsWithDisabled = [
        { id: "tab1", label: "Tab 1" },
        { disabled: true, id: "tab2", label: "Tab 2" },
      ];

      render(
        <Tabs defaultValue="tab1" tabs={tabsWithDisabled}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[1].focus();
      await user.keyboard("{Enter}");

      expect(tabs[0]).toHaveAttribute("aria-selected", "true");

      await user.keyboard("{ }"); // Space key
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });

    it("Tab key moves focus from tab to panel, then to next element", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <Tabs defaultValue="tab1" tabs={basicTabs}>
            <div data-tab-panel="tab1">Content 1</div>
            <div data-tab-panel="tab2">Content 2</div>
            <div data-tab-panel="tab3">Content 3</div>
          </Tabs>
          <button>After</button>
        </div>,
      );

      const tabs = screen.getAllByRole("tab");
      const panels = screen.getAllByRole("tabpanel", { hidden: true });

      // Focus on first tab
      tabs[0].focus();

      // First Tab should move to the active panel
      await user.keyboard("{Tab}");
      expect(panels[0]).toHaveFocus();

      // Second Tab should move to the "After" button
      await user.keyboard("{Tab}");
      const afterButton = screen.getByText("After");
      expect(afterButton).toHaveFocus();
    });

    it("roving tabindex: only focused tab has tabindex='0'", () => {
      render(
        <Tabs defaultValue="tab2" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
          <div data-tab-panel="tab3">Content 3</div>
        </Tabs>,
      );

      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("tabindex", "-1");
      expect(tabs[1]).toHaveAttribute("tabindex", "0");
      expect(tabs[2]).toHaveAttribute("tabindex", "-1");
    });
  });
});

describe("Tabs - Accessibility (ARIA)", () => {
  const basicTabs = [
    { id: "tab1", label: "Tab 1" },
    { disabled: true, id: "tab2", label: "Tab 2" },
  ];

  it("tablist has role='tablist'", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("tablist has aria-orientation", () => {
    render(
      <Tabs defaultValue="tab1" orientation="vertical" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");
  });

  it("tabs have role='tab'", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });

  it("tabs have aria-selected (true/false)", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("tabs have aria-controls pointing to panel", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    const panels = screen.getAllByRole("tabpanel");

    const tab1Controls = tabs[0].getAttribute("aria-controls");
    const panel1Id = panels[0].getAttribute("id");
    expect(tab1Controls).toBe(panel1Id);
  });

  it("tabs have aria-disabled when disabled", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).not.toHaveAttribute("aria-disabled");
    expect(tabs[1]).toHaveAttribute("aria-disabled");
  });

  it("panels have role='tabpanel'", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(2);
  });

  it("panels have aria-labelledby pointing to tab", () => {
    render(
      <Tabs defaultValue="tab1" tabs={basicTabs}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    const panels = screen.getAllByRole("tabpanel");

    const panel1LabelledBy = panels[0].getAttribute("aria-labelledby");
    const tab1Id = tabs[0].getAttribute("id");
    expect(panel1LabelledBy).toBe(tab1Id);
  });

  it("tab and panel IDs are unique (using useId)", () => {
    render(
      <div>
        <Tabs defaultValue="tab1" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
        </Tabs>
        <Tabs defaultValue="tab1" tabs={basicTabs}>
          <div data-tab-panel="tab1">Content 1</div>
          <div data-tab-panel="tab2">Content 2</div>
        </Tabs>
      </div>,
    );

    const tabs = screen.getAllByRole("tab");
    const panels = screen.getAllByRole("tabpanel");

    const tabIds = tabs.map((tab) => tab.getAttribute("id"));
    const panelIds = panels.map((panel) => panel.getAttribute("id"));

    // Check all IDs are unique
    const allIds = [...tabIds, ...panelIds];
    const uniqueIds = new Set(allIds);
    expect(allIds.length).toBe(uniqueIds.size);
  });
});

describe("Tabs - Disabled Tabs", () => {
  const tabsWithDisabled = [
    { id: "tab1", label: "Tab 1" },
    { disabled: true, id: "tab2", label: "Tab 2" },
    { id: "tab3", label: "Tab 3" },
  ];

  it("disabled tab cannot be clicked", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={tabsWithDisabled}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    await user.click(tabs[1]);

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("disabled tab cannot be activated via Enter key", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={tabsWithDisabled}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    tabs[1].focus();
    await user.keyboard("{Enter}");

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("disabled tab cannot be activated via Space key", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={tabsWithDisabled}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    tabs[1].focus();
    await user.keyboard("{ }"); // Space key

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("arrow keys skip disabled tabs", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" tabs={tabsWithDisabled}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");

    expect(tabs[2]).toHaveFocus();
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
  });

  it("Home/End skip disabled tabs at boundaries", async () => {
    const user = userEvent.setup();
    const allDisabledExceptMiddle = [
      { disabled: true, id: "tab1", label: "Tab 1" },
      { id: "tab2", label: "Tab 2" },
      { disabled: true, id: "tab3", label: "Tab 3" },
    ];

    render(
      <Tabs defaultValue="tab2" tabs={allDisabledExceptMiddle}>
        <div data-tab-panel="tab1">Content 1</div>
        <div data-tab-panel="tab2">Content 2</div>
        <div data-tab-panel="tab3">Content 3</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole("tab");
    tabs[1].focus();
    await user.keyboard("{Home}");

    expect(tabs[1]).toHaveFocus();

    await user.keyboard("{End}");
    expect(tabs[1]).toHaveFocus();
  });
});

describe("Tabs - Display Name", () => {
  it("has displayName set to 'Tabs'", () => {
    expect(Tabs.displayName).toBe("Tabs");
  });
});
