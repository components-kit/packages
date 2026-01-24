import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Separator } from "./separator";

describe("Separator Component", () => {
  describe("Basic Rendering", () => {
    it("renders as hr element", () => {
      render(<Separator />);

      const separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
      expect(separator.tagName).toBe("HR");
    });

    it("has correct role", () => {
      render(<Separator />);

      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("applies horizontal orientation by default", () => {
      render(<Separator />);

      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("applies vertical orientation when specified", () => {
      render(<Separator orientation="vertical" />);

      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });
  });

  describe("Orientation Variants", () => {
    it("handles horizontal orientation", () => {
      render(<Separator orientation="horizontal" />);

      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
      expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("handles vertical orientation", () => {
      render(<Separator orientation="vertical" />);

      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("data-orientation", "vertical");
      expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });

    it("switches orientation on rerender", () => {
      const { rerender } = render(<Separator orientation="horizontal" />);

      expect(screen.getByRole("separator")).toHaveAttribute(
        "data-orientation",
        "horizontal"
      );

      rerender(<Separator orientation="vertical" />);

      expect(screen.getByRole("separator")).toHaveAttribute(
        "data-orientation",
        "vertical"
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to hr element", () => {
      const ref = React.createRef<HTMLHRElement>();

      render(<Separator ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLHRElement);
      expect(ref.current).toHaveAttribute("role", "separator");
    });

    it("works with callback refs", () => {
      let refElement: HTMLHRElement | null = null;
      const callbackRef = (element: HTMLHRElement | null) => {
        refElement = element;
      };

      render(<Separator ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLHRElement);
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Separator
          id="separator-id"
          data-testid="custom-separator"
          title="Separator title"
        />
      );

      const separator = screen.getByTestId("custom-separator");
      expect(separator).toHaveAttribute("id", "separator-id");
      expect(separator).toHaveAttribute("title", "Separator title");
    });

    it("applies className correctly", () => {
      render(<Separator className="custom-class another-class" />);

      const separator = screen.getByRole("separator");
      expect(separator).toHaveClass("custom-class", "another-class");
    });

    it("applies style correctly", () => {
      render(
        <Separator style={{ backgroundColor: "red", margin: "10px" }} />
      );

      const separator = screen.getByRole("separator");
      expect(separator).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
      expect(separator).toHaveStyle("margin: 10px");
    });

    it("supports event handlers", () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Separator onClick={handleClick} onMouseEnter={handleMouseEnter} />
      );

      const separator = screen.getByRole("separator");

      fireEvent.click(separator);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseEnter(separator);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has correct separator role", () => {
      render(<Separator />);

      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("supports aria-orientation", () => {
      render(<Separator orientation="vertical" />);

      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });

    it("supports aria-label for screen readers", () => {
      render(<Separator aria-label="Section divider" />);

      const separator = screen.getByLabelText("Section divider");
      expect(separator).toBeInTheDocument();
    });

    it("supports aria-hidden for decorative separators", () => {
      render(<Separator aria-hidden="true" data-testid="decorative" />);

      const separator = screen.getByTestId("decorative");
      expect(separator).toHaveAttribute("aria-hidden", "true");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <h2 id="section-title">Section Title</h2>
          <Separator aria-labelledby="section-title" />
        </>
      );

      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("aria-labelledby", "section-title");
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined orientation", () => {
      render(<Separator orientation={undefined} />);

      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders without any props", () => {
      render(<Separator />);

      const separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("role", "separator");
    });

    it("handles multiple separators", () => {
      render(
        <>
          <Separator data-testid="sep-1" />
          <Separator data-testid="sep-2" orientation="vertical" />
          <Separator data-testid="sep-3" />
        </>
      );

      expect(screen.getByTestId("sep-1")).toHaveAttribute(
        "data-orientation",
        "horizontal"
      );
      expect(screen.getByTestId("sep-2")).toHaveAttribute(
        "data-orientation",
        "vertical"
      );
      expect(screen.getByTestId("sep-3")).toHaveAttribute(
        "data-orientation",
        "horizontal"
      );
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Separator.displayName).toBe("Separator");
    });
  });
});
