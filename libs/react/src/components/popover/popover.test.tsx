import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Popover } from "./popover";

describe("Popover Component", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Basic Rendering", () => {
    it("renders the trigger child", () => {
      render(
        <Popover content="Popover text">
          <button>Trigger</button>
        </Popover>,
      );

      expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
    });

    it("does not render popover content when closed", () => {
      render(
        <Popover content="Popover text">
          <button>Trigger</button>
        </Popover>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders popover content when defaultOpen is true", async () => {
      render(
        <Popover content="Popover text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toHaveTextContent("Popover text");
    });

    it("renders with data-ck='popover' attribute", async () => {
      const { baseElement } = render(
        <Popover content="Popover text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toBeInTheDocument();
    });

    it("renders with data-variant attribute", async () => {
      const { baseElement } = render(
        <Popover
          content="Popover text"
          defaultOpen
          portal={false}
          variantName="primary"
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveAttribute("data-variant", "primary");
    });

    it("sets data-state='open' when open", async () => {
      const { baseElement } = render(
        <Popover content="Popover text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveAttribute("data-state", "open");
    });

    it("has correct displayName", () => {
      expect(
        (Popover as unknown as { displayName?: string }).displayName,
      ).toBe("Popover");
    });
  });

  describe("Click Interaction", () => {
    it("opens on click", async () => {
      const { baseElement } = render(
        <Popover content="Popover text" portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.click(trigger);
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        const popover = baseElement.querySelector('[data-ck="popover"]');
        expect(popover).toBeInTheDocument();
        expect(popover).toHaveAttribute("data-state", "open");
      });
    });

    it("closes on second click (toggle)", async () => {
      render(
        <Popover content="Popover text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.click(trigger);
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("closes on Escape key", async () => {
      render(
        <Popover content="Popover text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await act(async () => {
        await userEvent.keyboard("{Escape}");
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("does not open when disabled", async () => {
      render(
        <Popover content="Popover text" disabled portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.click(trigger);
        vi.advanceTimersByTime(1000);
      });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not close on Escape when closeOnEscape is false", async () => {
      const { baseElement } = render(
        <Popover
          closeOnEscape={false}
          content="Popover text"
          defaultOpen
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await act(async () => {
        await userEvent.keyboard("{Escape}");
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toBeInTheDocument();
    });
  });

  describe("Controlled Mode", () => {
    it("opens when open prop is true", async () => {
      render(
        <Popover content="Popover text" open portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("stays closed when open prop is false", async () => {
      render(
        <Popover content="Popover text" open={false} portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.click(trigger);
        vi.advanceTimersByTime(1000);
      });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("calls onOpenChange when click triggers open", async () => {
      const onOpenChange = vi.fn();

      render(
        <Popover
          content="Popover text"
          portal={false}
          onOpenChange={onOpenChange}
        >
          <button>Trigger</button>
        </Popover>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      await act(async () => {
        await userEvent.click(trigger);
        vi.advanceTimersByTime(100);
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Content", () => {
    it("renders string content", async () => {
      render(
        <Popover content="Simple text" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toHaveTextContent("Simple text");
    });

    it("renders ReactNode content", async () => {
      render(
        <Popover
          content={
            <span data-testid="rich-content">
              <strong>Bold</strong> content
            </span>
          }
          defaultOpen
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId("rich-content")).toBeInTheDocument();
      expect(screen.getByText("Bold")).toBeInTheDocument();
    });

    it("renders arrow when showArrow is true", async () => {
      const { baseElement } = render(
        <Popover content="With arrow" defaultOpen portal={false} showArrow>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const arrow = baseElement.querySelector('[data-ck="popover-arrow"]');
      expect(arrow).toBeInTheDocument();
    });

    it("does not render arrow when showArrow is false", async () => {
      const { baseElement } = render(
        <Popover content="No arrow" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const arrow = baseElement.querySelector('[data-ck="popover-arrow"]');
      expect(arrow).not.toBeInTheDocument();
    });
  });

  describe("Placement & Data Attributes", () => {
    it("sets data-side attribute based on resolved placement", async () => {
      const { baseElement } = render(
        <Popover
          content="Top popover"
          defaultOpen
          placement="top"
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveAttribute("data-side", "top");
    });

    it("sets data-align attribute based on resolved alignment", async () => {
      const { baseElement } = render(
        <Popover
          content="Aligned popover"
          defaultOpen
          placement="top-start"
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveAttribute("data-align", "start");
    });

    it("defaults data-align to 'center' for simple placements", async () => {
      const { baseElement } = render(
        <Popover
          content="Center popover"
          defaultOpen
          placement="bottom"
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveAttribute("data-align", "center");
    });

    it("sets --ck-popover-transform-origin CSS custom property", async () => {
      const { baseElement } = render(
        <Popover
          content="Popover text"
          defaultOpen
          placement="top"
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveStyle({
        "--ck-popover-transform-origin": "bottom center",
      });
    });
  });

  describe("Portal", () => {
    it("renders inline when portal is false", async () => {
      const { container } = render(
        <Popover content="Inline popover" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = container.querySelector('[data-ck="popover"]');
      expect(popover).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("popover content has role='dialog'", async () => {
      render(
        <Popover content="Accessible popover" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("trigger has aria-expanded when popover is open", async () => {
      render(
        <Popover content="Expanded popover" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const trigger = screen.getByRole("button", { name: "Trigger" });
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("trigger has aria-haspopup attribute", () => {
      render(
        <Popover content="Popover text">
          <button>Trigger</button>
        </Popover>,
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("uses auto-generated id when not provided", async () => {
      render(
        <Popover content="Auto ID popover" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = screen.getByRole("dialog");
      expect(popover).toHaveAttribute("id");
      expect(popover.id).toMatch(/^ck-popover-/);
    });

    it("uses provided id", async () => {
      render(
        <Popover
          id="my-popover"
          content="Custom ID popover"
          defaultOpen
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = screen.getByRole("dialog");
      expect(popover).toHaveAttribute("id", "my-popover");
    });
  });

  describe("Modal Mode", () => {
    it("renders with aria-modal when modal is true", async () => {
      render(
        <Popover content="Modal popover" defaultOpen modal portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = screen.getByRole("dialog");
      expect(popover).toHaveAttribute("aria-modal", "true");
    });

    it("does not have aria-modal when modal is false", async () => {
      render(
        <Popover content="Non-modal popover" defaultOpen portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = screen.getByRole("dialog");
      expect(popover).not.toHaveAttribute("aria-modal");
    });
  });

  describe("forceMount", () => {
    it("keeps content mounted when closed (forceMount=true)", () => {
      const { baseElement } = render(
        <Popover content="Always mounted" forceMount portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toBeInTheDocument();
      expect(popover).toHaveAttribute("data-state", "closed");
    });

    it("applies visibility:hidden when closed and forceMount", () => {
      const { baseElement } = render(
        <Popover content="Hidden popover" forceMount portal={false}>
          <button>Trigger</button>
        </Popover>,
      );

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveStyle({ visibility: "hidden" });
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to the popover content element", async () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <Popover content="Ref test" defaultOpen portal={false} ref={ref}>
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute("data-ck")).toBe("popover");
    });
  });

  describe("className", () => {
    it("applies className to the popover content", async () => {
      const { baseElement } = render(
        <Popover
          className="custom-popover"
          content="Styled popover"
          defaultOpen
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveClass("custom-popover");
    });
  });

  describe("maxWidth", () => {
    it("applies maxWidth as number (px)", async () => {
      const { baseElement } = render(
        <Popover
          content="Constrained popover"
          defaultOpen
          maxWidth={200}
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveStyle({ maxWidth: "200px" });
    });

    it("applies maxWidth as string", async () => {
      const { baseElement } = render(
        <Popover
          content="Constrained popover"
          defaultOpen
          maxWidth="50vw"
          portal={false}
        >
          <button>Trigger</button>
        </Popover>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const popover = baseElement.querySelector('[data-ck="popover"]');
      expect(popover).toHaveStyle({ maxWidth: "50vw" });
    });
  });
});
