import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Text } from "./text";

describe("Text Component", () => {
  describe("Basic Rendering", () => {
    it("renders with children content", () => {
      render(<Text>Test Text</Text>);

      expect(screen.getByText("Test Text")).toBeInTheDocument();
    });

    it("renders as paragraph by default", () => {
      render(<Text>Default Text</Text>);

      const text = screen.getByText("Default Text");
      expect(text.tagName).toBe("P");
    });

    it("applies variant name as data attribute", () => {
      render(<Text variantName="body">Variant Text</Text>);

      const text = screen.getByText("Variant Text");
      expect(text).toHaveAttribute("data-variant", "body");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Text>No Variant</Text>);

      const text = screen.getByText("No Variant");
      expect(text).not.toHaveAttribute("data-variant");
    });

    it("renders with JSX content", () => {
      render(
        <Text>
          <span>JSX Content</span>
        </Text>
      );

      expect(screen.getByText("JSX Content")).toBeInTheDocument();
    });
  });

  describe("Polymorphic Rendering", () => {
    it("renders as span when specified", () => {
      render(<Text as="span">Span Text</Text>);

      const text = screen.getByText("Span Text");
      expect(text.tagName).toBe("SPAN");
    });

    it("renders as div when specified", () => {
      render(<Text as="div">Div Text</Text>);

      const text = screen.getByText("Div Text");
      expect(text.tagName).toBe("DIV");
    });

    it("renders as label when specified", () => {
      render(<Text as="label">Label Text</Text>);

      const text = screen.getByText("Label Text");
      expect(text.tagName).toBe("LABEL");
    });

    it("renders as small when specified", () => {
      render(<Text as="small">Small Text</Text>);

      const text = screen.getByText("Small Text");
      expect(text.tagName).toBe("SMALL");
    });

    it("renders as strong when specified", () => {
      render(<Text as="strong">Strong Text</Text>);

      const text = screen.getByText("Strong Text");
      expect(text.tagName).toBe("STRONG");
    });

    it("renders as em when specified", () => {
      render(<Text as="em">Emphasized Text</Text>);

      const text = screen.getByText("Emphasized Text");
      expect(text.tagName).toBe("EM");
    });

    it("switches element type on rerender", () => {
      const { rerender } = render(<Text as="p">Text</Text>);

      expect(screen.getByText("Text").tagName).toBe("P");

      rerender(<Text as="span">Text</Text>);

      expect(screen.getByText("Text").tagName).toBe("SPAN");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to paragraph element", () => {
      const ref = React.createRef<HTMLElement>();

      render(<Text ref={ref}>Ref Test</Text>);

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
      expect(ref.current?.tagName).toBe("P");
    });

    it("forwards ref to different element types", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Text as="span" ref={ref}>
          Span Ref Test
        </Text>
      );

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.tagName).toBe("SPAN");
    });

    it("works with callback refs", () => {
      let refElement: HTMLElement | null = null;
      const callbackRef = (element: HTMLElement | null) => {
        refElement = element;
      };

      render(<Text ref={callbackRef}>Callback Ref</Text>);

      expect(refElement).toBeInstanceOf(HTMLParagraphElement);
    });

    it("forwards ref to label element", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Text as="label" ref={ref}>
          Label Ref Test
        </Text>
      );

      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Text id="text-id" data-testid="custom-text" title="Text title">
          Attributes Test
        </Text>
      );

      const text = screen.getByTestId("custom-text");
      expect(text).toHaveAttribute("id", "text-id");
      expect(text).toHaveAttribute("title", "Text title");
    });

    it("applies className correctly", () => {
      render(<Text className="custom-class another-class">Class Test</Text>);

      const text = screen.getByText("Class Test");
      expect(text).toHaveClass("custom-class", "another-class");
    });

    it("applies style correctly", () => {
      render(
        <Text style={{ color: "red", fontSize: "16px" }}>Style Test</Text>
      );

      const text = screen.getByText("Style Test");
      expect(text).toHaveStyle({ color: "rgb(255, 0, 0)" });
      expect(text).toHaveStyle("font-size: 16px");
    });

    it("supports event handlers", () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Text onClick={handleClick} onMouseEnter={handleMouseEnter}>
          Interactive Text
        </Text>
      );

      const text = screen.getByText("Interactive Text");

      fireEvent.click(text);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseEnter(text);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it("supports label htmlFor attribute", () => {
      render(
        <>
          <Text as="label" htmlFor="input-id">
            Label
          </Text>
          <input id="input-id" />
        </>
      );

      const label = screen.getByText("Label");
      expect(label).toHaveAttribute("for", "input-id");
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<Text aria-label="Custom label">Text</Text>);

      const text = screen.getByLabelText("Custom label");
      expect(text).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Text aria-describedby="desc">Text</Text>
          <span id="desc">Description</span>
        </>
      );

      const text = screen.getByText("Text");
      expect(text).toHaveAttribute("aria-describedby", "desc");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <span id="label">Label</span>
          <Text aria-labelledby="label">Text</Text>
        </>
      );

      const text = screen.getByText("Text");
      expect(text).toHaveAttribute("aria-labelledby", "label");
    });

    it("supports aria-hidden for decorative text", () => {
      render(
        <Text aria-hidden="true" data-testid="decorative">
          Decorative
        </Text>
      );

      const text = screen.getByTestId("decorative");
      expect(text).toHaveAttribute("aria-hidden", "true");
    });

    it("supports role attribute", () => {
      render(
        <Text data-testid="status-text" role="status">
          Status message
        </Text>
      );

      const text = screen.getByRole("status");
      expect(text).toBeInTheDocument();
    });

    it("label element associates with form input", () => {
      render(
        <>
          <Text as="label" htmlFor="email-input">
            Email
          </Text>
          <input id="email-input" type="email" />
        </>
      );

      const input = screen.getByLabelText("Email");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "email");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string children", () => {
      render(<Text data-testid="empty">{""}</Text>);

      const text = screen.getByTestId("empty");
      expect(text).toBeInTheDocument();
    });

    it("handles zero as children", () => {
      render(<Text>{0}</Text>);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles complex nested content", () => {
      render(
        <Text>
          <span>
            Complex <strong>nested</strong> text
          </span>
        </Text>
      );

      expect(screen.getByText("nested")).toBeInTheDocument();
      expect(screen.getByText(/Complex/)).toBeInTheDocument();
    });

    it("handles null children", () => {
      render(<Text data-testid="null-child">{null}</Text>);

      const text = screen.getByTestId("null-child");
      expect(text).toBeInTheDocument();
    });

    it("handles undefined children", () => {
      render(<Text data-testid="undefined-child">{undefined}</Text>);

      const text = screen.getByTestId("undefined-child");
      expect(text).toBeInTheDocument();
    });

    it("handles multiple children", () => {
      render(
        <Text>
          Part 1 <span>Part 2</span> Part 3
        </Text>
      );

      expect(screen.getByText(/Part 1/)).toBeInTheDocument();
      expect(screen.getByText("Part 2")).toBeInTheDocument();
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Text.displayName).toBe("Text");
    });
  });
});
