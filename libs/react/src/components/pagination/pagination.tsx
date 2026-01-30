"use client";

import React, { forwardRef, useId } from "react";

import { type PageItem, usePagination } from "./use-pagination";

/**
 * An accessible pagination component supporting both numeric page navigation and cursor-based pagination.
 *
 * @description
 * The Pagination component provides navigation controls for paginated content.
 * It supports two modes, automatically inferred from props:
 * - **Offset mode** (when `totalPages` is provided): Displays page number buttons with
 *   ellipsis truncation, plus previous/next navigation
 * - **Cursor mode** (when `totalPages` is absent): Displays only previous/next (and
 *   optionally first/last) buttons for cursor-based APIs
 *
 * @remarks
 * This component features:
 * - **Automatic mode inference** from the presence of `totalPages`
 * - **Controlled and uncontrolled** page state (offset mode)
 * - **Ellipsis truncation** with configurable `siblings` count
 * - **First/Last buttons** via `showFirstLast` (both modes)
 * - **CSS-controlled navigation content** — prev/next/first/last buttons render empty;
 *   content (arrows, chevrons, text) is set via CSS `content` on `data-ck` selectors
 * - **Data attributes** for CSS-based styling (`data-ck`, `data-variant`, `data-mode`, `data-state`)
 *
 * ## Accessibility
 *
 * This component follows the WAI-ARIA navigation landmark pattern for pagination,
 * confirmed by W3C Design System, USWDS, MUI, and React Aria implementations.
 *
 * ### Keyboard Support
 *
 * | Key | Description |
 * | --- | --- |
 * | `Tab` / `Shift+Tab` | Moves focus between pagination buttons in DOM order |
 * | `Enter` | Activates the focused button |
 * | `Space` | Activates the focused button |
 *
 * ### ARIA Roles and Attributes
 *
 * - **Navigation landmark**: `<nav>` with `aria-label="Pagination"` (customizable)
 * - **Current page**: `aria-current="page"` marks the active page button
 * - **Page labels**: `"Page N, current page"` or `"Go to page N"`
 * - **Navigation labels**: `"Go to previous page"`, `"Go to next page"`, etc.
 * - **Disabled state**: `aria-disabled="true"` (keeps buttons focusable for assistive tech)
 * - **Ellipsis**: `aria-hidden="true"` hides decorative elements from assistive tech
 *
 * ### WCAG 2.2 AA Compliance
 *
 * - **2.1.1 Keyboard**: All buttons keyboard-operable via Tab + Enter/Space
 * - **2.4.3 Focus Order**: Natural DOM order provides logical focus sequence
 * - **2.5.8 Target Size**: CSS implementors should ensure minimum 24x24px targets
 * - **4.1.2 Name, Role, Value**: All buttons have accessible names, semantic roles, and state
 *
 * ## Best Practices
 *
 * - Use offset mode when the total page count is known
 * - Use cursor mode for infinite scroll or streaming data patterns
 * - Provide a unique `aria-label` when multiple pagination components exist on the same page
 * - CSS implementors should set content for navigation buttons via `[data-ck="pagination-previous"]::before`
 * - Ensure sufficient color contrast and minimum 24x24px target size in CSS
 * - After dynamic page load, manage focus to the new content area in your application
 *
 * @param {number} [totalPages] - Total number of pages. When provided, enables offset (numeric) mode.
 * @param {number} [page] - Controlled current page (1-based). When provided, component is controlled.
 * @param {number} [defaultPage=1] - Initial page for uncontrolled mode (1-based).
 * @param {(page: number) => void} [onPageChange] - Callback fired when the page changes (offset mode).
 * @param {number} [siblings=1] - Number of sibling pages visible on each side of the current page.
 * @param {boolean} [disabled] - Whether all pagination buttons are disabled.
 * @param {boolean} [showFirstLast=false] - Whether to show first/last navigation buttons.
 * @param {string} [variantName] - Style variant name for CSS targeting via `data-variant`.
 * @param {boolean} [hasNextPage] - Whether a next page exists (cursor mode).
 * @param {boolean} [hasPreviousPage] - Whether a previous page exists (cursor mode).
 * @param {() => void} [onNext] - Callback fired when "Next" is activated (cursor mode).
 * @param {() => void} [onPrevious] - Callback fired when "Previous" is activated (cursor mode).
 * @param {() => void} [onFirst] - Callback fired when "First" is activated.
 * @param {() => void} [onLast] - Callback fired when "Last" is activated.
 * @param {boolean} [hasFirstPage] - Whether a first page is available (cursor mode, defaults to hasPreviousPage).
 * @param {boolean} [hasLastPage] - Whether a last page is available (cursor mode, defaults to hasNextPage).
 *
 * @returns An accessible pagination navigation component
 *
 * @example
 * // Basic offset mode (uncontrolled)
 * <Pagination totalPages={10} defaultPage={1} />
 *
 * @example
 * // Controlled offset mode
 * function ControlledExample() {
 *   const [page, setPage] = useState(1);
 *   return (
 *     <Pagination
 *       totalPages={10}
 *       page={page}
 *       onPageChange={setPage}
 *     />
 *   );
 * }
 *
 * @example
 * // With custom siblings
 * <Pagination totalPages={20} defaultPage={10} siblings={2} />
 *
 * @example
 * // With first/last buttons (offset mode)
 * <Pagination totalPages={50} defaultPage={1} showFirstLast />
 *
 * @example
 * // Cursor-based mode
 * <Pagination
 *   hasNextPage={data.hasNext}
 *   hasPreviousPage={data.hasPrevious}
 *   onNext={() => fetchNext()}
 *   onPrevious={() => fetchPrevious()}
 * />
 *
 * @example
 * // Cursor mode with first/last buttons
 * <Pagination
 *   hasNextPage={true}
 *   hasPreviousPage={true}
 *   onNext={() => fetchNext()}
 *   onPrevious={() => fetchPrevious()}
 *   showFirstLast
 *   onFirst={() => fetchFirst()}
 *   onLast={() => fetchLast()}
 * />
 *
 * @example
 * // Disabled state
 * <Pagination totalPages={10} defaultPage={3} disabled />
 *
 * @example
 * // With variant for styling
 * <Pagination totalPages={10} defaultPage={1} variantName="compact" />
 *
 * @example
 * // With custom aria-label (when multiple paginations on page)
 * <Pagination
 *   totalPages={10}
 *   defaultPage={1}
 *   aria-label="Search results pagination"
 * />
 */

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  defaultPage?: number;
  disabled?: boolean;
  hasFirstPage?: boolean;
  hasLastPage?: boolean;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onFirst?: () => void;
  onLast?: () => void;
  onNext?: () => void;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  page?: number;
  showFirstLast?: boolean;
  siblings?: number;
  totalPages?: number;
  variantName?: string;
}

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      "aria-label": ariaLabel = "Pagination",
      defaultPage,
      disabled,
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
      showFirstLast,
      siblings,
      totalPages,
      variantName,
      ...rest
    },
    ref,
  ) => {
    const baseId = useId();

    const {
      canGoFirst,
      canGoLast,
      canGoNext,
      canGoPrevious,
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
      showFirstLast: resolvedShowFirstLast,
    } = usePagination({
      defaultPage,
      disabled,
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
      showFirstLast,
      siblings,
      totalPages,
    });

    const isDisabled = disabled || false;

    const handleButtonClick =
      (handler: () => void, canPerform: boolean) =>
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled || !canPerform) {
          e.preventDefault();
          return;
        }
        handler();
      };

    const handleButtonKeyDown =
      (canPerform: boolean) =>
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (
          (isDisabled || !canPerform) &&
          (e.key === "Enter" || e.key === " ")
        ) {
          e.preventDefault();
        }
      };

    const handlePageButtonClick =
      (item: PageItem) => (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled || item.isCurrent) {
          e.preventDefault();
          return;
        }
        handlePageClick(item.value!);
      };

    const handlePageButtonKeyDown =
      (item: PageItem) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (
          (isDisabled || item.isCurrent) &&
          (e.key === "Enter" || e.key === " ")
        ) {
          e.preventDefault();
        }
      };

    return (
      <nav
        {...rest}
        aria-label={ariaLabel}
        data-ck="pagination"
        data-disabled={isDisabled || undefined}
        data-mode={mode}
        data-variant={variantName}
        ref={ref}
      >
        <ul data-ck="pagination-list">
          {/* First button */}
          {resolvedShowFirstLast && (
            <li data-slot="page-item">
              <button
                {...getFirstButtonProps(baseId)}
                type="button"
                onClick={handleButtonClick(handleFirst, canGoFirst)}
                onKeyDown={handleButtonKeyDown(canGoFirst)}
              />
            </li>
          )}

          {/* Previous button */}
          <li data-slot="page-item">
            <button
              {...getPreviousButtonProps(baseId)}
              type="button"
              onClick={handleButtonClick(handlePrevious, canGoPrevious)}
              onKeyDown={handleButtonKeyDown(canGoPrevious)}
            />
          </li>

          {/* Page buttons (offset mode only) */}
          {pages.map((item, index) =>
            item.type === "ellipsis" ? (
              <li key={`ellipsis-${index}`} data-slot="page-item">
                <span {...getEllipsisProps()}>{"\u2026"}</span>
              </li>
            ) : (
              <li key={item.value} data-slot="page-item">
                <button
                  {...getPageButtonProps(item, baseId)}
                  type="button"
                  onClick={handlePageButtonClick(item)}
                  onKeyDown={handlePageButtonKeyDown(item)}
                >
                  {item.value}
                </button>
              </li>
            ),
          )}

          {/* Next button */}
          <li data-slot="page-item">
            <button
              {...getNextButtonProps(baseId)}
              type="button"
              onClick={handleButtonClick(handleNext, canGoNext)}
              onKeyDown={handleButtonKeyDown(canGoNext)}
            />
          </li>

          {/* Last button */}
          {resolvedShowFirstLast && (
            <li data-slot="page-item">
              <button
                {...getLastButtonProps(baseId)}
                type="button"
                onClick={handleButtonClick(handleLast, canGoLast)}
                onKeyDown={handleButtonKeyDown(canGoLast)}
              />
            </li>
          )}
        </ul>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export { Pagination, type PaginationProps };
