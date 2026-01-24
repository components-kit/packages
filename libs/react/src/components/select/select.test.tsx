import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

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

    it("renders placeholder when no value selected", () => {
      render(
        <Select options={["apple", "banana"]} placeholder="Select a fruit..." />,
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
      render(
        <Select
          options={[
            { value: "apple" },
            { value: "banana" },
          ]}
        />,
      );

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
      const { container } = render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { type: "separator" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const separator = container.querySelector(
        '[data-ck="select-separator"]',
      );
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("role", "separator");
    });
  });

  describe("Disabled Items", () => {
    it("renders disabled items with aria-disabled", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana (Out of Stock)", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = container.querySelectorAll('[data-ck="select-item"]');
      expect(items[0]).not.toHaveAttribute("aria-disabled");
      expect(items[1]).toHaveAttribute("aria-disabled", "true");
      expect(items[1]).toHaveAttribute("data-disabled", "true");
    });

    it("skips disabled items during keyboard navigation", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
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

      const items = container.querySelectorAll('[data-ck="select-item"]');
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

      expect(screen.getByText("Apple")).toBeInTheDocument();
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

    it("supports object values with isEqual", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select<User>
          isEqual={(a, b) => a?.id === b?.id}
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
          isEqual={(a, b) => a?.id === b?.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          value={users[1]}
        />,
      );

      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  describe("Custom Rendering", () => {
    it("supports custom trigger rendering", () => {
      render(
        <Select
          options={["apple", "banana"]}
          placeholder="Pick one"
          renderTrigger={({ placeholder, selectedItem }) => (
            <span data-testid="custom-trigger">
              {selectedItem?.label || placeholder} ▼
            </span>
          )}
        />,
      );

      const trigger = screen.getByTestId("custom-trigger");
      expect(trigger).toHaveTextContent("Pick one ▼");
    });

    it("passes correct context to renderTrigger", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[{ label: "Apple", value: "apple" }]}
          placeholder="Select..."
          renderTrigger={({ isOpen, selectedItem }) => (
            <span data-testid="custom-trigger">
              {selectedItem?.label || "None"} - {isOpen ? "Open" : "Closed"}
            </span>
          )}
        />,
      );

      const trigger = screen.getByTestId("custom-trigger");
      expect(trigger).toHaveTextContent("None - Closed");

      await user.click(screen.getByRole("combobox"));
      expect(trigger).toHaveTextContent("None - Open");

      await user.click(screen.getByRole("option", { name: "Apple" }));
      expect(trigger).toHaveTextContent("Apple - Closed");
    });

    it("supports custom item rendering", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          renderItem={({ isHighlighted, isSelected, option }) => (
            <span data-testid={`item-${option.value}`}>
              {option.label}
              {isSelected && " ✓"}
              {isHighlighted && " ←"}
            </span>
          )}
          value="apple"
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const appleItem = screen.getByTestId("item-apple");
      expect(appleItem).toHaveTextContent("Apple ✓");
    });
  });

  describe("Keyboard Navigation", () => {
    it("opens menu with Enter key", async () => {
      const user = userEvent.setup();
      const { container } = render(<Select options={["apple", "banana"]} />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{Enter}");

      const select = container.querySelector('[data-ck="select"]');
      expect(select).toHaveAttribute("data-state", "open");
    });

    it("opens menu with Space key", async () => {
      const user = userEvent.setup();
      const { container } = render(<Select options={["apple", "banana"]} />);

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
      expect(
        container.querySelector('[data-ck="select"]'),
      ).toHaveAttribute("data-state", "open");

      await user.keyboard("{Escape}");
      expect(
        container.querySelector('[data-ck="select"]'),
      ).toHaveAttribute("data-state", "closed");
    });

    it("navigates items with Arrow keys", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const items = container.querySelectorAll('[data-ck="select-item"]');
      const highlightedItems = Array.from(items).filter(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(highlightedItems.length).toBe(1);
    });

    it("selects item with Enter key", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={["apple", "banana"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalled();
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

  describe("Data Attributes", () => {
    it("has data-state on trigger and content", async () => {
      const user = userEvent.setup();
      const { container } = render(<Select options={["apple"]} />);

      const trigger = container.querySelector(
        '[data-ck="select-trigger"]',
      );
      const content = container.querySelector(
        '[data-ck="select-content"]',
      );

      expect(trigger).toHaveAttribute("data-state", "closed");
      expect(content).toHaveAttribute("data-state", "closed");

      await user.click(screen.getByRole("combobox"));

      expect(trigger).toHaveAttribute("data-state", "open");
      expect(content).toHaveAttribute("data-state", "open");
    });

    it("has data-state on items for selection state", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="apple"
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = container.querySelectorAll('[data-ck="select-item"]');
      expect(items[0]).toHaveAttribute("data-state", "checked");
      expect(items[1]).toHaveAttribute("data-state", "unchecked");
    });

    it("has data-highlighted on highlighted item", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");

      const items = container.querySelectorAll('[data-ck="select-item"]');
      const hasHighlighted = Array.from(items).some(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(hasHighlighted).toBe(true);
    });
  });

  describe("Edge Cases", () => {
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
});
