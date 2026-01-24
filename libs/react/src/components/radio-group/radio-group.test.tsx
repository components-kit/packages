import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup Component", () => {
  describe("Basic Rendering", () => {
    it("renders as radio group container", () => {
      render(
        <RadioGroup>
          <RadioGroupItem name="test" value="1" />
          <RadioGroupItem name="test" value="2" />
        </RadioGroup>
      );

      const radioGroup = screen.getByRole("radiogroup");
      expect(radioGroup).toBeInTheDocument();
    });

    it("applies variantName as data attribute", () => {
      render(
        <RadioGroup data-testid="radio-group" variantName="primary">
          <RadioGroupItem name="test" value="1" />
        </RadioGroup>
      );

      const radioGroup = screen.getByTestId("radio-group");
      expect(radioGroup).toHaveAttribute("data-variant", "primary");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(
        <RadioGroup data-testid="radio-group">
          <RadioGroupItem name="test" value="1" />
        </RadioGroup>
      );

      const radioGroup = screen.getByTestId("radio-group");
      expect(radioGroup).not.toHaveAttribute("data-variant");
    });

    it("renders radio items with correct attributes", () => {
      render(
        <RadioGroup>
          <RadioGroupItem id="option1" name="option" value="1" />
          <RadioGroupItem id="option2" name="option" value="2" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(2);
      expect(radios[0]).toHaveAttribute("type", "radio");
      expect(radios[0]).toHaveAttribute("name", "option");
      expect(radios[0]).toHaveAttribute("value", "1");
      expect(radios[1]).toHaveAttribute("name", "option");
      expect(radios[1]).toHaveAttribute("value", "2");
    });
  });

  describe("RadioGroup States", () => {
    it("renders unchecked by default", () => {
      render(
        <RadioGroup>
          <RadioGroupItem name="test" value="1" />
          <RadioGroupItem name="test" value="2" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it("renders as checked when defaultChecked is true", () => {
      render(
        <RadioGroup>
          <RadioGroupItem defaultChecked name="test" value="1" />
          <RadioGroupItem name="test" value="2" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it("can be controlled with checked prop", () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <RadioGroup>
          <RadioGroupItem
            checked={false}
            name="test"
            value="1"
            onChange={handleChange}
          />
          <RadioGroupItem
            checked={true}
            name="test"
            value="2"
            onChange={handleChange}
          />
        </RadioGroup>
      );

      let radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();

      rerender(
        <RadioGroup>
          <RadioGroupItem
            checked={true}
            name="test"
            value="1"
            onChange={handleChange}
          />
          <RadioGroupItem
            checked={false}
            name="test"
            value="2"
            onChange={handleChange}
          />
        </RadioGroup>
      );
      radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it("handles disabled state", () => {
      render(
        <RadioGroup>
          <RadioGroupItem name="test" value="1" />
          <RadioGroupItem disabled name="test" value="2" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeDisabled();
      expect(radios[1]).toBeDisabled();
    });

    it("allows only one radio to be checked at a time in the same group", () => {
      render(
        <RadioGroup>
          <RadioGroupItem name="option" value="1" />
          <RadioGroupItem name="option" value="2" />
          <RadioGroupItem name="option" value="3" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");

      fireEvent.click(radios[0]);
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
      expect(radios[2]).not.toBeChecked();

      fireEvent.click(radios[1]);
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();

      fireEvent.click(radios[2]);
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
      expect(radios[2]).toBeChecked();
    });
  });

  describe("Event Handling", () => {
    it("calls onChange when radio is selected", () => {
      const handleChange = vi.fn();
      render(
        <RadioGroup>
          <RadioGroupItem name="test" value="1" onChange={handleChange} />
          <RadioGroupItem name="test" value="2" onChange={handleChange} />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[0]);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            checked: true,
            value: "1",
          }),
        })
      );
    });

    it("supports onFocus and onBlur events", () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();

      render(
        <RadioGroup>
          <RadioGroupItem
            name="test"
            value="1"
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
        </RadioGroup>
      );

      const radio = screen.getByRole("radio");

      fireEvent.focus(radio);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(radio);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("supports keyboard interaction", () => {
      render(
        <RadioGroup>
          <RadioGroupItem name="option" value="1" />
          <RadioGroupItem name="option" value="2" />
          <RadioGroupItem name="option" value="3" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      radios[0].focus();

      expect(radios[0]).toHaveFocus();
      expect(radios[0]).toBeInTheDocument();
    });
  });

  describe("Form Integration", () => {
    it("works with form submission", () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
      });

      render(
        <form onSubmit={handleSubmit}>
          <RadioGroup>
            <RadioGroupItem defaultChecked name="option" value="1" />
            <RadioGroupItem name="option" value="2" />
          </RadioGroup>
          <button type="submit">Submit</button>
        </form>
      );

      const form = screen.getByRole("radiogroup").closest("form");
      const radios = screen.getAllByRole("radio");

      expect(radios[0]).toBeChecked();

      if (form) {
        fireEvent.submit(form);
      }

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("supports name and value attributes", () => {
      render(
        <RadioGroup>
          <RadioGroupItem name="preference" value="option1" />
          <RadioGroupItem name="preference" value="option2" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("name", "preference");
      expect(radios[0]).toHaveAttribute("value", "option1");
      expect(radios[1]).toHaveAttribute("name", "preference");
      expect(radios[1]).toHaveAttribute("value", "option2");
    });

    it("works with required attribute", () => {
      render(
        <RadioGroup>
          <RadioGroupItem name="required-option" required value="1" />
          <RadioGroupItem name="required-option" value="2" />
        </RadioGroup>
      );

      const radio = screen.getAllByRole("radio")[0];
      expect(radio).toHaveAttribute("required");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to radiogroup container", () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <RadioGroup ref={ref}>
          <RadioGroupItem name="test" value="1" />
        </RadioGroup>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute("role")).toBe("radiogroup");
    });

    it("forwards ref to radio input elements", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(
        <RadioGroup>
          <RadioGroupItem name="test" value="1" ref={ref} />
        </RadioGroup>
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe("radio");
    });

    it("works with callback refs", () => {
      let refElement: HTMLDivElement | null = null;
      const callbackRef = (element: HTMLDivElement | null) => {
        refElement = element;
      };

      render(
        <RadioGroup ref={callbackRef}>
          <RadioGroupItem name="test" value="1" />
        </RadioGroup>
      );

      expect(refElement).toBeInstanceOf(HTMLDivElement);
      expect(refElement).toBeTruthy();
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes to RadioGroup", () => {
      render(
        <RadioGroup
          id="radio-group-id"
          data-testid="custom-radio-group"
          title="Radio group title"
        >
          <RadioGroupItem name="test" value="1" />
        </RadioGroup>
      );

      const radioGroup = screen.getByTestId("custom-radio-group");
      expect(radioGroup).toHaveAttribute("id", "radio-group-id");
      expect(radioGroup).toHaveAttribute("title", "Radio group title");
    });

    it("passes through standard HTML attributes to RadioGroupItem", () => {
      render(
        <RadioGroup>
          <RadioGroupItem
            id="radio-id"
            data-testid="custom-radio"
            name="test"
            title="Radio title"
            value="1"
          />
        </RadioGroup>
      );

      const radio = screen.getByTestId("custom-radio");
      expect(radio).toHaveAttribute("id", "radio-id");
      expect(radio).toHaveAttribute("title", "Radio title");
    });

    it("merges className correctly", () => {
      render(
        <RadioGroup className="custom-group-class">
          <RadioGroupItem
            className="custom-radio-class"
            name="test"
            value="1"
          />
        </RadioGroup>
      );

      const radioGroup = screen.getByRole("radiogroup");
      const radio = screen.getByRole("radio");
      expect(radioGroup).toHaveClass("custom-group-class");
      expect(radio).toHaveClass("custom-radio-class");
    });

    it("supports inline styles", () => {
      render(
        <RadioGroup style={{ margin: "10px" }}>
          <RadioGroupItem style={{ padding: "5px" }} name="test" value="1" />
        </RadioGroup>
      );

      const radioGroup = screen.getByRole("radiogroup");
      const radio = screen.getByRole("radio");
      expect(radioGroup.style.margin).toBe("10px");
      expect(radio.style.padding).toBe("5px");
    });
  });

  describe("Accessibility", () => {
    it("has correct radiogroup role", () => {
      render(
        <RadioGroup>
          <RadioGroupItem name="test" value="1" />
        </RadioGroup>
      );

      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("supports aria-label on RadioGroup", () => {
      render(
        <RadioGroup aria-label="Choose option">
          <RadioGroupItem name="test" value="1" />
        </RadioGroup>
      );

      const radioGroup = screen.getByLabelText("Choose option");
      expect(radioGroup).toBeInTheDocument();
    });

    it("supports aria-labelledby on RadioGroup", () => {
      render(
        <>
          <div id="group-label">Select your preference</div>
          <RadioGroup aria-labelledby="group-label">
            <RadioGroupItem name="test" value="1" />
          </RadioGroup>
        </>
      );

      const radioGroup = screen.getByRole("radiogroup");
      expect(radioGroup).toHaveAttribute("aria-labelledby", "group-label");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <div id="description">Radio group description</div>
          <RadioGroup aria-describedby="description">
            <RadioGroupItem name="test" value="1" />
          </RadioGroup>
        </>
      );

      const radioGroup = screen.getByRole("radiogroup");
      expect(radioGroup).toHaveAttribute("aria-describedby", "description");
    });

    it("works with associated labels", () => {
      render(
        <RadioGroup>
          <div>
            <RadioGroupItem id="radio-with-label" name="test" value="1" />
            <label htmlFor="radio-with-label">Option 1</label>
          </div>
        </RadioGroup>
      );

      const label = screen.getByText("Option 1");
      fireEvent.click(label);

      const radio = screen.getByRole("radio");
      expect(radio).toBeChecked();
    });

    it("maintains accessibility when disabled", () => {
      render(
        <RadioGroup>
          <RadioGroupItem disabled name="test" value="1" />
        </RadioGroup>
      );

      const radio = screen.getByRole("radio");
      expect(radio).toBeDisabled();
      expect(radio).toHaveAttribute("disabled");
    });

    it("announces state changes to screen readers", () => {
      render(
        <RadioGroup aria-label="Preferences">
          <RadioGroupItem
            id="option1"
            aria-label="First option"
            name="pref"
            value="1"
          />
          <RadioGroupItem
            id="option2"
            aria-label="Second option"
            name="pref"
            value="2"
          />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText("First option");
      const radio2 = screen.getByLabelText("Second option");

      expect(radio1).not.toBeChecked();
      expect(radio2).not.toBeChecked();

      fireEvent.click(radio1);
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();

      fireEvent.click(radio2);
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });
  });

  describe("Variant Names", () => {
    const variants = ["default", "primary", "error", "success"];

    variants.forEach((variant) => {
      it(`applies ${variant} variant correctly`, () => {
        render(
          <RadioGroup data-testid={`radio-group-${variant}`} variantName={variant}>
            <RadioGroupItem name="test" value="1" />
          </RadioGroup>
        );

        const radioGroup = screen.getByTestId(`radio-group-${variant}`);
        expect(radioGroup).toHaveAttribute("data-variant", variant);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicking", () => {
      const handleChange = vi.fn();
      render(
        <RadioGroup>
          <RadioGroupItem name="test" value="1" onChange={handleChange} />
          <RadioGroupItem name="test" value="2" onChange={handleChange} />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");

      fireEvent.click(radios[0]);
      fireEvent.click(radios[1]);
      fireEvent.click(radios[0]);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it("maintains state during re-renders", () => {
      const TestComponent = ({ variant }: { variant: string }) => (
        <RadioGroup variantName={variant}>
          <RadioGroupItem defaultChecked name="test" value="1" />
          <RadioGroupItem name="test" value="2" />
        </RadioGroup>
      );

      const { rerender } = render(<TestComponent variant="default" />);

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();

      rerender(<TestComponent variant="primary" />);
      const newRadios = screen.getAllByRole("radio");
      expect(newRadios[0]).toBeChecked();
    });

    it("handles groups with different names separately", () => {
      render(
        <div>
          <RadioGroup>
            <RadioGroupItem name="group1" value="1" />
            <RadioGroupItem name="group1" value="2" />
          </RadioGroup>
          <RadioGroup>
            <RadioGroupItem name="group2" value="1" />
            <RadioGroupItem name="group2" value="2" />
          </RadioGroup>
        </div>
      );

      const radios = screen.getAllByRole("radio");

      fireEvent.click(radios[0]);
      fireEvent.click(radios[2]);

      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
      expect(radios[2]).toBeChecked();
      expect(radios[3]).not.toBeChecked();
    });
  });

  describe("Radio Group Patterns", () => {
    it("works with fieldset and legend", () => {
      render(
        <fieldset>
          <legend>Choose your preference</legend>
          <RadioGroup>
            <div>
              <RadioGroupItem id="pref1" name="preference" value="option1" />
              <label htmlFor="pref1">Option 1</label>
            </div>
            <div>
              <RadioGroupItem id="pref2" name="preference" value="option2" />
              <label htmlFor="pref2">Option 2</label>
            </div>
          </RadioGroup>
        </fieldset>
      );

      const fieldset = screen.getByRole("group");
      const legend = screen.getByText("Choose your preference");
      const radios = screen.getAllByRole("radio");

      expect(fieldset).toContainElement(legend);
      expect(radios).toHaveLength(2);
      expect(radios[0]).toHaveAttribute("name", "preference");
      expect(radios[1]).toHaveAttribute("name", "preference");
    });

    it("supports keyboard navigation within radio groups", () => {
      render(
        <RadioGroup>
          <RadioGroupItem id="option1" name="options" value="1" />
          <RadioGroupItem id="option2" name="options" value="2" />
          <RadioGroupItem id="option3" name="options" value="3" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");

      radios[0].focus();
      expect(radios[0]).toHaveFocus();
    });

    it("handles form submission with radio groups", () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
      });

      render(
        <form onSubmit={handleSubmit}>
          <RadioGroup>
            <RadioGroupItem
              id="size-small"
              defaultChecked
              name="size"
              value="small"
            />
            <label htmlFor="size-small">Small</label>
            <RadioGroupItem id="size-medium" name="size" value="medium" />
            <label htmlFor="size-medium">Medium</label>
            <RadioGroupItem id="size-large" name="size" value="large" />
            <label htmlFor="size-large">Large</label>
          </RadioGroup>
          <button type="submit">Submit</button>
        </form>
      );

      const form = screen.getByRole("radiogroup").closest("form");
      const radios = screen.getAllByRole("radio");

      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
      expect(radios[2]).not.toBeChecked();

      if (form) {
        fireEvent.submit(form);
      }

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("supports radio group validation", () => {
      const TestValidationGroup = () => {
        const [error, setError] = React.useState("Please select an option");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setError(value ? "" : "Please select an option");
        };

        return (
          <div>
            <fieldset aria-describedby={error ? "error-message" : undefined}>
              <legend>Required Selection</legend>
              <RadioGroup>
                <div>
                  <RadioGroupItem
                    id="req1"
                    name="required-option"
                    value="option1"
                    onChange={handleChange}
                  />
                  <label htmlFor="req1">Option 1</label>
                </div>
                <div>
                  <RadioGroupItem
                    id="req2"
                    name="required-option"
                    value="option2"
                    onChange={handleChange}
                  />
                  <label htmlFor="req2">Option 2</label>
                </div>
              </RadioGroup>
            </fieldset>
            {error && (
              <div id="error-message" role="alert">
                {error}
              </div>
            )}
          </div>
        );
      };

      render(<TestValidationGroup />);

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please select an option"
      );

      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[0]);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("supports conditional radio groups", () => {
      const TestConditionalGroup = () => {
        const [showSecondGroup, setShowSecondGroup] = React.useState(false);

        return (
          <div>
            <RadioGroup>
              <div>
                <RadioGroupItem
                  id="enable-feature"
                  name="feature"
                  value="yes"
                  onChange={(e) => setShowSecondGroup(e.target.checked)}
                />
                <label htmlFor="enable-feature">Enable feature</label>
              </div>
              <div>
                <RadioGroupItem
                  id="disable-feature"
                  name="feature"
                  value="no"
                />
                <label htmlFor="disable-feature">Disable feature</label>
              </div>
            </RadioGroup>

            {showSecondGroup && (
              <RadioGroup>
                <div>
                  <RadioGroupItem id="level-basic" name="level" value="basic" />
                  <label htmlFor="level-basic">Basic</label>
                </div>
                <div>
                  <RadioGroupItem
                    id="level-advanced"
                    name="level"
                    value="advanced"
                  />
                  <label htmlFor="level-advanced">Advanced</label>
                </div>
              </RadioGroup>
            )}
          </div>
        );
      };

      render(<TestConditionalGroup />);

      const initialRadios = screen.getAllByRole("radio");
      expect(initialRadios).toHaveLength(2);

      fireEvent.click(initialRadios[0]);

      const allRadios = screen.getAllByRole("radio");
      expect(allRadios).toHaveLength(4);
    });

    it("supports data attributes for styling different states", () => {
      render(
        <RadioGroup data-orientation="horizontal">
          <RadioGroupItem
            id="option1"
            data-state="checked"
            defaultChecked
            name="test"
            value="1"
          />
          <label htmlFor="option1">Option 1</label>
          <RadioGroupItem
            id="option2"
            data-state="unchecked"
            name="test"
            value="2"
          />
          <label htmlFor="option2">Option 2</label>
          <RadioGroupItem
            id="option3"
            data-state="disabled"
            disabled
            name="test"
            value="3"
          />
          <label htmlFor="option3">Option 3</label>
        </RadioGroup>
      );

      const radioGroup = screen.getByRole("radiogroup");
      const radios = screen.getAllByRole("radio");

      expect(radioGroup).toHaveAttribute("data-orientation", "horizontal");
      expect(radios[0]).toHaveAttribute("data-state", "checked");
      expect(radios[1]).toHaveAttribute("data-state", "unchecked");
      expect(radios[2]).toHaveAttribute("data-state", "disabled");
    });
  });

  describe("Display Name", () => {
    it("has correct displayName for RadioGroup", () => {
      expect(RadioGroup.displayName).toBe("RadioGroup");
    });

    it("has correct displayName for RadioGroupItem", () => {
      expect(RadioGroupItem.displayName).toBe("RadioGroupItem");
    });
  });
});
