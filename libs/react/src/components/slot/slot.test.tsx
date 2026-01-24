import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Slot } from "./slot";

describe("Slot Component", () => {
  describe("Default Mode (asChild=false)", () => {
    it("renders as span by default", () => {
      render(<Slot>Default Content</Slot>);

      const element = screen.getByText("Default Content");
      expect(element).toBeInTheDocument();
      expect(element.tagName).toBe("SPAN");
    });

    it("renders as specified element with as prop", () => {
      render(<Slot as="div">Div Content</Slot>);

      const element = screen.getByText("Div Content");
      expect(element.tagName).toBe("DIV");
    });

    it("renders as button when specified", () => {
      render(<Slot as="button">Button Content</Slot>);

      const element = screen.getByRole("button");
      expect(element).toHaveTextContent("Button Content");
    });

    it("passes through props", () => {
      render(
        <Slot
          id="test-id"
          className="test-class"
          as="div"
          data-testid="test-slot"
        >
          Props Test
        </Slot>
      );

      const element = screen.getByTestId("test-slot");
      expect(element).toHaveAttribute("id", "test-id");
      expect(element).toHaveClass("test-class");
    });
  });

  describe("AsChild Mode (asChild=true)", () => {
    it("merges with child element", () => {
      render(
        <Slot asChild>
          <button type="button">Child Button</button>
        </Slot>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Child Button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("merges className with child element", () => {
      render(
        <Slot className="slot-class" asChild>
          <div className="child-class">Merged Classes</div>
        </Slot>
      );

      const element = screen.getByText("Merged Classes");
      expect(element).toHaveClass("slot-class");
      expect(element).toHaveClass("child-class");
    });

    it("merges props with child element", () => {
      render(
        <Slot id="slot-id" asChild data-testid="merged-props">
          <div data-original="child">Merged Props</div>
        </Slot>
      );

      const element = screen.getByTestId("merged-props");
      expect(element).toHaveAttribute("id", "slot-id");
      expect(element).toHaveAttribute("data-original", "child");
    });

    it("child props override slot props for conflicting keys", () => {
      render(
        <Slot id="slot-id" asChild data-value="slot">
          <div id="child-id" data-value="child">
            Override Test
          </div>
        </Slot>
      );

      const element = screen.getByText("Override Test");
      expect(element).toHaveAttribute("id", "child-id");
      expect(element).toHaveAttribute("data-value", "child");
    });

    it("works with different child element types", () => {
      const { rerender } = render(
        <Slot asChild>
          <a href="/test">Link Child</a>
        </Slot>
      );

      expect(screen.getByRole("link")).toHaveAttribute("href", "/test");

      rerender(
        <Slot asChild>
          <input placeholder="Input Child" type="text" />
        </Slot>
      );

      expect(screen.getByRole("textbox")).toHaveAttribute(
        "placeholder",
        "Input Child"
      );
    });
  });

  describe("Event Handler Merging", () => {
    it("calls both slot and child onClick handlers", () => {
      const slotClick = vi.fn();
      const childClick = vi.fn();

      render(
        <Slot asChild onClick={slotClick}>
          <button onClick={childClick}>Click Me</button>
        </Slot>
      );

      fireEvent.click(screen.getByRole("button"));

      expect(childClick).toHaveBeenCalledTimes(1);
      expect(slotClick).toHaveBeenCalledTimes(1);
    });

    it("calls child handler before slot handler", () => {
      const callOrder: string[] = [];

      render(
        <Slot asChild onClick={() => callOrder.push("slot")}>
          <button onClick={() => callOrder.push("child")}>Click Me</button>
        </Slot>
      );

      fireEvent.click(screen.getByRole("button"));

      expect(callOrder).toEqual(["child", "slot"]);
    });

    it("merges onKeyDown handlers", () => {
      const slotKeyDown = vi.fn();
      const childKeyDown = vi.fn();

      render(
        <Slot asChild onKeyDown={slotKeyDown}>
          <button onKeyDown={childKeyDown}>Press Key</button>
        </Slot>
      );

      fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });

      expect(childKeyDown).toHaveBeenCalledTimes(1);
      expect(slotKeyDown).toHaveBeenCalledTimes(1);
    });

    it("merges onBlur and onFocus handlers", () => {
      const slotBlur = vi.fn();
      const slotFocus = vi.fn();
      const childBlur = vi.fn();
      const childFocus = vi.fn();

      render(
        <Slot asChild onBlur={slotBlur} onFocus={slotFocus}>
          <button onBlur={childBlur} onFocus={childFocus}>
            Focus Test
          </button>
        </Slot>
      );

      const button = screen.getByRole("button");

      fireEvent.focus(button);
      expect(childFocus).toHaveBeenCalledTimes(1);
      expect(slotFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(button);
      expect(childBlur).toHaveBeenCalledTimes(1);
      expect(slotBlur).toHaveBeenCalledTimes(1);
    });

    it("merges onMouseEnter and onMouseLeave handlers", () => {
      const slotEnter = vi.fn();
      const slotLeave = vi.fn();
      const childEnter = vi.fn();
      const childLeave = vi.fn();

      render(
        <Slot asChild onMouseEnter={slotEnter} onMouseLeave={slotLeave}>
          <button onMouseEnter={childEnter} onMouseLeave={childLeave}>
            Hover Test
          </button>
        </Slot>
      );

      const button = screen.getByRole("button");

      fireEvent.mouseEnter(button);
      expect(childEnter).toHaveBeenCalledTimes(1);
      expect(slotEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(button);
      expect(childLeave).toHaveBeenCalledTimes(1);
      expect(slotLeave).toHaveBeenCalledTimes(1);
    });

    it("handles only slot handler when child has none", () => {
      const slotClick = vi.fn();

      render(
        <Slot asChild onClick={slotClick}>
          <button>Click Me</button>
        </Slot>
      );

      fireEvent.click(screen.getByRole("button"));

      expect(slotClick).toHaveBeenCalledTimes(1);
    });

    it("handles only child handler when slot has none", () => {
      const childClick = vi.fn();

      render(
        <Slot asChild>
          <button onClick={childClick}>Click Me</button>
        </Slot>
      );

      fireEvent.click(screen.getByRole("button"));

      expect(childClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref when asChild is false", () => {
      const ref = React.createRef<HTMLElement>();

      render(<Slot ref={ref}>Ref Test</Slot>);

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent("Ref Test");
    });

    it("forwards ref when asChild is true", () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Slot asChild ref={ref}>
          <button>Button Ref Test</button>
        </Slot>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent("Button Ref Test");
    });

    it("merges slot ref with child ref", () => {
      const slotRef = React.createRef<HTMLElement>();
      const childRef = React.createRef<HTMLButtonElement>();

      render(
        <Slot asChild ref={slotRef}>
          <button ref={childRef}>Merged Refs</button>
        </Slot>
      );

      expect(slotRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(childRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(slotRef.current).toBe(childRef.current);
    });

    it("works with callback refs", () => {
      let refElement: HTMLElement | null = null;
      const callbackRef = (element: HTMLElement | null) => {
        refElement = element;
      };

      render(<Slot ref={callbackRef}>Callback Ref</Slot>);

      expect(refElement).toBeInstanceOf(HTMLSpanElement);
      expect(refElement).toHaveTextContent("Callback Ref");
    });

    it("merges callback ref with object ref", () => {
      let callbackElement: HTMLElement | null = null;
      const callbackRef = (element: HTMLElement | null) => {
        callbackElement = element;
      };
      const objectRef = React.createRef<HTMLButtonElement>();

      render(
        <Slot asChild ref={callbackRef}>
          <button ref={objectRef}>Mixed Refs</button>
        </Slot>
      );

      expect(callbackElement).toBeInstanceOf(HTMLButtonElement);
      expect(objectRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(callbackElement).toBe(objectRef.current);
    });
  });

  describe("Fallback Handling", () => {
    it("falls back with plain text child when asChild=true", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<Slot asChild>Plain text child</Slot>);

      const element = screen.getByText("Plain text child");
      expect(element.tagName).toBe("SPAN");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "[Slot] Expected a single valid React element"
        )
      );

      consoleSpy.mockRestore();
    });

    it("falls back with multiple children when asChild=true", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(
        <Slot asChild>
          <div>First child</div>
          <div>Second child</div>
        </Slot>
      );

      const container = screen.getByText("First child").parentElement;
      expect(container?.tagName).toBe("SPAN");
      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("falls back with Fragment when asChild=true", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(
        <Slot asChild>
          <>Fragment content</>
        </Slot>
      );

      const element = screen.getByText("Fragment content");
      expect(element.tagName).toBe("SPAN");

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("does not warn when children is null/undefined", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const { container } = render(<Slot asChild>{null}</Slot>);

      const spanElement = container.querySelector("span");
      expect(spanElement).toBeInTheDocument();

      // Should not warn for null children
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("does not warn in production", () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<Slot asChild>Plain text child</Slot>);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe("ClassName Merging", () => {
    it("handles empty classNames", () => {
      render(
        <Slot className="" asChild>
          <div className="">Empty Classes</div>
        </Slot>
      );

      const element = screen.getByText("Empty Classes");
      expect(element).toBeInTheDocument();
      expect(element.className).toBe("");
    });

    it("handles undefined classNames", () => {
      render(
        <Slot className={undefined} asChild>
          <div>No Classes</div>
        </Slot>
      );

      const element = screen.getByText("No Classes");
      expect(element).toBeInTheDocument();
    });

    it("merges multiple classes correctly", () => {
      render(
        <Slot className="slot-1 slot-2" asChild>
          <div className="child-1 child-2">Multiple Classes</div>
        </Slot>
      );

      const element = screen.getByText("Multiple Classes");
      expect(element).toHaveClass("slot-1", "slot-2", "child-1", "child-2");
    });

    it("slot className comes first in merged result", () => {
      render(
        <Slot className="slot-class" asChild>
          <div className="child-class">Order Test</div>
        </Slot>
      );

      const element = screen.getByText("Order Test");
      expect(element.className).toBe("slot-class child-class");
    });
  });

  describe("Edge Cases", () => {
    it("handles deeply nested content", () => {
      render(
        <Slot asChild>
          <div>
            <span>
              <strong>Deeply nested</strong> content
            </span>
          </div>
        </Slot>
      );

      expect(screen.getByText("Deeply nested")).toBeInTheDocument();
    });

    it("handles numeric children when asChild=false", () => {
      render(<Slot>{42}</Slot>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("handles empty children when asChild=false", () => {
      const { container } = render(<Slot>{/* Empty */}</Slot>);

      const spanElement = container.querySelector("span");
      expect(spanElement).toBeEmptyDOMElement();
    });

    it("handles conditional children", () => {
      const { rerender } = render(<Slot>{"Conditional content"}</Slot>);

      expect(screen.getByText("Conditional content")).toBeInTheDocument();

      rerender(<Slot>{null}</Slot>);

      expect(
        screen.queryByText("Conditional content")
      ).not.toBeInTheDocument();
    });

    it("handles array of elements when asChild=false", () => {
      render(
        <Slot>
          {[
            <div key="1">Array item 1</div>,
            <div key="2">Array item 2</div>,
          ]}
        </Slot>
      );

      expect(screen.getByText("Array item 1")).toBeInTheDocument();
      expect(screen.getByText("Array item 2")).toBeInTheDocument();
    });

    it("handles boolean and undefined props", () => {
      render(
        <Slot asChild data-active={true} hidden={false}>
          <div data-test="boolean-props">Boolean Props</div>
        </Slot>
      );

      const element = screen.getByText("Boolean Props");
      expect(element).toHaveAttribute("data-active", "true");
      expect(element).not.toHaveAttribute("hidden");
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Slot.displayName).toBe("Slot");
    });
  });
});
