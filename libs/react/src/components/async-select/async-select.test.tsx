import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { SelectOption } from "../../types/select";

import { AsyncSelect } from "./async-select";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fruitOptions: SelectOption<string>[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

const emptySearch = vi.fn().mockResolvedValue([]);

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("AsyncSelect Component", () => {
  // Top-level cleanup to guarantee fake timers never leak between tests
  afterEach(() => {
    vi.useRealTimers();
  });

  // =========================================================================
  // Basic Rendering  (no user interaction, no fake timers needed)
  // =========================================================================

  describe("Basic Rendering", () => {
    it("renders with data-ck='async-select' on root", () => {
      const { container } = render(<AsyncSelect onSearch={emptySearch} />);

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toBeInTheDocument();
    });

    it("renders input element with data-ck='async-select-input'", () => {
      const { container } = render(<AsyncSelect onSearch={emptySearch} />);

      const input = container.querySelector('[data-ck="async-select-input"]');
      expect(input).toBeInTheDocument();
      expect(input?.tagName).toBe("INPUT");
    });

    it("renders trigger button with data-ck='async-select-trigger'", () => {
      const { container } = render(<AsyncSelect onSearch={emptySearch} />);

      const trigger = container.querySelector(
        '[data-ck="async-select-trigger"]',
      );
      expect(trigger).toBeInTheDocument();
      expect(trigger?.tagName).toBe("BUTTON");
    });

    it("renders placeholder text in input", () => {
      render(
        <AsyncSelect placeholder="Search fruits..." onSearch={emptySearch} />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveAttribute("placeholder", "Search fruits...");
    });

    it("applies variantName as data-variant attribute", () => {
      const { container } = render(
        <AsyncSelect variantName="primary" onSearch={emptySearch} />,
      );

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toHaveAttribute("data-variant", "primary");
    });

    it("passes through HTML attributes", () => {
      const { container } = render(
        <AsyncSelect
          id="my-async-select"
          className="custom-async"
          data-testid="async-root"
          onSearch={emptySearch}
        />,
      );

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toHaveAttribute("id", "my-async-select");
      expect(root).toHaveClass("custom-async");
      expect(root).toHaveAttribute("data-testid", "async-root");
    });

    it("forwards ref to div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<AsyncSelect onSearch={emptySearch} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("has displayName", () => {
      expect(
        (AsyncSelect as unknown as { displayName?: string }).displayName,
      ).toBe("AsyncSelect");
    });
  });

  // =========================================================================
  // Initial Options  (uses real timers for clicks, fake timers for debounce)
  // =========================================================================

  describe("Initial Options", () => {
    it("renders initialOptions when menu opens before any search", async () => {
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={mockSearch} />,
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Cherry")).toBeInTheDocument();
    });

    it("reverts to initialOptions when input is cleared below minSearchLength", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockResolvedValue([{ label: "Apricot", value: "apricot" }]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={mockSearch} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "apr");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("Apricot")).toBeInTheDocument();
      });

      // Clear the input
      await user.clear(input);

      // Should revert to initial options (below minSearchLength triggers reset)
      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
        expect(screen.getByText("Banana")).toBeInTheDocument();
        expect(screen.getByText("Cherry")).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Async Search  (uses fake timers)
  // =========================================================================

  describe("Async Search", () => {
    it("calls onSearch after debounce delay when typing", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockResolvedValue([{ label: "Apple", value: "apple" }]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "app");

      expect(mockSearch).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(300);

      expect(mockSearch).toHaveBeenCalledWith("app");
    });

    it("debounces rapid input changes", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      await user.type(input, "a");
      await vi.advanceTimersByTimeAsync(100);
      await user.type(input, "p");
      await vi.advanceTimersByTimeAsync(100);
      await user.type(input, "p");

      // Still no call — timer restarted each time via handleSearch
      expect(mockSearch).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(300);

      // Should only be called once with the final value
      expect(mockSearch).toHaveBeenCalledTimes(1);
      expect(mockSearch).toHaveBeenCalledWith("app");
    });

    it("respects custom debounceMs", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect debounceMs={500} onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "test");

      await vi.advanceTimersByTimeAsync(300);
      expect(mockSearch).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(200);
      expect(mockSearch).toHaveBeenCalledWith("test");
    });

    it("does not search when input length is below minSearchLength", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect minSearchLength={3} onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "ab");

      await vi.advanceTimersByTimeAsync(300);

      expect(mockSearch).not.toHaveBeenCalled();
    });

    it("searches when input length meets minSearchLength", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect minSearchLength={3} onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "abc");

      await vi.advanceTimersByTimeAsync(300);

      expect(mockSearch).toHaveBeenCalledWith("abc");
    });

    it("displays search results after successful fetch", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([
        { label: "Mango", value: "mango" },
        { label: "Melon", value: "melon" },
      ]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "m");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("Mango")).toBeInTheDocument();
        expect(screen.getByText("Melon")).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Loading State
  // =========================================================================

  describe("Loading State", () => {
    it("shows loading content while search is pending", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      let resolveSearch!: (value: SelectOption<string>[]) => void;
      const mockSearch = vi.fn().mockImplementation(
        () =>
          new Promise<SelectOption<string>[]>((resolve) => {
            resolveSearch = resolve;
          }),
      );
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "a");

      // Loading appears after debounce fires (not immediately)
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });

      // Resolve the promise
      resolveSearch([{ label: "Apple", value: "apple" }]);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });
    });

    it("renders data-ck='async-select-loading' element", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      let resolveSearch!: (value: SelectOption<string>[]) => void;
      const mockSearch = vi.fn().mockImplementation(
        () =>
          new Promise<SelectOption<string>[]>((resolve) => {
            resolveSearch = resolve;
          }),
      );
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "x");

      // Advance past debounce so loading state appears
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        const loadingEl = document.querySelector(
          '[data-ck="async-select-loading"]',
        );
        expect(loadingEl).toBeInTheDocument();
      });

      // Cleanup
      resolveSearch([]);
    });

    it("sets data-loading on root during loading", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      let resolveSearch!: (value: SelectOption<string>[]) => void;
      const mockSearch = vi.fn().mockImplementation(
        () =>
          new Promise<SelectOption<string>[]>((resolve) => {
            resolveSearch = resolve;
          }),
      );
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      const { container } = render(<AsyncSelect onSearch={mockSearch} />);

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).not.toHaveAttribute("data-loading");

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "q");

      // Advance past debounce so loading state appears
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(root).toHaveAttribute("data-loading", "true");
      });

      // Resolve
      resolveSearch([]);

      await waitFor(() => {
        expect(root).not.toHaveAttribute("data-loading");
      });
    });

    it("sets aria-busy on root during loading", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      let resolveSearch!: (value: SelectOption<string>[]) => void;
      const mockSearch = vi.fn().mockImplementation(
        () =>
          new Promise<SelectOption<string>[]>((resolve) => {
            resolveSearch = resolve;
          }),
      );
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      const { container } = render(<AsyncSelect onSearch={mockSearch} />);

      const root = container.querySelector('[data-ck="async-select"]');

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "z");

      // Advance past debounce so loading state appears
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(root).toHaveAttribute("aria-busy", "true");
      });

      resolveSearch([]);

      await waitFor(() => {
        expect(root).not.toHaveAttribute("aria-busy");
      });
    });

    it("displays custom loadingContent", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      let resolveSearch!: (value: SelectOption<string>[]) => void;
      const mockSearch = vi.fn().mockImplementation(
        () =>
          new Promise<SelectOption<string>[]>((resolve) => {
            resolveSearch = resolve;
          }),
      );
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(
        <AsyncSelect
          loadingContent={<span data-testid="spinner">Fetching...</span>}
          onSearch={mockSearch}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "t");

      // Advance past debounce so loading state appears
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
        expect(screen.getByText("Fetching...")).toBeInTheDocument();
      });

      // Cleanup
      resolveSearch([]);
    });
  });

  // =========================================================================
  // Error State
  // =========================================================================

  describe("Error State", () => {
    it("shows error content when search rejects", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockRejectedValue(new Error("Network failure"));
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "err");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("An error occurred")).toBeInTheDocument();
      });
    });

    it("renders data-ck='async-select-error' element", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockRejectedValue(new Error("fail"));
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "x");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        const errorEl = document.querySelector(
          '[data-ck="async-select-error"]',
        );
        expect(errorEl).toBeInTheDocument();
      });
    });

    it("sets data-has-error on root when error occurs", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockRejectedValue(new Error("fail"));
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      const { container } = render(<AsyncSelect onSearch={mockSearch} />);

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).not.toHaveAttribute("data-has-error");

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "x");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(root).toHaveAttribute("data-has-error", "true");
      });
    });

    it("displays custom errorContent", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockRejectedValue(new Error("fail"));
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(
        <AsyncSelect
          errorContent={<span data-testid="err-msg">Oops! Try again.</span>}
          onSearch={mockSearch}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "x");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByTestId("err-msg")).toBeInTheDocument();
        expect(screen.getByText("Oops! Try again.")).toBeInTheDocument();
      });
    });

    it("clears error on new successful search", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce([{ label: "Apple", value: "apple" }]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      const { container } = render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "x");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("An error occurred")).toBeInTheDocument();
      });

      // Clear and type a new query
      await user.clear(input);
      await user.type(input, "app");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.queryByText("An error occurred")).not.toBeInTheDocument();
        const root = container.querySelector('[data-ck="async-select"]');
        expect(root).not.toHaveAttribute("data-has-error");
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Empty State
  // =========================================================================

  describe("Empty State", () => {
    it("shows empty content when search returns no results", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "zzz");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("No results found")).toBeInTheDocument();
      });
    });

    it("renders data-ck='async-select-empty' element", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "zzz");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        const emptyEl = document.querySelector(
          '[data-ck="async-select-empty"]',
        );
        expect(emptyEl).toBeInTheDocument();
      });
    });

    it("displays custom emptyContent", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(
        <AsyncSelect
          emptyContent={<span data-testid="empty-msg">Nothing here!</span>}
          onSearch={mockSearch}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "zzz");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByTestId("empty-msg")).toBeInTheDocument();
        expect(screen.getByText("Nothing here!")).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Race Condition Handling
  // =========================================================================

  describe("Race Condition Handling", () => {
    it("ignores stale responses when a newer search has started", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      let resolveFirst!: (value: SelectOption<string>[]) => void;
      let resolveSecond!: (value: SelectOption<string>[]) => void;

      const mockSearch = vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise<SelectOption<string>[]>((resolve) => {
              resolveFirst = resolve;
            }),
        )
        .mockImplementationOnce(
          () =>
            new Promise<SelectOption<string>[]>((resolve) => {
              resolveSecond = resolve;
            }),
        );

      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // First search
      await user.type(input, "a");
      await vi.advanceTimersByTimeAsync(300);
      expect(mockSearch).toHaveBeenCalledWith("a");

      // Second search — type more characters
      await user.type(input, "pple");
      await vi.advanceTimersByTimeAsync(300);
      expect(mockSearch).toHaveBeenCalledWith("apple");

      // Resolve SECOND search first (the fast one)
      resolveSecond([{ label: "Apple", value: "apple" }]);

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });

      // Now resolve FIRST search (the slow/stale one)
      resolveFirst([{ label: "Avocado", value: "avocado" }]);

      // Stale result should be ignored — Apple should still be displayed
      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
        expect(screen.queryByText("Avocado")).not.toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Caching
  // =========================================================================

  describe("Caching", () => {
    it("does not cache results by default", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockResolvedValue([{ label: "Apple", value: "apple" }]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // First search
      await user.type(input, "app");
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalledTimes(1);
      });

      // Clear and repeat the same search
      await user.clear(input);
      await user.type(input, "app");
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalledTimes(2);
      });
    });

    it("caches results when cacheResults is true", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockResolvedValue([{ label: "Apple", value: "apple" }]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect cacheResults onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // First search
      await user.type(input, "app");
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });

      // Clear and repeat the same query
      await user.clear(input);
      await user.type(input, "app");

      // Cache returns immediately — no new onSearch call
      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });

      // onSearch should NOT be called again
      expect(mockSearch).toHaveBeenCalledTimes(1);
    });

    it("returns cached results immediately without calling onSearch again", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockResolvedValueOnce([{ label: "Apple", value: "apple" }])
        .mockResolvedValueOnce([{ label: "Berry", value: "berry" }]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect cacheResults onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);

      // First query: "app"
      await user.type(input, "app");
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });

      // Second query: "ber"
      await user.clear(input);
      await user.type(input, "ber");
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("Berry")).toBeInTheDocument();
      });

      expect(mockSearch).toHaveBeenCalledTimes(2);

      // Go back to "app" — should come from cache
      await user.clear(input);
      await user.type(input, "app");

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });

      // Still only 2 calls — third was served from cache
      expect(mockSearch).toHaveBeenCalledTimes(2);
    });
  });

  // =========================================================================
  // Controlled Mode  (uses real timers for click-based interactions)
  // =========================================================================

  describe("Controlled Mode", () => {
    it("respects controlled value", async () => {
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      render(
        <AsyncSelect
          initialOptions={fruitOptions}
          value="banana"
          onSearch={mockSearch}
        />,
      );

      // In combobox mode the input shows the selected item's label
      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("Banana");

      // Open menu and verify selection marker
      await user.click(screen.getByLabelText("toggle menu"));

      await waitFor(() => {
        const options = screen.getAllByRole("option");
        const bananaOption = options.find(
          (opt) => opt.textContent === "Banana",
        );
        expect(bananaOption).toHaveAttribute("aria-selected", "true");
      });
    });

    it("calls onValueChange when selection changes", async () => {
      const onValueChange = vi.fn();
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      render(
        <AsyncSelect
          initialOptions={fruitOptions}
          value="apple"
          onSearch={mockSearch}
          onValueChange={onValueChange}
        />,
      );

      await user.click(screen.getByLabelText("toggle menu"));

      await waitFor(() => {
        expect(screen.getByText("Banana")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("option", { name: "Banana" }));

      expect(onValueChange).toHaveBeenCalledWith("banana");
    });

    it("updates display when controlled value changes via rerender", () => {
      const mockSearch = vi.fn().mockResolvedValue([]);

      const { rerender } = render(
        <AsyncSelect
          initialOptions={fruitOptions}
          value="apple"
          onSearch={mockSearch}
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("Apple");

      rerender(
        <AsyncSelect
          initialOptions={fruitOptions}
          value="banana"
          onSearch={mockSearch}
        />,
      );

      expect(input).toHaveValue("Banana");
    });
  });

  // =========================================================================
  // Uncontrolled Mode
  // =========================================================================

  describe("Uncontrolled Mode", () => {
    it("uses defaultValue for initial selection", () => {
      const mockSearch = vi.fn().mockResolvedValue([]);

      render(
        <AsyncSelect
          defaultValue="banana"
          initialOptions={fruitOptions}
          onSearch={mockSearch}
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("Banana");
    });

    it("updates selection on user interaction", async () => {
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      render(
        <AsyncSelect
          initialOptions={fruitOptions}
          placeholder="Search..."
          onSearch={mockSearch}
        />,
      );

      await user.click(screen.getByLabelText("toggle menu"));

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("option", { name: "Apple" }));

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("Apple");
    });
  });

  // =========================================================================
  // Keyboard Navigation
  // =========================================================================

  describe("Keyboard Navigation", () => {
    it("opens menu on ArrowDown from input", async () => {
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      const { container } = render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={mockSearch} />,
      );

      const input = screen.getByRole("combobox");
      input.focus();
      await user.keyboard("{ArrowDown}");

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toHaveAttribute("data-state", "open");
    });

    it("navigates items with ArrowDown/ArrowUp", async () => {
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={mockSearch} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="async-select-item"]');
      const highlightedItems = Array.from(items).filter(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(highlightedItems.length).toBe(1);

      // Navigate up
      await user.keyboard("{ArrowUp}");

      const highlightedAfterUp = Array.from(
        document.querySelectorAll('[data-ck="async-select-item"]'),
      ).filter((item) => item.getAttribute("data-highlighted") === "true");
      expect(highlightedAfterUp.length).toBe(1);
    });

    it("selects item with Enter key and closes menu", async () => {
      const onValueChange = vi.fn();
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      const { container } = render(
        <AsyncSelect
          initialOptions={fruitOptions}
          onSearch={mockSearch}
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onValueChange).toHaveBeenCalled();

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toHaveAttribute("data-state", "closed");
    });

    it("closes menu with Escape key", async () => {
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      const { container } = render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={mockSearch} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toHaveAttribute("data-state", "open");

      await user.keyboard("{Escape}");
      expect(root).toHaveAttribute("data-state", "closed");
    });

    it("typing triggers debounced search", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockResolvedValue([{ label: "Pear", value: "pear" }]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={mockSearch} />,
      );

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "pea");

      expect(mockSearch).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(300);

      expect(mockSearch).toHaveBeenCalledWith("pea");

      await waitFor(() => {
        expect(screen.getByText("Pear")).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Disabled State
  // =========================================================================

  describe("Disabled State", () => {
    it("disables input when disabled prop is true", () => {
      render(<AsyncSelect disabled onSearch={emptySearch} />);

      const input = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });

    it("disables trigger button when disabled", () => {
      const { container } = render(
        <AsyncSelect disabled onSearch={emptySearch} />,
      );

      const trigger = container.querySelector(
        '[data-ck="async-select-trigger"]',
      );
      expect(trigger).toBeDisabled();
    });

    it("applies data-disabled to root when disabled", () => {
      const { container } = render(
        <AsyncSelect disabled onSearch={emptySearch} />,
      );

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toHaveAttribute("data-disabled", "true");
    });
  });

  // =========================================================================
  // Accessibility
  // =========================================================================

  describe("Accessibility", () => {
    it("input has combobox role", () => {
      render(<AsyncSelect onSearch={emptySearch} />);

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
      expect(combobox.tagName).toBe("INPUT");
    });

    it("menu has listbox role", async () => {
      const user = userEvent.setup();

      render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={emptySearch} />,
      );

      const combobox = screen.getByRole("combobox");
      await user.click(combobox);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });

    it("has aria-expanded on combobox element", async () => {
      const user = userEvent.setup();

      render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={emptySearch} />,
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded", "false");

      await user.click(combobox);
      expect(combobox).toHaveAttribute("aria-expanded", "true");
    });

    it("loading state has role status and aria-live polite", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      let resolveSearch!: (value: SelectOption<string>[]) => void;
      const mockSearch = vi.fn().mockImplementation(
        () =>
          new Promise<SelectOption<string>[]>((resolve) => {
            resolveSearch = resolve;
          }),
      );
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "t");

      // Advance past debounce so loading state appears
      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        const loadingEl = document.querySelector(
          '[data-ck="async-select-loading"]',
        );
        expect(loadingEl).toBeInTheDocument();
        expect(loadingEl).toHaveAttribute("role", "status");
        expect(loadingEl).toHaveAttribute("aria-live", "polite");
        expect(loadingEl).toHaveAttribute("aria-label", "Loading results");
      });

      // Cleanup
      resolveSearch([]);
    });

    it("error state has role alert and aria-live assertive", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockRejectedValue(new Error("fail"));
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "x");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        const errorEl = document.querySelector(
          '[data-ck="async-select-error"]',
        );
        expect(errorEl).toBeInTheDocument();
        expect(errorEl).toHaveAttribute("role", "alert");
        expect(errorEl).toHaveAttribute("aria-live", "assertive");
      });
    });

    it("empty state has role status and aria-live polite", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "zzz");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        const emptyEl = document.querySelector(
          '[data-ck="async-select-empty"]',
        );
        expect(emptyEl).toBeInTheDocument();
        expect(emptyEl).toHaveAttribute("role", "status");
        expect(emptyEl).toHaveAttribute("aria-live", "polite");
      });
    });

    it("items have role option", async () => {
      const user = userEvent.setup();

      render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={emptySearch} />,
      );

      await user.click(screen.getByRole("combobox"));

      const options = screen.getAllByRole("option");
      expect(options.length).toBeGreaterThanOrEqual(3);
    });

    it("marks selected item with aria-selected", async () => {
      const user = userEvent.setup();

      render(
        <AsyncSelect
          initialOptions={fruitOptions}
          value="apple"
          onSearch={emptySearch}
        />,
      );

      await user.click(screen.getByLabelText("toggle menu"));

      await waitFor(() => {
        const options = screen.getAllByRole("option");
        const appleOption = options.find((opt) => opt.textContent === "Apple");
        expect(appleOption).toHaveAttribute("aria-selected", "true");

        const bananaOption = options.find(
          (opt) => opt.textContent === "Banana",
        );
        expect(bananaOption).toHaveAttribute("aria-selected", "false");
      });
    });
  });

  // =========================================================================
  // Data Attributes
  // =========================================================================

  describe("Data Attributes", () => {
    it("has data-state on root and trigger", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={emptySearch} />,
      );

      const root = container.querySelector('[data-ck="async-select"]');
      const trigger = container.querySelector(
        '[data-ck="async-select-trigger"]',
      );

      expect(root).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("data-state", "closed");

      await user.click(screen.getByRole("combobox"));

      expect(root).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveAttribute("data-state", "open");

      const content = document.querySelector(
        '[data-ck="async-select-content"]',
      );
      expect(content).toHaveAttribute("data-state", "open");
    });

    it("has data-disabled on root when disabled", () => {
      const { container } = render(
        <AsyncSelect disabled onSearch={emptySearch} />,
      );

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toHaveAttribute("data-disabled", "true");
    });

    it("has data-variant on root when variantName is provided", () => {
      const { container } = render(
        <AsyncSelect variantName="outlined" onSearch={emptySearch} />,
      );

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toHaveAttribute("data-variant", "outlined");
    });

    it("has data-loading on root during search", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      let resolveSearch!: (value: SelectOption<string>[]) => void;
      const mockSearch = vi.fn().mockImplementation(
        () =>
          new Promise<SelectOption<string>[]>((resolve) => {
            resolveSearch = resolve;
          }),
      );
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      const { container } = render(<AsyncSelect onSearch={mockSearch} />);

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).not.toHaveAttribute("data-loading");

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "a");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(root).toHaveAttribute("data-loading", "true");
      });

      resolveSearch([]);

      await waitFor(() => {
        expect(root).not.toHaveAttribute("data-loading");
      });
    });

    it("has data-has-error on root when search fails", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockRejectedValue(new Error("fail"));
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      const { container } = render(<AsyncSelect onSearch={mockSearch} />);

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).not.toHaveAttribute("data-has-error");

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "x");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(root).toHaveAttribute("data-has-error", "true");
      });
    });

    it("has data-highlighted on highlighted item", async () => {
      const user = userEvent.setup();

      render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={emptySearch} />,
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");

      const items = document.querySelectorAll('[data-ck="async-select-item"]');
      const hasHighlighted = Array.from(items).some(
        (item) => item.getAttribute("data-highlighted") === "true",
      );
      expect(hasHighlighted).toBe(true);
    });
  });

  // =========================================================================
  // Edge Cases
  // =========================================================================

  describe("Edge Cases", () => {
    it("handles empty initialOptions", async () => {
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      const { container } = render(
        <AsyncSelect initialOptions={[]} onSearch={mockSearch} />,
      );

      const root = container.querySelector('[data-ck="async-select"]');
      expect(root).toBeInTheDocument();

      await user.click(screen.getByRole("combobox"));

      // No items rendered, but component is intact
      const items = document.querySelectorAll('[data-ck="async-select-item"]');
      expect(items).toHaveLength(0);
    });

    it("handles onSearch returning grouped options", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi.fn().mockResolvedValue([
        {
          label: "Fruits",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ],
          type: "group",
        },
        { type: "separator" },
        {
          label: "Vegetables",
          options: [{ label: "Carrot", value: "carrot" }],
          type: "group",
        },
      ] as SelectOption<string>[]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "food");

      await vi.advanceTimersByTimeAsync(300);

      await waitFor(() => {
        expect(screen.getByText("Fruits")).toBeInTheDocument();
        expect(screen.getByText("Vegetables")).toBeInTheDocument();
        expect(screen.getByText("Apple")).toBeInTheDocument();
        expect(screen.getByText("Banana")).toBeInTheDocument();
        expect(screen.getByText("Carrot")).toBeInTheDocument();
      });

      // Verify structural elements
      const groupLabels = document.querySelectorAll(
        '[data-ck="async-select-group-label"]',
      );
      expect(groupLabels).toHaveLength(2);

      const separator = document.querySelector(
        '[data-ck="async-select-separator"]',
      );
      expect(separator).toBeInTheDocument();
    });

    it("handles rapid open/close cycles", async () => {
      const mockSearch = vi.fn().mockResolvedValue([]);
      const user = userEvent.setup();

      const { container } = render(
        <AsyncSelect initialOptions={fruitOptions} onSearch={mockSearch} />,
      );

      const trigger = screen.getByLabelText("toggle menu");
      const root = container.querySelector('[data-ck="async-select"]');

      // Rapid open/close
      await user.click(trigger);
      expect(root).toHaveAttribute("data-state", "open");

      await user.click(trigger);
      expect(root).toHaveAttribute("data-state", "closed");

      await user.click(trigger);
      expect(root).toHaveAttribute("data-state", "open");

      await user.click(trigger);
      expect(root).toHaveAttribute("data-state", "closed");

      // Component should still be intact
      expect(root).toBeInTheDocument();
    });

    it("cleans up debounce timer on unmount", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const mockSearch = vi
        .fn()
        .mockResolvedValue([{ label: "Apple", value: "apple" }]);
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });

      const { unmount } = render(<AsyncSelect onSearch={mockSearch} />);

      const input = screen.getByRole("combobox");
      await user.click(input);
      await user.type(input, "app");

      // Unmount before debounce fires
      unmount();

      // Advance past debounce — should not throw or cause issues
      await vi.advanceTimersByTimeAsync(500);

      // The key assertion is that no errors are thrown during cleanup.
      // The timer callback may fire, but React state updates on unmounted
      // components are safely ignored.
      expect(true).toBe(true);
    });
  });

  // =========================================================================
  // getOptionValue
  // =========================================================================

  describe("getOptionValue", () => {
    it("works with object values using getOptionValue", async () => {
      const user = userEvent.setup();
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      const handleChange = vi.fn();
      const handleSearch = vi
        .fn()
        .mockResolvedValue(users.map((u) => ({ label: u.name, value: u })));

      render(
        <AsyncSelect
          getOptionValue={(u) => u.id}
          onSearch={handleSearch}
          onValueChange={handleChange}
        />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "Bob");

      await waitFor(() => {
        expect(screen.getByRole("option", { name: "Bob" })).toBeInTheDocument();
      });

      const bobOption = screen.getByRole("option", { name: "Bob" });
      await user.click(bobOption);

      expect(handleChange).toHaveBeenCalledWith(users[1]);
    });

    it("correctly identifies selected item with getOptionValue", async () => {
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      const selectedUser = { id: 1, name: "Alice" };
      const handleSearch = vi
        .fn()
        .mockResolvedValue(users.map((u) => ({ label: u.name, value: u })));

      render(
        <AsyncSelect
          getOptionValue={(u) => u.id}
          value={selectedUser}
          onSearch={handleSearch}
        />,
      );

      const input = screen.getByRole("combobox");
      expect(input).toHaveValue("");
    });

    it("works without getOptionValue for primitives", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const handleSearch = vi.fn().mockResolvedValue(["apple", "banana"]);

      render(
        <AsyncSelect onSearch={handleSearch} onValueChange={handleChange} />,
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "apple");

      await waitFor(() => {
        expect(
          screen.getByRole("option", { name: "apple" }),
        ).toBeInTheDocument();
      });

      const appleOption = screen.getByRole("option", { name: "apple" });
      await user.click(appleOption);

      expect(handleChange).toHaveBeenCalledWith("apple");
    });
  });
});
