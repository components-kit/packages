import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Select } from "./select";

describe("Select Component", () => {
  describe("Basic Rendering", () => {
    it("renders with string options", () => {
      const { container } = render(
        <Select options={["apple", "banana", "cherry"]} />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute("data-state", "closed");
    });

    it("has data-placeholder on value span when no selection", () => {
      const { container } = render(
        <Select
          options={["apple", "banana"]}
          placeholder="Select a fruit..."
        />,
      );

      const valueSpan = container.querySelector('[data-ck="select-value"]');
      expect(valueSpan).toHaveAttribute("data-placeholder", "");
    });

    it("removes data-placeholder after selection", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select
          options={["apple", "banana"]}
          placeholder="Select..."
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));

      const valueSpan = container.querySelector('[data-ck="select-value"]');
      expect(valueSpan).not.toHaveAttribute("data-placeholder");
      expect(valueSpan).toHaveTextContent("apple");
    });

    it("renders placeholder when no value selected", () => {
      render(
        <Select
          options={["apple", "banana"]}
          placeholder="Select a fruit..."
        />,
      );

      expect(screen.getByText("Select a fruit...")).toBeInTheDocument();
    });

    it("applies variantName as data-variant attribute", () => {
      const { container } = render(
        <Select options={["apple"]} variantName="primary" />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-variant", "primary");
    });

    it("passes through HTML attributes", () => {
      const { container } = render(
        <Select
          id="my-select"
          className="custom-select"
          data-testid="select-root"
          options={["apple"]}
        />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("id", "my-select");
      expect(select).toHaveClass("custom-select");
      expect(select).toHaveAttribute("data-testid", "select-root");
    });

    it("forwards ref to div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Select options={["apple"]} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("has displayName", () => {
      expect((Select as { displayName?: string }).displayName).toBe("Select");
    });
  });

  describe("Labeled Options", () => {
    it("renders options with explicit labels", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("uses value as label when label not provided", async () => {
      const user = userEvent.setup();
      render(<Select options={[{ value: "apple" }, { value: "banana" }]} />);

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("apple")).toBeInTheDocument();
      expect(screen.getByText("banana")).toBeInTheDocument();
    });
  });

  describe("Grouped Options", () => {
    it("renders grouped options with labels", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            {
              label: "Fruits",
              options: ["apple", "banana"],
              type: "group",
            },
            { type: "separator" },
            {
              label: "Vegetables",
              options: ["carrot"],
              type: "group",
            },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
      expect(screen.getByText("apple")).toBeInTheDocument();
      expect(screen.getByText("banana")).toBeInTheDocument();
      expect(screen.getByText("carrot")).toBeInTheDocument();
    });

    it("renders separators", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { type: "separator" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const separator = document.querySelector('[data-ck="select-separator"]');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("role", "separator");
    });

    it("wraps grouped items in role=group with aria-labelledby", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            {
              label: "Fruits",
              options: ["apple", "banana"],
              type: "group",
            },
            {
              label: "Vegetables",
              options: ["carrot"],
              type: "group",
            },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const groups = screen.getAllByRole("group");
      expect(groups).toHaveLength(2);

      // Each group has aria-labelledby pointing to its label
      groups.forEach((group) => {
        const labelId = group.getAttribute("aria-labelledby");
        expect(labelId).toBeTruthy();
        const label = document.getElementById(labelId!);
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute("role", "presentation");
      });

      // Verify label text matches
      const fruitsGroup = groups[0];
      const labelId = fruitsGroup.getAttribute("aria-labelledby")!;
      expect(document.getElementById(labelId)).toHaveTextContent("Fruits");
    });
  });

  describe("Disabled Items", () => {
    it("renders disabled items with aria-disabled", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana (Out of Stock)", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="select-item"]');
      expect(items[0]).not.toHaveAttribute("aria-disabled");
      expect(items[1]).toHaveAttribute("aria-disabled", "true");
      expect(items[1]).toHaveAttribute("data-disabled", "true");
    });

    it("skips disabled items during keyboard navigation", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana", value: "banana" },
            { label: "Cherry", value: "cherry" },
          ]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="select-item"]');
      const disabledItem = items[1];
      expect(disabledItem).not.toHaveAttribute("data-highlighted", "true");
    });
  });

  describe("Controlled Mode", () => {
    it("respects controlled value", () => {
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="banana"
        />,
      );

      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("calls onValueChange when selection changes", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="apple"
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Banana" }));

      expect(onValueChange).toHaveBeenCalledWith("banana");
    });

    it("updates display when controlled value changes", () => {
      const { rerender } = render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="apple"
        />,
      );

      expect(screen.getByText("Apple")).toBeInTheDocument();

      rerender(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="banana"
        />,
      );

      expect(screen.getByText("Banana")).toBeInTheDocument();
    });
  });

  describe("Uncontrolled Mode", () => {
    it("uses defaultValue for initial selection", () => {
      render(
        <Select
          defaultValue="banana"
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("updates selection on user interaction", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          placeholder="Select..."
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Apple" }));

      expect(
        document.querySelector('[data-ck="select-value"]'),
      ).toHaveTextContent("Apple");
    });
  });

  describe("Object Values", () => {
    interface User {
      id: number;
      name: string;
    }

    const users: User[] = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    it("supports object values with getOptionValue", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select<User>
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Alice" }));

      expect(onValueChange).toHaveBeenCalledWith(users[0]);
    });

    it("displays controlled object value", () => {
      render(
        <Select<User>
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          value={users[1]}
        />,
      );

      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  describe("getOptionValue", () => {
    it("works with object values using getOptionValue", async () => {
      const user = userEvent.setup();
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      const handleChange = vi.fn();

      render(
        <Select
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          onValueChange={handleChange}
        />,
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      const bobOption = screen.getByRole("option", { name: "Bob" });
      await user.click(bobOption);

      expect(handleChange).toHaveBeenCalledWith(users[1]);
    });

    it("correctly identifies selected item with getOptionValue", () => {
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      const selectedUser = { id: 1, name: "Alice" }; // Different reference!

      render(
        <Select
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          value={selectedUser}
        />,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveTextContent("Alice");
    });

    it("works without getOptionValue for primitives", () => {
      render(<Select options={["apple", "banana"]} value="apple" />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveTextContent("apple");
    });
  });

  describe("Keyboard Navigation", () => {
    it("opens menu with Enter key", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select openOnFocus={false} options={["apple", "banana"]} />,
      );

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{Enter}");

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-state", "open");
    });

    it("opens menu with Space key", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select openOnFocus={false} options={["apple", "banana"]} />,
      );

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard(" ");

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-state", "open");
    });

    it("closes menu with Escape key", async () => {
      const user = userEvent.setup();
      const { container } = render(<Select options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      expect(container.querySelector('[data-ck="select"]')).toHaveAttribute(
        "data-state",
        "open",
      );

      await user.keyboard("{Escape}");
      expect(container.querySelector('[data-ck="select"]')).toHaveAttribute(
        "data-state",
        "closed",
      );
    });

    it("navigates items with Arrow keys", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="select-item"]');
      const highlightedItems = Array.from(items).filter(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(highlightedItems.length).toBe(1);
    });

    it("returns focus to trigger after selecting with Enter", async () => {
      const user = userEvent.setup();
      render(
        <Select options={["apple", "banana"]} />,
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(document.activeElement).toBe(trigger);
    });

    it("selects item with Enter key", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select options={["apple", "banana"]} onValueChange={onValueChange} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalled();
    });

    it("jumps to first item with Home key", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana", "cherry", "date"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      // Now on "date" (index 3)

      await user.keyboard("{Home}");

      const items = document.querySelectorAll('[data-ck="select-item"]');
      expect(items[0]).toHaveAttribute("data-highlighted", "true");
    });

    it("jumps to last item with End key", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana", "cherry", "date"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      // Now on "apple" (index 0)

      await user.keyboard("{End}");

      const items = document.querySelectorAll('[data-ck="select-item"]');
      expect(items[items.length - 1]).toHaveAttribute("data-highlighted", "true");
    });

    it("supports type-ahead character search", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={["apple", "apricot", "banana", "blueberry", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      // Type "b" to jump to first item starting with "b"
      await user.keyboard("b");

      const items = document.querySelectorAll('[data-ck="select-item"]');
      // Should highlight "banana" (index 2)
      expect(items[2]).toHaveAttribute("data-highlighted", "true");
      expect(items[2]).toHaveTextContent("banana");
    });

    it("supports type-ahead with rapid character input", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={["apple", "apricot", "banana", "blueberry", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      // Rapidly type "bl" to match "blueberry"
      await user.keyboard("bl");

      const items = document.querySelectorAll('[data-ck="select-item"]');
      // Should highlight "blueberry" (index 3)
      expect(items[3]).toHaveAttribute("data-highlighted", "true");
      expect(items[3]).toHaveTextContent("blueberry");
    });
  });

  describe("Disabled State", () => {
    it("disables trigger when disabled prop is true", () => {
      render(<Select disabled options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });

    it("applies data-disabled to root when disabled", () => {
      const { container } = render(
        <Select disabled options={["apple", "banana"]} />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes on trigger", () => {
      render(<Select options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("updates aria-expanded when open", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("links trigger and listbox with aria-controls", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      const listbox = screen.getByRole("listbox");
      const controlsId = trigger.getAttribute("aria-controls");
      expect(listbox).toHaveAttribute("id", controlsId);
    });

    it("listbox has aria-labelledby pointing to trigger id", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("aria-labelledby", trigger.id);
    });

    it("marks selected item with aria-selected", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="apple"
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      expect(options[0]).toHaveAttribute("aria-selected", "true");
      expect(options[1]).toHaveAttribute("aria-selected", "false");
    });

    it("has role option on items", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
    });
  });

  describe("aria-label", () => {
    it("applies aria-label to trigger button", () => {
      render(
        <Select
          aria-label="Choose a fruit"
          options={["apple", "banana"]}
        />,
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-label", "Choose a fruit");
    });

    it("works without aria-label when not provided", () => {
      render(<Select options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).not.toHaveAttribute("aria-label");
    });

    it("does not have dangling aria-labelledby on trigger", () => {
      render(<Select options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).not.toHaveAttribute("aria-labelledby");
    });
  });

  describe("Data Attributes", () => {
    it("has data-state on trigger and content", async () => {
      const user = userEvent.setup();
      const { container } = render(<Select options={["apple"]} />);

      const trigger = container.querySelector('[data-ck="select-trigger"]');

      expect(trigger).toHaveAttribute("data-state", "closed");
      // Content is always in DOM; positioner is marked unmounted when closed
      const positioner = document.querySelector('[data-ck="select-positioner"]');
      expect(positioner).toHaveAttribute("data-unmounted");

      await user.click(screen.getByRole("combobox"));

      expect(trigger).toHaveAttribute("data-state", "open");
      const content = document.querySelector('[data-ck="select-content"]');
      // content data-state transitions to "open" after rAF
      await waitFor(() => {
        expect(content).toHaveAttribute("data-state", "open");
      });
    });

    it("has data-state on items for selection state", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="apple"
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="select-item"]');
      expect(items[0]).toHaveAttribute("data-state", "checked");
      expect(items[1]).toHaveAttribute("data-state", "unchecked");
    });

    it("has data-highlighted on highlighted item", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="select-item"]');
      const hasHighlighted = Array.from(items).some(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(hasHighlighted).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("renders custom emptyContent when options are empty", async () => {
      const user = userEvent.setup();
      render(<Select emptyContent="Nothing here" options={[]} />);

      await user.click(screen.getByRole("combobox"));

      const emptyEl = document.querySelector('[data-ck="select-empty"]');
      expect(emptyEl).toBeInTheDocument();
      expect(emptyEl).toHaveTextContent("Nothing here");
    });

    it("handles empty options array", () => {
      const { container } = render(<Select options={[]} />);

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toBeInTheDocument();
    });

    it("handles mixed option types", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            "plain-string",
            { label: "Labeled", value: "labeled" },
            { type: "separator" },
            {
              label: "Group",
              options: [
                "grouped-string",
                { label: "Grouped Labeled", value: "grouped-labeled" },
              ],
              type: "group",
            },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("plain-string")).toBeInTheDocument();
      expect(screen.getByText("Labeled")).toBeInTheDocument();
      expect(screen.getByText("Group")).toBeInTheDocument();
      expect(screen.getByText("grouped-string")).toBeInTheDocument();
      expect(screen.getByText("Grouped Labeled")).toBeInTheDocument();
    });

    it("handles value not in options", () => {
      render(
        <Select
          options={["apple", "banana"]}
          placeholder="Select..."
          value="nonexistent"
        />,
      );

      // Should show placeholder when value doesn't match any option
      expect(screen.getByText("Select...")).toBeInTheDocument();
    });
  });

  describe("Icon Slot", () => {
    it("renders icon slot in trigger", () => {
      const { container } = render(<Select options={["apple"]} />);
      const iconSlot = container.querySelector(
        '[data-ck="select-trigger"] [data-slot="icon"]',
      );
      expect(iconSlot).toBeInTheDocument();
    });

    it("icon slot has aria-hidden true", () => {
      const { container } = render(<Select options={["apple"]} />);
      const iconSlot = container.querySelector(
        '[data-ck="select-trigger"] [data-slot="icon"]',
      );
      expect(iconSlot).toHaveAttribute("aria-hidden", "true");
    });

    it("icon slot is positioned after the value span", () => {
      const { container } = render(<Select options={["apple"]} />);
      const trigger = container.querySelector('[data-ck="select-trigger"]');
      const children = Array.from(trigger!.children);
      expect(children[0]).toHaveAttribute("data-ck", "select-value");
      expect(children[1]).toHaveAttribute("data-slot", "icon");
    });
  });

  describe("Item Icon Slot", () => {
    it("renders trailing icon slot inside each dropdown item", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="select-item"]');
      for (const item of items) {
        const iconSlot = item.querySelector('[data-slot="icon"]');
        expect(iconSlot).toBeInTheDocument();
        expect(iconSlot).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("renders trailing icon slot inside grouped items", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            {
              label: "Fruits",
              options: ["apple", "banana"],
              type: "group",
            },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="select-item"]');
      expect(items).toHaveLength(2);
      for (const item of items) {
        const iconSlot = item.querySelector('[data-slot="icon"]');
        expect(iconSlot).toBeInTheDocument();
        expect(iconSlot).toHaveAttribute("aria-hidden", "true");
      }
    });
  });

  describe("Placement", () => {
    it("sets data-side attribute on content reflecting placement", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="select-content"]');
      expect(content).toHaveAttribute("data-side");
    });

    it("accepts placement prop without error", () => {
      expect(() =>
        render(<Select options={["apple"]} placement="top-start" />),
      ).not.toThrow();
    });

    it("accepts different placement values", () => {
      const { unmount } = render(
        <Select options={["apple"]} placement="top" />,
      );
      unmount();

      expect(() =>
        render(<Select options={["apple"]} placement="bottom-end" />),
      ).not.toThrow();
    });
  });

  describe("maxDropdownHeight", () => {
    it("renders without error when maxDropdownHeight is provided", () => {
      expect(() =>
        render(<Select maxDropdownHeight={300} options={["apple", "banana"]} />),
      ).not.toThrow();
    });
  });

  describe("onOpenChange", () => {
    it("fires with true when dropdown opens", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={["apple", "banana"]}
          onOpenChange={onOpenChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("fires with false when dropdown closes via Escape", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={["apple", "banana"]}
          onOpenChange={onOpenChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      onOpenChange.mockClear();

      await user.keyboard("{Escape}");

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("openOnFocus", () => {
    it("opens dropdown when trigger receives focus and openOnFocus is true", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select openOnFocus options={["apple", "banana"]} />,
      );

      await user.tab();

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-state", "open");
    });

    it("does not open dropdown on focus when openOnFocus is false", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select openOnFocus={false} options={["apple", "banana"]} />,
      );

      await user.tab();

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-state", "closed");
    });

    it("closes dropdown when trigger is clicked while open", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select openOnFocus={false} options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector('[data-ck="select-trigger"]')!;
      const select = container.querySelector('[data-ck="select"]')!;

      // Click to open
      await user.click(trigger);
      expect(select).toHaveAttribute("data-state", "open");

      // Click again to close
      await user.click(trigger);
      expect(select).toHaveAttribute("data-state", "closed");
    });

    it("does not immediately close when trigger is clicked after focus-open", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select openOnFocus options={["apple", "banana"]} />,
      );

      // Click the trigger — this fires focus (opens) then click (should NOT toggle-close)
      const trigger = container.querySelector('[data-ck="select-trigger"]')!;
      await user.click(trigger);

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-state", "open");
    });

    it("reopens correctly after clicking outside to close then clicking trigger", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select openOnFocus options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector('[data-ck="select-trigger"]')!;
      const select = container.querySelector('[data-ck="select"]')!;

      // Open by clicking trigger
      await user.click(trigger);
      expect(select).toHaveAttribute("data-state", "open");

      // Close by clicking outside
      await user.click(document.body);
      expect(select).toHaveAttribute("data-state", "closed");

      // Re-click trigger — should reopen, not flash open/close
      await user.click(trigger);
      expect(select).toHaveAttribute("data-state", "open");
    });

    it("reopens correctly after tab-open, click-outside-close, then click trigger", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select openOnFocus options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector('[data-ck="select-trigger"]')!;
      const select = container.querySelector('[data-ck="select"]')!;

      // 1. Tab to focus trigger — openOnFocus opens the dropdown
      await user.tab();
      expect(select).toHaveAttribute("data-state", "open");

      // 2. Click outside — closes dropdown and blurs trigger
      await user.click(document.body);
      expect(select).toHaveAttribute("data-state", "closed");

      // 3. Click trigger to reopen — should stay open
      await user.click(trigger);
      expect(select).toHaveAttribute("data-state", "open");
    });
  });

  describe("autoFocus", () => {
    it("focuses the trigger on mount when autoFocus is true", () => {
      render(<Select autoFocus options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveFocus();
    });

    it("does not focus trigger on mount when autoFocus is false", () => {
      render(<Select options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).not.toHaveFocus();
    });
  });

  describe("Read-only Mode", () => {
    it("applies data-readonly on root when readOnly is true", () => {
      const { container } = render(
        <Select options={["apple", "banana"]} readOnly />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-readonly", "true");
    });

    it("disables trigger button when readOnly", () => {
      render(<Select options={["apple", "banana"]} readOnly />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });

    it("does not open dropdown when readOnly", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select options={["apple", "banana"]} readOnly />,
      );

      await user.click(screen.getByRole("combobox"));

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-state", "closed");
    });

    it("does not call onOpenChange when readOnly", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={["apple", "banana"]}
          readOnly
          onOpenChange={onOpenChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Form Integration (name prop)", () => {
    it("renders hidden input with name attribute when name prop is set", () => {
      const { container } = render(
        <Select name="fruit" options={["apple", "banana"]} />,
      );

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute("name", "fruit");
    });

    it("hidden input has empty value when nothing is selected", () => {
      const { container } = render(
        <Select name="fruit" options={["apple", "banana"]} />,
      );

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute("value", "");
    });

    it("hidden input has the selected value when an item is selected", () => {
      const { container } = render(
        <Select
          name="fruit"
          options={["apple", "banana"]}
          value="apple"
        />,
      );

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute("value", "apple");
    });

    it("updates hidden input value after user selects an item", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select
          name="fruit"
          options={["apple", "banana"]}
        />,
      );

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute("value", "");

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));

      expect(hiddenInput).toHaveAttribute("value", "apple");
    });

    it("does not render hidden input when name is not set", () => {
      const { container } = render(
        <Select options={["apple", "banana"]} />,
      );

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).not.toBeInTheDocument();
    });
  });

  describe("Required", () => {
    it("applies data-required on root when required is true", () => {
      const { container } = render(
        <Select options={["apple", "banana"]} required />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-required", "true");
    });

    it("applies aria-required on the trigger button when required is true", () => {
      render(<Select options={["apple", "banana"]} required />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-required", "true");
    });

    it("does not have data-required when required is false", () => {
      const { container } = render(
        <Select options={["apple", "banana"]} />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).not.toHaveAttribute("data-required");
    });
  });

  describe("data-has-value", () => {
    it("is not present when no value is selected", () => {
      const { container } = render(
        <Select options={["apple", "banana"]} placeholder="Select..." />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).not.toHaveAttribute("data-has-value");
    });

    it("is present when a value is selected (controlled)", () => {
      const { container } = render(
        <Select options={["apple", "banana"]} value="apple" />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-has-value", "true");
    });
  });

  describe("data-error", () => {
    it("is present on root when error is true", () => {
      const { container } = render(
        <Select error options={["apple", "banana"]} />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-error", "true");
    });

    it("is not present when error is false", () => {
      const { container } = render(
        <Select options={["apple", "banana"]} />,
      );

      const select = container.querySelector('[data-ck="select"]');
      expect(select).not.toHaveAttribute("data-error");
    });
  });

  describe("data-empty on content", () => {
    it("is present on dropdown content when there are no options", async () => {
      const user = userEvent.setup();
      render(<Select options={[]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="select-content"]');
      expect(content).toHaveAttribute("data-empty", "true");
    });

    it("is not present when there are options", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="select-content"]');
      expect(content).not.toHaveAttribute("data-empty");
    });
  });

  describe("Live Region", () => {
    it("renders live region element with data-ck select-live", () => {
      render(<Select options={["apple", "banana"]} />);

      const liveRegion = document.querySelector('[data-ck="select-live"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it("has aria-live polite and role status", () => {
      render(<Select options={["apple", "banana"]} />);

      const liveRegion = document.querySelector('[data-ck="select-live"]');
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
      expect(liveRegion).toHaveAttribute("role", "status");
    });

    it("clears announcement after 1000ms", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Apple" }));

      const liveRegion = document.querySelector('[data-ck="select-live"]');
      expect(liveRegion).toHaveTextContent("Apple selected");

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(liveRegion).toHaveTextContent("");
      vi.useRealTimers();
    });

    it("announces selection after selecting an item", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Apple" }));

      const liveRegion = document.querySelector('[data-ck="select-live"]');
      expect(liveRegion).toHaveTextContent("Apple selected");
    });
  });

  describe("aria-orientation on listbox", () => {
    it("has aria-orientation vertical on the listbox when open", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("aria-orientation", "vertical");
    });
  });

  describe("exit transition", () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("sets data-state='open' on content when dropdown is open", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="select-content"]');
      expect(content).toHaveAttribute("data-state", "open");
    });

    it("sets data-state='closed' on content before unmounting", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      expect(
        document.querySelector('[data-ck="select-content"]'),
      ).toBeInTheDocument();

      await user.keyboard("{Escape}");

      // Content should still be in DOM with data-state="closed"
      const content = document.querySelector('[data-ck="select-content"]');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-state", "closed");
    });

    it("hides positioner after exit duration", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{Escape}");

      // Advance past exit duration
      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Content stays in DOM but positioner is marked unmounted
      const positioner = document.querySelector('[data-ck="select-positioner"]');
      expect(positioner).toHaveAttribute("data-unmounted");
    });

    it("disables pointer events during exit animation", async () => {
      const user = userEvent.setup();
      render(<Select options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{Escape}");

      const content = document.querySelector(
        '[data-ck="select-content"]',
      ) as HTMLElement;
      // Positioner wrapper uses data attributes instead of inline styles
      expect(content.parentElement!).toHaveAttribute("data-ck", "select-positioner");
      expect(content.parentElement!).toHaveAttribute("data-state", "closed");
    });
  });
});
