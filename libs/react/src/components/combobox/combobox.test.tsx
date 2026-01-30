import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Combobox } from "./combobox";

describe("Combobox Component", () => {
  describe("Basic Rendering", () => {
    it("renders with data-ck='combobox' on root", () => {
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toBeInTheDocument();
      expect(combobox).toHaveAttribute("data-state", "closed");
    });

    it("renders input element with data-ck='combobox-input'", () => {
      const { container } = render(<Combobox options={["apple", "banana"]} />);

      const input = container.querySelector('[data-ck="combobox-input"]');
      expect(input).toBeInTheDocument();
      expect(input?.tagName).toBe("INPUT");
    });

    it("renders trigger button with data-ck='combobox-trigger'", () => {
      const { container } = render(<Combobox options={["apple", "banana"]} />);

      const trigger = container.querySelector('[data-ck="combobox-trigger"]');
      expect(trigger).toBeInTheDocument();
      expect(trigger?.tagName).toBe("BUTTON");
    });

    it("renders placeholder text in input", () => {
      render(
        <Combobox
          options={["apple", "banana"]}
          placeholder="Search fruits..."
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "Search fruits...");
    });

    it("applies variantName as data-variant attribute", () => {
      const { container } = render(
        <Combobox options={["apple"]} variantName="primary" />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-variant", "primary");
    });

    it("passes through HTML attributes", () => {
      const { container } = render(
        <Combobox
          id="my-combobox"
          className="custom-combobox"
          data-testid="combobox-root"
          options={["apple"]}
        />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("id", "my-combobox");
      expect(combobox).toHaveClass("custom-combobox");
      expect(combobox).toHaveAttribute("data-testid", "combobox-root");
    });

    it("forwards ref to div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Combobox options={["apple"]} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("has displayName", () => {
      expect((Combobox as { displayName?: string }).displayName).toBe(
        "Combobox",
      );
    });
  });

  describe("Labeled Options", () => {
    it("renders options with explicit labels when opened", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
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
      render(<Combobox options={[{ value: "apple" }, { value: "banana" }]} />);

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("apple")).toBeInTheDocument();
      expect(screen.getByText("banana")).toBeInTheDocument();
    });
  });

  describe("Grouped Options", () => {
    it("renders grouped options with group labels", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
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
      const { container } = render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { type: "separator" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const separator = container.querySelector(
        '[data-ck="combobox-separator"]',
      );
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("role", "separator");
    });
  });

  describe("Disabled Items", () => {
    it("renders disabled items with aria-disabled", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana (Out of Stock)", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      expect(items[0]).not.toHaveAttribute("aria-disabled");
      expect(items[1]).toHaveAttribute("aria-disabled", "true");
      expect(items[1]).toHaveAttribute("data-disabled", "true");
    });

    it("skips disabled items during keyboard navigation", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
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

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      const disabledItem = items[1];
      expect(disabledItem).not.toHaveAttribute("data-highlighted", "true");
    });
  });

  describe("Filtering", () => {
    it("filters options based on input text", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "ban");

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("banana");
    });

    it("shows all options when input is empty", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(3);
    });

    it("shows empty state when no options match", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "xyz");

      const emptyState = container.querySelector('[data-ck="combobox-empty"]');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveTextContent("No results found");
    });

    it("uses custom filterFn when provided", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          filterFn={(option, inputValue) =>
            option.label.toLowerCase().startsWith(inputValue.toLowerCase())
          }
          options={["apple", "apricot", "banana"]}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "ap");

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("apple");
      expect(items[1]).toHaveTextContent("apricot");
    });

    it("preserves group labels when group has visible children", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          options={[
            {
              label: "Fruits",
              options: ["apple", "banana"],
              type: "group",
            },
            { type: "separator" },
            {
              label: "Vegetables",
              options: ["carrot", "celery"],
              type: "group",
            },
          ]}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "ap");

      expect(screen.getByText("Fruits")).toBeInTheDocument();
      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("apple");
    });

    it("removes empty groups when all children filtered out", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={[
            {
              label: "Fruits",
              options: ["apple", "banana"],
              type: "group",
            },
            { type: "separator" },
            {
              label: "Vegetables",
              options: ["carrot", "celery"],
              type: "group",
            },
          ]}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "car");

      expect(screen.queryByText("Fruits")).not.toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
      expect(screen.getByText("carrot")).toBeInTheDocument();
    });
  });

  describe("Controlled Mode", () => {
    it("respects controlled value", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="banana"
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      const bananaOption = options.find((opt) => opt.textContent === "Banana");
      expect(bananaOption).toHaveAttribute("aria-selected", "true");
    });

    it("calls onValueChange when selection changes", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Combobox
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

    it("updates display when controlled value changes via rerender", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="apple"
        />,
      );

      await user.click(screen.getByRole("combobox"));
      let options = screen.getAllByRole("option");
      const appleOption = options.find((opt) => opt.textContent === "Apple");
      expect(appleOption).toHaveAttribute("aria-selected", "true");

      rerender(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="banana"
        />,
      );

      options = screen.getAllByRole("option");
      const bananaOption = options.find((opt) => opt.textContent === "Banana");
      expect(bananaOption).toHaveAttribute("aria-selected", "true");
    });

    it("respects controlled inputValue", () => {
      render(
        <Combobox inputValue="ban" options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("ban");
    });

    it("calls onInputValueChange when input text changes", async () => {
      const onInputValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Combobox
          options={["apple", "banana", "cherry"]}
          onInputValueChange={onInputValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "a");

      expect(onInputValueChange).toHaveBeenCalledWith("a");
    });
  });

  describe("Uncontrolled Mode", () => {
    it("uses defaultValue for initial selection", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          defaultValue="banana"
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      const bananaOption = options.find((opt) => opt.textContent === "Banana");
      expect(bananaOption).toHaveAttribute("aria-selected", "true");
    });

    it("uses defaultInputValue for initial input text", () => {
      render(
        <Combobox
          defaultInputValue="ban"
          options={["apple", "banana", "cherry"]}
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("ban");
    });

    it("updates selection on user interaction", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          placeholder="Search..."
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Apple" }));

      // Re-open to verify selection
      await user.click(
        container.querySelector('[data-ck="combobox-trigger"]')!,
      );

      const options = screen.getAllByRole("option");
      const appleOption = options.find((opt) => opt.textContent === "Apple");
      expect(appleOption).toHaveAttribute("aria-selected", "true");
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
        <Combobox<User>
          isEqual={(a, b) => a?.id === b?.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Alice" }));

      expect(onValueChange).toHaveBeenCalledWith(users[0]);
    });

    it("displays controlled object value", async () => {
      const user = userEvent.setup();
      render(
        <Combobox<User>
          isEqual={(a, b) => a?.id === b?.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          value={users[1]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      const bobOption = options.find((opt) => opt.textContent === "Bob");
      expect(bobOption).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Custom Rendering", () => {
    it("supports custom trigger rendering via renderTrigger", () => {
      render(
        <Combobox
          options={["apple", "banana"]}
          placeholder="Search here"
          renderTrigger={({ inputValue, placeholder }) => (
            <span data-testid="custom-trigger">
              {inputValue || placeholder}
            </span>
          )}
        />,
      );

      const trigger = screen.getByTestId("custom-trigger");
      expect(trigger).toHaveTextContent("Search here");
    });

    it("passes correct context to renderTrigger", async () => {
      render(
        <Combobox
          options={[{ label: "Apple", value: "apple" }]}
          placeholder="Search..."
          renderTrigger={({ isOpen, selectedItem }) => (
            <span data-testid="custom-trigger">
              {selectedItem?.label || "None"} - {isOpen ? "Open" : "Closed"}
            </span>
          )}
        />,
      );

      const trigger = screen.getByTestId("custom-trigger");
      expect(trigger).toHaveTextContent("None - Closed");
    });

    it("supports custom item rendering via renderItem", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          renderItem={({ isSelected, option }) => (
            <span data-testid={`item-${option.value}`}>
              {option.label}
              {isSelected && " ✓"}
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
    it("opens menu on ArrowDown from input", async () => {
      const user = userEvent.setup();
      const { container } = render(<Combobox options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      input.focus();
      await user.keyboard("{ArrowDown}");

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-state", "open");
    });

    it("navigates items with ArrowDown/ArrowUp", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      const highlightedItems = Array.from(items).filter(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(highlightedItems.length).toBe(1);

      // Navigate back up
      await user.keyboard("{ArrowUp}");

      const highlightedAfterUp = Array.from(
        container.querySelectorAll('[data-ck="combobox-item"]'),
      ).filter((item) => item.getAttribute("data-highlighted") === "true");
      expect(highlightedAfterUp.length).toBe(1);
    });

    it("selects item with Enter key and closes menu", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          options={["apple", "banana"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalled();

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-state", "closed");
    });

    it("closes menu with Escape key", async () => {
      const user = userEvent.setup();
      const { container } = render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      expect(container.querySelector('[data-ck="combobox"]')).toHaveAttribute(
        "data-state",
        "open",
      );

      await user.keyboard("{Escape}");
      expect(container.querySelector('[data-ck="combobox"]')).toHaveAttribute(
        "data-state",
        "closed",
      );
    });

    it("filters options as user types characters", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "ch");

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("cherry");
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled prop is true", () => {
      render(<Combobox disabled options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });

    it("disables trigger button when disabled", () => {
      const { container } = render(
        <Combobox disabled options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector('[data-ck="combobox-trigger"]');
      expect(trigger).toBeDisabled();
    });

    it("applies data-disabled to root when disabled", () => {
      const { container } = render(
        <Combobox disabled options={["apple", "banana"]} />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Accessibility", () => {
    it("input has role combobox", () => {
      render(<Combobox options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe("INPUT");
    });

    it("menu has role listbox", () => {
      render(<Combobox options={["apple", "banana"]} />);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });

    it("has aria-expanded on combobox element", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-expanded", "false");

      await user.click(input);
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("links combobox and listbox with aria-controls", () => {
      render(<Combobox options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      const listbox = screen.getByRole("listbox");
      const controlsId = input.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      expect(listbox).toHaveAttribute("id", controlsId);
    });

    it("marks selected item with aria-selected", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
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
      render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
    });

    it("empty state has role status", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      await user.type(input, "xyz");

      const status = screen.getByRole("status");
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent("No results found");
    });

    it("separators have role separator", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { type: "separator" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const separators = screen.getAllByRole("separator");
      expect(separators.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Data Attributes", () => {
    it("has data-state on root, trigger, and content", async () => {
      const user = userEvent.setup();
      const { container } = render(<Combobox options={["apple"]} />);

      const root = container.querySelector('[data-ck="combobox"]');
      const trigger = container.querySelector('[data-ck="combobox-trigger"]');
      const content = container.querySelector('[data-ck="combobox-content"]');

      expect(root).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("data-state", "closed");
      expect(content).toHaveAttribute("data-state", "closed");

      await user.click(screen.getByRole("combobox"));

      expect(root).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveAttribute("data-state", "open");
      expect(content).toHaveAttribute("data-state", "open");
    });

    it("has data-state checked/unchecked on items", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value="apple"
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      expect(items[0]).toHaveAttribute("data-state", "checked");
      expect(items[1]).toHaveAttribute("data-state", "unchecked");
    });

    it("has data-highlighted on highlighted item", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      const hasHighlighted = Array.from(items).some(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(hasHighlighted).toBe(true);
    });

    it("has data-disabled on disabled items", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = container.querySelectorAll('[data-ck="combobox-item"]');
      expect(items[0]).not.toHaveAttribute("data-disabled");
      expect(items[1]).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      const { container } = render(<Combobox options={[]} />);

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toBeInTheDocument();
    });

    it("handles mixed option types", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
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
      const { container } = render(
        <Combobox
          options={["apple", "banana"]}
          placeholder="Search..."
          value="nonexistent"
        />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toBeInTheDocument();

      // Input should still render with its placeholder
      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "Search...");
    });
  });
});
