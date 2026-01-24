import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Alert } from "./alert";

describe("Alert Component", () => {
  describe("Basic Rendering", () => {
    it("renders with description only", () => {
      render(<Alert description="Test alert message" />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Test alert message")).toBeInTheDocument();
    });

    it("renders with heading and description", () => {
      render(
        <Alert description="Test description" heading="Test Heading" />
      );

      expect(screen.getByText("Test Heading")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
    });

    it("renders without any content", () => {
      render(<Alert data-testid="empty-alert" />);

      expect(screen.getByTestId("empty-alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("displays icon when provided as ReactNode", () => {
      render(
        <Alert
          description="Test message"
          icon={<svg data-testid="alert-icon" />}
        />
      );

      const icon = screen.getByTestId("alert-icon");
      expect(icon).toBeInTheDocument();
    });

    it("renders action button when provided", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Alert
          action={{
            children: "Action Button",
            onClick: handleClick,
          }}
          description="Test message"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Action Button");

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies variantName as data attribute", () => {
      render(
        <Alert
          description="Test message"
          variantName="warning"
        />
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("data-variant", "warning");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Alert description="Test message" />);

      const alert = screen.getByRole("alert");
      expect(alert).not.toHaveAttribute("data-variant");
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA role", () => {
      render(<Alert description="Accessible alert" />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("has aria-live attribute for screen reader announcements", () => {
      render(<Alert description="Live region alert" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-live", "polite");
    });

    it("hides icon from screen readers", () => {
      const { container } = render(
        <Alert
          description="Test message"
          icon={<svg data-testid="alert-icon" />}
        />
      );

      const iconWrapper = container.querySelector('[data-slot="icon"]');
      expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    });

    it("supports keyboard navigation for action button", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Alert
          action={{
            children: "Click me",
            onClick: handleClick,
          }}
          description="Test message"
        />
      );

      const button = screen.getByRole("button");

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();

      // Press Enter
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Press Space
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("maintains proper heading hierarchy", () => {
      render(
        <Alert
          description="Description text"
          heading={<h2>Alert Heading</h2>}
        />
      );

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Alert Heading");
    });

    it("supports aria-label", () => {
      render(
        <Alert
          aria-label="Important notification"
          description="Test message"
        />
      );

      const alert = screen.getByLabelText("Important notification");
      expect(alert).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <span id="alert-desc">Additional description</span>
          <Alert
            aria-describedby="alert-desc"
            description="Test message"
          />
        </>
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-describedby", "alert-desc");
    });
  });

  describe("Data Slots", () => {
    it("applies correct data-slot attributes", () => {
      const { container } = render(
        <Alert
          description="Content"
          heading="Title"
          icon={<svg data-testid="icon" />}
        />
      );

      expect(container.querySelector('[data-slot="icon"]')).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="content"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="heading"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="description"]')
      ).toBeInTheDocument();
    });

    it("includes action slot when action is provided", () => {
      const { container } = render(
        <Alert
          action={{ children: "Action", onClick: vi.fn() }}
          description="Content"
        />
      );

      expect(
        container.querySelector('[data-slot="action"]')
      ).toBeInTheDocument();
    });

    it("omits slots when content is not provided", () => {
      const { container } = render(
        <Alert description="Only description" />
      );

      expect(
        container.querySelector('[data-slot="icon"]')
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="heading"]')
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="action"]')
      ).not.toBeInTheDocument();
    });
  });

  describe("Action Button", () => {
    it("calls action onClick handler", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Alert
          action={{
            children: "Click me",
            onClick: handleClick,
          }}
          description="Test message"
        />
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("passes additional props to action button", () => {
      render(
        <Alert
          action={{
            "aria-label": "Custom action",
            children: "Custom Button",
            onClick: vi.fn(),
          }}
          description="Test message"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom action");
    });

    it("applies variantName to action button", () => {
      render(
        <Alert
          action={{
            children: "Styled Button",
            onClick: vi.fn(),
            variantName: "outline",
          }}
          description="Test message"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-variant", "outline");
    });

    it("always applies size sm to action button", () => {
      render(
        <Alert
          action={{
            children: "Small Button",
            onClick: vi.fn(),
          }}
          description="Test message"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-size", "sm");
    });
  });

  describe("Rich Content Support", () => {
    it("supports JSX elements in description", () => {
      render(
        <Alert
          description={
            <div>
              Rich content with <strong>bold text</strong> and{" "}
              <a href="/link">links</a>
            </div>
          }
        />
      );

      expect(screen.getByText("bold text")).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute("href", "/link");
    });

    it("supports JSX elements in heading", () => {
      render(
        <Alert
          description="Description"
          heading={
            <div>
              Heading with <span className="badge">Badge</span>
            </div>
          }
        />
      );

      expect(screen.getByText("Badge")).toBeInTheDocument();
      expect(screen.getByText("Badge")).toHaveClass("badge");
    });

    it("supports complex nested content", () => {
      render(
        <Alert
          description={
            <div>
              <p>First paragraph</p>
              <ul>
                <li>List item 1</li>
                <li>List item 2</li>
              </ul>
              <p>
                Second paragraph with <code>inline code</code>
              </p>
            </div>
          }
        />
      );

      expect(screen.getByText("First paragraph")).toBeInTheDocument();
      expect(screen.getByText("List item 1")).toBeInTheDocument();
      expect(screen.getByText("inline code")).toBeInTheDocument();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to root element", () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<Alert description="Test message" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute("role", "alert");
    });

    it("works with callback refs", () => {
      let refElement: HTMLDivElement | null = null;
      const callbackRef = (element: HTMLDivElement | null) => {
        refElement = element;
      };

      render(<Alert description="Test message" ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLDivElement);
      expect(refElement).toHaveAttribute("role", "alert");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Alert
          id="alert-id"
          data-testid="custom-alert"
          description="Test message"
          title="Alert title"
        />
      );

      const alert = screen.getByTestId("custom-alert");
      expect(alert).toHaveAttribute("id", "alert-id");
      expect(alert).toHaveAttribute("title", "Alert title");
    });

    it("merges className correctly", () => {
      render(
        <Alert
          className="custom-class another-class"
          description="Test message"
        />
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("custom-class", "another-class");
    });

    it("supports inline styles", () => {
      render(
        <Alert
          style={{ backgroundColor: "red", padding: "20px" }}
          description="Styled alert"
        />
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
      expect(alert).toHaveStyle("padding: 20px");
    });

    it("supports event handlers", () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();

      render(
        <Alert
          description="Interactive alert"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
        />
      );

      const alert = screen.getByRole("alert");

      fireEvent.click(alert);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.mouseEnter(alert);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe("Variant Names", () => {
    const variants = ["info", "success", "warning", "destructive"];

    variants.forEach((variant) => {
      it(`applies ${variant} variant correctly`, () => {
        render(
          <Alert
            data-testid={`alert-${variant}`}
            description={`${variant} alert`}
            variantName={variant}
          />
        );

        const alert = screen.getByTestId(`alert-${variant}`);
        expect(alert).toHaveAttribute("data-variant", variant);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles null/undefined values gracefully", () => {
      render(
        <Alert
          data-testid="edge-alert"
          description={null}
          heading={undefined}
        />
      );

      const alert = screen.getByTestId("edge-alert");
      expect(alert).toBeInTheDocument();
    });

    it("handles zero as description", () => {
      render(<Alert description={0} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles action without onClick", () => {
      render(
        <Alert
          action={{ children: "No handler" }}
          description="Test message"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("No handler");
    });

    it("renders correctly with all props", () => {
      const handleClick = vi.fn();

      render(
        <Alert
          className="full-alert"
          action={{
            children: "Action",
            onClick: handleClick,
            variantName: "outline",
          }}
          description="Full description"
          heading="Full Heading"
          icon={<svg data-testid="full-icon" />}
          variantName="info"
        />
      );

      expect(screen.getByRole("alert")).toHaveClass("full-alert");
      expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "info");
      expect(screen.getByText("Full Heading")).toBeInTheDocument();
      expect(screen.getByText("Full description")).toBeInTheDocument();
      expect(screen.getByTestId("full-icon")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("Action");
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Alert.displayName).toBe("Alert");
    });
  });
});
