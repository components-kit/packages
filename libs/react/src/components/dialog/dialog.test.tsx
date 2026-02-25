import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Dialog } from "./dialog";

describe("Dialog Component", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Basic Rendering", () => {
    it("renders the trigger element", () => {
      render(
        <Dialog trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    });

    it("does not render dialog content when closed", () => {
      render(
        <Dialog trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders dialog content when defaultOpen is true", async () => {
      render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toHaveTextContent("Content");
    });

    it("renders with data-ck='dialog' attribute", async () => {
      const { baseElement } = render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = baseElement.querySelector('[data-ck="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    it("renders with data-ck='dialog-overlay' attribute", async () => {
      const { baseElement } = render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const overlay = baseElement.querySelector('[data-ck="dialog-overlay"]');
      expect(overlay).toBeInTheDocument();
    });

    it("renders with data-variant attribute", async () => {
      const { baseElement } = render(
        <Dialog
          defaultOpen
          portal={false}
          trigger={<button>Open</button>}
          variantName="danger"
        >
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = baseElement.querySelector('[data-ck="dialog"]');
      expect(dialog).toHaveAttribute("data-variant", "danger");
    });

    it("sets data-state='open' when open", async () => {
      const { baseElement } = render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = baseElement.querySelector('[data-ck="dialog"]');
      expect(dialog).toHaveAttribute("data-state", "open");

      const overlay = baseElement.querySelector('[data-ck="dialog-overlay"]');
      expect(overlay).toHaveAttribute("data-state", "open");
    });

    it("has correct displayName", () => {
      expect(
        (Dialog as unknown as { displayName?: string }).displayName,
      ).toBe("Dialog");
    });
  });

  describe("Trigger Interaction", () => {
    it("opens on trigger click", async () => {
      const { baseElement } = render(
        <Dialog portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      const trigger = screen.getByRole("button", { name: "Open" });

      await act(async () => {
        await userEvent.click(trigger);
        vi.advanceTimersByTime(100);
      });

      await waitFor(() => {
        const dialog = baseElement.querySelector('[data-ck="dialog"]');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute("data-state", "open");
      });
    });

    it("closes on second trigger click", async () => {
      const { baseElement } = render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // When dialog is open modally, trigger gets aria-hidden from FloatingFocusManager,
      // so we query by text instead of role
      const trigger = baseElement.querySelector("button") as HTMLElement;

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
  });

  describe("Controlled Mode", () => {
    it("opens when open prop is true", async () => {
      render(
        <Dialog open portal={false}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("stays closed when open prop is false", () => {
      render(
        <Dialog open={false} portal={false}>
          <p>Content</p>
        </Dialog>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("calls onOpenChange when trigger click toggles", async () => {
      const onOpenChange = vi.fn();

      render(
        <Dialog
          portal={false}
          trigger={<button>Open</button>}
          onOpenChange={onOpenChange}
        >
          <p>Content</p>
        </Dialog>,
      );

      const trigger = screen.getByRole("button", { name: "Open" });

      await act(async () => {
        await userEvent.click(trigger);
        vi.advanceTimersByTime(100);
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("works without a trigger (controlled only)", async () => {
      render(
        <Dialog open portal={false}>
          <p>Controlled content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toHaveTextContent(
        "Controlled content",
      );
    });
  });

  describe("Dismiss", () => {
    it("closes on Escape key", async () => {
      render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
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

    it("does not close on Escape when closeOnEscape is false", async () => {
      const { baseElement } = render(
        <Dialog
          closeOnEscape={false}
          defaultOpen
          portal={false}
          trigger={<button>Open</button>}
        >
          <p>Content</p>
        </Dialog>,
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

      const dialog = baseElement.querySelector('[data-ck="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    it("closes on overlay click", async () => {
      const { baseElement } = render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const overlay = baseElement.querySelector(
        '[data-ck="dialog-overlay"]',
      ) as HTMLElement;

      await act(async () => {
        await userEvent.click(overlay);
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("does not close on overlay click when closeOnOverlayClick is false", async () => {
      const { baseElement } = render(
        <Dialog
          closeOnOverlayClick={false}
          defaultOpen
          portal={false}
          trigger={<button>Open</button>}
        >
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const overlay = baseElement.querySelector(
        '[data-ck="dialog-overlay"]',
      ) as HTMLElement;

      await act(async () => {
        await userEvent.click(overlay);
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      const dialog = baseElement.querySelector('[data-ck="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    it("does not close when clicking dialog content (not overlay)", async () => {
      const { baseElement } = render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = baseElement.querySelector(
        '[data-ck="dialog"]',
      ) as HTMLElement;

      await act(async () => {
        await userEvent.click(dialog);
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(
        baseElement.querySelector('[data-ck="dialog"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Content", () => {
    it("renders children content", async () => {
      render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <h2>Dialog Title</h2>
          <p>Dialog body text</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      expect(screen.getByText("Dialog body text")).toBeInTheDocument();
    });

    it("renders complex ReactNode children", async () => {
      render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <form data-testid="dialog-form">
            <input placeholder="Name" />
            <button type="submit">Submit</button>
          </form>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId("dialog-form")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has role='dialog' by default", async () => {
      render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("supports role='alertdialog'", async () => {
      render(
        <Dialog
          defaultOpen
          portal={false}
          role="alertdialog"
          trigger={<button>Open</button>}
        >
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("has aria-modal='true'", async () => {
      render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("trigger has aria-haspopup attribute", () => {
      render(
        <Dialog trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("trigger has aria-expanded when dialog is open", async () => {
      const { baseElement } = render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // When dialog is open modally, trigger gets aria-hidden from FloatingFocusManager,
      // so we query the DOM directly
      const trigger = baseElement.querySelector("button") as HTMLElement;
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("uses auto-generated id when not provided", async () => {
      render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("id");
      expect(dialog.id).toMatch(/^ck-dialog-/);
    });

    it("uses provided id", async () => {
      render(
        <Dialog
          id="my-dialog"
          defaultOpen
          portal={false}
          trigger={<button>Open</button>}
        >
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("id", "my-dialog");
    });
  });

  describe("forceMount", () => {
    it("keeps content mounted when closed (forceMount=true)", () => {
      const { baseElement } = render(
        <Dialog forceMount portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      const dialog = baseElement.querySelector('[data-ck="dialog"]');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-state", "closed");
    });

    it("applies visibility:hidden when closed and forceMount", () => {
      const { baseElement } = render(
        <Dialog forceMount portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      const overlay = baseElement.querySelector('[data-ck="dialog-overlay"]');
      expect(overlay).toHaveStyle({ visibility: "hidden" });
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to the dialog content element", async () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <Dialog
          defaultOpen
          portal={false}
          trigger={<button>Open</button>}
          ref={ref}
        >
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute("data-ck")).toBe("dialog");
    });
  });

  describe("className", () => {
    it("applies className to the dialog content", async () => {
      const { baseElement } = render(
        <Dialog
          className="custom-dialog"
          defaultOpen
          portal={false}
          trigger={<button>Open</button>}
        >
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = baseElement.querySelector('[data-ck="dialog"]');
      expect(dialog).toHaveClass("custom-dialog");
    });

    it("applies overlayClassName to the overlay", async () => {
      const { baseElement } = render(
        <Dialog
          defaultOpen
          overlayClassName="custom-overlay"
          portal={false}
          trigger={<button>Open</button>}
        >
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const overlay = baseElement.querySelector('[data-ck="dialog-overlay"]');
      expect(overlay).toHaveClass("custom-overlay");
    });
  });

  describe("Portal", () => {
    it("renders inline when portal is false", async () => {
      const { container } = render(
        <Dialog defaultOpen portal={false} trigger={<button>Open</button>}>
          <p>Content</p>
        </Dialog>,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const dialog = container.querySelector('[data-ck="dialog"]');
      expect(dialog).toBeInTheDocument();
    });
  });
});
