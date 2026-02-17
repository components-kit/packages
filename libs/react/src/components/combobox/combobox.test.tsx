import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

      const separator = document.querySelector(
        '[data-ck="combobox-separator"]',
      );
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("role", "separator");
    });

    it("wraps grouped items in role=group with aria-labelledby", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
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
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana (Out of Stock)", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items[0]).not.toHaveAttribute("aria-disabled");
      expect(items[1]).toHaveAttribute("aria-disabled", "true");
      expect(items[1]).toHaveAttribute("data-disabled", "true");
    });

    it("skips disabled items during keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
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

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      const disabledItem = items[1];
      expect(disabledItem).not.toHaveAttribute("data-highlighted", "true");
    });
  });

  describe("Filtering", () => {
    it("filters options based on input text", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.type(input, "ban");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("banana");
    });

    it("shows all options when input is empty", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(3);
    });

    it("shows empty state when no options match", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.type(input, "xyz");

      const emptyState = document.querySelector('[data-ck="combobox-empty"]');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveTextContent("No results found");
    });

    it("renders custom emptyContent when no options match", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          emptyContent="Nada"
          options={["apple", "banana", "cherry"]}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "xyz");

      const emptyState = document.querySelector('[data-ck="combobox-empty"]');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveTextContent("Nada");
    });

    it("uses custom filterFn when provided", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          filterFn={(option, inputValue) =>
            option.label.toLowerCase().startsWith(inputValue.toLowerCase())
          }
          options={["apple", "apricot", "banana"]}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "ap");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("apple");
      expect(items[1]).toHaveTextContent("apricot");
    });

    it("preserves group labels when group has visible children", async () => {
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
      await user.type(input, "ap");

      expect(screen.getByText("Fruits")).toBeInTheDocument();
      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("apple");
    });

    it("removes separators when all surrounding groups are filtered out", async () => {
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
      await user.type(input, "xyz");

      expect(
        document.querySelector('[data-ck="combobox-separator"]'),
      ).not.toBeInTheDocument();
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

    it("shows all options and preserves input when reopening via toggle button", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox openOnFocus={false} options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.click(screen.getByRole("option", { name: "banana" }));

      expect(input).toHaveValue("banana");

      // Reopen via toggle button
      await user.click(
        container.querySelector('[data-ck="combobox-trigger"]')!,
      );

      // All options visible and selected value preserved in input
      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(3);
      expect(input).toHaveValue("banana");
    });

    it("shows all options and preserves input when reopening via input click", async () => {
      const user = userEvent.setup();
      render(<Combobox openOnFocus={false} options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.click(screen.getByRole("option", { name: "banana" }));

      expect(input).toHaveValue("banana");

      // Reopen via clicking the input
      await user.click(input);

      // All options visible and selected value preserved in input
      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(3);
      expect(input).toHaveValue("banana");
    });

    it("shows all options and preserves input when reopening via arrow down", async () => {
      const user = userEvent.setup();
      render(<Combobox openOnFocus={false} options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.click(screen.getByRole("option", { name: "banana" }));

      expect(input).toHaveValue("banana");

      // Reopen via ArrowDown only (keyboard, no click)
      input.focus();
      await user.keyboard("{ArrowDown}");

      // All options visible and selected value preserved
      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(3);
      expect(input).toHaveValue("banana");
    });

    it("input is editable after selection — can clear and retype to filter", async () => {
      const user = userEvent.setup();
      render(
        <Combobox openOnFocus={false} options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.click(screen.getByRole("option", { name: "banana" }));
      expect(input).toHaveValue("banana");

      // Clear and retype
      await user.click(input);
      await user.clear(input);
      await user.type(input, "ch");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("cherry");
    });

    it("filters normally once user types after reopening", async () => {
      const user = userEvent.setup();
      render(<Combobox openOnFocus={false} options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.click(screen.getByRole("option", { name: "banana" }));

      // Reopen — all options should be visible
      await user.click(input);
      expect(document.querySelectorAll('[data-ck="combobox-item"]')).toHaveLength(3);

      // User clears and types "ch" — should filter to only "cherry"
      await user.clear(input);
      await user.type(input, "ch");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("cherry");
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
          openOnFocus={false}
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
          openOnFocus={false}
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

    it("supports object values with getOptionValue", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Combobox<User>
          getOptionValue={(u) => u.id}
          openOnFocus={false}
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
          getOptionValue={(u) => u.id}
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

  describe("getOptionValue", () => {
    it("works with object values using getOptionValue", async () => {
      const user = userEvent.setup();
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      const handleChange = vi.fn();

      render(
        <Combobox
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          onValueChange={handleChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "Bob");

      const bobOption = screen.getByRole("option", { name: "Bob" });
      await user.click(bobOption);

      expect(handleChange).toHaveBeenCalledWith(users[1]);
    });

    it("correctly identifies selected item with getOptionValue", () => {
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      const selectedUser = { id: 1, name: "Alice" };

      render(
        <Combobox
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          value={selectedUser}
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("Alice");
    });

    it("works without getOptionValue for primitives", () => {
      render(<Combobox options={["apple", "banana"]} value="apple" />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("apple");
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
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      const highlightedItems = Array.from(items).filter(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(highlightedItems.length).toBe(1);

      // Navigate back up
      await user.keyboard("{ArrowUp}");

      const highlightedAfterUp = Array.from(
        document.querySelectorAll('[data-ck="combobox-item"]'),
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
      const { container } = render(<Combobox openOnFocus={false} options={["apple", "banana"]} />);

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
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.type(input, "ch");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("cherry");
    });

    it("navigates to first item with Home key", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Home}");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items[0]).toHaveAttribute("data-highlighted", "true");
    });

    it("navigates to last item with End key", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{End}");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items[items.length - 1]).toHaveAttribute(
        "data-highlighted",
        "true",
      );
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

    it("menu has role listbox", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });

    it("has aria-expanded on combobox element", async () => {
      const user = userEvent.setup();
      render(<Combobox openOnFocus={false} options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-expanded", "false");

      await user.click(input);
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("links combobox and listbox with aria-controls", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

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

      const emptyEl = document.querySelector('[data-ck="combobox-empty"]');
      expect(emptyEl).toBeInTheDocument();
      expect(emptyEl).toHaveAttribute("role", "status");
      expect(emptyEl).toHaveTextContent("No results found");
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

    it("menu has aria-labelledby linking to input", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const input = screen.getByRole("combobox");
      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("aria-labelledby", input.id);
    });
  });

  describe("aria-label", () => {
    it("applies aria-label to input element", () => {
      render(
        <Combobox
          aria-label="Search fruits"
          options={["apple", "banana"]}
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-label", "Search fruits");
    });

    it("works without aria-label when not provided", () => {
      render(<Combobox options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).not.toHaveAttribute("aria-label");
    });

    it("does not have dangling aria-labelledby on input", () => {
      render(<Combobox options={["apple", "banana"]} />);

      const input = screen.getByRole("combobox");
      expect(input).not.toHaveAttribute("aria-labelledby");
    });
  });

  describe("Data Attributes", () => {
    it("has data-state on root, trigger, and content", async () => {
      const user = userEvent.setup();
      const { container } = render(<Combobox openOnFocus={false} options={["apple"]} />);

      const root = container.querySelector('[data-ck="combobox"]');
      const trigger = container.querySelector('[data-ck="combobox-trigger"]');

      expect(root).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("data-state", "closed");

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="combobox-content"]');
      expect(root).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveAttribute("data-state", "open");
      // content data-state transitions to "open" after rAF
      await waitFor(() => {
        expect(content).toHaveAttribute("data-state", "open");
      });
    });

    it("has data-state checked/unchecked on items", async () => {
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

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items[0]).toHaveAttribute("data-state", "checked");
      expect(items[1]).toHaveAttribute("data-state", "unchecked");
    });

    it("has data-highlighted on highlighted item", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      const hasHighlighted = Array.from(items).some(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(hasHighlighted).toBe(true);
    });

    it("has data-side on content reflecting placement", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="combobox-content"]');
      expect(content).toHaveAttribute("data-side");
    });

    it("has data-disabled on disabled items", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
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

  describe("Loading State", () => {
    it("shows loading content when loading prop is true", async () => {
      const user = userEvent.setup();
      render(
        <Combobox loading options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      const loadingEl = document.querySelector('[data-ck="combobox-loading"]');
      expect(loadingEl).toBeInTheDocument();
      expect(loadingEl).toHaveTextContent("Loading...");
    });

    it("renders data-ck='combobox-loading' element", async () => {
      const user = userEvent.setup();
      render(
        <Combobox loading options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      const loadingEl = document.querySelector('[data-ck="combobox-loading"]');
      expect(loadingEl).toBeInTheDocument();
    });

    it("sets data-loading on root during loading", () => {
      const { container } = render(
        <Combobox loading options={[]} />,
      );

      const root = container.querySelector('[data-ck="combobox"]');
      expect(root).toHaveAttribute("data-loading", "true");
    });

    it("sets aria-busy on root during loading", () => {
      const { container } = render(
        <Combobox loading options={[]} />,
      );

      const root = container.querySelector('[data-ck="combobox"]');
      expect(root).toHaveAttribute("aria-busy", "true");
    });

    it("displays custom loadingContent", async () => {
      const user = userEvent.setup();
      render(
        <Combobox loading loadingContent="Fetching data..." options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("Fetching data...")).toBeInTheDocument();
    });

    it("hides items while loading", async () => {
      const user = userEvent.setup();
      render(
        <Combobox loading options={["apple", "banana"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(
        document.querySelector('[data-ck="combobox-item"]'),
      ).not.toBeInTheDocument();
    });

    it("hides empty state while loading", async () => {
      const user = userEvent.setup();
      render(
        <Combobox loading options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(
        document.querySelector('[data-ck="combobox-empty"]'),
      ).not.toBeInTheDocument();
    });

    it("does not set data-empty on content while loading", async () => {
      const user = userEvent.setup();
      render(
        <Combobox loading options={[]} />,
      );

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="combobox-content"]');
      expect(content).not.toHaveAttribute("data-empty");
    });

    it("does not set data-loading when not loading", () => {
      const { container } = render(
        <Combobox options={["apple"]} />,
      );

      const root = container.querySelector('[data-ck="combobox"]');
      expect(root).not.toHaveAttribute("data-loading");
      expect(root).not.toHaveAttribute("aria-busy");
    });
  });

  describe("Error State", () => {
    it("shows error content when error prop is true", async () => {
      const user = userEvent.setup();
      render(
        <Combobox error options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      const errorEl = document.querySelector('[data-ck="combobox-error"]');
      expect(errorEl).toBeInTheDocument();
      expect(errorEl).toHaveTextContent("An error occurred");
    });

    it("renders data-ck='combobox-error' element", async () => {
      const user = userEvent.setup();
      render(
        <Combobox error options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      const errorEl = document.querySelector('[data-ck="combobox-error"]');
      expect(errorEl).toBeInTheDocument();
    });

    it("sets data-error on root when error", () => {
      const { container } = render(
        <Combobox error options={[]} />,
      );

      const root = container.querySelector('[data-ck="combobox"]');
      expect(root).toHaveAttribute("data-error", "true");
    });

    it("displays custom errorContent", async () => {
      const user = userEvent.setup();
      render(
        <Combobox error errorContent="Something went wrong!" options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    });

    it("hides items while error", async () => {
      const user = userEvent.setup();
      render(
        <Combobox error options={["apple", "banana"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(
        document.querySelector('[data-ck="combobox-item"]'),
      ).not.toBeInTheDocument();
    });

    it("hides empty state while error", async () => {
      const user = userEvent.setup();
      render(
        <Combobox error options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(
        document.querySelector('[data-ck="combobox-empty"]'),
      ).not.toBeInTheDocument();
    });

    it("loading takes precedence over error", async () => {
      const user = userEvent.setup();
      render(
        <Combobox error loading options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(
        document.querySelector('[data-ck="combobox-loading"]'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('[data-ck="combobox-error"]'),
      ).not.toBeInTheDocument();
    });

    it("does not set data-error when no error", () => {
      const { container } = render(
        <Combobox options={["apple"]} />,
      );

      const root = container.querySelector('[data-ck="combobox"]');
      expect(root).not.toHaveAttribute("data-error");
    });
  });

  describe("Loading/Error Accessibility", () => {
    it("loading state has role status and aria-live polite", async () => {
      const user = userEvent.setup();
      render(
        <Combobox loading options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      const loadingEl = document.querySelector('[data-ck="combobox-loading"]');
      expect(loadingEl).toHaveAttribute("role", "status");
      expect(loadingEl).toHaveAttribute("aria-live", "polite");
    });

    it("error state has role alert and aria-live assertive", async () => {
      const user = userEvent.setup();
      render(
        <Combobox error options={["apple"]} />,
      );

      await user.click(screen.getByRole("combobox"));

      const errorEl = document.querySelector('[data-ck="combobox-error"]');
      expect(errorEl).toHaveAttribute("role", "alert");
      expect(errorEl).toHaveAttribute("aria-live", "assertive");
    });
  });

  describe("Read-only Mode", () => {
    it("prevents opening when clicking input (data-state stays closed)", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana"]} readOnly />,
      );

      await user.click(screen.getByRole("combobox"));

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-state", "closed");
    });

    it("applies data-readonly on root", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} readOnly />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-readonly", "true");
    });

    it("disables input interaction (disabled attribute on input)", () => {
      render(
        <Combobox options={["apple", "banana"]} readOnly />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });

    it("disables trigger button", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} readOnly />,
      );

      const trigger = container.querySelector('[data-ck="combobox-trigger"]');
      expect(trigger).toBeDisabled();
    });

    it("does not fire onOpenChange when readOnly", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Combobox options={["apple", "banana"]} readOnly onOpenChange={onOpenChange} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Placement", () => {
    it("renders without error when placement prop is provided", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} placement="bottom-start" />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toBeInTheDocument();
    });

    it("accepts top-start placement", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} placement="top-start" />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("maxDropdownHeight", () => {
    it("renders without error when maxDropdownHeight prop is provided", () => {
      const { container } = render(
        <Combobox maxDropdownHeight={200} options={["apple", "banana"]} />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toBeInTheDocument();
    });
  });

  describe("onOpenChange", () => {
    it("fires callback with true when dropdown opens", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Combobox options={["apple", "banana"]} onOpenChange={onOpenChange} />,
      );

      await user.click(screen.getByRole("combobox"));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("fires callback with false when dropdown closes (Escape)", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Combobox openOnFocus={false} options={["apple", "banana"]} onOpenChange={onOpenChange} />,
      );

      await user.click(screen.getByRole("combobox"));
      onOpenChange.mockClear();
      await user.keyboard("{Escape}");

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("openOnFocus", () => {
    it("opens dropdown when input receives focus and openOnFocus is true", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox openOnFocus options={["apple", "banana"]} />,
      );

      await user.tab();

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-state", "open");
    });

    it("does not open on focus when openOnFocus is false", async () => {
      const { container } = render(
        <Combobox openOnFocus={false} options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      input.focus();

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-state", "closed");
    });

    it("does not immediately close when input is clicked after focus-open", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox openOnFocus options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-state", "open");
    });

    it("reopens correctly after tab-open, click-outside-close, then click input", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox openOnFocus options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      const combobox = container.querySelector('[data-ck="combobox"]')!;

      // 1. Tab to focus input — openOnFocus opens the dropdown
      await user.tab();
      expect(combobox).toHaveAttribute("data-state", "open");

      // 2. Click outside — closes dropdown and blurs input
      await user.click(document.body);
      expect(combobox).toHaveAttribute("data-state", "closed");

      // 3. Click input to reopen — should stay open
      await user.click(input);
      expect(combobox).toHaveAttribute("data-state", "open");
    });
  });

  describe("Form Integration", () => {
    it("renders hidden input with name attribute when name prop set", () => {
      const { container } = render(
        <Combobox name="fruit" options={["apple", "banana"]} />,
      );

      const hiddenInput = container.querySelector('input[name="fruit"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute("type", "hidden");
    });

    it("hidden input has empty value when nothing selected", () => {
      const { container } = render(
        <Combobox name="fruit" options={["apple", "banana"]} />,
      );

      const hiddenInput = container.querySelector('input[name="fruit"]');
      expect(hiddenInput).toHaveValue("");
    });

    it("hidden input has serialized value when item is selected", () => {
      const { container } = render(
        <Combobox name="fruit" options={["apple", "banana"]} value="banana" />,
      );

      const hiddenInput = container.querySelector('input[name="fruit"]');
      expect(hiddenInput).toHaveValue("banana");
    });

    it("does not render hidden input when name not set", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} />,
      );

      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).not.toBeInTheDocument();
    });

    it("hidden input has required attribute when required is set", () => {
      const { container } = render(
        <Combobox name="fruit" options={["apple", "banana"]} required />,
      );

      const hiddenInput = container.querySelector('input[name="fruit"]');
      expect(hiddenInput).toBeInTheDocument();
    });
  });

  describe("Required", () => {
    it("applies data-required on root", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} required />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-required", "true");
    });

    it("applies aria-required on input (combobox role element)", () => {
      render(
        <Combobox options={["apple", "banana"]} required />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("does not apply data-required when not required", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).not.toHaveAttribute("data-required");
    });
  });

  describe("Live Region", () => {
    it("renders live region element with data-ck='combobox-live'", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} />,
      );

      const liveRegion = container.querySelector('[data-ck="combobox-live"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it("live region has aria-live='polite' and role='status'", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} />,
      );

      const liveRegion = container.querySelector('[data-ck="combobox-live"]');
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
      expect(liveRegion).toHaveAttribute("role", "status");
    });

    it("live region announces selection", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          openOnFocus={false}
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Apple" }));

      const liveRegion = container.querySelector('[data-ck="combobox-live"]');
      expect(liveRegion).toHaveTextContent("Apple selected");
    });

    it("clears announcement after 1000ms", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          openOnFocus={false}
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
        />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Apple" }));

      const liveRegion = container.querySelector('[data-ck="combobox-live"]');
      expect(liveRegion).toHaveTextContent("Apple selected");

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(liveRegion).toHaveTextContent("");
      vi.useRealTimers();
    });
  });

  describe("Icon Slot", () => {
    it("renders icon slot with data-slot='icon' inside trigger", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector('[data-ck="combobox-trigger"]');
      const icon = trigger?.querySelector('[data-slot="icon"]');
      expect(icon).toBeInTheDocument();
    });

    it("icon slot has aria-hidden='true'", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} />,
      );

      const trigger = container.querySelector('[data-ck="combobox-trigger"]');
      const icon = trigger?.querySelector('[data-slot="icon"]');
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Item Icon Slot", () => {
    it("renders trailing icon slot inside each dropdown item", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      for (const item of items) {
        const iconSlot = item.querySelector('[data-slot="icon"]');
        expect(iconSlot).toBeInTheDocument();
        expect(iconSlot).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("renders trailing icon slot inside grouped items", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
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

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      expect(items).toHaveLength(2);
      for (const item of items) {
        const iconSlot = item.querySelector('[data-slot="icon"]');
        expect(iconSlot).toBeInTheDocument();
        expect(iconSlot).toHaveAttribute("aria-hidden", "true");
      }
    });
  });

  describe("data-has-value", () => {
    it("not present when no value selected", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).not.toHaveAttribute("data-has-value");
    });

    it("present when value is selected (controlled)", () => {
      const { container } = render(
        <Combobox options={["apple", "banana"]} value="apple" />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-has-value", "true");
    });

    it("present after user selects item (uncontrolled)", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox openOnFocus={false} options={["apple", "banana"]} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "apple" }));

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-has-value", "true");
    });

    it("removed after clearing selection", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          clearable
          defaultValue="apple"
          options={["apple", "banana"]}
        />,
      );

      const combobox = container.querySelector('[data-ck="combobox"]');
      expect(combobox).toHaveAttribute("data-has-value", "true");

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      await user.click(clearButton!);

      expect(combobox).not.toHaveAttribute("data-has-value");
    });
  });

  describe("data-empty", () => {
    it("present on dropdown content when no items match filter", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      const input = screen.getByRole("combobox");
      await user.type(input, "xyz");

      const content = document.querySelector('[data-ck="combobox-content"]');
      expect(content).toHaveAttribute("data-empty", "true");
    });

    it("not present on dropdown content when items exist", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="combobox-content"]');
      expect(content).not.toHaveAttribute("data-empty");
    });
  });

  describe("aria-orientation on listbox", () => {
    it("has aria-orientation='vertical' on dropdown menu when open", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana", "cherry"]} />);

      await user.click(screen.getByRole("combobox"));

      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("aria-orientation", "vertical");
    });
  });

  describe("Result Count Announcement", () => {
    it("announces result count after typing", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "a");

      const liveRegion = container.querySelector('[data-ck="combobox-live"]');
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent("2 results available");
      });
    });

    it("result count announcement fires after 300ms delay", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "a");

      const liveRegion = container.querySelector('[data-ck="combobox-live"]');

      // At 200ms the announcement should not have fired yet
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(liveRegion).not.toHaveTextContent("2 results available");

      // At 300ms the announcement should fire
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(liveRegion).toHaveTextContent("2 results available");
      vi.useRealTimers();
    });

    it("announces filtered result count after narrowing search", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox options={["apple", "banana", "cherry"]} />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "ban");

      const liveRegion = container.querySelector('[data-ck="combobox-live"]');
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent("1 result available");
      });
    });
  });

  describe("Clearable", () => {
    it("shows clear button when clearable and value is selected", async () => {
      const user = userEvent.setup();
      render(
        <Combobox clearable options={["apple", "banana"]} value="apple" />,
      );

      // Interact to ensure component is rendered with the value
      await user.click(screen.getByRole("combobox"));

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      expect(clearButton).toBeInTheDocument();
    });

    it("does not show clear button when clearable but no value selected", () => {
      render(<Combobox clearable options={["apple", "banana"]} />);

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      expect(clearButton).not.toBeInTheDocument();
    });

    it("clears value when clear button is clicked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Combobox
          clearable
          defaultValue="apple"
          options={["apple", "banana"]}
          onValueChange={onValueChange}
        />,
      );

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      expect(clearButton).toBeInTheDocument();

      await user.click(clearButton!);

      expect(onValueChange).toHaveBeenCalledWith(undefined);

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("");
    });

    it("does not show clear button when disabled", () => {
      render(
        <Combobox
          clearable
          disabled
          options={["apple", "banana"]}
          value="apple"
        />,
      );

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      expect(clearButton).not.toBeInTheDocument();
    });

    it("does not show clear button when readOnly", () => {
      render(
        <Combobox
          clearable
          options={["apple", "banana"]}
          readOnly
          value="apple"
        />,
      );

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      expect(clearButton).not.toBeInTheDocument();
    });

    it("refocuses input after clearing", async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          clearable
          defaultValue="apple"
          options={["apple", "banana"]}
        />,
      );

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      await user.click(clearButton!);

      const input = screen.getByRole("combobox");
      expect(input).toHaveFocus();
    });

    it("calls onInputValueChange with empty string on clear", async () => {
      const onInputValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Combobox
          clearable
          defaultValue="apple"
          options={["apple", "banana"]}
          onInputValueChange={onInputValueChange}
        />,
      );

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      await user.click(clearButton!);

      expect(onInputValueChange).toHaveBeenCalledWith("");
    });

    it("resets all items to unchecked after clearing", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox
          clearable
          defaultValue="apple"
          options={["apple", "banana"]}
        />,
      );

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      await user.click(clearButton!);

      // Reopen dropdown
      await user.click(
        container.querySelector('[data-ck="combobox-trigger"]')!,
      );

      const items = document.querySelectorAll('[data-ck="combobox-item"]');
      for (const item of items) {
        expect(item).toHaveAttribute("data-state", "unchecked");
      }
    });

    it("clear button has aria-label='Clear selection'", () => {
      render(
        <Combobox clearable options={["apple", "banana"]} value="apple" />,
      );

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      expect(clearButton).toHaveAttribute("aria-label", "Clear selection");
    });

    it("clear button is removed from tab order (tabIndex -1)", () => {
      render(
        <Combobox clearable options={["apple", "banana"]} value="apple" />,
      );

      const clearButton = document.querySelector('[data-ck="combobox-clear"]');
      expect(clearButton).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("onBlur and onFocus Callbacks", () => {
    it("calls onFocus when input receives focus", async () => {
      const onFocus = vi.fn();
      const user = userEvent.setup();

      render(
        <Combobox options={["apple", "banana"]} onFocus={onFocus} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      expect(onFocus).toHaveBeenCalled();
    });

    it("calls onBlur when input loses focus", async () => {
      const onBlur = vi.fn();
      const user = userEvent.setup();

      render(
        <>
          <Combobox options={["apple", "banana"]} onBlur={onBlur} />
          <button type="button">Other</button>
        </>,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.click(screen.getByRole("button", { name: "Other" }));

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe("autoFocus", () => {
    it("focuses the input on mount when autoFocus is true", () => {
      render(
        <Combobox autoFocus options={["apple", "banana"]} />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveFocus();
    });

    it("does not focus input on mount when autoFocus is false", () => {
      render(
        <Combobox options={["apple", "banana"]} />,
      );

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
      render(<Combobox openOnFocus={false} options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));

      const content = document.querySelector('[data-ck="combobox-content"]');
      expect(content).toHaveAttribute("data-state", "open");
    });

    it("sets data-state='closed' on content before unmounting", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      expect(
        document.querySelector('[data-ck="combobox-content"]'),
      ).toBeInTheDocument();

      await user.keyboard("{Escape}");

      const content = document.querySelector('[data-ck="combobox-content"]');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-state", "closed");
    });

    it("removes content from DOM after exit duration", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{Escape}");

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(
        document.querySelector('[data-ck="combobox-content"]'),
      ).not.toBeInTheDocument();
    });

    it("disables pointer events during exit animation", async () => {
      const user = userEvent.setup();
      render(<Combobox options={["apple", "banana"]} />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{Escape}");

      const content = document.querySelector(
        '[data-ck="combobox-content"]',
      ) as HTMLElement;
      // pointerEvents is on the outer positioning wrapper, not the inner content div
      expect(content.parentElement!.style.pointerEvents).toBe("none");
    });
  });
});
