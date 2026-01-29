import { useCallback, useRef, useState } from "react";

interface UseSliderOptions {
  defaultValue?: number;
  disabled?: boolean;
  max: number;
  min: number;
  onValueChange?: (value: number) => void;
  step: number;
  value?: number;
}

/**
 * A headless hook for managing slider state, keyboard navigation, and pointer interaction.
 *
 * @description
 * The `useSlider` hook provides all the logic needed to build an accessible slider component
 * following the WAI-ARIA Slider pattern. It manages:
 * - Slider value state with controlled (`value`) and uncontrolled (`defaultValue`) modes
 * - Keyboard navigation (Arrow keys, Home, End, PageUp, PageDown)
 * - Pointer (mouse/touch) drag interaction
 * - Value clamping and step snapping
 *
 * @remarks
 * - Arrow keys adjust by `step`; PageUp/PageDown adjust by 10× `step`
 * - Home sets value to `min`; End sets value to `max`
 * - All values are clamped to `[min, max]` and snapped to the nearest step
 * - Pointer drag uses `pointermove`/`pointerup` events on `document` for reliable tracking
 * - When `disabled` is true, all keyboard and pointer interactions are blocked
 *
 * ## Accessibility
 *
 * This hook implements the [WAI-ARIA Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/):
 * - **`role="slider"`** on the thumb element
 * - **`aria-valuenow`**, **`aria-valuemin`**, **`aria-valuemax`** for range communication
 * - **`aria-disabled`** when disabled (keeps element focusable)
 * - Keyboard navigation follows WAI-ARIA recommended key bindings
 *
 * @param {UseSliderOptions} options - Configuration object
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @param {number} options.step - Step increment
 * @param {boolean} [options.disabled] - Whether the slider is disabled
 * @param {number} [options.value] - Controlled value. When provided, internal state is bypassed.
 * @param {number} [options.defaultValue] - Initial value for uncontrolled mode
 * @param {(value: number) => void} [options.onValueChange] - Callback fired when the value changes
 */
export function useSlider(options: UseSliderOptions) {
  const { defaultValue, disabled, max, min, onValueChange, step, value } =
    options;

  const initialValue = defaultValue ?? min;

  const [valueInternal, setValueInternal] = useState(() => {
    // Clamp and snap the initial value
    const snapped = Math.round((initialValue - min) / step) * step + min;
    return Math.min(Math.max(snapped, min), max);
  });

  const currentValue = value !== undefined ? value : valueInternal;

  const trackRef = useRef<HTMLDivElement | null>(null);

  // Helper: clamp and snap to step
  const clampAndSnap = useCallback(
    (raw: number): number => {
      const snapped = Math.round((raw - min) / step) * step + min;
      return Math.min(Math.max(snapped, min), max);
    },
    [max, min, step],
  );

  // Helper: update value
  const updateValue = useCallback(
    (newValue: number) => {
      const clamped = clampAndSnap(newValue);
      if (value === undefined) {
        setValueInternal(clamped);
      }
      onValueChange?.(clamped);
    },
    [clampAndSnap, onValueChange, value],
  );

  // Percentage for CSS positioning
  const percentage =
    max === min ? 0 : Math.min(Math.max(((currentValue - min) / (max - min)) * 100, 0), 100);

  // Handler: Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) {
        if (
          e.key === "ArrowRight" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "Home" ||
          e.key === "End" ||
          e.key === "PageUp" ||
          e.key === "PageDown"
        ) {
          e.preventDefault();
        }
        return;
      }

      let handled = false;

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        updateValue(currentValue + step);
        handled = true;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        updateValue(currentValue - step);
        handled = true;
      } else if (e.key === "Home") {
        updateValue(min);
        handled = true;
      } else if (e.key === "End") {
        updateValue(max);
        handled = true;
      } else if (e.key === "PageUp") {
        updateValue(currentValue + step * 10);
        handled = true;
      } else if (e.key === "PageDown") {
        updateValue(currentValue - step * 10);
        handled = true;
      }

      if (handled) {
        e.preventDefault();
      }
    },
    [currentValue, disabled, max, min, step, updateValue],
  );

  // Helper: compute value from pointer position
  const getValueFromPointer = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return currentValue;

      const rect = track.getBoundingClientRect();
      const fraction = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1,
      );
      return clampAndSnap(min + fraction * (max - min));
    },
    [clampAndSnap, currentValue, max, min],
  );

  // Handler: Pointer down on track (starts drag)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;

      e.preventDefault();
      const newValue = getValueFromPointer(e.clientX);
      updateValue(newValue);

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const moveValue = getValueFromPointer(moveEvent.clientX);
        updateValue(moveValue);
      };

      const handlePointerUp = () => {
        target.releasePointerCapture(e.pointerId);
        target.removeEventListener("pointermove", handlePointerMove);
        target.removeEventListener("pointerup", handlePointerUp);
      };

      target.addEventListener("pointermove", handlePointerMove);
      target.addEventListener("pointerup", handlePointerUp);
    },
    [disabled, getValueFromPointer, updateValue],
  );

  return {
    currentValue,
    handleKeyDown,
    handlePointerDown,
    percentage,
    trackRef,
  };
}
