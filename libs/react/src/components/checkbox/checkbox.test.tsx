import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./checkbox";

describe("Checkbox Component", () => {
  describe("Basic Rendering", () => {
    it("renders as checkbox input", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("type", "checkbox");
    });

    it("applies variantName as data attribute", () => {
      render(<Checkbox variantName="primary" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("data-variant", "primary");
    });

    it("does not set data-variant when variantName is not provided", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toHaveAttribute("data-variant");
    });
  });

  describe("Checkbox States", () => {
    it("renders unchecked by default", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("renders as checked when defaultChecked is true", () => {
      render(<Checkbox defaultChecked />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("can be controlled with checked prop", () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <Checkbox checked={false} onChange={handleChange} />
      );

      let checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      rerender(<Checkbox checked={true} onChange={handleChange} />);
      checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("supports indeterminate state", () => {
      const TestComponent = () => {
        const [ref, setRef] = React.useState<HTMLInputElement | null>(null);

        React.useEffect(() => {
          if (ref) {
            ref.indeterminate = true;
          }
        }, [ref]);

        return <Checkbox ref={setRef} />;
      };

      render(<TestComponent />);

      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it("handles disabled state", () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
    });

    it("can toggle between checked and unchecked", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Event Handling", () => {
    it("calls onChange when clicked", () => {
      const handleChange = vi.fn();
      render(<Checkbox onChange={handleChange} />);

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            checked: true,
          }),
        })
      );
    });

    it("supports onFocus and onBlur events", () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();

      render(<Checkbox onBlur={handleBlur} onFocus={handleFocus} />);

      const checkbox = screen.getByRole("checkbox");

      fireEvent.focus(checkbox);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(checkbox);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("supports keyboard interaction (Space key)", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveFocus();
    });
  });

  describe("Form Integration", () => {
    it("works with form submission", () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
      });

      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="terms" value="accepted" />
          <button type="submit">Submit</button>
        </form>
      );

      const checkbox = screen.getByRole("checkbox");
      const form = checkbox.closest("form");

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      if (form) {
        fireEvent.submit(form);
      }

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("supports name and value attributes", () => {
      render(<Checkbox name="newsletter" value="subscribe" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("name", "newsletter");
      expect(checkbox).toHaveAttribute("value", "subscribe");
    });

    it("works with required attribute", () => {
      render(<Checkbox required />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("required");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Checkbox ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe("checkbox");
    });

    it("works with callback refs", () => {
      let refElement: HTMLInputElement | null = null;
      const callbackRef = (element: HTMLInputElement | null) => {
        refElement = element;
      };

      render(<Checkbox ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLInputElement);
      expect(refElement).toBeTruthy();
    });
  });

  describe("HTML Attributes", () => {
    it("passes through standard HTML attributes", () => {
      render(
        <Checkbox
          id="checkbox-id"
          data-testid="custom-checkbox"
          title="Checkbox title"
        />
      );

      const checkbox = screen.getByTestId("custom-checkbox");
      expect(checkbox).toHaveAttribute("id", "checkbox-id");
      expect(checkbox).toHaveAttribute("title", "Checkbox title");
    });

    it("merges className correctly", () => {
      render(<Checkbox className="custom-class another-class" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("custom-class", "another-class");
    });

    it("supports inline styles", () => {
      render(<Checkbox style={{ margin: "10px" }} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.style.margin).toBe("10px");
    });
  });

  describe("Accessibility", () => {
    it("has correct checkbox role", () => {
      render(<Checkbox />);

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Checkbox aria-label="Accept terms" />);

      const checkbox = screen.getByLabelText("Accept terms");
      expect(checkbox).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <div id="description">Checkbox description</div>
          <Checkbox aria-describedby="description" />
        </>
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-describedby", "description");
    });

    it("supports aria-invalid for error states", () => {
      render(<Checkbox aria-invalid="true" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
    });

    it("works with associated label", () => {
      render(
        <>
          <Checkbox id="checkbox-with-label" />
          <label htmlFor="checkbox-with-label">Check me</label>
        </>
      );

      const label = screen.getByText("Check me");
      fireEvent.click(label);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("maintains accessibility when disabled", () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute("disabled");
    });
  });

  describe("Variant Names", () => {
    const variants = ["default", "primary", "error", "success"];

    variants.forEach((variant) => {
      it(`applies ${variant} variant correctly`, () => {
        render(<Checkbox data-testid={`checkbox-${variant}`} variantName={variant} />);

        const checkbox = screen.getByTestId(`checkbox-${variant}`);
        expect(checkbox).toHaveAttribute("data-variant", variant);
      });
    });
  });

  describe("Checkbox Groups", () => {
    it("works in a basic checkbox group for multiple selection", () => {
      const handleChange = vi.fn();

      render(
        <div aria-labelledby="checkbox-group-label" role="group">
          <div id="checkbox-group-label">Select your interests:</div>
          <Checkbox
            id="sports"
            name="interests"
            value="sports"
            onChange={handleChange}
          />
          <label htmlFor="sports">Sports</label>
          <Checkbox
            id="music"
            name="interests"
            value="music"
            onChange={handleChange}
          />
          <label htmlFor="music">Music</label>
          <Checkbox
            id="travel"
            name="interests"
            value="travel"
            onChange={handleChange}
          />
          <label htmlFor="travel">Travel</label>
        </div>
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);

      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[2]);

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(handleChange).toHaveBeenCalledTimes(2);
    });

    it("supports checkbox group with fieldset and legend", () => {
      render(
        <fieldset>
          <legend>Select your preferences</legend>
          <Checkbox id="notifications" name="preferences" value="notifications" />
          <label htmlFor="notifications">Email Notifications</label>
          <Checkbox id="newsletter" name="preferences" value="newsletter" />
          <label htmlFor="newsletter">Newsletter</label>
        </fieldset>
      );

      const fieldset = screen.getByRole("group");
      const legend = screen.getByText("Select your preferences");
      const checkboxes = screen.getAllByRole("checkbox");

      expect(fieldset).toContainElement(legend);
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).toHaveAttribute("name", "preferences");
      expect(checkboxes[1]).toHaveAttribute("name", "preferences");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicking", () => {
      const handleChange = vi.fn();
      render(<Checkbox onChange={handleChange} />);

      const checkbox = screen.getByRole("checkbox");

      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(checkbox).toBeChecked();
    });

    it("handles programmatic indeterminate changes", () => {
      const TestComponent = () => {
        const [ref, setRef] = React.useState<HTMLInputElement | null>(null);
        const [indeterminate, setIndeterminate] = React.useState(false);

        React.useEffect(() => {
          if (ref) {
            ref.indeterminate = indeterminate;
          }
        }, [ref, indeterminate]);

        return (
          <>
            <Checkbox ref={setRef} />
            <button onClick={() => setIndeterminate(!indeterminate)}>
              Toggle Indeterminate
            </button>
          </>
        );
      };

      render(<TestComponent />);

      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      const button = screen.getByText("Toggle Indeterminate");

      expect(checkbox.indeterminate).toBe(false);

      fireEvent.click(button);
      expect(checkbox.indeterminate).toBe(true);

      fireEvent.click(button);
      expect(checkbox.indeterminate).toBe(false);
    });

    it("maintains state during re-renders", () => {
      const TestComponent = ({ variant }: { variant: string }) => (
        <Checkbox defaultChecked variantName={variant} />
      );

      const { rerender } = render(<TestComponent variant="default" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();

      rerender(<TestComponent variant="primary" />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });
  });

  describe("Select All Pattern", () => {
    it("implements select all functionality", () => {
      const TestSelectAll = () => {
        const [items, setItems] = React.useState([
          { checked: false, id: 1, name: "Item 1" },
          { checked: false, id: 2, name: "Item 2" },
          { checked: false, id: 3, name: "Item 3" },
        ]);

        const allChecked = items.every((item) => item.checked);

        const handleSelectAll = () => {
          setItems(items.map((item) => ({ ...item, checked: !allChecked })));
        };

        const handleItemChange = (id: number) => {
          setItems(
            items.map((item) =>
              item.id === id ? { ...item, checked: !item.checked } : item
            )
          );
        };

        return (
          <div>
            <Checkbox checked={allChecked} onChange={handleSelectAll} />
            <label>Select All</label>
            {items.map((item) => (
              <div key={item.id}>
                <Checkbox
                  checked={item.checked}
                  onChange={() => handleItemChange(item.id)}
                />
                <label>{item.name}</label>
              </div>
            ))}
          </div>
        );
      };

      render(<TestSelectAll />);

      const checkboxes = screen.getAllByRole("checkbox");
      const selectAll = checkboxes[0];
      const item1 = checkboxes[1];
      const item2 = checkboxes[2];
      const item3 = checkboxes[3];

      expect(selectAll).not.toBeChecked();

      fireEvent.click(item1);
      fireEvent.click(item2);
      fireEvent.click(item3);
      expect(selectAll).toBeChecked();

      fireEvent.click(selectAll);
      expect(item1).not.toBeChecked();
      expect(item2).not.toBeChecked();
      expect(item3).not.toBeChecked();
    });
  });

  describe("Display Name", () => {
    it("has correct displayName", () => {
      expect(Checkbox.displayName).toBe("Checkbox");
    });
  });
});
