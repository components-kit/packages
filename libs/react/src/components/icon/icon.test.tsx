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

    it("renders as span by default", () => {
      render(<Icon data-testid="icon">Icon content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon.tagName).toBe("SPAN");
    });

    it("applies default dimensions", () => {
      render(<Icon data-testid="icon">Content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveStyle("width: 20px");
      expect(icon).toHaveStyle("height: 20px");
    });

    it("applies custom dimensions", () => {
      render(
        <Icon data-testid="icon" height="32px" width="32px">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveStyle("width: 32px");
      expect(icon).toHaveStyle("height: 32px");
    });

    it("applies inline-flex display", () => {
      render(<Icon data-testid="icon">Content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveStyle("display: inline-flex");
    });

    it("centers content with flexbox", () => {
      render(<Icon data-testid="icon">Content</Icon>);

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveStyle("align-items: center");
      expect(icon).toHaveStyle("justify-content: center");
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

  describe("Polymorphic Rendering", () => {
    it("renders as div when specified", () => {
      render(
        <Icon as="div" data-testid="icon">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon.tagName).toBe("DIV");
    });

    it("renders as i when specified", () => {
      render(
        <Icon as="i" data-testid="icon">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon.tagName).toBe("I");
    });

    it("switches element type on rerender", () => {
      const { rerender } = render(
        <Icon as="span" data-testid="icon">
          Content
        </Icon>
      );

      expect(screen.getByTestId("icon").tagName).toBe("SPAN");

      rerender(
        <Icon as="div" data-testid="icon">
          Content
        </Icon>
      );

      expect(screen.getByTestId("icon").tagName).toBe("DIV");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to span element", () => {
      const ref = React.createRef<HTMLElement>();

      render(<Icon ref={ref}>Content</Icon>);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.tagName).toBe("SPAN");
    });

    it("forwards ref to different element types", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Icon as="div" ref={ref}>
          Content
        </Icon>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.tagName).toBe("DIV");
    });

    it("works with callback refs", () => {
      let refElement: HTMLElement | null = null;
      const callbackRef = (element: HTMLElement | null) => {
        refElement = element;
      };

      render(<Icon ref={callbackRef}>Content</Icon>);

      expect(refElement).toBeInstanceOf(HTMLSpanElement);
    });

    it("ref is accessible for DOM manipulation", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Icon height="32px" width="24px" ref={ref}>
          Content
        </Icon>
      );

      expect(ref.current?.style.width).toBe("24px");
      expect(ref.current?.style.height).toBe("32px");
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

    it("merges style correctly with dimensions", () => {
      render(
        <Icon
          style={{ color: "red", opacity: 0.5 }}
          data-testid="icon"
          height="32px"
          width="24px"
        >
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveStyle({ color: "rgb(255, 0, 0)" });
      expect(icon).toHaveStyle("opacity: 0.5");
      expect(icon).toHaveStyle("width: 24px");
      expect(icon).toHaveStyle("height: 32px");
    });

    it("dimension props override style dimensions", () => {
      render(
        <Icon
          style={{ height: "10px", width: "10px" }}
          data-testid="icon"
          height="32px"
          width="24px"
        >
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveStyle("width: 24px");
      expect(icon).toHaveStyle("height: 32px");
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
      // aria-hidden={false} renders as aria-hidden="false" in DOM, which unhides the element
      expect(icon).toHaveAttribute("aria-hidden", "false");
    });

    it("supports aria-label for meaningful icons (requires aria-hidden override)", () => {
      // For meaningful icons, consumers must override aria-hidden={false}
      render(
        <Icon aria-hidden={false} aria-label="Close button" role="img">
          <svg />
        </Icon>
      );

      const icon = screen.getByLabelText("Close button");
      expect(icon).toBeInTheDocument();
    });

    it("supports role attribute (requires aria-hidden override)", () => {
      // By default, Icon has aria-hidden="true". To make it accessible,
      // consumers must override with aria-hidden={false}
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

    it("handles zero dimensions", () => {
      render(
        <Icon data-testid="icon" height="0px" width="0px">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveStyle("width: 0px");
      expect(icon).toHaveStyle("height: 0px");
    });

    it("handles percentage dimensions", () => {
      render(
        <Icon data-testid="icon" height="100%" width="50%">
          Content
        </Icon>
      );

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveStyle("width: 50%");
      expect(icon).toHaveStyle("height: 100%");
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
