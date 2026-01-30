import { useCallback, useState } from "react";

/**
 * Represents a single item in the generated page list.
 */
export interface PageItem {
  /** Whether this is the currently active page */
  isCurrent: boolean;
  /** The type of item: a clickable page or a non-interactive ellipsis */
  type: "ellipsis" | "page";
  /** The page number (only present when type is "page") */
  value?: number;
}

interface UsePaginationOptions {
  // Shared
  disabled?: boolean;
  showFirstLast?: boolean;

  // Offset mode
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  page?: number;
  siblings?: number;
  totalPages?: number;

  // Cursor mode
  hasFirstPage?: boolean;
  hasLastPage?: boolean;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onFirst?: () => void;
  onLast?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

/**
 * Generates an array of PageItem objects for rendering pagination buttons.
 *
 * Always includes the first and last pages. Inserts ellipsis items
 * wherever there is a gap greater than 1 between consecutive pages.
 */
function generatePages(
  currentPage: number,
  totalPages: number,
  siblings: number,
): PageItem[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) {
    return [{ isCurrent: currentPage === 1, type: "page", value: 1 }];
  }

  // Build set of page numbers to show
  const pageSet = new Set<number>();

  // Always show first and last
  pageSet.add(1);
  pageSet.add(totalPages);

  // Sibling range around current page
  const rangeStart = Math.max(2, currentPage - siblings);
  const rangeEnd = Math.min(totalPages - 1, currentPage + siblings);

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pageSet.add(i);
  }

  // Sort page numbers
  const sorted = Array.from(pageSet).sort((a, b) => a - b);

  // Build items with ellipsis gaps
  const items: PageItem[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const pageNum = sorted[i];

    // Insert ellipsis if there's a gap
    if (i > 0 && pageNum - sorted[i - 1] > 1) {
      items.push({ isCurrent: false, type: "ellipsis" });
    }

    items.push({
      isCurrent: currentPage === pageNum,
      type: "page",
      value: pageNum,
    });
  }

  return items;
}

/**
 * A headless hook for managing pagination state, page generation, and ARIA prop generation.
 *
 * @description
 * The `usePagination` hook provides all the logic needed to build an accessible pagination
 * component following the WAI-ARIA navigation landmark pattern. It supports two modes:
 * - **Offset mode** (when `totalPages` is provided): numeric page navigation with ellipsis truncation
 * - **Cursor mode** (when `totalPages` is absent): previous/next navigation only
 *
 * @remarks
 * - Mode is inferred from props: `totalPages !== undefined` → offset, otherwise → cursor
 * - Offset mode supports controlled (`page`) and uncontrolled (`defaultPage`) state
 * - The page generation algorithm always shows the first and last pages, with ellipsis for gaps
 * - All handlers check disabled state and prevent interaction when disabled
 * - Uses `aria-disabled` pattern (not native `disabled`) to keep buttons focusable for screen readers
 * - All handler functions are wrapped in `useCallback` for stable references
 *
 * ## Accessibility
 *
 * This hook implements the WAI-ARIA navigation landmark pattern for pagination:
 * - **`aria-current="page"`** on the active page button
 * - **`aria-label`** with descriptive text on all buttons
 * - **`aria-disabled`** instead of native `disabled` (keeps buttons focusable)
 * - **`aria-hidden="true"`** on decorative ellipsis elements
 *
 * @param {UsePaginationOptions} options - Configuration object
 * @param {number} [options.totalPages] - Total pages. When provided, enables offset mode.
 * @param {number} [options.page] - Controlled current page (1-based). Bypasses internal state.
 * @param {number} [options.defaultPage] - Initial page for uncontrolled mode (1-based). Defaults to 1.
 * @param {(page: number) => void} [options.onPageChange] - Callback when page changes (offset mode)
 * @param {number} [options.siblings=1] - Number of sibling pages on each side of the current page
 * @param {boolean} [options.disabled] - Whether all pagination buttons are disabled
 * @param {boolean} [options.showFirstLast] - Whether first/last buttons are shown
 * @param {boolean} [options.hasNextPage] - Whether a next page exists (cursor mode)
 * @param {boolean} [options.hasPreviousPage] - Whether a previous page exists (cursor mode)
 * @param {() => void} [options.onNext] - Callback for next button (cursor mode)
 * @param {() => void} [options.onPrevious] - Callback for previous button (cursor mode)
 * @param {() => void} [options.onFirst] - Callback for first button
 * @param {() => void} [options.onLast] - Callback for last button
 * @param {boolean} [options.hasFirstPage] - Whether first page is available (cursor mode, defaults to hasPreviousPage)
 * @param {boolean} [options.hasLastPage] - Whether last page is available (cursor mode, defaults to hasNextPage)
 *
 * @returns An object containing:
 * - `mode` — The determined pagination mode ("offset" or "cursor")
 * - `currentPage` — The current page number (offset mode, 1-based)
 * - `pages` — Array of PageItem objects for rendering (offset mode only)
 * - `canGoPrevious` — Whether the previous action is available
 * - `canGoNext` — Whether the next action is available
 * - `canGoFirst` — Whether the first action is available
 * - `canGoLast` — Whether the last action is available
 * - `handlePageClick` — Click handler for page number buttons
 * - `handlePrevious` — Click handler for the previous button
 * - `handleNext` — Click handler for the next button
 * - `handleFirst` — Click handler for the first button
 * - `handleLast` — Click handler for the last button
 * - `getPageButtonProps` — Generates ARIA and data attribute props for a page button
 * - `getPreviousButtonProps` — Generates props for the previous button
 * - `getNextButtonProps` — Generates props for the next button
 * - `getFirstButtonProps` — Generates props for the first button
 * - `getLastButtonProps` — Generates props for the last button
 * - `getEllipsisProps` — Generates props for an ellipsis element
 */
export function usePagination(options: UsePaginationOptions) {
  const {
    defaultPage,
    disabled = false,
    hasFirstPage,
    hasLastPage,
    hasNextPage,
    hasPreviousPage,
    onFirst,
    onLast,
    onNext,
    onPageChange,
    onPrevious,
    page,
    showFirstLast = false,
    siblings = 1,
    totalPages,
  } = options;

  // Determine mode
  const mode = totalPages !== undefined ? "offset" : "cursor";

  // Internal state for uncontrolled offset mode
  const [pageInternal, setPageInternal] = useState(() => defaultPage ?? 1);

  // Controlled/uncontrolled pattern
  const currentPage =
    mode === "offset" ? (page !== undefined ? page : pageInternal) : 1;

  // Page generation (offset mode only)
  const pages: PageItem[] =
    mode === "offset" ? generatePages(currentPage, totalPages!, siblings) : [];

  // Navigation availability
  const canGoPrevious =
    mode === "offset" ? currentPage > 1 : (hasPreviousPage ?? false);

  const canGoNext =
    mode === "offset" ? currentPage < totalPages! : (hasNextPage ?? false);

  const canGoFirst =
    mode === "offset"
      ? currentPage > 1
      : (hasFirstPage ?? hasPreviousPage ?? false);

  const canGoLast =
    mode === "offset"
      ? currentPage < totalPages!
      : (hasLastPage ?? hasNextPage ?? false);

  // Helper: change page in offset mode
  const changePage = useCallback(
    (newPage: number) => {
      if (disabled) return;
      if (mode !== "offset") return;
      if (newPage < 1 || newPage > totalPages!) return;
      if (newPage === currentPage) return;

      if (page === undefined) {
        setPageInternal(newPage);
      }
      onPageChange?.(newPage);
    },
    [currentPage, disabled, mode, onPageChange, page, totalPages],
  );

  // Handlers
  const handlePageClick = useCallback(
    (pageNumber: number) => {
      if (disabled) return;
      changePage(pageNumber);
    },
    [changePage, disabled],
  );

  const handlePrevious = useCallback(() => {
    if (disabled) return;
    if (mode === "offset") {
      changePage(currentPage - 1);
    } else {
      onPrevious?.();
    }
  }, [changePage, currentPage, disabled, mode, onPrevious]);

  const handleNext = useCallback(() => {
    if (disabled) return;
    if (mode === "offset") {
      changePage(currentPage + 1);
    } else {
      onNext?.();
    }
  }, [changePage, currentPage, disabled, mode, onNext]);

  const handleFirst = useCallback(() => {
    if (disabled) return;
    if (mode === "offset") {
      changePage(1);
    } else {
      onFirst?.();
    }
  }, [changePage, disabled, mode, onFirst]);

  const handleLast = useCallback(() => {
    if (disabled) return;
    if (mode === "offset") {
      changePage(totalPages!);
    } else {
      onLast?.();
    }
  }, [changePage, disabled, mode, onLast, totalPages]);

  // Prop generators
  const getPageButtonProps = useCallback(
    (item: PageItem, baseId: string) => {
      const isActive = item.isCurrent;
      const isButtonDisabled = disabled;

      return {
        "aria-current": isActive ? ("page" as const) : undefined,
        "aria-disabled": isButtonDisabled || undefined,
        "aria-label": isActive
          ? `Page ${item.value}, current page`
          : `Go to page ${item.value}`,
        "data-ck": "pagination-page",
        "data-disabled": isButtonDisabled || undefined,
        "data-state": isActive ? "active" : "inactive",
        id: `${baseId}-page-${item.value}`,
      };
    },
    [disabled],
  );

  const getPreviousButtonProps = useCallback(
    (baseId: string) => {
      const isButtonDisabled = disabled || !canGoPrevious;

      return {
        "aria-disabled": isButtonDisabled || undefined,
        "aria-label": "Go to previous page",
        "data-ck": "pagination-previous",
        "data-disabled": isButtonDisabled || undefined,
        id: `${baseId}-previous`,
      };
    },
    [canGoPrevious, disabled],
  );

  const getNextButtonProps = useCallback(
    (baseId: string) => {
      const isButtonDisabled = disabled || !canGoNext;

      return {
        "aria-disabled": isButtonDisabled || undefined,
        "aria-label": "Go to next page",
        "data-ck": "pagination-next",
        "data-disabled": isButtonDisabled || undefined,
        id: `${baseId}-next`,
      };
    },
    [canGoNext, disabled],
  );

  const getFirstButtonProps = useCallback(
    (baseId: string) => {
      const isButtonDisabled = disabled || !canGoFirst;

      return {
        "aria-disabled": isButtonDisabled || undefined,
        "aria-label": "Go to first page",
        "data-ck": "pagination-first",
        "data-disabled": isButtonDisabled || undefined,
        id: `${baseId}-first`,
      };
    },
    [canGoFirst, disabled],
  );

  const getLastButtonProps = useCallback(
    (baseId: string) => {
      const isButtonDisabled = disabled || !canGoLast;

      return {
        "aria-disabled": isButtonDisabled || undefined,
        "aria-label": "Go to last page",
        "data-ck": "pagination-last",
        "data-disabled": isButtonDisabled || undefined,
        id: `${baseId}-last`,
      };
    },
    [canGoLast, disabled],
  );

  const getEllipsisProps = useCallback(
    () => ({
      "aria-hidden": true as const,
      "data-ck": "pagination-ellipsis",
    }),
    [],
  );

  return {
    canGoFirst,
    canGoLast,
    canGoNext,
    canGoPrevious,
    currentPage,
    getEllipsisProps,
    getFirstButtonProps,
    getLastButtonProps,
    getNextButtonProps,
    getPageButtonProps,
    getPreviousButtonProps,
    handleFirst,
    handleLast,
    handleNext,
    handlePageClick,
    handlePrevious,
    mode,
    pages,
    showFirstLast,
  };
}
