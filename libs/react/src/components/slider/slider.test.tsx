import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "./slider";

describe("Slider Component", () => {
  describe("Basic Rendering", () => {
    it("renders with slider role", () => {
      render(<Slider aria-label="Volume" />);

      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("renders track sub-element", () => {
      const { container } = render(<Slider aria-label="Volume" />);

      const track = container.querySelector('[data-ck="slider-track"]');
      expect(track).toBeInTheDocument();
    });

    it("renders thumb sub-element", () => {
      const { container } = render(<Slider aria-label="Volume" />);

      const thumb = container.querySelector('[data-ck="slider-thumb"]');
      expect(thumb).toBeInTheDocument();
    });

    it("renders range sub-element inside track", () => {
      const { container } = render(<Slider aria-label="Volume" />);

      const range = container.querySelector('[data-ck="slider-range"]');
      expect(range).toBeInTheDocument();

      const track = container.querySelector('[data-ck="slider-track"]');
      expect(track).toContainElement(range as HTMLElement);
    });

    it("renders thumb as sibling to track, not inside track", () => {
      const { container } = render(<Slider aria-label="Volume" />);

      const track = container.querySelector('[data-ck="slider-track"]');
      const thumb = container.querySelector('[data-ck="slider-thumb"]');

      expect(track).not.toContainElement(thumb as HTMLElement);

      const root = container.firstElementChild;
      expect(root).toContainElement(track as HTMLElement);
      expect(root).toContainElement(thumb as HTMLElement);
    });

    it("applies data-ck='slider' on root element", () => {
      const { container } = render(<Slider aria-label="Volume" />);

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-ck", "slider");
    });

    it("renders with default min=0, max=100, step=1", () => {
      render(<Slider aria-label="Volume" />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemin", "0");
      expect(thumb).toHaveAttribute("aria-valuemax", "100");
      expect(thumb).toHaveAttribute("aria-valuenow", "0");
    });

    it("applies variantName as data-variant on root", () => {
      const { container } = render(
        <Slider aria-label="Volume" variantName="primary" />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-variant", "primary");
    });

    it("does not set data-variant when variantName is not provided", () => {
      const { container } = render(<Slider aria-label="Volume" />);

      const root = container.firstElementChild;
      expect(root).not.toHaveAttribute("data-variant");
    });
  });

  describe("Controlled Mode", () => {
    it("reflects the value prop", () => {
      render(<Slider aria-label="Volume" value={75} />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuenow", "75");
    });

    it("calls onValueChange on keyboard interaction", async () => {
      const handleChange = vi.fn();
      render(
        <Slider
          aria-label="Volume"
          value={50}
          onValueChange={handleChange}
        />,
      );

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });

      expect(handleChange).toHaveBeenCalledWith(51);
    });

    it("updates on rerender with new value", () => {
      const { rerender } = render(
        <Slider aria-label="Volume" value={25} />,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuenow", "25");

      rerender(<Slider aria-label="Volume" value={75} />);
      expect(thumb).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("Uncontrolled Mode", () => {
    it("uses defaultValue as initial value", () => {
      render(<Slider aria-label="Volume" defaultValue={40} />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuenow", "40");
    });

    it("defaults to min when no defaultValue is provided", () => {
      render(<Slider aria-label="Volume" />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuenow", "0");
    });

    it("manages internal state on keyboard interaction", () => {
      render(<Slider aria-label="Volume" defaultValue={50} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });

      expect(thumb).toHaveAttribute("aria-valuenow", "51");
    });
  });

  describe("Disabled State", () => {
    it("sets aria-disabled when disabled", () => {
      render(<Slider aria-label="Volume" defaultValue={50} disabled />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-disabled", "true");
    });

    it("sets data-disabled on root when disabled", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} disabled />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-disabled", "true");
    });

    it("does not set data-disabled when not disabled", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );

      const root = container.firstElementChild;
      expect(root).not.toHaveAttribute("data-disabled");
    });

    it("prevents keyboard interaction when disabled", () => {
      const handleChange = vi.fn();
      render(
        <Slider
          aria-label="Volume"
          defaultValue={50}
          disabled
          onValueChange={handleChange}
        />,
      );

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      fireEvent.keyDown(thumb, { key: "ArrowLeft" });
      fireEvent.keyDown(thumb, { key: "Home" });
      fireEvent.keyDown(thumb, { key: "End" });

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("sets tabIndex to -1 when disabled", () => {
      render(<Slider aria-label="Volume" defaultValue={50} disabled />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("tabindex", "-1");
    });

    it("has tabIndex 0 when not disabled", () => {
      render(<Slider aria-label="Volume" defaultValue={50} />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("tabindex", "0");
    });
  });

  describe("Keyboard Navigation", () => {
    it("ArrowRight increases value by step", () => {
      render(<Slider aria-label="Volume" defaultValue={50} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });

      expect(thumb).toHaveAttribute("aria-valuenow", "51");
    });

    it("ArrowLeft decreases value by step", () => {
      render(<Slider aria-label="Volume" defaultValue={50} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowLeft" });

      expect(thumb).toHaveAttribute("aria-valuenow", "49");
    });

    it("ArrowUp increases value by step", () => {
      render(<Slider aria-label="Volume" defaultValue={50} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowUp" });

      expect(thumb).toHaveAttribute("aria-valuenow", "51");
    });

    it("ArrowDown decreases value by step", () => {
      render(<Slider aria-label="Volume" defaultValue={50} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowDown" });

      expect(thumb).toHaveAttribute("aria-valuenow", "49");
    });

    it("Home sets value to min", () => {
      render(<Slider aria-label="Volume" defaultValue={50} min={10} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "Home" });

      expect(thumb).toHaveAttribute("aria-valuenow", "10");
    });

    it("End sets value to max", () => {
      render(<Slider aria-label="Volume" defaultValue={50} max={200} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "End" });

      expect(thumb).toHaveAttribute("aria-valuenow", "200");
    });

    it("PageUp increases value by 10x step", () => {
      render(<Slider aria-label="Volume" defaultValue={50} step={2} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "PageUp" });

      expect(thumb).toHaveAttribute("aria-valuenow", "70");
    });

    it("PageDown decreases value by 10x step", () => {
      render(<Slider aria-label="Volume" defaultValue={50} step={2} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "PageDown" });

      expect(thumb).toHaveAttribute("aria-valuenow", "30");
    });

    it("does not exceed max on ArrowRight", () => {
      render(<Slider aria-label="Volume" defaultValue={100} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });

      expect(thumb).toHaveAttribute("aria-valuenow", "100");
    });

    it("does not go below min on ArrowLeft", () => {
      render(<Slider aria-label="Volume" defaultValue={0} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowLeft" });

      expect(thumb).toHaveAttribute("aria-valuenow", "0");
    });

    it("respects custom step value", () => {
      render(<Slider aria-label="Volume" defaultValue={50} step={5} />);

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });

      expect(thumb).toHaveAttribute("aria-valuenow", "55");
    });

    it("calls onValueChange on each key press", () => {
      const handleChange = vi.fn();
      render(
        <Slider
          aria-label="Volume"
          defaultValue={50}
          onValueChange={handleChange}
        />,
      );

      const thumb = screen.getByRole("slider");
      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      fireEvent.keyDown(thumb, { key: "ArrowLeft" });

      expect(handleChange).toHaveBeenCalledTimes(2);
      expect(handleChange).toHaveBeenNthCalledWith(1, 51);
      expect(handleChange).toHaveBeenNthCalledWith(2, 50);
    });
  });

  describe("Min/Max/Step Props", () => {
    it("applies custom min to aria-valuemin", () => {
      render(<Slider aria-label="Volume" min={10} />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemin", "10");
    });

    it("applies custom max to aria-valuemax", () => {
      render(<Slider aria-label="Volume" max={200} />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemax", "200");
    });

    it("defaults min=0, max=100", () => {
      render(<Slider aria-label="Volume" />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemin", "0");
      expect(thumb).toHaveAttribute("aria-valuemax", "100");
    });

    it("clamps value to max", () => {
      render(
        <Slider aria-label="Volume" defaultValue={150} max={100} />,
      );

      const thumb = screen.getByRole("slider");
      // Value is snapped/clamped by the hook
      expect(Number(thumb.getAttribute("aria-valuenow"))).toBeLessThanOrEqual(
        100,
      );
    });

    it("clamps value to min", () => {
      render(
        <Slider aria-label="Volume" defaultValue={-10} min={0} />,
      );

      const thumb = screen.getByRole("slider");
      expect(Number(thumb.getAttribute("aria-valuenow"))).toBeGreaterThanOrEqual(
        0,
      );
    });

    it("handles custom range with step", () => {
      render(
        <Slider
          aria-label="Volume"
          defaultValue={30}
          max={50}
          min={10}
          step={10}
        />,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemin", "10");
      expect(thumb).toHaveAttribute("aria-valuemax", "50");
      expect(thumb).toHaveAttribute("aria-valuenow", "30");

      fireEvent.keyDown(thumb, { key: "ArrowRight" });
      expect(thumb).toHaveAttribute("aria-valuenow", "40");
    });
  });

  describe("Data Attributes", () => {
    it("has data-ck='slider' on root element", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-ck", "slider");
    });

    it("has data-ck='slider-track' on track element", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );

      const track = container.querySelector('[data-ck="slider-track"]');
      expect(track).toBeInTheDocument();
    });

    it("has data-ck='slider-thumb' on thumb element", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );

      const thumb = container.querySelector('[data-ck="slider-thumb"]');
      expect(thumb).toBeInTheDocument();
    });

    it("has data-ck='slider-range' inside track element", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );

      const range = container.querySelector('[data-ck="slider-range"]');
      expect(range).toBeInTheDocument();

      const track = container.querySelector('[data-ck="slider-track"]');
      expect(track).toContainElement(range as HTMLElement);
    });

    it("has data-variant on root when variantName is set", () => {
      const { container } = render(
        <Slider
          aria-label="Volume"
          defaultValue={50}
          variantName="success"
        />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-variant", "success");
    });

    it("has data-disabled on root when disabled", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} disabled />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-disabled", "true");
    });

    it("omits data-disabled when not disabled", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );

      const root = container.firstElementChild;
      expect(root).not.toHaveAttribute("data-disabled");
    });

  });

  describe("CSS Custom Properties", () => {
    it("sets --slider-value percentage on root", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={50} />,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue("--slider-value")).toBe("50%");
    });

    it("sets --slider-value to 0% at min", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={0} />,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue("--slider-value")).toBe("0%");
    });

    it("sets --slider-value to 100% at max", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={100} />,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue("--slider-value")).toBe("100%");
    });

    it("calculates correct percentage with custom min/max", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={75} max={150} min={50} />,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue("--slider-value")).toBe("25%");
    });

    it("updates --slider-value when value changes", () => {
      const { container, rerender } = render(
        <Slider aria-label="Volume" value={25} />,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue("--slider-value")).toBe("25%");

      rerender(<Slider aria-label="Volume" value={75} />);
      expect(root.style.getPropertyValue("--slider-value")).toBe("75%");
    });
  });

  describe("Accessibility", () => {
    it("has role='slider' on thumb element", () => {
      render(<Slider aria-label="Volume" />);

      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("has aria-valuemin set", () => {
      render(<Slider aria-label="Volume" min={10} />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemin", "10");
    });

    it("has aria-valuemax set", () => {
      render(<Slider aria-label="Volume" max={200} />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuemax", "200");
    });

    it("has aria-valuenow set", () => {
      render(<Slider aria-label="Volume" defaultValue={60} />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuenow", "60");
    });

    it("supports aria-label for accessible name", () => {
      render(<Slider aria-label="Volume control" defaultValue={50} />);

      expect(screen.getByLabelText("Volume control")).toBeInTheDocument();
    });

    it("supports aria-labelledby on thumb", () => {
      render(
        <>
          <label id="volume-label">Volume</label>
          <Slider aria-labelledby="volume-label" defaultValue={50} />
        </>,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-labelledby", "volume-label");
    });

    it("supports aria-valuetext on thumb", () => {
      render(
        <Slider
          aria-label="Priority"
          aria-valuetext="Medium priority"
          defaultValue={3}
          max={5}
          min={1}
        />,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuetext", "Medium priority");
    });

    it("supports aria-describedby on thumb", () => {
      render(
        <>
          <div id="description">Adjust the volume level</div>
          <Slider
            aria-describedby="description"
            aria-label="Volume"
            defaultValue={50}
          />
        </>,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-describedby", "description");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to root div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Slider aria-label="Volume" defaultValue={50} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute("data-ck", "slider");
    });

    it("works with callback refs", () => {
      let refElement: HTMLDivElement | null = null;
      const callbackRef = (element: HTMLDivElement | null) => {
        refElement = element;
      };

      render(
        <Slider aria-label="Volume" defaultValue={50} ref={callbackRef} />,
      );

      expect(refElement).toBeInstanceOf(HTMLDivElement);
      expect(refElement).toHaveAttribute("data-ck", "slider");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      const { container } = render(
        <Slider
          id="slider-id"
          aria-label="Volume"
          data-testid="custom-slider"
          defaultValue={50}
          title="Volume slider"
        />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("id", "slider-id");
      expect(root).toHaveAttribute("title", "Volume slider");
    });

    it("applies className correctly", () => {
      const { container } = render(
        <Slider
          className="custom-class"
          aria-label="Volume"
          defaultValue={50}
        />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveClass("custom-class");
    });

    it("applies style correctly", () => {
      const { container } = render(
        <Slider
          style={{ width: "300px" }}
          aria-label="Volume"
          defaultValue={50}
        />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveStyle({ width: "300px" });
    });
  });

  describe("Edge Cases", () => {
    it("handles value at min boundary (0%)", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={0} max={100} min={0} />,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuenow", "0");

      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue("--slider-value")).toBe("0%");
    });

    it("handles value at max boundary (100%)", () => {
      const { container } = render(
        <Slider aria-label="Volume" defaultValue={100} max={100} min={0} />,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuenow", "100");

      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue("--slider-value")).toBe("100%");
    });

    it("handles min equal to max", () => {
      render(
        <Slider
          aria-label="Volume"
          defaultValue={50}
          max={50}
          min={50}
        />,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toBeInTheDocument();
    });

    it("handles multiple sliders on page", () => {
      render(
        <>
          <Slider aria-label="Volume" defaultValue={25} />
          <Slider aria-label="Brightness" defaultValue={75} />
        </>,
      );

      const sliders = screen.getAllByRole("slider");
      expect(sliders).toHaveLength(2);
      expect(sliders[0]).toHaveAttribute("aria-valuenow", "25");
      expect(sliders[1]).toHaveAttribute("aria-valuenow", "75");
    });

    it("renders without any custom props", () => {
      render(<Slider />);

      const thumb = screen.getByRole("slider");
      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveAttribute("aria-valuenow", "0");
    });

    it("handles rerender from one value to another", () => {
      const { rerender } = render(
        <Slider aria-label="Volume" value={25} />,
      );

      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("aria-valuenow", "25");

      rerender(<Slider aria-label="Volume" value={75} />);
      expect(thumb).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Slider.displayName).toBe("Slider");
    });
  });
});
