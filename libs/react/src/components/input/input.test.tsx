import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./input";

describe("Input Component", () => {
  describe("Basic Rendering", () => {
    it("renders as input element", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
    });

    it("renders with default type text when type is not provided", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });

    it("applies variantName as data attribute", () => {
      render(<Input variantName="primary" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("data-variant", "primary");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).not.toHaveAttribute("data-variant");
    });

    it("renders with placeholder text", () => {
      render(<Input placeholder="Enter your text" />);

      const input = screen.getByPlaceholderText("Enter your text");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Input Types", () => {
    const inputTypes = [
      { role: "textbox", testValue: "test text", type: "text" },
      { role: "textbox", testValue: "test@example.com", type: "email" },
      { role: "spinbutton", testValue: 123, type: "number" },
      { role: "textbox", testValue: "+1234567890", type: "tel" },
      { role: "textbox", testValue: "https://example.com", type: "url" },
      { role: "searchbox", testValue: "search query", type: "search" },
    ];

    inputTypes.forEach(({ role, testValue, type }) => {
      it(`renders correctly with type="${type}"`, () => {
        render(<Input type={type} />);

        const input = screen.getByRole(role);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", type);

        fireEvent.change(input, { target: { value: testValue } });
        expect(input).toHaveValue(testValue);
      });
    });

    it("handles color input type", () => {
      render(<Input type="color" />);

      const input = screen.getByDisplayValue("#000000");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "color");
    });

    it("handles range input type", () => {
      render(<Input defaultValue="50" max="100" min="0" type="range" />);

      const input = screen.getByRole("slider");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "range");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "100");
    });

    it("handles file input type", () => {
      const { container } = render(<Input type="file" />);

      const input = container.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "file");
    });
  });

  describe("Input States", () => {
    it("renders as enabled by default", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).not.toBeDisabled();
    });

    it("renders as disabled when disabled prop is true", () => {
      render(<Input disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("renders as readonly when readOnly prop is true", () => {
      render(<Input readOnly />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });

    it("supports controlled input with value prop", () => {
      const { rerender } = render(
        <Input value="initial value" onChange={() => {}} />
      );

      let input = screen.getByRole("textbox");
      expect(input).toHaveValue("initial value");

      rerender(<Input value="updated value" onChange={() => {}} />);
      input = screen.getByRole("textbox");
      expect(input).toHaveValue("updated value");
    });

    it("supports uncontrolled input with defaultValue prop", () => {
      render(<Input defaultValue="default text" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("default text");
    });

    it("handles required attribute", () => {
      render(<Input required />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("required");
    });
  });

  describe("Event Handling", () => {
    it("calls onChange when input value changes", () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "new value" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "new value",
          }),
        })
      );
    });

    it("supports onFocus and onBlur events", () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();

      render(<Input onBlur={handleBlur} onFocus={handleFocus} />);

      const input = screen.getByRole("textbox");

      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("supports keyboard events", () => {
      const handleKeyDown = vi.fn();
      const handleKeyUp = vi.fn();

      render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);

      const input = screen.getByRole("textbox");

      fireEvent.keyDown(input, { code: "KeyA", key: "A" });
      fireEvent.keyUp(input, { code: "KeyA", key: "A" });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyUp).toHaveBeenCalledTimes(1);
    });
  });

  describe("Form Integration", () => {
    it("works with form submission", () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
      });

      render(
        <form onSubmit={handleSubmit}>
          <Input name="username" />
          <button type="submit">Submit</button>
        </form>
      );

      const input = screen.getByRole("textbox");
      const form = input.closest("form");

      fireEvent.change(input, { target: { value: "testuser" } });
      expect(input).toHaveValue("testuser");

      if (form) {
        fireEvent.submit(form);
      }

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("supports name and value attributes", () => {
      render(<Input name="email" value="test@example.com" onChange={() => {}} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("name", "email");
      expect(input).toHaveValue("test@example.com");
    });

    it("works with labels", () => {
      render(
        <div>
          <label htmlFor="test-input">Test Label</label>
          <Input id="test-input" />
        </div>
      );

      const input = screen.getByLabelText("Test Label");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "test-input");
    });

    it("supports form validation with pattern", () => {
      render(
        <Input pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" type="email" />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("pattern");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe("text");
    });

    it("works with callback refs", () => {
      let refElement: HTMLInputElement | null = null;
      const callbackRef = (element: HTMLInputElement | null) => {
        refElement = element;
      };

      render(<Input ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLInputElement);
      expect(refElement).toBeTruthy();
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Input
          id="input-id"
          data-testid="custom-input"
          maxLength={100}
          minLength={5}
          title="Input title"
        />
      );

      const input = screen.getByTestId("custom-input");
      expect(input).toHaveAttribute("id", "input-id");
      expect(input).toHaveAttribute("title", "Input title");
      expect(input).toHaveAttribute("maxlength", "100");
      expect(input).toHaveAttribute("minlength", "5");
    });

    it("merges className correctly", () => {
      render(<Input className="custom-class another-class" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-class", "another-class");
    });

    it("supports inline styles", () => {
      render(<Input style={{ margin: "10px" }} />);

      const input = screen.getByRole("textbox");
      expect(input.style.margin).toBe("10px");
    });

    it("supports input-specific attributes", () => {
      render(<Input max="100" min="0" step="5" type="number" />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "100");
      expect(input).toHaveAttribute("step", "5");
    });
  });

  describe("Accessibility", () => {
    it("has correct textbox role by default", () => {
      render(<Input />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Input aria-label="Custom input label" />);

      const input = screen.getByLabelText("Custom input label");
      expect(input).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <div id="description">Input description</div>
          <Input aria-describedby="description" />
        </>
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "description");
    });

    it("supports aria-invalid for error states", () => {
      render(<Input aria-invalid="true" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("supports aria-required", () => {
      render(<Input aria-required="true" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("maintains accessibility when disabled", () => {
      render(<Input disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute("disabled");
    });
  });

  describe("Variant Names", () => {
    const variants = ["default", "primary", "error", "success"];

    variants.forEach((variant) => {
      it(`applies ${variant} variant correctly`, () => {
        render(<Input data-testid={`input-${variant}`} variantName={variant} />);

        const input = screen.getByTestId(`input-${variant}`);
        expect(input).toHaveAttribute("data-variant", variant);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid input changes", () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "a" } });
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.change(input, { target: { value: "abc" } });

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(input).toHaveValue("abc");
    });

    it("handles empty and whitespace values", () => {
      const { rerender } = render(<Input value="" onChange={() => {}} />);

      let input = screen.getByRole("textbox");
      expect(input).toHaveValue("");

      rerender(<Input value="   " onChange={() => {}} />);
      input = screen.getByRole("textbox");
      expect(input).toHaveValue("   ");
    });

    it("maintains state during re-renders", () => {
      const TestComponent = ({ variant }: { variant: string }) => (
        <Input defaultValue="persistent value" variantName={variant} />
      );

      const { rerender } = render(<TestComponent variant="default" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("persistent value");

      rerender(<TestComponent variant="primary" />);
      expect(screen.getByRole("textbox")).toHaveValue("persistent value");
    });

    it("handles special characters and unicode", () => {
      render(<Input defaultValue="こんにちは 你好 <>&" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("こんにちは 你好 <>&");
    });
  });

  describe("Input Groups and Patterns", () => {
    it("works in form with multiple inputs", () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
      });

      render(
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>User Information</legend>
            <Input name="firstName" placeholder="First Name" />
            <Input name="lastName" placeholder="Last Name" />
            <Input name="email" placeholder="Email" type="email" />
            <Input name="phone" placeholder="Phone" type="tel" />
          </fieldset>
        </form>
      );

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(4);

      fireEvent.change(inputs[0], { target: { value: "John" } });
      fireEvent.change(inputs[1], { target: { value: "Doe" } });
      fireEvent.change(inputs[2], { target: { value: "john@example.com" } });
      fireEvent.change(inputs[3], { target: { value: "+1234567890" } });

      expect(inputs[0]).toHaveValue("John");
      expect(inputs[1]).toHaveValue("Doe");
      expect(inputs[2]).toHaveValue("john@example.com");
      expect(inputs[3]).toHaveValue("+1234567890");
    });

    it("supports input with validation messages", () => {
      const TestInputWithValidation = () => {
        const [value, setValue] = React.useState("");
        const [error, setError] = React.useState("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          setValue(newValue);

          if (newValue.length < 3) {
            setError("Must be at least 3 characters");
          } else {
            setError("");
          }
        };

        return (
          <div>
            <label htmlFor="validated-input">Username</label>
            <Input
              id="validated-input"
              aria-describedby={error ? "error-message" : undefined}
              aria-invalid={error ? "true" : "false"}
              data-error={error ? "true" : "false"}
              value={value}
              onChange={handleChange}
            />
            {error && (
              <div id="error-message" role="alert">
                {error}
              </div>
            )}
          </div>
        );
      };

      render(<TestInputWithValidation />);

      const input = screen.getByLabelText("Username");

      fireEvent.change(input, { target: { value: "ab" } });
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Must be at least 3 characters"
      );
      expect(input).toHaveAttribute("data-error", "true");

      fireEvent.change(input, { target: { value: "abc" } });
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(input).toHaveAttribute("data-error", "false");
    });

    it("supports search functionality", () => {
      const TestSearchComponent = () => {
        const [query, setQuery] = React.useState("");
        const [results, setResults] = React.useState<string[]>([]);

        const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setQuery(value);

          if (value.length > 0) {
            setResults([`Result for "${value}" 1`, `Result for "${value}" 2`]);
          } else {
            setResults([]);
          }
        };

        return (
          <div>
            <Input
              placeholder="Search..."
              type="search"
              value={query}
              onChange={handleSearch}
            />
            {results.length > 0 && (
              <ul role="listbox">
                {results.map((result, index) => (
                  <li key={index} role="option">
                    {result}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      };

      render(<TestSearchComponent />);

      const searchInput = screen.getByRole("searchbox");

      fireEvent.change(searchInput, { target: { value: "test" } });

      expect(searchInput).toHaveValue("test");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getAllByRole("option")).toHaveLength(2);
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Input.displayName).toBe("Input");
    });
  });
});
