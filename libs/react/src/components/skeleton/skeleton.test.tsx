import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Skeleton } from "./skeleton";

describe("Skeleton Component", () => {
  describe("Basic Rendering", () => {
    it("renders as div element", () => {
      const { container } = render(<Skeleton />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton.tagName).toBe("DIV");
    });

    it("applies custom dimensions", () => {
      const { container } = render(<Skeleton height="100px" width="200px" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle("width: 200px");
      expect(skeleton).toHaveStyle("height: 100px");
    });

    it("renders without any props", () => {
      const { container } = render(<Skeleton />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton.tagName).toBe("DIV");
    });
  });

  describe("Dimension Handling", () => {
    it("handles width only", () => {
      const { container } = render(<Skeleton width="150px" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle("width: 150px");
    });

    it("handles height only", () => {
      const { container } = render(<Skeleton height="50px" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle("height: 50px");
    });

    it("handles both width and height", () => {
      const { container } = render(<Skeleton height="80px" width="120px" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle("width: 120px");
      expect(skeleton).toHaveStyle("height: 80px");
    });

    it("handles percentage dimensions", () => {
      const { container } = render(<Skeleton height="50%" width="75%" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle("width: 75%");
      expect(skeleton).toHaveStyle("height: 50%");
    });

    it("handles em units", () => {
      const { container } = render(<Skeleton height="1em" width="10em" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle("width: 10em");
      expect(skeleton).toHaveStyle("height: 1em");
    });

    it("handles no dimensions", () => {
      const { container } = render(<Skeleton />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("Variant Name", () => {
    it("applies data-variant attribute when variantName is provided", () => {
      render(<Skeleton data-testid="skeleton" variantName="text" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAttribute("data-variant", "text");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Skeleton data-testid="skeleton" />);

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).not.toHaveAttribute("data-variant");
    });

    it("handles different variant names", () => {
      const variants = ["text", "avatar", "card", "button", "image"];

      variants.forEach((variant) => {
        const { unmount } = render(
          <Skeleton data-testid={`skeleton-${variant}`} variantName={variant} />
        );

        const skeleton = screen.getByTestId(`skeleton-${variant}`);
        expect(skeleton).toHaveAttribute("data-variant", variant);
        unmount();
      });
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to root div element", () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<Skeleton ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("works with callback refs", () => {
      let refElement: HTMLDivElement | null = null;
      const callbackRef = (element: HTMLDivElement | null) => {
        refElement = element;
      };

      render(<Skeleton ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLDivElement);
    });

    it("ref is accessible for DOM manipulation", () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<Skeleton height="100px" width="200px" ref={ref} />);

      expect(ref.current?.style.width).toBe("200px");
      expect(ref.current?.style.height).toBe("100px");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Skeleton
          id="skeleton-id"
          data-testid="custom-skeleton"
          title="Skeleton title"
        />
      );

      const skeleton = screen.getByTestId("custom-skeleton");
      expect(skeleton).toHaveAttribute("id", "skeleton-id");
      expect(skeleton).toHaveAttribute("title", "Skeleton title");
    });

    it("applies className correctly", () => {
      render(
        <Skeleton className="custom-class another-class" data-testid="skeleton-element" />
      );

      const skeleton = screen.getByTestId("skeleton-element");
      expect(skeleton).toHaveClass("custom-class", "another-class");
    });

    it("merges style correctly with dimensions", () => {
      render(
        <Skeleton
          style={{ borderRadius: "8px", opacity: 0.5 }}
          data-testid="skeleton-style-test"
          height="100px"
          width="200px"
        />
      );

      const skeleton = screen.getByTestId("skeleton-style-test");
      expect(skeleton).toHaveStyle("opacity: 0.5");
      expect(skeleton).toHaveStyle("border-radius: 8px");
      expect(skeleton).toHaveStyle("width: 200px");
      expect(skeleton).toHaveStyle("height: 100px");
    });

    it("dimension props override style dimensions", () => {
      render(
        <Skeleton
          style={{ height: "50px", width: "50px" }}
          data-testid="skeleton-override"
          height="100px"
          width="200px"
        />
      );

      const skeleton = screen.getByTestId("skeleton-override");
      expect(skeleton).toHaveStyle("width: 200px");
      expect(skeleton).toHaveStyle("height: 100px");
    });

    it("supports event handlers", () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Skeleton
          data-testid="skeleton-events"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
        />
      );

      const skeleton = screen.getByTestId("skeleton-events");

      fireEvent.click(skeleton);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseEnter(skeleton);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label for screen readers", () => {
      render(<Skeleton aria-label="Loading content" />);

      const skeleton = screen.getByLabelText("Loading content");
      expect(skeleton).toBeInTheDocument();
    });

    it("supports role attribute (requires aria-hidden override)", () => {
      // By default, Skeleton has aria-hidden="true". To make it accessible,
      // consumers must override with aria-hidden={false}
      render(<Skeleton aria-hidden={false} role="status" />);

      const skeleton = screen.getByRole("status");
      expect(skeleton).toBeInTheDocument();
    });

    it("supports aria-busy for loading states", () => {
      render(
        <Skeleton aria-busy="true" data-testid="skeleton-busy" />
      );

      const skeleton = screen.getByTestId("skeleton-busy");
      expect(skeleton).toHaveAttribute("aria-busy", "true");
    });

    it("supports aria-live for announcing updates", () => {
      render(
        <Skeleton aria-live="polite" data-testid="skeleton-live" />
      );

      const skeleton = screen.getByTestId("skeleton-live");
      expect(skeleton).toHaveAttribute("aria-live", "polite");
    });

    it("has aria-hidden=true by default (decorative)", () => {
      render(<Skeleton data-testid="skeleton-hidden" />);

      const skeleton = screen.getByTestId("skeleton-hidden");
      expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    it("allows aria-hidden to be overridden to false", () => {
      render(<Skeleton aria-hidden={false} data-testid="skeleton-visible" />);

      const skeleton = screen.getByTestId("skeleton-visible");
      // aria-hidden={false} renders as aria-hidden="false" in DOM, which unhides the element
      expect(skeleton).toHaveAttribute("aria-hidden", "false");
    });

    it("works with role=status and aria-label combination (requires aria-hidden override)", () => {
      // By default, Skeleton has aria-hidden="true". To make it accessible,
      // consumers must override with aria-hidden={false}
      render(
        <Skeleton
          aria-hidden={false}
          aria-label="Loading user profile"
          data-testid="skeleton-accessible"
          role="status"
        />
      );

      const skeleton = screen.getByRole("status");
      expect(skeleton).toHaveAttribute("aria-label", "Loading user profile");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <span id="loading-label">Loading...</span>
          <Skeleton aria-labelledby="loading-label" data-testid="skeleton" />
        </>
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveAttribute("aria-labelledby", "loading-label");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string dimensions", () => {
      const { container } = render(<Skeleton height="" width="" />);

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toBeInTheDocument();
    });

    it("handles undefined dimensions explicitly", () => {
      const { container } = render(
        <Skeleton height={undefined} width={undefined} />
      );

      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toBeInTheDocument();
    });

    it("handles multiple skeletons", () => {
      render(
        <>
          <Skeleton data-testid="skeleton-1" height="20px" />
          <Skeleton data-testid="skeleton-2" height="40px" />
          <Skeleton data-testid="skeleton-3" height="60px" />
        </>
      );

      expect(screen.getByTestId("skeleton-1")).toHaveStyle("height: 20px");
      expect(screen.getByTestId("skeleton-2")).toHaveStyle("height: 40px");
      expect(screen.getByTestId("skeleton-3")).toHaveStyle("height: 60px");
    });

    it("handles rerender with different dimensions", () => {
      const { rerender } = render(
        <Skeleton data-testid="skeleton" height="100px" width="200px" />
      );

      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveStyle("width: 200px");
      expect(skeleton).toHaveStyle("height: 100px");

      rerender(<Skeleton data-testid="skeleton" height="50px" width="100px" />);

      expect(skeleton).toHaveStyle("width: 100px");
      expect(skeleton).toHaveStyle("height: 50px");
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Skeleton.displayName).toBe("Skeleton");
    });
  });
});
