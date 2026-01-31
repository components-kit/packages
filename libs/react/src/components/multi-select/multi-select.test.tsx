import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { MultiSelect } from "./multi-select";

describe("MultiSelect Component", () => {
  describe("Basic Rendering", () => {
    it("renders with data-ck='multi-select' on root", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana", "cherry"]} />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toBeInTheDocument();
    });

    it("renders input element with data-ck='multi-select-input'", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const input = container.querySelector('[data-ck="multi-select-input"]');
      expect(input).toBeInTheDocument();
      expect(input?.tagName).toBe("INPUT");
    });

    it("renders trigger button with data-ck='multi-select-trigger'", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector(
        '[data-ck="multi-select-trigger"]',
      );
      expect(trigger).toBeInTheDocument();
      expect(trigger?.tagName).toBe("BUTTON");
    });

    it("renders placeholder text when no items selected", () => {
      render(
        <MultiSelect
          options={["apple", "banana"]}
          placeholder="Pick fruits..."
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "Pick fruits...");
    });

    it("hides placeholder when items are selected", () => {
      render(
        <MultiSelect
          defaultValue={["apple"]}
          options={["apple", "banana"]}
          placeholder="Pick fruits..."
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "");
    });

    it("applies variantName as data-variant attribute", () => {
      const { container } = render(
        <MultiSelect options={["apple"]} variantName="primary" />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-variant", "primary");
    });

    it("passes through HTML attributes", () => {
      const { container } = render(
        <MultiSelect
          id="my-multi-select"
          className="custom-multi-select"
          data-testid="multi-select-root"
          options={["apple"]}
        />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("id", "my-multi-select");
      expect(root).toHaveClass("custom-multi-select");
      expect(root).toHaveAttribute("data-testid", "multi-select-root");
    });

    it("forwards ref to div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<MultiSelect options={["apple"]} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("has displayName", () => {
      expect((MultiSelect as { displayName?: string }).displayName).toBe(
        "MultiSelect",
      );
    });
  });

  describe("Tag Rendering", () => {
    it("renders tags for selected items", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(2);
      expect(tags[0]).toHaveTextContent("apple");
      expect(tags[1]).toHaveTextContent("banana");
    });

    it("renders tag remove buttons", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const removeButtons = container.querySelectorAll(
        '[data-ck="multi-select-tag-remove"]',
      );
      expect(removeButtons).toHaveLength(2);
    });

    it("removes item when tag remove button is clicked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      const removeButtons = container.querySelectorAll(
        '[data-ck="multi-select-tag-remove"]',
      );
      await user.click(removeButtons[0]);

      expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    });

    it("tags have aria-label with item label and 'selected'", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags[0]).toHaveAttribute("aria-label", "apple, selected");
      expect(tags[1]).toHaveAttribute("aria-label", "banana, selected");
    });

    it("tag remove buttons have aria-label 'Remove {label}'", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const removeButtons = container.querySelectorAll(
        '[data-ck="multi-select-tag-remove"]',
      );
      expect(removeButtons[0]).toHaveAttribute("aria-label", "Remove apple");
      expect(removeButtons[1]).toHaveAttribute("aria-label", "Remove banana");
    });
  });

  describe("Labeled Options", () => {
    it("renders options with explicit labels when opened", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
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
        <MultiSelect options={[{ value: "apple" }, { value: "banana" }]} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("apple")).toBeInTheDocument();
      expect(screen.getByText("banana")).toBeInTheDocument();
    });
  });

  describe("Grouped Options", () => {
    it("renders grouped options with group labels", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
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

    it("renders separators between groups", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { type: "separator" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const separator = document.querySelector(
        '[data-ck="multi-select-separator"]',
      );
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("role", "separator");
    });
  });

  describe("Disabled Items", () => {
    it("renders disabled items with aria-disabled", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            {
              disabled: true,
              label: "Banana (Out of Stock)",
              value: "banana",
            },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items[0]).not.toHaveAttribute("aria-disabled");
      expect(items[1]).toHaveAttribute("aria-disabled", "true");
      expect(items[1]).toHaveAttribute("data-disabled", "true");
    });

    it("skips disabled items during keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana", value: "banana" },
            { label: "Cherry", value: "cherry" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      const disabledItem = items[1];
      expect(disabledItem).not.toHaveAttribute("data-highlighted", "true");
    });
  });

  describe("Filtering", () => {
    it("filters options based on input text", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "ban");

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("banana");
    });

    it("excludes already-selected items from dropdown", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(2);
      const itemTexts = Array.from(items).map((item) => item.textContent);
      expect(itemTexts).toContain("banana");
      expect(itemTexts).toContain("cherry");
      expect(itemTexts).not.toContain("apple");
    });

    it("shows empty state when no options match", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "xyz");

      const empty = document.querySelector('[data-ck="multi-select-empty"]');
      expect(empty).toBeInTheDocument();
      expect(empty).toHaveTextContent("No results found");
    });

    it("uses custom filterFn when provided", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          filterFn={(option, inputValue) => option.label.startsWith(inputValue)}
          options={["apple", "apricot", "banana"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "ap");

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("apple");
      expect(items[1]).toHaveTextContent("apricot");
    });

    it("clears input after selecting an item", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "ban");
      await user.click(screen.getByRole("option", { name: "banana" }));

      expect(input).toHaveValue("");
    });
  });

  describe("Selection Behavior", () => {
    it("adds item to selection on click", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "banana" }));

      expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    });

    it("keeps menu open after selection", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "banana" }));

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-state", "open");
    });

    it("removes selected item from dropdown options", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));

      // Before selecting, all 3 options should be visible
      expect(screen.getAllByRole("option")).toHaveLength(3);

      await user.click(screen.getByRole("option", { name: "banana" }));

      // After selecting, only 2 options remain
      expect(screen.getAllByRole("option")).toHaveLength(2);
      const optionTexts = screen
        .getAllByRole("option")
        .map((opt) => opt.textContent);
      expect(optionTexts).not.toContain("banana");
    });

    it("enforces maxSelected limit", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          maxSelected={2}
          options={["apple", "banana", "cherry", "date"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));
      await user.click(screen.getByRole("option", { name: "banana" }));

      // After selecting 2 items with maxSelected=2, onValueChange should have
      // been called with at most 2 items
      const lastCall =
        onValueChange.mock.calls[onValueChange.mock.calls.length - 1];
      expect(lastCall[0]).toHaveLength(2);
    });

    it("shows 'Maximum selections reached' when at limit", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          maxSelected={2}
          options={["apple", "banana"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const empty = document.querySelector('[data-ck="multi-select-empty"]');
      expect(empty).toBeInTheDocument();
      expect(empty).toHaveTextContent("Maximum selections reached");
    });
  });

  describe("Controlled Mode", () => {
    it("respects controlled value array", () => {
      const { container } = render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Cherry", value: "cherry" },
          ]}
          value={["apple", "cherry"]}
        />,
      );

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(2);
      expect(tags[0]).toHaveTextContent("Apple");
      expect(tags[1]).toHaveTextContent("Cherry");
    });

    it("calls onValueChange with updated array when item selected", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Cherry", value: "cherry" },
          ]}
          value={["apple"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Banana" }));

      expect(onValueChange).toHaveBeenCalledWith(["apple", "banana"]);
    });

    it("calls onValueChange with updated array when tag removed", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value={["apple", "banana"]}
          onValueChange={onValueChange}
        />,
      );

      const removeButtons = container.querySelectorAll(
        '[data-ck="multi-select-tag-remove"]',
      );
      await user.click(removeButtons[0]);

      expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    });

    it("updates display when controlled value changes via rerender", () => {
      const { container, rerender } = render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Cherry", value: "cherry" },
          ]}
          value={["apple"]}
        />,
      );

      let tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(1);
      expect(tags[0]).toHaveTextContent("Apple");

      rerender(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Cherry", value: "cherry" },
          ]}
          value={["banana", "cherry"]}
        />,
      );

      tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(2);
      expect(tags[0]).toHaveTextContent("Banana");
      expect(tags[1]).toHaveTextContent("Cherry");
    });
  });

  describe("Uncontrolled Mode", () => {
    it("uses defaultValue for initial selections", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["banana"]}
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(1);
      expect(tags[0]).toHaveTextContent("Banana");
    });

    it("updates selections on user interaction", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Apple" }));

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(1);
      expect(tags[0]).toHaveTextContent("Apple");
    });
  });

  describe("getOptionValue", () => {
    it("works with object values using getOptionValue", async () => {
      const user = userEvent.setup();
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ];

      const handleChange = vi.fn();

      render(
        <MultiSelect
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          onValueChange={handleChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "Bob");

      const bobOption = screen.getByRole("option", { name: "Bob" });
      await user.click(bobOption);

      expect(handleChange).toHaveBeenCalledWith([users[1]]);
    });

    it("correctly identifies selected items with getOptionValue", () => {
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ];

      const selectedUsers = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      render(
        <MultiSelect
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          value={selectedUsers}
        />,
      );

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("works without getOptionValue for primitives", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <MultiSelect
          options={["apple", "banana", "cherry"]}
          onValueChange={handleChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "apple");

      const appleOption = screen.getByRole("option", { name: "apple" });
      await user.click(appleOption);

      expect(handleChange).toHaveBeenCalledWith(["apple"]);
    });
  });

  describe("Keyboard Navigation", () => {
    it("opens menu on ArrowDown from input", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      input.focus();
      await user.keyboard("{ArrowDown}");

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-state", "open");
    });

    it("navigates items with ArrowDown/ArrowUp", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      const highlightedItems = Array.from(items).filter(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(highlightedItems.length).toBe(1);
    });

    it("selects item with Enter key and keeps menu open", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalled();

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-state", "open");
    });

    it("closes menu with Escape key", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      expect(
        container.querySelector('[data-ck="multi-select"]'),
      ).toHaveAttribute("data-state", "open");

      await user.keyboard("{Escape}");
      expect(
        container.querySelector('[data-ck="multi-select"]'),
      ).toHaveAttribute("data-state", "closed");
    });

    it("removes last tag with Backspace when input is empty", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      input.focus();

      // Backspace on empty input should remove the last selected item
      await user.keyboard("{Backspace}");

      expect(onValueChange).toHaveBeenCalledWith(["apple"]);
    });

    it("navigates tags with ArrowLeft from input", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const input = screen.getByRole("combobox");
      input.focus();

      // ArrowLeft from input should activate the last tag
      await user.keyboard("{ArrowLeft}");

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      const activeTags = Array.from(tags).filter(
        (tag) => tag.getAttribute("data-active") === "true",
      );
      expect(activeTags.length).toBe(1);
    });

    it("filters options as user types characters", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "ch");

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("cherry");
    });

    it("navigates between tags with ArrowLeft and ArrowRight", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana", "cherry"]}
          options={["apple", "banana", "cherry", "date"]}
        />,
      );

      const input = screen.getByRole("combobox");
      input.focus();

      // ArrowLeft from input should activate last tag
      await user.keyboard("{ArrowLeft}");

      let tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags[2]).toHaveAttribute("data-active", "true");

      // ArrowLeft again should move to previous tag
      await user.keyboard("{ArrowLeft}");

      tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags[1]).toHaveAttribute("data-active", "true");

      // ArrowRight should move back to next tag
      await user.keyboard("{ArrowRight}");

      tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags[2]).toHaveAttribute("data-active", "true");
    });

    it("returns focus to input with ArrowRight from last tag", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect defaultValue={["apple"]} options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      input.focus();

      // Navigate to tag
      await user.keyboard("{ArrowLeft}");

      // ArrowRight from last (only) tag should return focus to input
      await user.keyboard("{ArrowRight}");

      expect(document.activeElement).toBe(input);
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled prop is true", () => {
      render(<MultiSelect disabled options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });

    it("disables trigger button when disabled", () => {
      const { container } = render(
        <MultiSelect disabled options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector(
        '[data-ck="multi-select-trigger"]',
      );
      expect(trigger).toBeDisabled();
    });

    it("disables tag remove buttons when disabled", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          disabled
          options={["apple", "banana", "cherry"]}
        />,
      );

      const removeButtons = container.querySelectorAll(
        '[data-ck="multi-select-tag-remove"]',
      );
      expect(removeButtons[0]).toBeDisabled();
      expect(removeButtons[1]).toBeDisabled();
    });

    it("applies data-disabled to root when disabled", () => {
      const { container } = render(
        <MultiSelect disabled options={["apple", "banana"]} />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Accessibility", () => {
    it("menu has aria-multiselectable='true'", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      );
      expect(content).toHaveAttribute("aria-multiselectable", "true");
    });

    it("has aria-expanded on combobox element", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-expanded", "false");

      await user.click(input);
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("links combobox and listbox with aria-controls", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      const listbox = screen.getByRole("listbox");
      const controlsId = input.getAttribute("aria-controls");
      expect(listbox).toHaveAttribute("id", controlsId);
    });

    it("items have role option", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
    });

    it("items have aria-selected false (selected removed from list)", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      // The dropdown only shows unselected items, all with aria-selected=false
      const options = screen.getAllByRole("option");
      for (const option of options) {
        expect(option).toHaveAttribute("aria-selected", "false");
      }
    });

    it("empty state has role status and aria-live polite", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "xyz");

      const empty = document.querySelector('[data-ck="multi-select-empty"]');
      expect(empty).toHaveAttribute("role", "status");
      expect(empty).toHaveAttribute("aria-live", "polite");
    });

    it("separators have role separator", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { type: "separator" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const separator = document.querySelector(
        '[data-ck="multi-select-separator"]',
      );
      expect(separator).toHaveAttribute("role", "separator");
    });
  });

  describe("Data Attributes", () => {
    it("has data-state on root, trigger, and content", async () => {
      const user = userEvent.setup();
      const { container } = render(<MultiSelect options={["apple"]} />);

      const root = container.querySelector('[data-ck="multi-select"]');
      const trigger = container.querySelector(
        '[data-ck="multi-select-trigger"]',
      );

      expect(root).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("data-state", "closed");
      // content is not rendered in the DOM when closed (portal only renders when open)
      expect(
        document.querySelector('[data-ck="multi-select-content"]'),
      ).toBeNull();

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      );
      expect(root).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveAttribute("data-state", "open");
      expect(content).toHaveAttribute("data-state", "open");
    });

    it("has data-has-value when items are selected", () => {
      const { container } = render(
        <MultiSelect defaultValue={["apple"]} options={["apple", "banana"]} />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-has-value", "true");
    });

    it("has data-max-reached when at maxSelected limit", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          maxSelected={2}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-max-reached", "true");
    });

    it("has data-active on currently active tag", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const input = screen.getByRole("combobox");
      input.focus();

      // Navigate to tags with ArrowLeft
      await user.keyboard("{ArrowLeft}");

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      const activeTags = Array.from(tags).filter(
        (tag) => tag.getAttribute("data-active") === "true",
      );
      expect(activeTags.length).toBe(1);
    });

    it("has data-highlighted on highlighted item", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      const hasHighlighted = Array.from(items).some(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(hasHighlighted).toBe(true);
    });

    it("has data-disabled on disabled items", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items[0]).not.toHaveAttribute("data-disabled");
      expect(items[1]).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      const { container } = render(<MultiSelect options={[]} />);

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toBeInTheDocument();
    });

    it("handles mixed option types", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
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

    it("handles defaultValue with values not in options", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["nonexistent", "apple"]}
          options={["apple", "banana"]}
        />,
      );

      // Only "apple" should appear as a tag since "nonexistent" is not in options
      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(1);
      expect(tags[0]).toHaveTextContent("apple");
    });

    it("handles selecting all available options", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));
      await user.click(screen.getByRole("option", { name: "banana" }));

      // All items selected means no options in the dropdown
      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(0);

      // Both should appear as tags
      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(2);
    });
  });
});
