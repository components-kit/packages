import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

    it("refocuses input after clicking tag remove button", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const removeButtons = container.querySelectorAll(
        '[data-ck="multi-select-tag-remove"]',
      );
      await user.click(removeButtons[0]);

      const input = screen.getByRole("combobox");
      expect(input).toHaveFocus();
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

    it("wraps grouped items in role=group with aria-labelledby", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
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

      groups.forEach((group) => {
        const labelId = group.getAttribute("aria-labelledby");
        expect(labelId).toBeTruthy();
        const label = document.getElementById(labelId!);
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute("role", "presentation");
      });

      const fruitsGroup = groups[0];
      const labelId = fruitsGroup.getAttribute("aria-labelledby")!;
      expect(document.getElementById(labelId)).toHaveTextContent("Fruits");
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

    it("keeps selected items visible in dropdown with checked state", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(3);

      // Selected item should have data-state="checked"
      const appleItem = Array.from(items).find((i) => i.textContent?.includes("apple"));
      expect(appleItem).toHaveAttribute("data-state", "checked");

      // Unselected items should have data-state="unchecked"
      const bananaItem = Array.from(items).find((i) => i.textContent?.includes("banana"));
      expect(bananaItem).toHaveAttribute("data-state", "unchecked");
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

    it("renders custom emptyContent when no options match", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          emptyContent="Nada"
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "xyz");

      const empty = document.querySelector('[data-ck="multi-select-empty"]');
      expect(empty).toBeInTheDocument();
      expect(empty).toHaveTextContent("Nada");
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
          openOnFocus={false}
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
        <MultiSelect openOnFocus={false} options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "banana" }));

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-state", "open");
    });

    it("toggles item checked state on click without removing from dropdown", async () => {
      const user = userEvent.setup();
      render(<MultiSelect openOnFocus={false} options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));

      // Before selecting, all 3 options should be visible
      expect(screen.getAllByRole("option")).toHaveLength(3);

      await user.click(screen.getByRole("option", { name: "banana" }));

      // After selecting, all 3 options remain visible
      expect(screen.getAllByRole("option")).toHaveLength(3);

      // Selected item should now be checked
      const bananaItem = document.querySelector('[data-ck="multi-select-item"][data-state="checked"]');
      expect(bananaItem).toHaveTextContent("banana");
    });

    it("enforces maxSelected limit", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          maxSelected={2}
          openOnFocus={false}
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

    it("maxSelected counts fixedValues toward the limit", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          fixedValues={["apple"]}
          maxSelected={2}
          openOnFocus={false}
          options={["apple", "banana", "cherry", "date"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      // Can add 1 more (apple is fixed and counts toward max)
      await user.click(screen.getByRole("option", { name: "banana" }));
      expect(onValueChange).toHaveBeenCalledWith(["apple", "banana"]);

      // Now at limit — cherry should be disabled
      onValueChange.mockClear();
      await user.click(screen.getByRole("option", { name: "cherry" }));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("disables unselected items when at maxSelected limit", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          maxSelected={2}
          options={["apple", "banana", "cherry", "date"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      // All items are still visible
      expect(items).toHaveLength(4);

      // Selected items should not be disabled
      const appleItem = Array.from(items).find((i) => i.textContent?.includes("apple"));
      expect(appleItem).not.toHaveAttribute("aria-disabled", "true");

      // Unselected items should be disabled when max reached
      const cherryItem = Array.from(items).find((i) => i.textContent?.includes("cherry"));
      expect(cherryItem).toHaveAttribute("aria-disabled", "true");
      expect(cherryItem).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("maxReachedContent", () => {
    it("shows maxReachedContent instead of emptyContent when at max and no filter results", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          maxReachedContent="No more allowed"
          maxSelected={2}
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "xyz");

      const empty = document.querySelector('[data-ck="multi-select-empty"]');
      expect(empty).toBeInTheDocument();
      expect(empty).toHaveTextContent("No more allowed");
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
          openOnFocus={false}
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
          openOnFocus={false}
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
        <MultiSelect openOnFocus={false} options={["apple", "banana"]} />,
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

    it("removes last tag with Backspace while dropdown is open", async () => {
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
      await user.click(input); // Opens dropdown

      // Backspace on empty input with dropdown open should remove last tag
      await user.keyboard("{Backspace}");

      expect(onValueChange).toHaveBeenCalledWith(["apple"]);
    });

    it("navigates to last tag with ArrowLeft while dropdown is open", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input); // Opens dropdown

      // ArrowLeft from input should activate last tag
      await user.keyboard("{ArrowLeft}");

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      const activeTags = Array.from(tags).filter(
        (tag) => tag.getAttribute("data-active") === "true",
      );
      expect(activeTags.length).toBe(1);
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
      render(<MultiSelect openOnFocus={false} options={["apple", "banana"]} />);

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

    it("selected items have aria-selected true in dropdown", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);

      // Selected item should have aria-selected=true
      const appleOption = screen.getByRole("option", { name: "apple" });
      expect(appleOption).toHaveAttribute("aria-selected", "true");

      // Unselected items should have aria-selected=false
      const bananaOption = screen.getByRole("option", { name: "banana" });
      expect(bananaOption).toHaveAttribute("aria-selected", "false");
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

    it("menu has aria-labelledby", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const listbox = screen.getByRole("listbox");
      const labelledBy = listbox.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
    });
  });

  describe("aria-label", () => {
    it("applies aria-label to input element", () => {
      render(
        <MultiSelect
          aria-label="Select multiple fruits"
          options={["apple", "banana"]}
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-label", "Select multiple fruits");
    });

    it("works without aria-label when not provided", () => {
      render(<MultiSelect options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).not.toHaveAttribute("aria-label");
    });

    it("does not have dangling aria-labelledby on input", () => {
      render(<MultiSelect options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).not.toHaveAttribute("aria-labelledby");
    });
  });

  describe("Data Attributes", () => {
    it("wraps tags, overflow, and input in multi-select-tags container", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana", "cherry"]}
          maxDisplayedTags={2}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const tagsWrapper = container.querySelector(
        '[data-ck="multi-select-tags"]',
      );
      expect(tagsWrapper).toBeInTheDocument();

      // Tags should be inside the wrapper
      const tags = tagsWrapper!.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(2);

      // Overflow badge should be inside the wrapper
      const overflow = tagsWrapper!.querySelector(
        '[data-ck="multi-select-tag-overflow"]',
      );
      expect(overflow).toBeInTheDocument();

      // Input should be inside the wrapper
      const input = tagsWrapper!.querySelector('[data-ck="multi-select-input"]');
      expect(input).toBeInTheDocument();

      // Clear and trigger buttons should NOT be inside the wrapper
      const clearButton = tagsWrapper!.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      expect(clearButton).not.toBeInTheDocument();

      const triggerButton = tagsWrapper!.querySelector(
        '[data-ck="multi-select-trigger"]',
      );
      expect(triggerButton).not.toBeInTheDocument();
    });

    it("has data-state on root, trigger, and content", async () => {
      const user = userEvent.setup();
      const { container } = render(<MultiSelect openOnFocus={false} options={["apple"]} />);

      const root = container.querySelector('[data-ck="multi-select"]');
      const trigger = container.querySelector(
        '[data-ck="multi-select-trigger"]',
      );

      expect(root).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("data-state", "closed");
      // Content is always in DOM; positioner is marked unmounted when closed
      const positioner = document.querySelector('[data-ck="multi-select-positioner"]');
      expect(positioner).toHaveAttribute("data-unmounted");

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      );
      expect(root).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveAttribute("data-state", "open");
      // content data-state transitions to "open" after rAF
      await waitFor(() => {
        expect(content).toHaveAttribute("data-state", "open");
      });
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

    it("has data-side on content reflecting placement", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      );
      expect(content).toHaveAttribute("data-side");
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

    it("all items remain visible when all are selected", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect openOnFocus={false} options={["apple", "banana"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));
      await user.click(screen.getByRole("option", { name: "banana" }));

      // All items remain visible in the dropdown with checked state
      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(2);
      for (const item of items) {
        expect(item).toHaveAttribute("data-state", "checked");
      }

      // Both should appear as tags
      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(2);
    });
  });

  describe("Placement Prop", () => {
    it("renders without error when placement prop is provided", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} placement="bottom-start" />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toBeInTheDocument();
    });

    it("accepts top-start placement", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} placement="top-start" />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toBeInTheDocument();
    });
  });

  describe("maxDropdownHeight Prop", () => {
    it("renders without error when maxDropdownHeight is provided", () => {
      const { container } = render(
        <MultiSelect
          maxDropdownHeight={200}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toBeInTheDocument();
    });
  });

  describe("onOpenChange Callback", () => {
    it("fires with true when dropdown opens", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
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
        <MultiSelect
          openOnFocus={false}
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
    it("opens dropdown when input receives focus and openOnFocus is true", () => {
      const { container } = render(
        <MultiSelect
          openOnFocus
          options={["apple", "banana"]}
        />,
      );

      const input = screen.getByRole("combobox");
      fireEvent.focus(input);

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-state", "open");
    });

    it("does not open dropdown on focus when openOnFocus is false", () => {
      const { container } = render(
        <MultiSelect openOnFocus={false} options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      fireEvent.focus(input);

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-state", "closed");
    });

    it("does not immediately close when input is clicked after focus-open", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect openOnFocus options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-state", "open");
    });

    it("reopens correctly after tab-open, click-outside-close, then click input", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect openOnFocus options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      const root = container.querySelector('[data-ck="multi-select"]')!;

      // 1. Tab to focus input — openOnFocus opens the dropdown
      await user.tab();
      expect(root).toHaveAttribute("data-state", "open");

      // 2. Click outside — closes dropdown and blurs input
      await user.click(document.body);
      expect(root).toHaveAttribute("data-state", "closed");

      // 3. Click input to reopen — should stay open
      await user.click(input);
      expect(root).toHaveAttribute("data-state", "open");
    });
  });

  describe("Read-only Mode", () => {
    it("applies data-readonly on root when readOnly is true", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} readOnly />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-readonly", "true");
    });

    it("disables input when readOnly", () => {
      render(<MultiSelect options={["apple", "banana"]} readOnly />);

      const input = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });

    it("does not open dropdown when readOnly", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} readOnly />,
      );

      await user.click(screen.getByRole("combobox"));

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-state", "closed");
    });

    it("does not call onOpenChange when readOnly", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
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
    it("renders hidden inputs when name prop is set", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          name="fruits"
          options={["apple", "banana", "cherry"]}
        />,
      );

      const hiddenInputs = container.querySelectorAll(
        'input[type="hidden"][name="fruits"]',
      );
      expect(hiddenInputs).toHaveLength(2);
    });

    it("does not render hidden inputs when name is not set", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const hiddenInputs = container.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs).toHaveLength(0);
    });

    it("removes hidden input when item is deselected", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          name="fruits"
          openOnFocus={false}
          options={["apple", "banana", "cherry"]}
        />,
      );

      let hiddenInputs = container.querySelectorAll(
        'input[type="hidden"][name="fruits"]',
      );
      expect(hiddenInputs).toHaveLength(2);

      // Remove apple via tag remove button
      const removeButtons = container.querySelectorAll(
        '[data-ck="multi-select-tag-remove"]',
      );
      await user.click(removeButtons[0]);

      hiddenInputs = container.querySelectorAll(
        'input[type="hidden"][name="fruits"]',
      );
      expect(hiddenInputs).toHaveLength(1);
      expect(hiddenInputs[0]).toHaveValue("banana");
    });

    it("has correct values on hidden inputs after selecting items", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          name="fruits"
          openOnFocus={false}
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));
      await user.click(screen.getByRole("option", { name: "cherry" }));

      const hiddenInputs = container.querySelectorAll(
        'input[type="hidden"][name="fruits"]',
      );
      expect(hiddenInputs).toHaveLength(2);
      expect(hiddenInputs[0]).toHaveValue("apple");
      expect(hiddenInputs[1]).toHaveValue("cherry");
    });
  });

  describe("Required", () => {
    it("applies data-required on root when required is true", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} required />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-required", "true");
    });

    it("applies aria-required on the combobox input when required is true", () => {
      render(<MultiSelect options={["apple", "banana"]} required />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("does not have data-required when required is false", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).not.toHaveAttribute("data-required");
    });
  });

  describe("data-error", () => {
    it("is present on root when error is true", () => {
      const { container } = render(
        <MultiSelect error options={["apple", "banana"]} />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).toHaveAttribute("data-error", "true");
    });

    it("is not present when error is false", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const root = container.querySelector('[data-ck="multi-select"]');
      expect(root).not.toHaveAttribute("data-error");
    });
  });

  describe("data-empty on Content", () => {
    it("is present on dropdown content when filtering yields no results", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "xyz");

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      );
      expect(content).toHaveAttribute("data-empty", "true");
    });

    it("is not present when items exist", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      );
      expect(content).not.toHaveAttribute("data-empty");
    });
  });

  describe("Live Region", () => {
    it("renders live region element with data-ck='multi-select-live'", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      expect(liveRegion).toBeInTheDocument();
    });

    it("has aria-live='polite' and role='status'", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
      expect(liveRegion).toHaveAttribute("role", "status");
    });
  });

  describe("Icon Slot", () => {
    it("has icon slot with data-slot='icon' inside the toggle trigger", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector(
        '[data-ck="multi-select-trigger"]',
      );
      const iconSlot = trigger?.querySelector('[data-slot="icon"]');
      expect(iconSlot).toBeInTheDocument();
    });

    it("icon slot has aria-hidden='true'", () => {
      const { container } = render(
        <MultiSelect options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector(
        '[data-ck="multi-select-trigger"]',
      );
      const iconSlot = trigger?.querySelector('[data-slot="icon"]');
      expect(iconSlot).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Item Icon Slot", () => {
    it("renders trailing icon slot inside each dropdown item", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      for (const item of items) {
        const iconSlot = item.querySelector('[data-slot="icon"]');
        expect(iconSlot).toBeInTheDocument();
        expect(iconSlot).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("renders trailing icon slot inside grouped items", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
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

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(2);
      for (const item of items) {
        const iconSlot = item.querySelector('[data-slot="icon"]');
        expect(iconSlot).toBeInTheDocument();
        expect(iconSlot).toHaveAttribute("aria-hidden", "true");
      }
    });
  });

  describe("Toggle Deselect", () => {
    it("deselects item when clicking a checked item in dropdown", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          openOnFocus={false}
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));

      expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    });

    it("deselects item via Enter on a checked item", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      // First item is apple (highlighted by default on open)
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it("does not deselect fixed values via dropdown click", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          fixedValues={["apple"]}
          openOnFocus={false}
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));

      // Fixed value should not be deselected
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("text filter applies to both selected and unselected items", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          options={["apple", "apricot", "banana"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "ap");

      const items = document.querySelectorAll('[data-ck="multi-select-item"]');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("apple");
      expect(items[1]).toHaveTextContent("apricot");

      // Selected item should still show checked state
      expect(items[0]).toHaveAttribute("data-state", "checked");
      expect(items[1]).toHaveAttribute("data-state", "unchecked");
    });
  });

  describe("aria-orientation on Listbox", () => {
    it("has aria-orientation='vertical' on the listbox when open", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("aria-orientation", "vertical");
    });
  });

  describe("Clearable Prop", () => {
    it("shows clear button when clearable is true and items are selected", () => {
      const { container } = render(
        <MultiSelect
          clearable
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      expect(clearButton).toBeInTheDocument();
    });

    it("does not show clear button when clearable is true but no items selected", () => {
      const { container } = render(
        <MultiSelect clearable options={["apple", "banana", "cherry"]} />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      expect(clearButton).not.toBeInTheDocument();
    });

    it("clears all selected items when clear button is clicked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          clearable
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      await user.click(clearButton!);

      expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it("refocuses input after clearing all selections", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          clearable
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      await user.click(clearButton!);

      const input = screen.getByRole("combobox");
      expect(input).toHaveFocus();
    });

    it("does not show clear button when disabled", () => {
      const { container } = render(
        <MultiSelect
          clearable
          defaultValue={["apple"]}
          disabled
          options={["apple", "banana", "cherry"]}
        />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      expect(clearButton).not.toBeInTheDocument();
    });

    it("does not show clear button when readOnly", () => {
      const { container } = render(
        <MultiSelect
          clearable
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
          readOnly
        />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      expect(clearButton).not.toBeInTheDocument();
    });

    it("clear button has aria-label 'Clear all selections'", () => {
      const { container } = render(
        <MultiSelect
          clearable
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      expect(clearButton).toHaveAttribute("aria-label", "Clear all selections");
    });

    it("clear button is removed from tab order (tabIndex -1)", () => {
      const { container } = render(
        <MultiSelect
          clearable
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      expect(clearButton).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Token Separators", () => {
    it("splits input by comma separator", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={["apple", "banana", "cherry"]}
          tokenSeparators={[","]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "apple,banana");

      expect(onValueChange).toHaveBeenCalledWith(["apple", "banana"]);
    });

    it("handles paste with token separators", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={["apple", "banana", "cherry"]}
          tokenSeparators={[",", ";"]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Simulate paste
      await user.paste("apple,banana;cherry");

      expect(onValueChange).toHaveBeenCalled();
      const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1];
      expect(lastCall[0]).toContain("apple");
      expect(lastCall[0]).toContain("banana");
      expect(lastCall[0]).toContain("cherry");
    });

    it("ignores unrecognized tokens", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={["apple", "banana", "cherry"]}
          tokenSeparators={[","]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "apple,unknown,banana");

      expect(onValueChange).toHaveBeenCalled();
      const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1];
      expect(lastCall[0]).toContain("apple");
      expect(lastCall[0]).toContain("banana");
      expect(lastCall[0]).not.toContain("unknown");
    });

    it("respects maxSelected limit with token separators", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          maxSelected={2}
          options={["apple", "banana", "cherry", "date"]}
          tokenSeparators={[","]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "apple,banana,cherry,date");

      expect(onValueChange).toHaveBeenCalled();
      const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1];
      expect(lastCall[0].length).toBeLessThanOrEqual(2);
    });

    it("does not add duplicate items via tokens", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          options={["apple", "banana", "cherry"]}
          tokenSeparators={[","]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "apple,banana");

      // Should only add banana since apple is already selected
      const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1];
      expect(lastCall[0]).toEqual(["apple", "banana"]);
    });

    it("does not split input when no tokenSeparators prop is provided", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={["apple", "banana", "cherry", "apple,banana"]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "apple,banana");

      // Without tokenSeparators, comma is treated as normal text — no split
      // onValueChange should NOT have been called with multiple items from splitting
      if (onValueChange.mock.calls.length > 0) {
        const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1];
        // Should not auto-split into ["apple", "banana"]
        expect(lastCall[0]).not.toEqual(["apple", "banana"]);
      }
    });

    it("fires single onValueChange when adding multiple tokens", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={["apple", "banana", "cherry"]}
          tokenSeparators={[","]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      // Use paste instead of type to trigger token processing once
      await user.paste("apple,banana,cherry");

      // Should fire once with all three items (single state update from setSelectedItems)
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith(["apple", "banana", "cherry"]);
    });
  });

  describe("Fixed Values", () => {
    it("renders fixed tags without remove buttons", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          fixedValues={["apple"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(2);

      // Apple tag should be fixed (no remove button)
      const appleTag = tags[0];
      expect(appleTag).toHaveAttribute("data-fixed", "true");
      const appleRemoveButton = appleTag.querySelector(
        '[data-ck="multi-select-tag-remove"]',
      );
      expect(appleRemoveButton).not.toBeInTheDocument();

      // Banana tag should have remove button
      const bananaTag = tags[1];
      expect(bananaTag).not.toHaveAttribute("data-fixed");
      const bananaRemoveButton = bananaTag.querySelector(
        '[data-ck="multi-select-tag-remove"]',
      );
      expect(bananaRemoveButton).toBeInTheDocument();
    });

    it("prevents removing fixed values with Backspace", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple"]}
          fixedValues={["apple"]}
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      input.focus();

      // Try to remove with Backspace
      await user.keyboard("{Backspace}");

      // Should not have called onValueChange (item is fixed)
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("allows removing non-fixed values with Backspace", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          fixedValues={["apple"]}
          options={["apple", "banana", "cherry"]}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      input.focus();

      // Remove last tag (banana, which is not fixed)
      await user.keyboard("{Backspace}");

      expect(onValueChange).toHaveBeenCalledWith(["apple"]);
    });

    it("preserves fixed values when clearing all", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          clearable
          defaultValue={["apple", "banana", "cherry"]}
          fixedValues={["apple"]}
          options={["apple", "banana", "cherry", "date"]}
          onValueChange={onValueChange}
        />,
      );

      const clearButton = container.querySelector(
        '[data-ck="multi-select-clear"]',
      );
      await user.click(clearButton!);

      // Should only keep fixed value "apple"
      expect(onValueChange).toHaveBeenCalledWith(["apple"]);
    });

    it("applies data-fixed attribute to fixed tags", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          fixedValues={["banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags[0]).not.toHaveAttribute("data-fixed");
      expect(tags[1]).toHaveAttribute("data-fixed", "true");
    });
  });

  describe("Live Region Announcements", () => {
    it("announces item selection with count", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect openOnFocus={false} options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      expect(liveRegion).toHaveTextContent(/apple selected.*1 item selected/i);
    });

    it("announces item removal with count", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const removeButtons = container.querySelectorAll(
        '[data-ck="multi-select-tag-remove"]',
      );
      await user.click(removeButtons[0]);

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      expect(liveRegion).toHaveTextContent(/apple deselected.*1 item selected/i);
    });

    it("clears announcement after 1000ms", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect openOnFocus={false} options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      expect(liveRegion).toHaveTextContent(/apple selected/i);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(liveRegion).toHaveTextContent("");
      vi.useRealTimers();
    });

    it("uses plural form for multiple items", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple"]}
          openOnFocus={false}
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "banana" }));

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      expect(liveRegion).toHaveTextContent(/banana selected.*2 items selected/i);
    });
  });

  describe("Result Count Announcement", () => {
    it("announces result count after typing", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "a");

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      await vi.waitFor(() => {
        expect(liveRegion).toHaveTextContent("2 results available");
      });
    });

    it("announces filtered result count after narrowing search", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={["apple", "apricot", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.type(screen.getByRole("combobox"), "appl");

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      await vi.waitFor(() => {
        expect(liveRegion).toHaveTextContent("1 result available");
      });
    });
  });

  describe("Tag Overflow Accessibility", () => {
    it("overflow badge has descriptive aria-label", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana", "cherry", "date"]}
          maxDisplayedTags={2}
          options={["apple", "banana", "cherry", "date"]}
        />,
      );

      const overflow = container.querySelector(
        '[data-ck="multi-select-tag-overflow"]',
      );
      expect(overflow).toBeInTheDocument();
      expect(overflow).toHaveAttribute(
        "aria-label",
        "2 more selected items not shown",
      );
    });

    it("shows no overflow badge when selected count equals maxDisplayedTags", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana", "cherry"]}
          maxDisplayedTags={3}
          options={["apple", "banana", "cherry", "date"]}
        />,
      );

      const tags = container.querySelectorAll('[data-ck="multi-select-tag"]');
      expect(tags).toHaveLength(3);

      const overflow = container.querySelector(
        '[data-ck="multi-select-tag-overflow"]',
      );
      expect(overflow).not.toBeInTheDocument();
    });

    it("overflow badge uses singular form for 1 hidden item", () => {
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana", "cherry"]}
          maxDisplayedTags={2}
          options={["apple", "banana", "cherry"]}
        />,
      );

      const overflow = container.querySelector(
        '[data-ck="multi-select-tag-overflow"]',
      );
      expect(overflow).toHaveAttribute(
        "aria-label",
        "1 more selected item not shown",
      );
    });
  });

  describe("Deselection Announcement", () => {
    it("announces 'deselected' when toggling off via dropdown", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          defaultValue={["apple", "banana"]}
          openOnFocus={false}
          options={["apple", "banana", "cherry"]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));

      const liveRegion = container.querySelector(
        '[data-ck="multi-select-live"]',
      );
      expect(liveRegion).toHaveTextContent(/apple deselected.*1 item selected/i);
    });
  });

  describe("onBlur and onFocus Callbacks", () => {
    it("calls onFocus when input receives focus", async () => {
      const onFocus = vi.fn();
      const user = userEvent.setup();

      render(
        <MultiSelect options={["apple", "banana"]} onFocus={onFocus} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onFocus).toHaveBeenCalledWith(expect.any(Object)); // FocusEvent
    });

    it("calls onBlur when input loses focus", async () => {
      const onBlur = vi.fn();
      const user = userEvent.setup();

      render(<MultiSelect options={["apple", "banana"]} onBlur={onBlur} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.tab(); // Move focus away

      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith(expect.any(Object)); // FocusEvent
    });
  });

  describe("autoFocus", () => {
    it("focuses the input on mount when autoFocus is true", () => {
      render(<MultiSelect autoFocus options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveFocus();
    });

    it("does not focus input on mount when autoFocus is false", () => {
      render(<MultiSelect options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).not.toHaveFocus();
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
      render(<MultiSelect openOnFocus={false} options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      );
      expect(content).toHaveAttribute("data-state", "open");
    });

    it("sets data-state='closed' on content before unmounting", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      expect(
        document.querySelector('[data-ck="multi-select-content"]'),
      ).toBeInTheDocument();

      await user.keyboard("{Escape}");

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      );
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-state", "closed");
    });

    it("hides positioner after exit duration", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{Escape}");

      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Content stays in DOM but positioner is marked unmounted
      const positioner = document.querySelector('[data-ck="multi-select-positioner"]');
      expect(positioner).toHaveAttribute("data-unmounted");
    });

    it("disables pointer events during exit animation", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{Escape}");

      const content = document.querySelector(
        '[data-ck="multi-select-content"]',
      ) as HTMLElement;
      // Positioner wrapper uses data attributes instead of inline styles
      expect(content.parentElement!).toHaveAttribute("data-ck", "multi-select-positioner");
      expect(content.parentElement!).toHaveAttribute("data-state", "closed");
    });
  });
});
