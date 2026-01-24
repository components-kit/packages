import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "./badge";

describe("Badge Component", () => {
  describe("Basic Rendering", () => {
    it("renders with children content", () => {
      render(<Badge>Test Badge</Badge>);

      expect(screen.getByText("Test Badge")).toBeInTheDocument();
    });

    it("renders as span element by default", () => {
      render(<Badge data-testid="badge">Content</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge.tagName).toBe("SPAN");
    });

    it("renders with default size when size is not provided", () => {
      render(<Badge>Default Size</Badge>);

      const badge = screen.getByText("Default Size");
      expect(badge).toHaveAttribute("data-size", "md");
    });

    it("renders with different sizes", () => {
      const { rerender } = render(<Badge size="sm">Small</Badge>);

      expect(screen.getByText("Small")).toHaveAttribute("data-size", "sm");

      rerender(<Badge>Medium</Badge>);
      expect(screen.getByText("Medium")).toHaveAttribute("data-size", "md");

      rerender(<Badge size="lg">Large</Badge>);
      expect(screen.getByText("Large")).toHaveAttribute("data-size", "lg");
    });

    it("applies variant name as data attribute", () => {
      render(<Badge variantName="success">Status</Badge>);

      const badge = screen.getByText("Status");
      expect(badge).toHaveAttribute("data-variant", "success");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Badge data-testid="badge">Content</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).not.toHaveAttribute("data-variant");
    });

    it("renders with number content", () => {
      render(<Badge>42</Badge>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders with JSX content", () => {
      render(
        <Badge>
          <span>JSX Content</span>
        </Badge>
      );

      expect(screen.getByText("JSX Content")).toBeInTheDocument();
    });
  });

  describe("AsChild Functionality", () => {
    it("renders as wrapper when asChild is false", () => {
      render(<Badge asChild={false}>Normal Badge</Badge>);

      const badge = screen.getByText("Normal Badge");
      expect(badge.tagName).toBe("SPAN");
    });

    it("merges with child element when asChild is true", () => {
      render(
        <Badge asChild variantName="primary">
          <button type="button">Button Badge</button>
        </Badge>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Button Badge");
      expect(button).toHaveAttribute("data-size", "md");
      expect(button).toHaveAttribute("data-variant", "primary");
    });

    it("passes size to child when asChild is true", () => {
      render(
        <Badge asChild size="lg">
          <a href="#">Link Badge</a>
        </Badge>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("data-size", "lg");
    });
  });

  describe("Size Variants", () => {
    const sizes = ["sm", "md", "lg"] as const;

    sizes.forEach((size) => {
      it(`applies correct data-size for ${size}`, () => {
        render(<Badge size={size}>{size.toUpperCase()}</Badge>);

        const badge = screen.getByText(size.toUpperCase());
        expect(badge).toHaveAttribute("data-size", size);
      });
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to root element", () => {
      const ref = React.createRef<HTMLSpanElement>();

      render(<Badge ref={ref}>Ref Test</Badge>);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent("Ref Test");
    });

    it("works with callback refs", () => {
      let refElement: HTMLSpanElement | null = null;
      const callbackRef = (element: HTMLSpanElement | null) => {
        refElement = element;
      };

      render(<Badge ref={callbackRef}>Callback Ref</Badge>);

      expect(refElement).toBeInstanceOf(HTMLSpanElement);
      expect(refElement).toHaveTextContent("Callback Ref");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Badge id="badge-id" data-testid="custom-badge" title="Badge title">
          Attributes Test
        </Badge>
      );

      const badge = screen.getByTestId("custom-badge");
      expect(badge).toHaveAttribute("id", "badge-id");
      expect(badge).toHaveAttribute("title", "Badge title");
    });

    it("merges className correctly", () => {
      render(<Badge className="custom-class another-class">Class Test</Badge>);

      const badge = screen.getByText("Class Test");
      expect(badge).toHaveClass("custom-class", "another-class");
    });

    it("supports inline styles", () => {
      render(
        <Badge style={{ backgroundColor: "red", padding: "10px" }}>
          Style Test
        </Badge>
      );

      const badge = screen.getByText("Style Test");
      expect(badge).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
      expect(badge).toHaveStyle("padding: 10px");
    });

    it("supports event handlers", () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Badge onClick={handleClick} onMouseEnter={handleMouseEnter}>
          Interactive Badge
        </Badge>
      );

      const badge = screen.getByText("Interactive Badge");

      fireEvent.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseEnter(badge);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<Badge aria-label="Status badge">New</Badge>);

      const badge = screen.getByLabelText("Status badge");
      expect(badge).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <span id="desc">Badge description</span>
          <Badge aria-describedby="desc" data-testid="badge">
            Status
          </Badge>
        </>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("aria-describedby", "desc");
    });

    it("supports aria-hidden for decorative badges", () => {
      render(
        <Badge aria-hidden="true" data-testid="badge">
          Decorative
        </Badge>
      );

      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("aria-hidden", "true");
    });

    it("works in notification count pattern", () => {
      render(
        <button aria-label="Messages, 5 unread" type="button">
          <span>Messages</span>
          <Badge data-testid="count" size="sm">
            5
          </Badge>
        </button>
      );

      const button = screen.getByRole("button", { name: "Messages, 5 unread" });
      expect(button).toBeInTheDocument();

      const badge = screen.getByTestId("count");
      expect(badge).toHaveTextContent("5");
    });

    it("supports role attribute", () => {
      render(
        <Badge data-testid="badge" role="status">
          Processing
        </Badge>
      );

      const badge = screen.getByRole("status");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string children", () => {
      const { container } = render(<Badge>{""}</Badge>);

      const badge = container.querySelector('[data-size="md"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-size", "md");
    });

    it("handles zero as children", () => {
      render(<Badge>{0}</Badge>);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles complex nested content", () => {
      render(
        <Badge size="lg">
          <span>
            Complex <strong>nested</strong> content
          </span>
        </Badge>
      );

      expect(screen.getByText("nested")).toBeInTheDocument();
      expect(screen.getByText(/Complex/)).toBeInTheDocument();
    });

    it("handles null children", () => {
      render(<Badge data-testid="badge">{null}</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
    });

    it("handles undefined children", () => {
      render(<Badge data-testid="badge">{undefined}</Badge>);

      const badge = screen.getByTestId("badge");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Variant Name", () => {
    it("applies different variant names", () => {
      const variants = ["success", "error", "warning", "info"];

      variants.forEach((variant) => {
        const { unmount } = render(
          <Badge data-testid={`badge-${variant}`} variantName={variant}>
            {variant}
          </Badge>
        );

        const badge = screen.getByTestId(`badge-${variant}`);
        expect(badge).toHaveAttribute("data-variant", variant);
        unmount();
      });
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Badge.displayName).toBe("Badge");
    });
  });
});
