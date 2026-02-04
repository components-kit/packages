import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button Component", () => {
  describe("Basic Rendering", () => {
    it("renders with children content", () => {
      render(<Button>Test Button</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("renders with default type='button'", () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("allows overriding type attribute", () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("sets data-variant attribute correctly", () => {
      render(<Button variantName="primary">Primary Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-variant", "primary");
    });

    it("renders with default size when not provided", () => {
      render(<Button>Default Size</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-size", "md");
    });

    it("renders with different sizes", () => {
      const { rerender } = render(<Button size="sm">Small</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("data-size", "sm");

      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "md");

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "lg");
    });

    it("renders with fullWidth", () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-full-width", "true");
    });

    it("does not render data-full-width when false", () => {
      render(<Button>Normal Width</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("data-full-width");
    });
  });

  describe("Loading State", () => {
    it("sets data-loading attribute when loading", () => {
      render(<Button isLoading>Loading Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-loading", "true");
    });

    it("does not render data-loading when false", () => {
      render(<Button>Not Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("data-loading");
    });

    it("sets aria-busy when loading", () => {
      render(<Button isLoading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("does not set aria-busy when not loading", () => {
      render(<Button>Not Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("aria-busy");
    });

    it("sets aria-disabled when loading", () => {
      render(<Button isLoading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("prevents click when loading", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("prevents keyboard activation when loading", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });
      fireEvent.keyDown(button, { key: " " });

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("sets aria-disabled when disabled", () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("sets data-disabled when disabled", () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-disabled", "true");
    });

    it("remains focusable when disabled (for accessibility)", () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("prevents click when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("prevents Enter key activation when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("prevents Space key activation when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: " " });

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("allows other key events when disabled", () => {
      const handleKeyDown = vi.fn();
      render(
        <Button disabled onKeyDown={handleKeyDown}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Tab" });

      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe("Icon Support (ReactNode)", () => {
    it("renders leading icon as ReactNode", () => {
      render(
        <Button leadingIcon={<span data-testid="leading-icon">←</span>}>
          Button with leading icon
        </Button>
      );

      expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
    });

    it("renders trailing icon as ReactNode", () => {
      render(
        <Button trailingIcon={<span data-testid="trailing-icon">→</span>}>
          Button with trailing icon
        </Button>
      );

      expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
    });

    it("renders both leading and trailing icons", () => {
      render(
        <Button
          leadingIcon={<span data-testid="leading">←</span>}
          trailingIcon={<span data-testid="trailing">→</span>}
        >
          Button with both icons
        </Button>
      );

      expect(screen.getByTestId("leading")).toBeInTheDocument();
      expect(screen.getByTestId("trailing")).toBeInTheDocument();
    });

    it("renders icons in correct order", () => {
      render(
        <Button
          leadingIcon={<span>LEAD</span>}
          trailingIcon={<span>TRAIL</span>}
        >
          TEXT
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button.textContent).toBe("LEADTEXTTRAIL");
    });
  });

  describe("AsChild Functionality", () => {
    it("renders as button when asChild is false", () => {
      render(<Button asChild={false}>Normal Button</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("merges with child element when asChild is true", () => {
      render(
        <Button asChild variantName="primary">
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveTextContent("Link Button");
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveAttribute("data-variant", "primary");
    });

    it("passes props to child element when asChild is true", () => {
      render(
        <Button asChild size="lg" variantName="secondary">
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("data-size", "lg");
      expect(link).toHaveAttribute("data-variant", "secondary");
      expect(link).toHaveAttribute("href", "/test");
    });

    it("renders leading icon when asChild is true", () => {
      render(
        <Button asChild leadingIcon={<span data-testid="leading-icon">←</span>}>
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
      expect(link).toContainElement(screen.getByTestId("leading-icon"));
    });

    it("renders trailing icon when asChild is true", () => {
      render(
        <Button
          asChild
          trailingIcon={<span data-testid="trailing-icon">→</span>}
        >
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
      expect(link).toContainElement(screen.getByTestId("trailing-icon"));
    });

    it("renders both icons in correct order when asChild is true", () => {
      render(
        <Button
          asChild
          leadingIcon={<span>LEAD</span>}
          trailingIcon={<span>TRAIL</span>}
        >
          <a href="/test">TEXT</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link.textContent).toBe("LEADTEXTTRAIL");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to button element", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Test</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent("Ref Test");
    });

    it("works with callback refs", () => {
      let refElement: HTMLButtonElement | null = null;
      const callbackRef = (element: HTMLButtonElement | null) => {
        refElement = element;
      };

      render(<Button ref={callbackRef}>Callback Ref</Button>);

      expect(refElement).toBeInstanceOf(HTMLButtonElement);
      expect(refElement).toHaveTextContent("Callback Ref");
    });
  });

  describe("Event Handlers", () => {
    it("calls onClick handler when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      fireEvent.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("calls onKeyDown handler", () => {
      const handleKeyDown = vi.fn();
      render(<Button onKeyDown={handleKeyDown}>Press Key</Button>);

      fireEvent.keyDown(screen.getByRole("button"), { key: "a" });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it("calls onMouseEnter handler", () => {
      const handleMouseEnter = vi.fn();
      render(<Button onMouseEnter={handleMouseEnter}>Hover Me</Button>);

      fireEvent.mouseEnter(screen.getByRole("button"));

      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Button id="button-id" data-testid="custom-button" title="Button title">
          Attributes Test
        </Button>
      );

      const button = screen.getByTestId("custom-button");
      expect(button).toHaveAttribute("id", "button-id");
      expect(button).toHaveAttribute("title", "Button title");
    });

    it("merges className correctly", () => {
      render(<Button className="custom-class">Class Test</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Accessibility", () => {
    it("has correct button role by default", () => {
      render(<Button>Accessible Button</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-label for icon-only buttons", () => {
      render(<Button aria-label="Search" leadingIcon={<span>🔍</span>} />);

      expect(screen.getByLabelText("Search")).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <div id="description">Button description</div>
          <Button aria-describedby="description">Described Button</Button>
        </>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "description");
    });

    it("supports aria-expanded", () => {
      render(<Button aria-expanded={true}>Expandable Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("supports aria-pressed for toggle buttons", () => {
      render(<Button aria-pressed={true}>Toggle Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string children", () => {
      render(<Button>{""}</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("handles zero as children", () => {
      render(<Button>{0}</Button>);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles complex nested content", () => {
      render(
        <Button>
          <span>
            Complex <strong>nested</strong> content
          </span>
        </Button>
      );

      expect(screen.getByText("nested")).toBeInTheDocument();
    });

    it("handles null children", () => {
      render(<Button>{null}</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Button.displayName).toBe("Button");
    });
  });
});
