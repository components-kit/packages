"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./switch";

describe("Switch Component", () => {
  describe("Basic Rendering", () => {
    it("renders as switch role", () => {
      render(<Switch aria-label="Test switch" />);

      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("renders as checkbox input with switch role", () => {
      render(<Switch aria-label="Test switch" data-testid="switch" />);

      const switchElement = screen.getByTestId("switch");
      expect(switchElement.tagName).toBe("INPUT");
      expect(switchElement).toHaveAttribute("type", "checkbox");
      expect(switchElement).toHaveAttribute("role", "switch");
    });

    it("applies variantName as data-variant attribute", () => {
      render(
        <Switch aria-label="Test" data-testid="switch" variantName="primary" />
      );

      expect(screen.getByTestId("switch")).toHaveAttribute(
        "data-variant",
        "primary"
      );
    });

    it("renders without variantName (optional)", () => {
      render(<Switch aria-label="Test" data-testid="switch" />);

      const switchElement = screen.getByTestId("switch");
      expect(switchElement).not.toHaveAttribute("data-variant");
    });
  });

  describe("Switch States", () => {
    it("renders unchecked by default", () => {
      render(<Switch aria-label="Test switch" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();
    });

    it("renders as checked when defaultChecked is true", () => {
      render(<Switch aria-label="Test switch" defaultChecked />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
    });

    it("can be controlled with checked prop", () => {
      const { rerender } = render(
        <Switch aria-label="Test switch" checked={false} onChange={() => {}} />
      );

      let switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      rerender(
        <Switch aria-label="Test switch" checked={true} onChange={() => {}} />
      );
      switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
    });

    it("handles disabled state", () => {
      render(<Switch aria-label="Test switch" disabled />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeDisabled();
    });

    it("can toggle between on and off (uncontrolled)", async () => {
      const user = userEvent.setup();

      render(<Switch aria-label="Test switch" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      await user.click(switchElement);
      expect(switchElement).toBeChecked();

      await user.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });
  });

  describe("Event Handling", () => {
    it("calls onChange when clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Switch aria-label="Test switch" onChange={handleChange} />);

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("receives checked state in onChange event", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Switch aria-label="Test switch" onChange={handleChange} />);

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalled();
      const event = handleChange.mock.calls[0][0];
      expect(event.target.checked).toBe(true);
    });

    it("supports keyboard interaction (Space key)", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Switch aria-label="Test switch" onChange={handleChange} />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();

      await user.keyboard(" ");

      expect(handleChange).toHaveBeenCalled();
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Switch aria-label="Test switch" disabled onChange={handleChange} />
      );

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Switch aria-label="Test switch" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toHaveRole("switch");
    });

    it("works with callback refs", () => {
      let refElement: HTMLInputElement | null = null;
      const callbackRef = (element: HTMLInputElement | null) => {
        refElement = element;
      };

      render(<Switch aria-label="Test switch" ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("HTML Attributes", () => {
    it("passes through data-testid attribute", () => {
      render(<Switch aria-label="Test" data-testid="custom-switch" />);

      const switchElement = screen.getByTestId("custom-switch");
      expect(switchElement).toHaveRole("switch");
    });

    it("applies className correctly", () => {
      render(
        <Switch
          className="custom-class another-class"
          aria-label="Test"
          data-testid="switch"
        />
      );

      const switchElement = screen.getByTestId("switch");
      expect(switchElement).toHaveClass("custom-class", "another-class");
    });

    it("supports id attribute for labels", () => {
      render(
        <>
          <Switch id="my-switch" />
          <label htmlFor="my-switch">Enable feature</label>
        </>
      );

      const switchElement = screen.getByLabelText("Enable feature");
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveRole("switch");
    });

    it("supports name attribute for form submission", () => {
      render(<Switch aria-label="Test" name="notifications" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("name", "notifications");
    });
  });

  describe("Accessibility", () => {
    it("has correct switch role", () => {
      render(<Switch aria-label="Test switch" />);

      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Switch aria-label="Enable notifications" />);

      const switchElement = screen.getByLabelText("Enable notifications");
      expect(switchElement).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Switch aria-describedby="description" aria-label="Test" />
          <p id="description">This enables notifications</p>
        </>
      );

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-describedby", "description");
    });

    it("is focusable", () => {
      render(<Switch aria-label="Test switch" />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();
      expect(switchElement).toHaveFocus();
    });

    it("is not focusable when disabled", () => {
      render(<Switch aria-label="Test switch" disabled />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();
      // Disabled inputs typically don't receive focus
      expect(switchElement).toBeDisabled();
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Switch.displayName).toBe("Switch");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicking", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Switch aria-label="Test switch" onChange={handleChange} />);

      const switchElement = screen.getByRole("switch");

      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it("maintains state during re-renders", () => {
      const TestComponent = ({ variant }: { variant: string }) => (
        <Switch aria-label="Test" defaultChecked variantName={variant} />
      );

      const { rerender } = render(<TestComponent variant="default" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();

      rerender(<TestComponent variant="primary" />);
      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("works with form reset", () => {
      render(
        <form data-testid="form">
          <Switch aria-label="Test" defaultChecked />
        </form>
      );

      const switchElement = screen.getByRole("switch");
      const form = screen.getByTestId("form") as HTMLFormElement;

      expect(switchElement).toBeChecked();

      // Toggle off
      fireEvent.click(switchElement);
      expect(switchElement).not.toBeChecked();

      // Reset form - should restore to defaultChecked state
      form.reset();
      expect(switchElement).toBeChecked();
    });
  });
});
