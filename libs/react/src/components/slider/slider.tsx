"use client";

import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
} from "react";

import { useSlider } from "./use-slider";

/**
 * An accessible slider input component for selecting a numeric value within a range.
 *
 * @description
 * The Slider component provides an interactive range input following the WAI-ARIA
 * Slider pattern. It supports:
 * - Controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes
 * - Full keyboard navigation (Arrow keys, Home, End, PageUp, PageDown)
 * - Pointer (mouse/touch) drag interaction on the track
 * - Customizable min, max, and step values
 * - Data attributes for CSS-based styling (`data-variant`, `data-disabled`, `data-orientation`)
 * - CSS custom property (`--slider-value`) for flexible thumb/track positioning
 *
 * @remarks
 * This component features:
 * - **Pointer drag** on the track element to set the value by position
 * - **Step snapping** ensures the value always aligns to the nearest valid step
 * - **Value clamping** keeps values within `[min, max]` regardless of input
 * - **Disabled state** uses `aria-disabled` instead of native `disabled` to keep the thumb focusable
 * - Uses `data-ck` attributes on root, track, and thumb for CSS targeting
 * - Forwards refs correctly for DOM access
 *
 * ## Keyboard Support
 *
 * | Key | Action |
 * | --- | --- |
 * | `ArrowRight` / `ArrowUp` | Increase value by one `step` |
 * | `ArrowLeft` / `ArrowDown` | Decrease value by one `step` |
 * | `Home` | Set value to `min` |
 * | `End` | Set value to `max` |
 * | `PageUp` | Increase value by 10× `step` |
 * | `PageDown` | Decrease value by 10× `step` |
 *
 * ## Accessibility
 *
 * This component follows the [WAI-ARIA Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/):
 * - Uses `role="slider"` on the thumb element for screen reader identification
 * - Sets `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` on the thumb
 * - Provide an accessible name via `aria-label` or `aria-labelledby`
 * - Use `aria-valuetext` for human-readable value descriptions
 *   (e.g., "50 percent" or "Medium volume")
 * - Uses `aria-disabled` instead of native `disabled` to keep the thumb focusable
 *   for screen reader users
 * - Prevents all keyboard and pointer interactions when disabled via event handlers
 *
 * ## Best Practices
 *
 * - Always associate with a `<label>` using `aria-labelledby`, or use `aria-label` for visually hidden labels
 * - Use `aria-valuetext` when the numeric value alone is not meaningful
 * - Choose a `step` that makes sense for the value range
 * - Ensure sufficient color contrast between track, thumb, and filled area
 * - Consider providing a visible value display alongside the slider
 *
 * @param {number} [defaultValue] - Initial value for uncontrolled mode. Defaults to `min`.
 * @param {boolean} [disabled] - If true, disables the slider.
 * @param {number} [max=100] - The maximum value of the slider.
 * @param {number} [min=0] - The minimum value of the slider.
 * @param {(value: number) => void} [onValueChange] - Callback fired when the value changes.
 * @param {number} [step=1] - The step increment between values.
 * @param {number} [value] - The controlled value. When provided, internal state is bypassed.
 * @param {string} [variantName] - The variant name for styling (e.g., "primary", "default").
 *
 * @example
 * // Basic slider with external label
 * <label id="volume-label">Volume</label>
 * <Slider aria-labelledby="volume-label" defaultValue={50} />
 *
 * @example
 * // With aria-label (no visible label)
 * <Slider aria-label="Volume" defaultValue={50} />
 *
 * @example
 * // Controlled slider
 * const [volume, setVolume] = useState(50);
 * <Slider aria-label="Volume" value={volume} onValueChange={setVolume} />
 *
 * @example
 * // Custom range and step
 * <Slider aria-label="Temperature" min={0} max={40} step={0.5} defaultValue={22} />
 *
 * @example
 * // With variant
 * <Slider aria-label="Brightness" defaultValue={75} variantName="primary" />
 *
 * @example
 * // Disabled slider
 * <Slider aria-label="Locked" defaultValue={30} disabled />
 *
 * @example
 * // With human-readable value text
 * <Slider
 *   aria-label="Priority"
 *   aria-valuetext="Medium priority"
 *   min={1}
 *   max={5}
 *   step={1}
 *   value={3}
 * />
 *
 * @example
 * // With ref for DOM access
 * const sliderRef = useRef<HTMLDivElement>(null);
 * <Slider ref={sliderRef} aria-label="Progress" defaultValue={25} />
 */

interface SliderProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  disabled?: boolean;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  step?: number;
  value?: number;
  variantName?: string;
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      defaultValue,
      disabled,
      max = 100,
      min = 0,
      onValueChange,
      step = 1,
      value,
      variantName,
      ...rest
    },
    ref,
  ) => {
    const {
      currentValue,
      handleKeyDown,
      handlePointerDown,
      percentage,
      trackRef,
    } = useSlider({
      defaultValue,
      disabled,
      max,
      min,
      onValueChange,
      step,
      value,
    });

    const thumbStyle: CSSProperties = {
      "--slider-value": `${percentage}%`,
    } as CSSProperties;

    return (
      <div
        {...rest}
        data-ck="slider"
        data-disabled={disabled || undefined}
        data-variant={variantName}
        ref={ref}
      >
        <div
          data-ck="slider-track"
          onPointerDown={handlePointerDown}
          ref={trackRef}
        >
          <div
            style={thumbStyle}
            aria-disabled={disabled || undefined}
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={currentValue}
            data-ck="slider-thumb"
            role="slider"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    );
  },
);

Slider.displayName = "Slider";

export { Slider, type SliderProps };
