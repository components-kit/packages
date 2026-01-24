import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Heading } from "./heading";

describe("Heading Component", () => {
  describe("Basic Rendering", () => {
    it("renders with children content", () => {
      render(<Heading>Test Heading</Heading>);

      expect(screen.getByRole("heading")).toBeInTheDocument();
      expect(screen.getByText("Test Heading")).toBeInTheDocument();
    });

    it("renders as h1 by default", () => {
      render(<Heading>Default Heading</Heading>);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });

    it("applies variant name as data attribute", () => {
      render(<Heading variantName="large">Variant Heading</Heading>);

      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("data-variant", "large");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Heading>No Variant</Heading>);

      const heading = screen.getByRole("heading");
      expect(heading).not.toHaveAttribute("data-variant");
    });

    it("renders with JSX content", () => {
      render(
        <Heading>
          <span>JSX Content</span>
        </Heading>
      );

      expect(screen.getByText("JSX Content")).toBeInTheDocument();
    });
  });

  describe("Polymorphic Rendering", () => {
    it("renders as h2 when specified", () => {
      render(<Heading as="h2">H2 Heading</Heading>);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
    });

    it("renders as h3 when specified", () => {
      render(<Heading as="h3">H3 Heading</Heading>);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H3");
    });

    it("renders as h4 when specified", () => {
      render(<Heading as="h4">H4 Heading</Heading>);

      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H4");
    });

    it("renders as h5 when specified", () => {
      render(<Heading as="h5">H5 Heading</Heading>);

      const heading = screen.getByRole("heading", { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H5");
    });

    it("renders as h6 when specified", () => {
      render(<Heading as="h6">H6 Heading</Heading>);

      const heading = screen.getByRole("heading", { level: 6 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H6");
    });

    it("renders as div when specified", () => {
      render(<Heading as="div">Div Heading</Heading>);

      const element = screen.getByText("Div Heading");
      expect(element.tagName).toBe("DIV");
    });

    it("renders as span when specified", () => {
      render(<Heading as="span">Span Heading</Heading>);

      const element = screen.getByText("Span Heading");
      expect(element.tagName).toBe("SPAN");
    });

    it("switches element type on rerender", () => {
      const { rerender } = render(<Heading as="h1">Heading</Heading>);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

      rerender(<Heading as="h3">Heading</Heading>);

      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to heading element", () => {
      const ref = React.createRef<HTMLElement>();

      render(<Heading ref={ref}>Ref Test</Heading>);

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.tagName).toBe("H1");
    });

    it("forwards ref to different element types", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Heading as="h2" ref={ref}>
          H2 Ref Test
        </Heading>
      );

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.tagName).toBe("H2");
    });

    it("works with callback refs", () => {
      let refElement: HTMLElement | null = null;
      const callbackRef = (element: HTMLElement | null) => {
        refElement = element;
      };

      render(<Heading ref={callbackRef}>Callback Ref</Heading>);

      expect(refElement).toBeInstanceOf(HTMLHeadingElement);
    });

    it("forwards ref to non-heading elements", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Heading as="div" ref={ref}>
          Div Ref Test
        </Heading>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Heading
          id="heading-id"
          data-testid="custom-heading"
          title="Heading title"
        >
          Attributes Test
        </Heading>
      );

      const heading = screen.getByTestId("custom-heading");
      expect(heading).toHaveAttribute("id", "heading-id");
      expect(heading).toHaveAttribute("title", "Heading title");
    });

    it("applies className correctly", () => {
      render(
        <Heading className="custom-class another-class">Class Test</Heading>
      );

      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("custom-class", "another-class");
    });

    it("applies style correctly", () => {
      render(
        <Heading style={{ color: "red", fontSize: "24px" }}>Style Test</Heading>
      );

      const heading = screen.getByRole("heading");
      expect(heading).toHaveStyle({ color: "rgb(255, 0, 0)" });
      expect(heading).toHaveStyle("font-size: 24px");
    });

    it("supports event handlers", () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Heading onClick={handleClick} onMouseEnter={handleMouseEnter}>
          Interactive Heading
        </Heading>
      );

      const heading = screen.getByRole("heading");

      fireEvent.click(heading);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseEnter(heading);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("maintains proper heading hierarchy", () => {
      const { rerender } = render(<Heading as="h1">Main Title</Heading>);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

      rerender(<Heading as="h2">Subtitle</Heading>);

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Heading aria-label="Custom label">Heading</Heading>);

      const heading = screen.getByLabelText("Custom label");
      expect(heading).toBeInTheDocument();
    });

    it("supports aria-level when using non-semantic element", () => {
      render(
        <Heading aria-level={2} as="div" role="heading">
          Non-semantic Heading
        </Heading>
      );

      const element = screen.getByRole("heading", { level: 2 });
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute("aria-level", "2");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Heading aria-describedby="desc">Heading</Heading>
          <p id="desc">Description</p>
        </>
      );

      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("aria-describedby", "desc");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <span id="label">Label</span>
          <Heading aria-labelledby="label">Heading</Heading>
        </>
      );

      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("aria-labelledby", "label");
    });

    it("supports id for navigation and linking", () => {
      render(<Heading id="section-title">Section Title</Heading>);

      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("id", "section-title");
    });

    it("supports tabIndex for focusability", () => {
      render(<Heading tabIndex={-1}>Focusable Heading</Heading>);

      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string children", () => {
      render(<Heading>{""}</Heading>);

      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });

    it("handles zero as children", () => {
      render(<Heading>{0}</Heading>);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles complex nested content", () => {
      render(
        <Heading>
          <span>
            Complex <strong>nested</strong> heading
          </span>
        </Heading>
      );

      expect(screen.getByText("nested")).toBeInTheDocument();
      expect(screen.getByText(/Complex/)).toBeInTheDocument();
    });

    it("handles null children", () => {
      render(<Heading>{null}</Heading>);

      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });

    it("handles undefined children", () => {
      render(<Heading>{undefined}</Heading>);

      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });

    it("handles multiple children", () => {
      render(
        <Heading>
          Part 1 <span>Part 2</span> Part 3
        </Heading>
      );

      expect(screen.getByText(/Part 1/)).toBeInTheDocument();
      expect(screen.getByText("Part 2")).toBeInTheDocument();
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Heading.displayName).toBe("Heading");
    });
  });
});
