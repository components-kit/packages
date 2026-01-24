import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./textarea";

describe("Textarea Component", () => {
  describe("Basic Rendering", () => {
    it("renders as textarea element", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("renders with placeholder text", () => {
      render(<Textarea placeholder="Enter your message" />);

      const textarea = screen.getByPlaceholderText("Enter your message");
      expect(textarea).toBeInTheDocument();
    });

    it("renders with custom rows", () => {
      render(<Textarea rows={5} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
    });

    it("renders with custom cols", () => {
      render(<Textarea cols={80} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("cols", "80");
    });

    it("applies variant name as data attribute", () => {
      render(<Textarea variantName="primary" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("data-variant", "primary");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toHaveAttribute("data-variant");
    });
  });

  describe("Auto-Resize Functionality", () => {
    it("adjusts height on input", async () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

      // Mock scrollHeight to simulate content growth
      Object.defineProperty(textarea, "scrollHeight", {
        value: 100,
        writable: true,
      });

      fireEvent.input(textarea, {
        target: { value: "Line 1\nLine 2\nLine 3" },
      });

      await waitFor(() => {
        expect(textarea.style.height).toBe("100px");
      });
    });

    it("calls user's onInput handler while maintaining auto-resize", async () => {
      const handleInput = vi.fn();
      render(<Textarea onInput={handleInput} />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

      // Mock scrollHeight to verify auto-resize still works
      Object.defineProperty(textarea, "scrollHeight", {
        value: 100,
        writable: true,
      });

      fireEvent.input(textarea, { target: { value: "test content" } });

      // User's handler should be called
      expect(handleInput).toHaveBeenCalledTimes(1);
      expect(handleInput).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "test content",
          }),
        })
      );

      // Auto-resize should still work
      await waitFor(() => {
        expect(textarea.style.height).toBe("100px");
      });
    });
  });

  describe("Event Handling", () => {
    it("calls onInput when textarea content changes", () => {
      const handleInput = vi.fn();
      render(<Textarea onInput={handleInput} />);

      const textarea = screen.getByRole("textbox");
      fireEvent.input(textarea, { target: { value: "new content" } });

      expect(handleInput).toHaveBeenCalledTimes(1);
      expect(handleInput).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "new content",
          }),
        })
      );
    });

    it("supports onFocus and onBlur events", () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();

      render(<Textarea onBlur={handleBlur} onFocus={handleFocus} />);

      const textarea = screen.getByRole("textbox");

      fireEvent.focus(textarea);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(textarea);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("handles multiline input correctly", () => {
      const handleInput = vi.fn();
      render(<Textarea onInput={handleInput} />);

      const textarea = screen.getByRole("textbox");
      const multilineText = "Line 1\nLine 2\nLine 3";

      fireEvent.input(textarea, { target: { value: multilineText } });

      expect(handleInput).toHaveBeenCalledTimes(1);
      expect(textarea).toHaveValue(multilineText);
    });

    it("supports onChange event", () => {
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "changed content" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to textarea element", () => {
      const ref = React.createRef<HTMLTextAreaElement>();

      render(<Textarea ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current?.tagName).toBe("TEXTAREA");
    });

    it("merges internal and external refs correctly", async () => {
      const externalRef = React.createRef<HTMLTextAreaElement>();

      render(<Textarea ref={externalRef} />);

      expect(externalRef.current).toBeInstanceOf(HTMLTextAreaElement);

      // Verify auto-resize still works with external ref
      const textarea = externalRef.current!;
      Object.defineProperty(textarea, "scrollHeight", {
        value: 90,
        writable: true,
      });

      fireEvent.input(textarea, { target: { value: "test" } });

      await waitFor(() => {
        expect(textarea.style.height).toBe("90px");
      });
    });

    it("works with callback refs", () => {
      let refElement: HTMLTextAreaElement | null = null;
      const callbackRef = (element: HTMLTextAreaElement | null) => {
        refElement = element;
      };

      render(<Textarea ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe("Textarea States", () => {
    it("renders as enabled by default", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toBeDisabled();
    });

    it("renders as disabled when disabled prop is true", () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
    });

    it("renders as readonly when readOnly prop is true", () => {
      render(<Textarea readOnly />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("readonly");
    });

    it("supports controlled textarea with value prop", () => {
      const { rerender } = render(
        <Textarea value="initial value" onChange={() => {}} />
      );

      let textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("initial value");

      rerender(<Textarea value="updated value" onChange={() => {}} />);
      textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("updated value");
    });

    it("supports uncontrolled textarea with defaultValue prop", () => {
      render(<Textarea defaultValue="default text" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("default text");
    });

    it("handles required attribute", () => {
      render(<Textarea required />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("required");
    });
  });

  describe("Form Integration", () => {
    it("works with form submission", () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
      });

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="message" />
          <button type="submit">Submit</button>
        </form>
      );

      const textarea = screen.getByRole("textbox");
      const form = textarea.closest("form");

      fireEvent.change(textarea, { target: { value: "test message" } });
      expect(textarea).toHaveValue("test message");

      if (form) {
        fireEvent.submit(form);
      }

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("supports name and value attributes", () => {
      render(
        <Textarea
          name="description"
          value="test description"
          onChange={() => {}}
        />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("name", "description");
      expect(textarea).toHaveValue("test description");
    });

    it("works with labels", () => {
      render(
        <div>
          <label htmlFor="test-textarea">Message</label>
          <Textarea id="test-textarea" />
        </div>
      );

      const textarea = screen.getByLabelText("Message");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("id", "test-textarea");
    });

    it("supports maxLength validation", () => {
      render(<Textarea maxLength={500} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("maxlength", "500");
    });

    it("supports minLength validation", () => {
      render(<Textarea minLength={10} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("minlength", "10");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Textarea
          id="textarea-id"
          data-testid="custom-textarea"
          maxLength={500}
          minLength={10}
          title="Textarea title"
        />
      );

      const textarea = screen.getByTestId("custom-textarea");
      expect(textarea).toHaveAttribute("id", "textarea-id");
      expect(textarea).toHaveAttribute("title", "Textarea title");
      expect(textarea).toHaveAttribute("maxlength", "500");
      expect(textarea).toHaveAttribute("minlength", "10");
    });

    it("merges className correctly", () => {
      render(<Textarea className="custom-class another-class" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("custom-class", "another-class");
    });

    it("supports inline styles", () => {
      render(<Textarea style={{ margin: "15px" }} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea.style.margin).toBe("15px");
    });

    it("supports textarea-specific attributes", () => {
      render(<Textarea cols={50} rows={10} wrap="soft" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("cols", "50");
      expect(textarea).toHaveAttribute("rows", "10");
      expect(textarea).toHaveAttribute("wrap", "soft");
    });
  });

  describe("Accessibility", () => {
    it("has correct textbox role", () => {
      render(<Textarea />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Textarea aria-label="Custom textarea label" />);

      const textarea = screen.getByLabelText("Custom textarea label");
      expect(textarea).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <div id="description">Textarea description</div>
          <Textarea aria-describedby="description" />
        </>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-describedby", "description");
    });

    it("supports aria-invalid for error states", () => {
      render(<Textarea aria-invalid="true" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
    });

    it("maintains accessibility when disabled", () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveAttribute("disabled");
    });

    it("supports aria-required", () => {
      render(<Textarea aria-required="true" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-required", "true");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <span id="label">Label text</span>
          <Textarea aria-labelledby="label" />
        </>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-labelledby", "label");
    });

    it("announces value changes to screen readers", () => {
      render(<Textarea aria-label="Message input" />);

      const textarea = screen.getByLabelText("Message input");

      fireEvent.change(textarea, { target: { value: "long message content" } });
      expect(textarea).toHaveValue("long message content");
    });
  });

  describe("Error States", () => {
    it("supports data-error attribute for styling", () => {
      render(<Textarea data-error="true" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("data-error", "true");
    });

    it("combines error state with other attributes", () => {
      render(
        <Textarea
          aria-describedby="error-message"
          aria-invalid="true"
          data-error="true"
        />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("data-error", "true");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
      expect(textarea).toHaveAttribute("aria-describedby", "error-message");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid input changes with auto-resize", async () => {
      const handleInput = vi.fn();
      render(<Textarea onInput={handleInput} />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

      // Mock different scroll heights for different content lengths
      let scrollHeight = 50;
      Object.defineProperty(textarea, "scrollHeight", {
        get: () => scrollHeight,
      });

      // Simulate rapid typing with growing content
      scrollHeight = 60;
      fireEvent.input(textarea, { target: { value: "a" } });

      scrollHeight = 70;
      fireEvent.input(textarea, { target: { value: "ab\n" } });

      scrollHeight = 80;
      fireEvent.input(textarea, { target: { value: "ab\nc" } });

      expect(handleInput).toHaveBeenCalledTimes(3);
      expect(textarea).toHaveValue("ab\nc");

      await waitFor(() => {
        expect(textarea.style.height).toBe("80px");
      });
    });

    it("handles empty and whitespace values", () => {
      const { rerender } = render(
        <Textarea value="" onChange={() => {}} />
      );

      let textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");

      rerender(<Textarea value="   " onChange={() => {}} />);
      textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("   ");
    });

    it("maintains state during re-renders", () => {
      const TestComponent = ({ variant }: { variant?: string }) => (
        <Textarea defaultValue="persistent content" variantName={variant} />
      );

      const { rerender } = render(<TestComponent variant="default" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("persistent content");

      rerender(<TestComponent variant="primary" />);
      expect(screen.getByRole("textbox")).toHaveValue("persistent content");
    });

    it("handles special characters and unicode", () => {
      const specialChars = "🔥 ❤️ 🚀 <>&\"'";
      render(<Textarea defaultValue={specialChars} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(specialChars);
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Textarea.displayName).toBe("Textarea");
    });
  });
});
