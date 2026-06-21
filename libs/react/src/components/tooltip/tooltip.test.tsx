import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Tooltip, TooltipProvider } from "./tooltip";

describe("Tooltip Component", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Basic Rendering", () => {
    it("renders the trigger child", () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Trigger</button>
        </Tooltip>,
      );

      expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
    });

    it("does not render tooltip content when closed", () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Trigger</button>
        </Tooltip>,
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("renders tooltip content when defaultOpen is true", async () => {
      render(
        <Tooltip content="Tooltip text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
    });

    it("renders with data-ck='tooltip' attribute", async () => {
      const { baseElement } = render(
        <Tooltip content="Tooltip text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toBeInTheDocument();
    });

    it("renders with data-variant attribute", async () => {
      const { baseElement } = render(
        <Tooltip
          content="Tooltip text"
          defaultOpen
          portal={false}
          variantName="primary"
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveAttribute("data-variant", "primary");
    });

    it("sets data-state='open' when open", async () => {
      const { baseElement } = render(
        <Tooltip content="Tooltip text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveAttribute("data-state", "open");
    });

    it("has correct displayName", () => {
      expect(
        (Tooltip as unknown as { displayName?: string }).displayName,
      ).toBe("Tooltip");
    });
  });

  describe("Trigger Interaction", () => {
    it("opens on mouse hover after delay", async () => {
      const { baseElement } = render(
        <Tooltip content="Tooltip text" openDelay={200} portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.hover(trigger);
        vi.advanceTimersByTime(200);
      });

      await waitFor(() => {
        const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveAttribute("data-state", "open");
      });
    });

    it("closes on mouse leave after delay", async () => {
      render(
        <Tooltip
          closeDelay={100}
          content="Tooltip text"
          defaultOpen
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.unhover(trigger);
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("opens on keyboard focus", async () => {
      render(
        <Tooltip content="Tooltip text" openDelay={0} portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        trigger.focus();
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("closes on Escape key", async () => {
      render(
        <Tooltip content="Tooltip text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      await act(async () => {
        await userEvent.keyboard("{Escape}");
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("does not open when disabled", async () => {
      render(
        <Tooltip content="Tooltip text" disabled openDelay={0} portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.hover(trigger);
        vi.advanceTimersByTime(1000);
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Controlled Mode", () => {
    it("opens when open prop is true", async () => {
      render(
        <Tooltip content="Tooltip text" open portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("stays closed when open prop is false", async () => {
      render(
        <Tooltip content="Tooltip text" open={false} portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.hover(trigger);
        vi.advanceTimersByTime(1000);
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("calls onOpenChange when hover triggers open", async () => {
      const onOpenChange = vi.fn();

      render(
        <Tooltip
          content="Tooltip text"
          openDelay={0}
          portal={false}
          onOpenChange={onOpenChange}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.hover(trigger);
        vi.advanceTimersByTime(100);
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Content", () => {
    it("renders string content", async () => {
      render(
        <Tooltip content="Simple text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("tooltip")).toHaveTextContent("Simple text");
    });

    it("renders ReactNode content", async () => {
      render(
        <Tooltip
          content={
            <span data-testid="rich-content">
              <strong>Bold</strong> content
            </span>
          }
          defaultOpen
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId("rich-content")).toBeInTheDocument();
      expect(screen.getByText("Bold")).toBeInTheDocument();
    });

    it("renders arrow when showArrow is true", async () => {
      const { baseElement } = render(
        <Tooltip content="With arrow" defaultOpen portal={false} showArrow>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const arrow = baseElement.querySelector('[data-ck="tooltip-arrow"]');
      expect(arrow).toBeInTheDocument();
    });

    it("does not render arrow when showArrow is false", async () => {
      const { baseElement } = render(
        <Tooltip content="No arrow" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const arrow = baseElement.querySelector('[data-ck="tooltip-arrow"]');
      expect(arrow).not.toBeInTheDocument();
    });
  });

  describe("Placement & Data Attributes", () => {
    it("sets data-side attribute based on resolved placement", async () => {
      const { baseElement } = render(
        <Tooltip
          content="Top tooltip"
          defaultOpen
          placement="top"
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveAttribute("data-side", "top");
    });

    it("sets data-align attribute based on resolved alignment", async () => {
      const { baseElement } = render(
        <Tooltip
          content="Aligned tooltip"
          defaultOpen
          placement="top-start"
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveAttribute("data-align", "start");
    });

    it("defaults data-align to 'center' for simple placements", async () => {
      const { baseElement } = render(
        <Tooltip
          content="Center tooltip"
          defaultOpen
          placement="bottom"
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveAttribute("data-align", "center");
    });

    it("sets --ck-tooltip-transform-origin CSS custom property", async () => {
      const { baseElement } = render(
        <Tooltip
          content="Tooltip text"
          defaultOpen
          placement="top"
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveStyle({
        "--ck-tooltip-transform-origin": "bottom center",
      });
    });
  });

  describe("Portal", () => {
    it("renders inline when portal is false", async () => {
      const { container } = render(
        <Tooltip content="Inline tooltip" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = container.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("tooltip content has role='tooltip'", async () => {
      render(
        <Tooltip content="Accessible tooltip" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("trigger has aria-describedby when tooltip is open", async () => {
      render(
        <Tooltip content="Described tooltip" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const trigger = screen.getByRole("button", { name: "Trigger" });

      // useRole from @floating-ui/react manages aria-describedby
      // with its own internal ID linking trigger to tooltip
      expect(trigger).toHaveAttribute("aria-describedby");
    });

    it("uses auto-generated id when not provided", async () => {
      render(
        <Tooltip content="Auto ID tooltip" defaultOpen portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveAttribute("id");
      expect(tooltip.id).toMatch(/^ck-tooltip-/);
    });

    it("uses provided id", async () => {
      render(
        <Tooltip
          id="my-tooltip"
          content="Custom ID tooltip"
          defaultOpen
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveAttribute("id", "my-tooltip");
    });
  });

  describe("forceMount", () => {
    it("keeps content mounted when closed (forceMount=true)", async () => {
      const { baseElement } = render(
        <Tooltip content="Always mounted" forceMount portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute("data-state", "closed");
    });

    it("applies visibility:hidden when closed and forceMount", () => {
      const { baseElement } = render(
        <Tooltip content="Hidden tooltip" forceMount portal={false}>
          <button>Trigger</button>
        </Tooltip>,
      );

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveStyle({ visibility: "hidden" });
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to the tooltip content element", async () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <Tooltip content="Ref test" defaultOpen portal={false} ref={ref}>
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute("data-ck")).toBe("tooltip");
    });
  });

  describe("className", () => {
    it("applies className to the tooltip content", async () => {
      const { baseElement } = render(
        <Tooltip
          className="custom-tooltip"
          content="Styled tooltip"
          defaultOpen
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveClass("custom-tooltip");
    });
  });

  describe("maxWidth", () => {
    it("applies maxWidth as number (px)", async () => {
      const { baseElement } = render(
        <Tooltip
          content="Constrained tooltip"
          defaultOpen
          maxWidth={200}
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveStyle({ maxWidth: "200px" });
    });

    it("applies maxWidth as string", async () => {
      const { baseElement } = render(
        <Tooltip
          content="Constrained tooltip"
          defaultOpen
          maxWidth="50vw"
          portal={false}
        >
          <button>Trigger</button>
        </Tooltip>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const tooltip = baseElement.querySelector('[data-ck="tooltip"]');
      expect(tooltip).toHaveStyle({ maxWidth: "50vw" });
    });
  });
});

describe("TooltipProvider", () => {
  it("renders children", () => {
    render(
      <TooltipProvider>
        <button>Child</button>
      </TooltipProvider>,
    );

    expect(screen.getByRole("button", { name: "Child" })).toBeInTheDocument();
  });

  it("has correct displayName", () => {
    expect(
      (TooltipProvider as unknown as { displayName?: string }).displayName,
    ).toBe("TooltipProvider");
  });
});
