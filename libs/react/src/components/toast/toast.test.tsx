import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { toast as sonnerToast, Toaster } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "./toast";

describe("Toast Component", () => {
  beforeEach(() => {
    render(<Toaster />);
  });

  afterEach(() => {
    sonnerToast.dismiss();
  });

  describe("Basic Rendering", () => {
    it("renders toast with title only", async () => {
      toast({
        title: "Test notification",
      });

      await waitFor(() => {
        expect(screen.getByText("Test notification")).toBeInTheDocument();
      });
    });

    it("renders toast with title and description", async () => {
      toast({
        description: "Test description",
        title: "Test title",
      });

      await waitFor(() => {
        expect(screen.getByText("Test title")).toBeInTheDocument();
        expect(screen.getByText("Test description")).toBeInTheDocument();
      });
    });

    it("renders toast with all props", async () => {
      toast({
        button: {
          label: "Action",
          onClick: vi.fn(),
        },
        description: "Test description",
        title: "Test title",
        variantName: "success",
      });

      await waitFor(() => {
        expect(screen.getByText("Test title")).toBeInTheDocument();
        expect(screen.getByText("Test description")).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Action" }),
        ).toBeInTheDocument();
      });
    });

    it("returns toast ID", () => {
      const toastId = toast({
        title: "Test",
      });

      expect(toastId).toBeDefined();
      expect(typeof toastId === "number" || typeof toastId === "string").toBe(
        true,
      );
    });

    it('applies data-ck="toast" attribute', async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        expect(toastElement).toBeInTheDocument();
      });
    });

    it("applies variantName as data-variant", async () => {
      toast({
        title: "Test",
        variantName: "success",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-variant", "success");
      });
    });
  });

  describe("Data Attributes", () => {
    it("sets data-variant when variantName provided", async () => {
      toast({
        title: "Test",
        variantName: "error",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-variant", "error");
      });
    });

    it("does not set data-variant when variantName not provided", async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        expect(toastElement).not.toHaveAttribute("data-variant");
      });
    });

    it("sets data-has-title when title provided", async () => {
      toast({
        title: "Test title",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test title")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-has-title");
      });
    });

    it("sets data-has-description when description provided", async () => {
      toast({
        description: "Test description",
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-has-description");
      });
    });

    it("does not set data-has-description when description not provided", async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        expect(toastElement).not.toHaveAttribute("data-has-description");
      });
    });

    it("sets data-has-action when button provided", async () => {
      toast({
        button: {
          label: "Click me",
        },
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-has-action");
      });
    });

    it("does not set data-has-action when button not provided", async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        expect(toastElement).not.toHaveAttribute("data-has-action");
      });
    });

    it("sets correct data-slot attributes", async () => {
      toast({
        button: {
          label: "Action",
        },
        description: "Description",
        title: "Title",
      });

      await waitFor(() => {
        expect(
          screen.getByText("Title").closest('[data-slot="title"]'),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Description").closest('[data-slot="description"]'),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button").closest('[data-slot="actions"]'),
        ).toBeInTheDocument();
        expect(screen.getByRole("button")).toHaveAttribute(
          "data-slot",
          "action",
        );
      });
    });

    it("renders icon slot with correct attributes", async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        const iconSlot = toastElement?.querySelector('[data-slot="icon"]');
        expect(iconSlot).toBeInTheDocument();
      });
    });
  });

  describe("Content Rendering", () => {
    it("renders title as string", async () => {
      toast({
        title: "String title",
      });

      await waitFor(() => {
        expect(screen.getByText("String title")).toBeInTheDocument();
      });
    });

    it("renders title as ReactNode", async () => {
      toast({
        title: <span data-testid="custom-title">Custom Title</span>,
      });

      await waitFor(() => {
        expect(screen.getByTestId("custom-title")).toBeInTheDocument();
        expect(screen.getByText("Custom Title")).toBeInTheDocument();
      });
    });

    it("renders description as string", async () => {
      toast({
        description: "String description",
        title: "Title",
      });

      await waitFor(() => {
        expect(screen.getByText("String description")).toBeInTheDocument();
      });
    });

    it("renders description as ReactNode", async () => {
      toast({
        description: (
          <div data-testid="custom-description">
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </div>
        ),
        title: "Title",
      });

      await waitFor(() => {
        expect(screen.getByTestId("custom-description")).toBeInTheDocument();
        expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
        expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
      });
    });

    it("renders without description (title only)", async () => {
      toast({
        title: "Only title",
      });

      await waitFor(() => {
        expect(screen.getByText("Only title")).toBeInTheDocument();
        const toastElement = screen
          .getByText("Only title")
          .closest('[data-ck="toast"]');
        expect(
          toastElement?.querySelector('[data-slot="description"]'),
        ).not.toBeInTheDocument();
      });
    });

    it("renders icon slot (always present, aria-hidden)", async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        const iconSlot = toastElement?.querySelector('[data-slot="icon"]');
        expect(iconSlot).toBeInTheDocument();
        expect(iconSlot).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  describe("Button/Action", () => {
    it("renders button with correct label", async () => {
      toast({
        button: {
          label: "Click me",
        },
        title: "Test",
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Click me" }),
        ).toBeInTheDocument();
      });
    });

    it("calls button onClick handler", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      toast({
        button: {
          label: "Action",
          onClick: handleClick,
        },
        title: "Test",
      });

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("dismisses toast after button click", async () => {
      const user = userEvent.setup();

      toast({
        button: {
          label: "Dismiss",
        },
        title: "Test toast",
      });

      await waitFor(() => {
        expect(screen.getByText("Test toast")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.queryByText("Test toast")).not.toBeInTheDocument();
      });
    });

    it('button has type="button"', async () => {
      toast({
        button: {
          label: "Action",
        },
        title: "Test",
      });

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it('button has data-ck="button"', async () => {
      toast({
        button: {
          label: "Action",
        },
        title: "Test",
      });

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-ck", "button");
      });
    });

    it('button has data-slot="action"', async () => {
      toast({
        button: {
          label: "Action",
        },
        title: "Test",
      });

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-slot", "action");
      });
    });

    it('button renders with data-size="sm"', async () => {
      toast({
        button: {
          label: "Action",
        },
        title: "Test",
      });

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-size", "sm");
      });
    });

    it("button accepts isLoading and sets aria-busy and data-loading", async () => {
      toast({
        button: {
          isLoading: true,
          label: "Action",
        },
        title: "Test",
      });

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-busy", "true");
        expect(button).toHaveAttribute("data-loading", "true");
      });
    });

    it("button is keyboard accessible (native button element)", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      toast({
        button: {
          label: "Action",
          onClick: handleClick,
        },
        title: "Test",
      });

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalled();
    });

    it("button without onClick handler still dismisses toast", async () => {
      const user = userEvent.setup();

      toast({
        button: {
          label: "Close",
        },
        title: "Test toast",
      });

      await waitFor(() => {
        expect(screen.getByText("Test toast")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.queryByText("Test toast")).not.toBeInTheDocument();
      });
    });
  });

  describe("Sonner Integration", () => {
    it("returns valid toast ID", () => {
      const toastId = toast({
        title: "Test",
      });

      expect(toastId).toBeDefined();
      expect(typeof toastId === "number" || typeof toastId === "string").toBe(
        true,
      );
    });

    it("can be dismissed with sonnerToast.dismiss(id)", async () => {
      const toastId = toast({
        title: "Dismissible toast",
      });

      await waitFor(() => {
        expect(screen.getByText("Dismissible toast")).toBeInTheDocument();
      });

      sonnerToast.dismiss(toastId);

      await waitFor(() => {
        expect(screen.queryByText("Dismissible toast")).not.toBeInTheDocument();
      });
    });

    it("passes through duration prop", async () => {
      toast({
        duration: 100,
        title: "Short duration",
      });

      await waitFor(() => {
        expect(screen.getByText("Short duration")).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.queryByText("Short duration")).not.toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });

    it("passes through position prop", async () => {
      toast({
        position: "top-center",
        title: "Positioned toast",
      });

      await waitFor(() => {
        expect(screen.getByText("Positioned toast")).toBeInTheDocument();
      });
    });

    it("passes through dismissible prop", async () => {
      toast({
        dismissible: false,
        title: "Not dismissible",
      });

      await waitFor(() => {
        expect(screen.getByText("Not dismissible")).toBeInTheDocument();
      });
    });

    it("works with custom className", async () => {
      toast({
        className: "custom-toast-class",
        title: "Custom class",
      });

      await waitFor(() => {
        expect(screen.getByText("Custom class")).toBeInTheDocument();
      });
    });

    it("works with custom style", async () => {
      toast({
        style: { border: "2px solid red" },
        title: "Custom style",
      });

      await waitFor(() => {
        expect(screen.getByText("Custom style")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it('has role="status"', async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[role="status"]');
        expect(toastElement).toBeInTheDocument();
      });
    });

    it('has aria-live="polite"', async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[aria-live="polite"]');
        expect(toastElement).toBeInTheDocument();
      });
    });

    it('icon slot has aria-hidden="true"', async () => {
      toast({
        title: "Test",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Test")
          .closest('[data-ck="toast"]');
        const iconSlot = toastElement?.querySelector('[data-slot="icon"]');
        expect(iconSlot).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("title is not hidden from screen readers", async () => {
      toast({
        title: "Accessible title",
      });

      await waitFor(() => {
        const titleElement = screen.getByText("Accessible title");
        expect(titleElement).not.toHaveAttribute("aria-hidden", "true");
      });
    });

    it("description is not hidden from screen readers", async () => {
      toast({
        description: "Accessible description",
        title: "Title",
      });

      await waitFor(() => {
        const descElement = screen.getByText("Accessible description");
        expect(descElement).not.toHaveAttribute("aria-hidden", "true");
      });
    });

    it("button is keyboard accessible", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      toast({
        button: {
          label: "Accessible button",
          onClick: handleClick,
        },
        title: "Test",
      });

      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("Variants", () => {
    it("applies info variant", async () => {
      toast({
        title: "Info",
        variantName: "info",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Info")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-variant", "info");
      });
    });

    it("applies success variant", async () => {
      toast({
        title: "Success",
        variantName: "success",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Success")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-variant", "success");
      });
    });

    it("applies warning variant", async () => {
      toast({
        title: "Warning",
        variantName: "warning",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Warning")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-variant", "warning");
      });
    });

    it("applies error variant", async () => {
      toast({
        title: "Error",
        variantName: "error",
      });

      await waitFor(() => {
        const toastElement = screen
          .getByText("Error")
          .closest('[data-ck="toast"]');
        expect(toastElement).toHaveAttribute("data-variant", "error");
      });
    });

    it("works without variant", async () => {
      toast({
        title: "No variant",
      });

      await waitFor(() => {
        expect(screen.getByText("No variant")).toBeInTheDocument();
        const toastElement = screen
          .getByText("No variant")
          .closest('[data-ck="toast"]');
        expect(toastElement).not.toHaveAttribute("data-variant");
      });
    });
  });

  describe("Edge Cases", () => {
    it("works with empty string title", async () => {
      toast({
        title: "",
      });

      await waitFor(() => {
        const toastElement = document.querySelector('[data-ck="toast"]');
        expect(toastElement).toBeInTheDocument();
      });
    });

    it("works with empty string description", async () => {
      toast({
        description: "",
        title: "Title",
      });

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument();
      });
    });

    it("works with zero as title", async () => {
      toast({
        title: 0,
      });

      await waitFor(() => {
        expect(screen.getByText("0")).toBeInTheDocument();
      });
    });

    it("works with complex ReactNode as title", async () => {
      toast({
        title: (
          <div>
            <h3>Heading</h3>
            <span>Subtitle</span>
          </div>
        ),
      });

      await waitFor(() => {
        expect(screen.getByText("Heading")).toBeInTheDocument();
        expect(screen.getByText("Subtitle")).toBeInTheDocument();
      });
    });

    it("works with complex ReactNode as description", async () => {
      toast({
        description: (
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        ),
        title: "List",
      });

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Item 3")).toBeInTheDocument();
      });
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(toast.displayName).toBe("Toast");
    });
  });
});
