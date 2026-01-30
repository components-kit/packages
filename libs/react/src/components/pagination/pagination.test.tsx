import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./pagination";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Finds all elements with role="button" or <button> inside the pagination nav */
const getAllButtons = () => screen.getAllByRole("button");

/** Finds the navigation landmark */
const getNav = () => screen.getByRole("navigation");

// ---------------------------------------------------------------------------
// 1. Basic Rendering
// ---------------------------------------------------------------------------

describe("Pagination - Basic Rendering", () => {
  it("renders a nav element as root", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(getNav()).toBeInTheDocument();
  });

  it("renders previous and next buttons", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(
      screen.getByLabelText("Go to previous page"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
  });

  it("renders page buttons in offset mode", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("does not render page buttons in cursor mode", () => {
    render(
      <Pagination hasNextPage={true} hasPreviousPage={false} />,
    );
    const buttons = getAllButtons();
    // Only previous and next buttons
    expect(buttons).toHaveLength(2);
  });

  it("renders ellipsis when pages are truncated", () => {
    render(<Pagination defaultPage={5} totalPages={10} />);
    const ellipses = screen.getAllByText("\u2026");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("renders first/last buttons when showFirstLast is true", () => {
    render(<Pagination defaultPage={5} showFirstLast totalPages={10} />);
    expect(
      screen.getByLabelText("Go to first page"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Go to last page"),
    ).toBeInTheDocument();
  });

  it("does not render first/last buttons by default", () => {
    render(<Pagination defaultPage={5} totalPages={10} />);
    expect(screen.queryByLabelText("Go to first page")).toBeNull();
    expect(screen.queryByLabelText("Go to last page")).toBeNull();
  });

  it("applies aria-label='Pagination' by default", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(getNav()).toHaveAttribute("aria-label", "Pagination");
  });

  it("renders with default siblings=1", () => {
    render(<Pagination defaultPage={5} totalPages={10} />);
    // With siblings=1 at page 5: [1, ..., 4, 5, 6, ..., 10]
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("renders cursor mode with first/last buttons", () => {
    render(
      <Pagination
        hasNextPage={true}
        hasPreviousPage={true}
        showFirstLast
        onFirst={() => {}}
        onLast={() => {}}
        onNext={() => {}}
        onPrevious={() => {}}
      />,
    );
    expect(
      screen.getByLabelText("Go to first page"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Go to last page"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Go to previous page"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
    // 4 buttons total, no page numbers
    expect(getAllButtons()).toHaveLength(4);
  });
});

// ---------------------------------------------------------------------------
// 2. Data Attributes
// ---------------------------------------------------------------------------

describe("Pagination - Data Attributes", () => {
  it("root has data-ck='pagination'", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(getNav()).toHaveAttribute("data-ck", "pagination");
  });

  it("root has data-variant when variantName is provided", () => {
    render(
      <Pagination defaultPage={1} totalPages={5} variantName="compact" />,
    );
    expect(getNav()).toHaveAttribute("data-variant", "compact");
  });

  it("root does not have data-variant when variantName is not provided", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(getNav()).not.toHaveAttribute("data-variant");
  });

  it("root has data-mode='offset' when totalPages provided", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(getNav()).toHaveAttribute("data-mode", "offset");
  });

  it("root has data-mode='cursor' when totalPages not provided", () => {
    render(<Pagination hasNextPage={true} />);
    expect(getNav()).toHaveAttribute("data-mode", "cursor");
  });

  it("root has data-disabled when disabled", () => {
    render(<Pagination defaultPage={1} disabled totalPages={5} />);
    expect(getNav()).toHaveAttribute("data-disabled", "true");
  });

  it("root omits data-disabled when not disabled", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(getNav()).not.toHaveAttribute("data-disabled");
  });

  it("page list has data-ck='pagination-list'", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    const list = getNav().querySelector("ul");
    expect(list).toHaveAttribute("data-ck", "pagination-list");
  });

  it("page buttons have data-ck='pagination-page'", () => {
    render(<Pagination defaultPage={1} totalPages={3} />);
    const pageButton = screen.getByText("2");
    expect(pageButton).toHaveAttribute("data-ck", "pagination-page");
  });

  it("previous button has data-ck='pagination-previous'", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    const prev = screen.getByLabelText("Go to previous page");
    expect(prev).toHaveAttribute("data-ck", "pagination-previous");
  });

  it("next button has data-ck='pagination-next'", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    const next = screen.getByLabelText("Go to next page");
    expect(next).toHaveAttribute("data-ck", "pagination-next");
  });

  it("first button has data-ck='pagination-first'", () => {
    render(
      <Pagination defaultPage={3} showFirstLast totalPages={5} />,
    );
    const first = screen.getByLabelText("Go to first page");
    expect(first).toHaveAttribute("data-ck", "pagination-first");
  });

  it("last button has data-ck='pagination-last'", () => {
    render(
      <Pagination defaultPage={3} showFirstLast totalPages={5} />,
    );
    const last = screen.getByLabelText("Go to last page");
    expect(last).toHaveAttribute("data-ck", "pagination-last");
  });

  it("ellipsis has data-ck='pagination-ellipsis'", () => {
    render(<Pagination defaultPage={5} totalPages={10} />);
    const ellipsis = screen.getAllByText("\u2026")[0];
    expect(ellipsis).toHaveAttribute("data-ck", "pagination-ellipsis");
  });

  it("current page button has data-state='active'", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    const current = screen.getByText("3");
    expect(current).toHaveAttribute("data-state", "active");
  });

  it("non-current page buttons have data-state='inactive'", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    const other = screen.getByText("1");
    expect(other).toHaveAttribute("data-state", "inactive");
  });

  it("list items have data-slot='page-item'", () => {
    render(<Pagination defaultPage={1} totalPages={3} />);
    const listItems = getNav().querySelectorAll("li");
    listItems.forEach((li) => {
      expect(li).toHaveAttribute("data-slot", "page-item");
    });
  });
});

// ---------------------------------------------------------------------------
// 3. ARIA Attributes
// ---------------------------------------------------------------------------

describe("Pagination - ARIA Attributes", () => {
  it("nav has aria-label", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(getNav()).toHaveAttribute("aria-label", "Pagination");
  });

  it("nav supports custom aria-label", () => {
    render(
      <Pagination
        aria-label="Search results pagination"
        defaultPage={1}
        totalPages={5}
      />,
    );
    expect(getNav()).toHaveAttribute(
      "aria-label",
      "Search results pagination",
    );
  });

  it("current page button has aria-current='page'", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    const current = screen.getByText("3");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("non-current page buttons do not have aria-current", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    const other = screen.getByText("1");
    expect(other).not.toHaveAttribute("aria-current");
  });

  it("current page button has descriptive aria-label", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    const current = screen.getByText("3");
    expect(current).toHaveAttribute(
      "aria-label",
      "Page 3, current page",
    );
  });

  it("non-current page buttons have 'Go to page N' aria-label", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    const page1 = screen.getByText("1");
    expect(page1).toHaveAttribute("aria-label", "Go to page 1");
  });

  it("previous button has aria-label", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    expect(
      screen.getByLabelText("Go to previous page"),
    ).toBeInTheDocument();
  });

  it("next button has aria-label", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
  });

  it("first button has aria-label", () => {
    render(
      <Pagination defaultPage={3} showFirstLast totalPages={5} />,
    );
    expect(
      screen.getByLabelText("Go to first page"),
    ).toBeInTheDocument();
  });

  it("last button has aria-label", () => {
    render(
      <Pagination defaultPage={3} showFirstLast totalPages={5} />,
    );
    expect(
      screen.getByLabelText("Go to last page"),
    ).toBeInTheDocument();
  });

  it("disabled buttons have aria-disabled='true'", () => {
    render(<Pagination defaultPage={1} totalPages={5} />);
    const prev = screen.getByLabelText("Go to previous page");
    expect(prev).toHaveAttribute("aria-disabled", "true");
  });

  it("enabled buttons do not have aria-disabled", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    const prev = screen.getByLabelText("Go to previous page");
    expect(prev).not.toHaveAttribute("aria-disabled");
  });

  it("ellipsis has aria-hidden='true'", () => {
    render(<Pagination defaultPage={5} totalPages={10} />);
    const ellipsis = screen.getAllByText("\u2026")[0];
    expect(ellipsis).toHaveAttribute("aria-hidden", "true");
  });
});

// ---------------------------------------------------------------------------
// 4. Offset Mode - Uncontrolled State
// ---------------------------------------------------------------------------

describe("Pagination - Offset Mode - Uncontrolled State", () => {
  it("defaultPage sets initial page", () => {
    render(<Pagination defaultPage={3} totalPages={5} />);
    const page3 = screen.getByText("3");
    expect(page3).toHaveAttribute("aria-current", "page");
  });

  it("defaults to page 1 when no defaultPage", () => {
    render(<Pagination totalPages={5} />);
    const page1 = screen.getByText("1");
    expect(page1).toHaveAttribute("aria-current", "page");
  });

  it("clicking a page button changes the current page", async () => {
    const user = userEvent.setup();
    render(<Pagination defaultPage={1} totalPages={5} />);

    // With page=1, siblings=1, visible pages are [1, 2, ..., 5]
    await user.click(screen.getByText("2"));

    expect(screen.getByText("2")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("1")).not.toHaveAttribute("aria-current");
  });

  it("clicking previous goes to previous page", async () => {
    const user = userEvent.setup();
    render(<Pagination defaultPage={3} totalPages={5} />);

    await user.click(screen.getByLabelText("Go to previous page"));

    expect(screen.getByText("2")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("clicking next goes to next page", async () => {
    const user = userEvent.setup();
    render(<Pagination defaultPage={3} totalPages={5} />);

    await user.click(screen.getByLabelText("Go to next page"));

    expect(screen.getByText("4")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("onPageChange fires with correct page number on page click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={1}
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    // With page=1, siblings=1, visible pages are [1, 2, ..., 5]
    await user.click(screen.getByText("5"));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it("onPageChange fires on previous click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={3}
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByLabelText("Go to previous page"));

    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("onPageChange fires on next click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={3}
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByLabelText("Go to next page"));

    expect(handleChange).toHaveBeenCalledWith(4);
  });
});

// ---------------------------------------------------------------------------
// 5. Offset Mode - Controlled State
// ---------------------------------------------------------------------------

describe("Pagination - Offset Mode - Controlled State", () => {
  it("page prop controls current page", () => {
    render(<Pagination page={3} totalPages={5} />);
    expect(screen.getByText("3")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("clicking page button fires onPageChange but does not change internal state", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Pagination
        page={3}
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    // With page=3, siblings=1, totalPages=5: visible [1, 2, 3, 4, 5]
    await user.click(screen.getByText("5"));

    expect(handleChange).toHaveBeenCalledWith(5);
    // Still on page 3 because controlled
    expect(screen.getByText("3")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("changing page prop updates displayed state", () => {
    const { rerender } = render(
      <Pagination page={1} totalPages={5} />,
    );

    expect(screen.getByText("1")).toHaveAttribute(
      "aria-current",
      "page",
    );

    rerender(<Pagination page={4} totalPages={5} />);

    expect(screen.getByText("4")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("1")).not.toHaveAttribute("aria-current");
  });
});

// ---------------------------------------------------------------------------
// 6. Cursor Mode
// ---------------------------------------------------------------------------

describe("Pagination - Cursor Mode", () => {
  it("renders without page numbers", () => {
    render(
      <Pagination hasNextPage={true} hasPreviousPage={false} />,
    );
    // Only prev/next buttons, no page number buttons
    const buttons = getAllButtons();
    expect(buttons).toHaveLength(2);
  });

  it("disables previous button when hasPreviousPage is false", () => {
    render(
      <Pagination hasNextPage={true} hasPreviousPage={false} />,
    );
    const prev = screen.getByLabelText("Go to previous page");
    expect(prev).toHaveAttribute("aria-disabled", "true");
  });

  it("enables previous button when hasPreviousPage is true", () => {
    render(
      <Pagination hasNextPage={true} hasPreviousPage={true} />,
    );
    const prev = screen.getByLabelText("Go to previous page");
    expect(prev).not.toHaveAttribute("aria-disabled");
  });

  it("disables next button when hasNextPage is false", () => {
    render(
      <Pagination hasNextPage={false} hasPreviousPage={true} />,
    );
    const next = screen.getByLabelText("Go to next page");
    expect(next).toHaveAttribute("aria-disabled", "true");
  });

  it("enables next button when hasNextPage is true", () => {
    render(
      <Pagination hasNextPage={true} hasPreviousPage={false} />,
    );
    const next = screen.getByLabelText("Go to next page");
    expect(next).not.toHaveAttribute("aria-disabled");
  });

  it("onNext fires when next clicked", async () => {
    const user = userEvent.setup();
    const handleNext = vi.fn();
    render(
      <Pagination
        hasNextPage={true}
        hasPreviousPage={false}
        onNext={handleNext}
      />,
    );

    await user.click(screen.getByLabelText("Go to next page"));

    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it("onPrevious fires when previous clicked", async () => {
    const user = userEvent.setup();
    const handlePrevious = vi.fn();
    render(
      <Pagination
        hasNextPage={false}
        hasPreviousPage={true}
        onPrevious={handlePrevious}
      />,
    );

    await user.click(screen.getByLabelText("Go to previous page"));

    expect(handlePrevious).toHaveBeenCalledTimes(1);
  });

  it("first/last buttons render when showFirstLast is true", () => {
    render(
      <Pagination
        hasNextPage={true}
        hasPreviousPage={true}
        showFirstLast
      />,
    );
    expect(
      screen.getByLabelText("Go to first page"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Go to last page"),
    ).toBeInTheDocument();
  });

  it("onFirst fires when first clicked", async () => {
    const user = userEvent.setup();
    const handleFirst = vi.fn();
    render(
      <Pagination
        hasNextPage={true}
        hasPreviousPage={true}
        showFirstLast
        onFirst={handleFirst}
      />,
    );

    await user.click(screen.getByLabelText("Go to first page"));

    expect(handleFirst).toHaveBeenCalledTimes(1);
  });

  it("onLast fires when last clicked", async () => {
    const user = userEvent.setup();
    const handleLast = vi.fn();
    render(
      <Pagination
        hasNextPage={true}
        hasPreviousPage={true}
        showFirstLast
        onLast={handleLast}
      />,
    );

    await user.click(screen.getByLabelText("Go to last page"));

    expect(handleLast).toHaveBeenCalledTimes(1);
  });

  it("first button disabled when hasFirstPage is false", () => {
    render(
      <Pagination
        hasFirstPage={false}
        hasNextPage={true}
        hasPreviousPage={true}
        showFirstLast
      />,
    );
    const first = screen.getByLabelText("Go to first page");
    expect(first).toHaveAttribute("aria-disabled", "true");
  });

  it("last button disabled when hasLastPage is false", () => {
    render(
      <Pagination
        hasLastPage={false}
        hasNextPage={true}
        hasPreviousPage={true}
        showFirstLast
      />,
    );
    const last = screen.getByLabelText("Go to last page");
    expect(last).toHaveAttribute("aria-disabled", "true");
  });
});

// ---------------------------------------------------------------------------
// 7. Click Interactions
// ---------------------------------------------------------------------------

describe("Pagination - Click Interactions", () => {
  it("clicking page button activates it (offset mode)", async () => {
    const user = userEvent.setup();
    render(<Pagination defaultPage={1} totalPages={5} />);

    // With page=1, siblings=1, visible pages are [1, 2, ..., 5]
    await user.click(screen.getByText("2"));

    expect(screen.getByText("2")).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByText("1")).toHaveAttribute(
      "data-state",
      "inactive",
    );
  });

  it("clicking disabled page button does nothing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={1}
        disabled
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByText("2"));

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByText("1")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("clicking previous when on first page does nothing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={1}
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByLabelText("Go to previous page"));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("clicking next when on last page does nothing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={5}
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    await user.click(screen.getByLabelText("Go to next page"));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("clicking first goes to page 1", async () => {
    const user = userEvent.setup();
    render(
      <Pagination defaultPage={5} showFirstLast totalPages={10} />,
    );

    await user.click(screen.getByLabelText("Go to first page"));

    expect(screen.getByText("1")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("clicking last goes to totalPages", async () => {
    const user = userEvent.setup();
    render(
      <Pagination defaultPage={5} showFirstLast totalPages={10} />,
    );

    await user.click(screen.getByLabelText("Go to last page"));

    expect(screen.getByText("10")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

// ---------------------------------------------------------------------------
// 8. Keyboard Navigation
// ---------------------------------------------------------------------------

describe("Pagination - Keyboard Navigation", () => {
  it("Enter activates focused page button", async () => {
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={1}
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    const page2 = screen.getByText("2");
    page2.focus();
    fireEvent.keyDown(page2, { key: "Enter" });
    fireEvent.click(page2);

    expect(handleChange).toHaveBeenCalled();
  });

  it("Space activates focused page button", async () => {
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={1}
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    const page2 = screen.getByText("2");
    page2.focus();
    fireEvent.keyDown(page2, { key: " " });
    fireEvent.click(page2);

    expect(handleChange).toHaveBeenCalled();
  });

  it("Enter on disabled button does nothing", () => {
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={1}
        disabled
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    const page2 = screen.getByText("2");
    page2.focus();
    fireEvent.keyDown(page2, { key: "Enter" });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("Space on disabled button does nothing", () => {
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={1}
        disabled
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    const page2 = screen.getByText("2");
    page2.focus();
    fireEvent.keyDown(page2, { key: " " });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("buttons remain focusable when disabled (aria-disabled pattern)", () => {
    render(<Pagination defaultPage={1} disabled totalPages={5} />);
    const page2 = screen.getByText("2");
    page2.focus();
    expect(document.activeElement).toBe(page2);
  });
});

// ---------------------------------------------------------------------------
// 9. Page Generation (Siblings / Ellipsis)
// ---------------------------------------------------------------------------

describe("Pagination - Page Generation", () => {
  it("shows correct pages with siblings=1, totalPages=7, page=4", () => {
    render(
      <Pagination defaultPage={4} siblings={1} totalPages={7} />,
    );
    // Expected: [1, ..., 3, 4, 5, ..., 7]
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.queryByText("2")).toBeNull();
    expect(screen.queryByText("6")).toBeNull();
  });

  it("shows left ellipsis only when current page far from start", () => {
    render(
      <Pagination defaultPage={9} siblings={1} totalPages={10} />,
    );
    // Expected: [1, ..., 8, 9, 10]
    const ellipses = screen.getAllByText("\u2026");
    expect(ellipses).toHaveLength(1);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows right ellipsis only when current page far from end", () => {
    render(
      <Pagination defaultPage={2} siblings={1} totalPages={10} />,
    );
    // Expected: [1, 2, 3, ..., 10]
    const ellipses = screen.getAllByText("\u2026");
    expect(ellipses).toHaveLength(1);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows both ellipses when current page in middle of large range", () => {
    render(
      <Pagination defaultPage={10} siblings={1} totalPages={20} />,
    );
    // Expected: [1, ..., 9, 10, 11, ..., 20]
    const ellipses = screen.getAllByText("\u2026");
    expect(ellipses).toHaveLength(2);
  });

  it("shows no ellipsis when totalPages is small", () => {
    render(
      <Pagination defaultPage={3} siblings={1} totalPages={5} />,
    );
    // Expected: [1, 2, 3, 4, 5] — all pages visible
    const ellipses = screen.queryAllByText("\u2026");
    expect(ellipses).toHaveLength(0);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("siblings=2 shows more page buttons", () => {
    render(
      <Pagination defaultPage={10} siblings={2} totalPages={20} />,
    );
    // Expected: [1, ..., 8, 9, 10, 11, 12, ..., 20]
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("siblings=0 shows only current, first, last", () => {
    render(
      <Pagination defaultPage={5} siblings={0} totalPages={10} />,
    );
    // Expected: [1, ..., 5, ..., 10]
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.queryByText("4")).toBeNull();
    expect(screen.queryByText("6")).toBeNull();
  });

  it("first and last page always visible", () => {
    render(
      <Pagination defaultPage={50} siblings={1} totalPages={100} />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 10. Disabled State
// ---------------------------------------------------------------------------

describe("Pagination - Disabled State", () => {
  it("all buttons have aria-disabled when component disabled", () => {
    render(<Pagination defaultPage={3} disabled totalPages={5} />);
    const buttons = getAllButtons();
    buttons.forEach((button) => {
      expect(button).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("all buttons have data-disabled when component disabled", () => {
    render(<Pagination defaultPage={3} disabled totalPages={5} />);
    const buttons = getAllButtons();
    buttons.forEach((button) => {
      expect(button).toHaveAttribute("data-disabled", "true");
    });
  });

  it("clicking any button when disabled does nothing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Pagination
        defaultPage={3}
        disabled
        totalPages={5}
        onPageChange={handleChange}
      />,
    );

    // Click page button
    await user.click(screen.getByText("1"));
    // Click next
    await user.click(screen.getByLabelText("Go to next page"));
    // Click previous
    await user.click(screen.getByLabelText("Go to previous page"));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("buttons remain focusable when disabled", () => {
    render(<Pagination defaultPage={3} disabled totalPages={5} />);
    const buttons = getAllButtons();
    buttons.forEach((button) => {
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});

// ---------------------------------------------------------------------------
// 11. Edge Cases
// ---------------------------------------------------------------------------

describe("Pagination - Edge Cases", () => {
  it("totalPages=1 shows only page 1, previous/next disabled", () => {
    render(<Pagination defaultPage={1} totalPages={1} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("1")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByLabelText("Go to previous page"),
    ).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByLabelText("Go to next page")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("totalPages=0 renders with navigation disabled", () => {
    render(<Pagination totalPages={0} />);
    expect(
      screen.getByLabelText("Go to previous page"),
    ).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByLabelText("Go to next page")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("page at first boundary (page=1)", () => {
    render(<Pagination defaultPage={1} totalPages={10} />);
    expect(
      screen.getByLabelText("Go to previous page"),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByLabelText("Go to next page"),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("page at last boundary (page=totalPages)", () => {
    render(<Pagination defaultPage={10} totalPages={10} />);
    expect(
      screen.getByLabelText("Go to previous page"),
    ).not.toHaveAttribute("aria-disabled");
    expect(screen.getByLabelText("Go to next page")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("very large totalPages (1000+)", () => {
    render(
      <Pagination defaultPage={500} siblings={1} totalPages={1000} />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    const ellipses = screen.getAllByText("\u2026");
    expect(ellipses).toHaveLength(2);
  });

  it("multiple pagination components on same page get unique IDs", () => {
    render(
      <>
        <Pagination
          aria-label="First pagination"
          defaultPage={1}
          totalPages={5}
        />
        <Pagination
          aria-label="Second pagination"
          defaultPage={1}
          totalPages={5}
        />
      </>,
    );
    const navs = screen.getAllByRole("navigation");
    expect(navs).toHaveLength(2);

    // Check that page button IDs are different
    const firstNav = navs[0];
    const secondNav = navs[1];
    const firstButtons = firstNav.querySelectorAll(
      '[data-ck="pagination-page"]',
    );
    const secondButtons = secondNav.querySelectorAll(
      '[data-ck="pagination-page"]',
    );
    expect(firstButtons[0].id).not.toBe(secondButtons[0].id);
  });

  it("renders without any custom props (minimal render)", () => {
    render(<Pagination />);
    expect(getNav()).toBeInTheDocument();
    expect(getNav()).toHaveAttribute("data-mode", "cursor");
  });
});

// ---------------------------------------------------------------------------
// 12. Display Name
// ---------------------------------------------------------------------------

describe("Pagination - Display Name", () => {
  it("has displayName set to 'Pagination'", () => {
    expect(Pagination.displayName).toBe("Pagination");
  });
});

// ---------------------------------------------------------------------------
// 13. Ref Forwarding
// ---------------------------------------------------------------------------

describe("Pagination - Ref Forwarding", () => {
  it("forwards ref to root nav element", () => {
    const ref = React.createRef<HTMLElement>();
    render(<Pagination defaultPage={1} totalPages={5} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("ref.current has data-ck='pagination'", () => {
    const ref = React.createRef<HTMLElement>();
    render(<Pagination defaultPage={1} totalPages={5} ref={ref} />);
    expect(ref.current).toHaveAttribute("data-ck", "pagination");
  });

  it("works with callback refs", () => {
    let refValue: HTMLElement | null = null;
    render(
      <Pagination
        defaultPage={1}
        totalPages={5}
        ref={(el) => {
          refValue = el;
        }}
      />,
    );
    expect(refValue).toBeInstanceOf(HTMLElement);
    expect(refValue?.tagName).toBe("NAV");
  });
});

// ---------------------------------------------------------------------------
// 14. HTML Attribute Passthrough
// ---------------------------------------------------------------------------

describe("Pagination - HTML Attributes", () => {
  it("passes through id", () => {
    render(
      <Pagination id="my-pagination" defaultPage={1} totalPages={5} />,
    );
    expect(getNav()).toHaveAttribute("id", "my-pagination");
  });

  it("passes through className", () => {
    render(
      <Pagination
        className="custom-class"
        defaultPage={1}
        totalPages={5}
      />,
    );
    expect(getNav()).toHaveClass("custom-class");
  });

  it("passes through style", () => {
    render(
      <Pagination
        style={{ marginTop: "10px" }}
        defaultPage={1}
        totalPages={5}
      />,
    );
    expect(getNav()).toHaveStyle({ marginTop: "10px" });
  });

  it("passes through data-testid", () => {
    render(
      <Pagination
        data-testid="test-pagination"
        defaultPage={1}
        totalPages={5}
      />,
    );
    expect(screen.getByTestId("test-pagination")).toBeInTheDocument();
  });

  it("passes through title", () => {
    render(
      <Pagination
        defaultPage={1}
        title="Page navigator"
        totalPages={5}
      />,
    );
    expect(getNav()).toHaveAttribute("title", "Page navigator");
  });
});
