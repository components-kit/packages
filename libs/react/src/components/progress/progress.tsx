"use client";

import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useId,
} from "react";

/**
 * A linear progress bar component for displaying completion status.
 *
 * @description
 * The Progress component provides a visual indicator of progress for tasks
 * or processes. It supports both determinate mode (known percentage) and
 * indeterminate mode (unknown duration loading state).
 *
 * @remarks
 * This component features:
 * - **Built-in label** for accessible progress identification
 * - **Determinate mode** with percentage-based fill
 * - **Indeterminate mode** for unknown-duration loading
 * - **Customizable min/max** range
 * - **CSS custom property** (`--progress-value`) for flexible styling
 * - **Data attributes** for CSS-based styling (`data-variant`, `data-state`, `data-value`, `data-max`)
 *
 * - When `value` is `null` or `undefined`, the component enters indeterminate mode
 * - The percentage is clamped between 0% and 100% regardless of input value
 * - The indicator element sets a `--progress-value` CSS custom property for styling
 * - Uses `data-state` to differentiate between determinate and indeterminate modes
 * - Forwards refs correctly for DOM access
 *
 * ## Accessibility
 *
 * This component follows WAI-ARIA Progressbar Pattern guidelines:
 * - Uses `role="progressbar"` for screen reader identification
 * - Sets `aria-valuemin` and `aria-valuemax` for range communication
 * - Sets `aria-valuenow` in determinate mode; omits it in indeterminate mode
 * - When `label` is provided, `aria-labelledby` is automatically set on the progressbar
 * - Alternatively, provide an accessible name via `aria-label` or `aria-labelledby`
 * - Use `aria-valuetext` for human-readable value descriptions
 *   (e.g., "3 of 10 steps complete" instead of a raw number)
 *
 * ## Best Practices
 *
 * - Provide a visible `label` or an accessible name (`aria-label` / `aria-labelledby`)
 * - Use determinate mode when progress percentage is known
 * - Use indeterminate mode (omit `value`) for unknown-duration operations
 * - Use `aria-valuetext` when the numeric value alone is not meaningful
 * - Ensure sufficient color contrast between track and indicator
 *
 * @param {ReactNode} [label] - Label text displayed above the progress bar. Automatically links to the progressbar via aria-labelledby.
 * @param {number} [max=100] - The maximum value of the progress bar.
 * @param {number} [min=0] - The minimum value of the progress bar.
 * @param {number | null} [value] - The current value. Null or undefined for indeterminate mode.
 * @param {string} [variantName] - The variant name for styling (e.g., "primary", "success").
 *
 * @example
 * // With label
 * <Progress label="Uploading files..." value={50} />
 *
 * @example
 * // Determinate progress with aria-label
 * <Progress value={50} aria-label="Upload progress" />
 *
 * @example
 * // Indeterminate progress (loading)
 * <Progress label="Loading content..." />
 *
 * @example
 * // Custom range
 * <Progress label="Steps completed" min={0} max={10} value={3} />
 *
 * @example
 * // With variant
 * <Progress label="Upload complete" value={100} variantName="success" />
 *
 * @example
 * // With human-readable value text
 * <Progress
 *   label="Installation"
 *   value={3}
 *   min={0}
 *   max={10}
 *   aria-valuetext="Step 3 of 10: Installing dependencies"
 * />
 *
 * @example
 * // With ref for DOM access
 * const progressRef = useRef<HTMLDivElement>(null);
 * <Progress ref={progressRef} label="Progress" value={75} />
 */

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  max?: number;
  min?: number;
  value?: number | null;
  variantName?: string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ label, max = 100, min = 0, value, variantName, ...rest }, ref) => {
    const labelId = useId();
    const isIndeterminate = value === undefined || value === null;
    const range = max - min;
    const percentage =
      isIndeterminate || range <= 0
        ? undefined
        : Math.min(Math.max(((value - min) / range) * 100, 0), 100);

    const indicatorStyle: CSSProperties = isIndeterminate
      ? {}
      : ({
          "--progress-value": `${percentage}%`,
        } as CSSProperties);

    return (
      <div
        {...rest}
        data-ck="progress"
        data-has-label={label ? true : undefined}
        data-variant={variantName}
        ref={ref}
      >
        {label && (
          <div id={labelId} data-slot="label">
            {label}
          </div>
        )}
        <div
          aria-labelledby={label ? labelId : undefined}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={isIndeterminate ? undefined : value}
          data-ck="progress-track"
          data-max={max}
          data-state={isIndeterminate ? "indeterminate" : "determinate"}
          data-value={isIndeterminate ? undefined : value}
          role="progressbar"
        >
          <div style={indicatorStyle} data-ck="progress-indicator" />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";

export { Progress, type ProgressProps };
