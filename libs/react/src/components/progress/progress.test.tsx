import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Progress } from "./progress";

describe("Progress Component", () => {
  describe("Basic Rendering", () => {
    it("renders with progressbar role", () => {
      render(<Progress aria-label="Progress" />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders the track sub-element", () => {
      const { container } = render(<Progress aria-label="Progress" />);

      const track = container.querySelector('[data-ck="progress-track"]');
      expect(track).toBeInTheDocument();
    });

    it("renders the indicator sub-element", () => {
      const { container } = render(<Progress aria-label="Progress" />);

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      );
      expect(indicator).toBeInTheDocument();
    });

    it("applies data-ck='progress' on root element", () => {
      const { container } = render(<Progress aria-label="Progress" />);

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-ck", "progress");
    });

    it("renders with default min=0 and max=100", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemin", "0");
      expect(track).toHaveAttribute("aria-valuemax", "100");
    });

    it("applies variantName as data-variant on root", () => {
      const { container } = render(
        <Progress aria-label="Progress" variantName="primary" />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-variant", "primary");
    });

    it("does not set data-variant when variantName is not provided", () => {
      const { container } = render(<Progress aria-label="Progress" />);

      const root = container.firstElementChild;
      expect(root).not.toHaveAttribute("data-variant");
    });
  });

  describe("Label Prop", () => {
    it("renders label text when provided", () => {
      render(<Progress label="Uploading..." value={50} />);

      expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });

    it("renders label with data-slot='label'", () => {
      render(<Progress label="Uploading..." value={50} />);

      const label = screen.getByText("Uploading...");
      expect(label).toHaveAttribute("data-slot", "label");
    });

    it("does not render label element when not provided", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={50} />,
      );

      const label = container.querySelector('[data-slot="label"]');
      expect(label).not.toBeInTheDocument();
    });

    it("sets data-has-label on root when label is provided", () => {
      const { container } = render(
        <Progress label="Uploading..." value={50} />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-has-label", "true");
    });

    it("omits data-has-label when label is not provided", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={50} />,
      );

      const root = container.firstElementChild;
      expect(root).not.toHaveAttribute("data-has-label");
    });

    it("sets aria-labelledby on track when label is provided", () => {
      render(<Progress label="Uploading..." value={50} />);

      const track = screen.getByRole("progressbar");
      const labelEl = screen.getByText("Uploading...");
      expect(track).toHaveAttribute("aria-labelledby", labelEl.id);
    });

    it("does not set aria-labelledby when label is not provided", () => {
      render(<Progress aria-label="Progress" value={50} />);

      const track = screen.getByRole("progressbar");
      expect(track).not.toHaveAttribute("aria-labelledby");
    });

    it("renders ReactNode label", () => {
      render(
        <Progress
          label={<span data-testid="custom-label">Custom Label</span>}
          value={50}
        />,
      );

      expect(screen.getByTestId("custom-label")).toBeInTheDocument();
      expect(screen.getByText("Custom Label")).toBeInTheDocument();
    });
  });

  describe("Determinate Mode", () => {
    it("sets data-state to 'determinate' when value is provided", () => {
      render(<Progress aria-label="Progress" value={50} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-state", "determinate");
    });

    it("sets aria-valuenow to the provided value", () => {
      render(<Progress aria-label="Progress" value={50} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuenow", "50");
    });

    it("sets data-value to the provided value", () => {
      render(<Progress aria-label="Progress" value={50} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-value", "50");
    });

    it("calculates correct percentage for indicator", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={50} />,
      );

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("50%");
    });

    it("calculates correct percentage with custom min/max", () => {
      const { container } = render(
        <Progress aria-label="Progress" max={150} min={50} value={75} />,
      );

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("25%");
    });

    it("sets --progress-value CSS custom property on indicator", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={75} />,
      );

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("75%");
    });

    it("updates when value changes on rerender", () => {
      const { container, rerender } = render(
        <Progress aria-label="Progress" value={25} />,
      );

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuenow", "25");

      rerender(<Progress aria-label="Progress" value={75} />);
      expect(track).toHaveAttribute("aria-valuenow", "75");

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("75%");
    });
  });

  describe("Indeterminate Mode", () => {
    it("sets data-state to 'indeterminate' when value is undefined", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-state", "indeterminate");
    });

    it("sets data-state to 'indeterminate' when value is null", () => {
      render(<Progress aria-label="Progress" value={null} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-state", "indeterminate");
    });

    it("does not set aria-valuenow when indeterminate", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).not.toHaveAttribute("aria-valuenow");
    });

    it("does not set data-value when indeterminate", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).not.toHaveAttribute("data-value");
    });

    it("does not set --progress-value when indeterminate", () => {
      const { container } = render(<Progress aria-label="Progress" />);

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("");
    });

    it("renders without value prop (default indeterminate)", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-state", "indeterminate");
      expect(track).not.toHaveAttribute("aria-valuenow");
    });
  });

  describe("Min/Max Props", () => {
    it("applies custom min value to aria-valuemin", () => {
      render(<Progress aria-label="Progress" min={10} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemin", "10");
    });

    it("applies custom max value to aria-valuemax", () => {
      render(<Progress aria-label="Progress" max={200} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemax", "200");
    });

    it("applies max value to data-max", () => {
      render(<Progress aria-label="Progress" max={200} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-max", "200");
    });

    it("defaults min to 0 when not provided", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemin", "0");
    });

    it("defaults max to 100 when not provided", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemax", "100");
      expect(track).toHaveAttribute("data-max", "100");
    });

    it("handles min and max with custom range", () => {
      const { container } = render(
        <Progress aria-label="Progress" max={50} min={10} value={30} />,
      );

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemin", "10");
      expect(track).toHaveAttribute("aria-valuemax", "50");
      expect(track).toHaveAttribute("aria-valuenow", "30");

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("50%");
    });
  });

  describe("Value Clamping", () => {
    it("clamps percentage to 0 when value is below min", () => {
      const { container } = render(
        <Progress aria-label="Progress" min={10} value={5} />,
      );

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("0%");
    });

    it("clamps percentage to 100 when value is above max", () => {
      const { container } = render(
        <Progress aria-label="Progress" max={100} value={150} />,
      );

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("100%");
    });

    it("handles value equal to min (0%)", () => {
      const { container } = render(
        <Progress aria-label="Progress" min={0} value={0} />,
      );

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("0%");
    });

    it("handles value equal to max (100%)", () => {
      const { container } = render(
        <Progress aria-label="Progress" max={100} value={100} />,
      );

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("100%");
    });
  });

  describe("Accessibility", () => {
    it("has role='progressbar' on track element", () => {
      render(<Progress aria-label="Progress" />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("has aria-valuemin set", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemin", "0");
    });

    it("has aria-valuemax set", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemax", "100");
    });

    it("has aria-valuenow when determinate", () => {
      render(<Progress aria-label="Progress" value={60} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuenow", "60");
    });

    it("omits aria-valuenow when indeterminate", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).not.toHaveAttribute("aria-valuenow");
    });

    it("supports aria-label for accessible name", () => {
      render(<Progress aria-label="Upload progress" value={50} />);

      expect(screen.getByLabelText("Upload progress")).toBeInTheDocument();
    });

    it("links label to progressbar via aria-labelledby", () => {
      render(<Progress label="File upload" value={50} />);

      const track = screen.getByRole("progressbar");
      const labelEl = screen.getByText("File upload");
      expect(track).toHaveAttribute("aria-labelledby", labelEl.id);
    });

    it("supports aria-valuetext for human-readable value description", () => {
      const { container } = render(
        <Progress
          aria-label="Steps"
          aria-valuetext="Step 3 of 10"
          max={10}
          value={3}
        />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("aria-valuetext", "Step 3 of 10");
    });

    it("supports aria-describedby", () => {
      const { container } = render(
        <>
          <div id="description">Upload progress for your files</div>
          <Progress
            aria-describedby="description"
            aria-label="Upload"
            value={50}
          />
        </>,
      );

      const root = container.querySelector('[data-ck="progress"]');
      expect(root).toHaveAttribute("aria-describedby", "description");
    });
  });

  describe("Data Attributes", () => {
    it("has data-ck='progress' on root element", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={50} />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-ck", "progress");
    });

    it("has data-ck='progress-track' on track element", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={50} />,
      );

      const track = container.querySelector('[data-ck="progress-track"]');
      expect(track).toBeInTheDocument();
    });

    it("has data-ck='progress-indicator' on indicator element", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={50} />,
      );

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      );
      expect(indicator).toBeInTheDocument();
    });

    it("has data-state attribute on track reflecting mode", () => {
      const { rerender } = render(
        <Progress aria-label="Progress" value={50} />,
      );

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-state", "determinate");

      rerender(<Progress aria-label="Progress" />);
      expect(track).toHaveAttribute("data-state", "indeterminate");
    });

    it("has data-max on track", () => {
      render(<Progress aria-label="Progress" max={200} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-max", "200");
    });

    it("has data-value on track when determinate", () => {
      render(<Progress aria-label="Progress" value={75} />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-value", "75");
    });

    it("omits data-value on track when indeterminate", () => {
      render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).not.toHaveAttribute("data-value");
    });

    it("has data-variant on root when variantName is set", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={50} variantName="success" />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-variant", "success");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to root div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Progress aria-label="Progress" value={50} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute("data-ck", "progress");
    });

    it("works with callback refs", () => {
      let refElement: HTMLDivElement | null = null;
      const callbackRef = (element: HTMLDivElement | null) => {
        refElement = element;
      };

      render(<Progress aria-label="Progress" value={50} ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLDivElement);
      expect(refElement).toHaveAttribute("data-ck", "progress");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      const { container } = render(
        <Progress
          id="progress-id"
          aria-label="Progress"
          data-testid="custom-progress"
          title="Progress title"
          value={50}
        />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("id", "progress-id");
      expect(root).toHaveAttribute("title", "Progress title");
    });

    it("applies className correctly", () => {
      const { container } = render(
        <Progress
          className="custom-class"
          aria-label="Progress"
          value={50}
        />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveClass("custom-class");
    });

    it("applies style correctly", () => {
      const { container } = render(
        <Progress
          style={{ height: "8px" }}
          aria-label="Progress"
          value={50}
        />,
      );

      const root = container.firstElementChild;
      expect(root).toHaveStyle({ height: "8px" });
    });

    it("supports event handlers", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Progress
          aria-label="Progress"
          value={50}
          onClick={handleClick}
        />,
      );

      const root = container.firstElementChild as HTMLElement;
      fireEvent.click(root);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("handles value of 0 correctly (0%)", () => {
      const { container } = render(
        <Progress aria-label="Progress" value={0} />,
      );

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-state", "determinate");
      expect(track).toHaveAttribute("aria-valuenow", "0");
      expect(track).toHaveAttribute("data-value", "0");

      const indicator = container.querySelector(
        '[data-ck="progress-indicator"]',
      ) as HTMLElement;
      expect(indicator.style.getPropertyValue("--progress-value")).toBe("0%");
    });

    it("handles min equal to max", () => {
      render(
        <Progress aria-label="Progress" max={100} min={100} value={100} />,
      );

      const track = screen.getByRole("progressbar");
      expect(track).toBeInTheDocument();
    });

    it("renders without any props", () => {
      render(<Progress />);

      const track = screen.getByRole("progressbar");
      expect(track).toBeInTheDocument();
      expect(track).toHaveAttribute("data-state", "indeterminate");
    });

    it("handles rerender from determinate to indeterminate", () => {
      const { rerender } = render(
        <Progress aria-label="Progress" value={50} />,
      );

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-state", "determinate");
      expect(track).toHaveAttribute("aria-valuenow", "50");

      rerender(<Progress aria-label="Progress" />);
      expect(track).toHaveAttribute("data-state", "indeterminate");
      expect(track).not.toHaveAttribute("aria-valuenow");
    });

    it("handles rerender from indeterminate to determinate", () => {
      const { rerender } = render(<Progress aria-label="Progress" />);

      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("data-state", "indeterminate");

      rerender(<Progress aria-label="Progress" value={75} />);
      expect(track).toHaveAttribute("data-state", "determinate");
      expect(track).toHaveAttribute("aria-valuenow", "75");
    });

    it("handles multiple progress bars", () => {
      render(
        <>
          <Progress aria-label="First" value={25} />
          <Progress aria-label="Second" value={75} />
        </>,
      );

      const progressBars = screen.getAllByRole("progressbar");
      expect(progressBars).toHaveLength(2);
      expect(progressBars[0]).toHaveAttribute("aria-valuenow", "25");
      expect(progressBars[1]).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Progress.displayName).toBe("Progress");
    });
  });
});
