import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Icon } from "./icon";

describe("Icon Component", () => {
  describe("Basic Rendering", () => {
    it("renders with children content", () => {
      render(
        <Icon>
          <svg data-testid="icon-svg" />
        </Icon>
      );

      expect(screen.getByTestId("icon-svg")).toBeInTheDocument();
    });

    it("renders as span", () => {
      render(<Icon data-testid="icon">Icon content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon.tagName).toBe("SPAN");
    });

    it("sets data-ck attribute", () => {
      render(<Icon data-testid="icon">Content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("data-ck", "icon");
    });

    it("applies default size of md", () => {
      render(<Icon data-testid="icon">Content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("data-size", "md");
    });

    it("renders with sm size", () => {
      render(
        <Icon data-testid="icon" size="sm">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("data-size", "sm");
    });

    it("renders with lg size", () => {
      render(
        <Icon data-testid="icon" size="lg">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("data-size", "lg");
    });

    it("applies variant name as data attribute", () => {
      render(
        <Icon data-testid="icon" variantName="primary">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("data-variant", "primary");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Icon data-testid="icon">Content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).not.toHaveAttribute("data-variant");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to span element", () => {
      const ref = React.createRef<HTMLSpanElement>();

      render(<Icon ref={ref}>Content</Icon>);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.tagName).toBe("SPAN");
    });

    it("works with callback refs", () => {
      let refElement: HTMLSpanElement | null = null;
      const callbackRef = (element: HTMLSpanElement | null) => {
        refElement = element;
      };

      render(<Icon ref={callbackRef}>Content</Icon>);

      expect(refElement).toBeInstanceOf(HTMLSpanElement);
    });

    it("ref is accessible for DOM access", () => {
      const ref = React.createRef<HTMLSpanElement>();

      render(
        <Icon size="lg" ref={ref}>
          Content
        </Icon>
      );

      expect(ref.current?.dataset.size).toBe("lg");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Icon id="icon-id" data-testid="icon" title="Icon title">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("id", "icon-id");
      expect(icon).toHaveAttribute("title", "Icon title");
    });

    it("applies className correctly", () => {
      render(
        <Icon className="custom-class another-class" data-testid="icon">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveClass("custom-class", "another-class");
    });

    it("does not render inline styles", () => {
      render(<Icon data-testid="icon">Content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).not.toHaveAttribute("style");
    });

    it("supports event handlers", () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Icon
          data-testid="icon"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
        >
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");

      fireEvent.click(icon);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseEnter(icon);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has aria-hidden=true by default (decorative)", () => {
      render(
        <Icon data-testid="icon">
          <svg />
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("allows aria-hidden to be overridden to false", () => {
      render(
        <Icon aria-hidden={false} data-testid="icon">
          <svg />
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("aria-hidden", "false");
    });

    it("supports aria-label for meaningful icons (requires aria-hidden override)", () => {
      render(
        <Icon aria-hidden={false} aria-label="Close button" role="img">
          <svg />
        </Icon>
      );

      const icon = screen.getByLabelText("Close button");
      expect(icon).toBeInTheDocument();
    });

    it("supports role attribute (requires aria-hidden override)", () => {
      render(
        <Icon aria-hidden={false} data-testid="icon" role="img">
          <svg />
        </Icon>
      );

      const icon = screen.getByRole("img");
      expect(icon).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Icon aria-describedby="desc" data-testid="icon">
            <svg />
          </Icon>
          <span id="desc">Icon description</span>
        </>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("aria-describedby", "desc");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <span id="label">Icon label</span>
          <Icon aria-labelledby="label" data-testid="icon">
            <svg />
          </Icon>
        </>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("aria-labelledby", "label");
    });

    it("works in icon button pattern", () => {
      render(
        <button aria-label="Close dialog" type="button">
          <Icon aria-hidden="true" data-testid="icon">
            <svg />
          </Icon>
        </button>
      );

      const button = screen.getByRole("button", { name: "Close dialog" });
      expect(button).toBeInTheDocument();

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children", () => {
      render(<Icon data-testid="icon" />);

      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
    });

    it("handles null children", () => {
      render(<Icon data-testid="icon">{null}</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
    });

    it("handles undefined children", () => {
      render(<Icon data-testid="icon">{undefined}</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
    });

    it("handles multiple children", () => {
      render(
        <Icon data-testid="icon">
          <span>Child 1</span>
          <span>Child 2</span>
        </Icon>
      );

      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });

    it("handles complex nested content", () => {
      render(
        <Icon data-testid="icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 0L24 12L12 24L0 12Z" />
          </svg>
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon.querySelector("svg")).toBeInTheDocument();
      expect(icon.querySelector("path")).toBeInTheDocument();
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Icon.displayName).toBe("Icon");
    });
  });
});
