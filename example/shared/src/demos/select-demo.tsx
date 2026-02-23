"use client";

import { Select } from "@components-kit/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { type ComponentDemo } from "../types";
import { type User, users } from "./shared-data";

function SelectPreview() {
  const [value, setValue] = useState<string>();
  const { control, handleSubmit } = useForm<{ fruit: string }>();
  const [submitted, setSubmitted] = useState<string>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "320px" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Basic
        </p>
        <Select
          options={["Apple", "Banana", "Cherry", "Date"]}
          placeholder="Select a fruit..."
          value={value}
          variantName="default"
          onValueChange={setValue}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Selected: {value ?? "none"}
        </p>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          With aria-label (no visible label)
        </p>
        <Select
          aria-label="Choose your favorite fruit"
          options={["Apple", "Banana", "Cherry", "Orange", "Grape"]}
          placeholder="Select..."
          variantName="default"
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Use aria-label for accessibility when there is no visible label
        </p>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Labeled Options
        </p>
        <Select
          options={[
            { label: "United States", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "Canada", value: "ca" },
            { label: "Australia", value: "au" },
          ]}
          placeholder="Select a country..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled Items
        </p>
        <Select
          options={[
            { label: "Apple", value: "apple" },
            { disabled: true, label: "Banana (Out of Stock)", value: "banana" },
            { label: "Cherry", value: "cherry" },
          ]}
          placeholder="Some items disabled..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Grouped Options
        </p>
        <Select
          options={[
            {
              label: "Fruits",
              options: ["Apple", "Banana", "Cherry"],
              type: "group",
            },
            { type: "separator" },
            {
              label: "Vegetables",
              options: ["Carrot", "Broccoli", "Spinach"],
              type: "group",
            },
          ]}
          placeholder="Select food..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Object Values
        </p>
        <Select<User>
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          placeholder="Select a user..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled
        </p>
        <Select
          disabled
          options={["Apple", "Banana"]}
          placeholder="Disabled"
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Empty Options
        </p>
        <Select
          emptyContent="No items available"
          options={[]}
          placeholder="No options..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Placement (Top)
        </p>
        <Select
          options={["Apple", "Banana", "Cherry", "Date"]}
          placeholder="Opens upward..."
          placement="top-start"
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Open on Click Only
        </p>
        <Select
          openOnFocus={false}
          options={["Apple", "Banana", "Cherry", "Date"]}
          placeholder="Click to open (not on focus)..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Default Open
        </p>
        <Select
          defaultOpen
          options={["Apple", "Banana", "Cherry", "Date"]}
          placeholder="Starts open..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Read-only
        </p>
        <Select
          defaultValue="Banana"
          options={["Apple", "Banana", "Cherry"]}
          readOnly
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Error State
        </p>
        <Select
          error
          options={["Apple", "Banana", "Cherry"]}
          placeholder="Invalid..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Form Integration
        </p>
        <Select
          name="fruit"
          options={["Apple", "Banana", "Cherry"]}
          placeholder="Select for form..."
          required
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Max Dropdown Height
        </p>
        <Select
          maxDropdownHeight={150}
          options={[
            "Apple",
            "Banana",
            "Cherry",
            "Date",
            "Elderberry",
            "Fig",
            "Grape",
          ]}
          placeholder="Scroll dropdown..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          React Hook Form
        </p>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          onSubmit={handleSubmit((data) => setSubmitted(data.fruit))}
        >
          <Controller
            control={control}
            name="fruit"
            render={({ field, fieldState }) => (
              <Select
                error={!!fieldState.error}
                options={["Apple", "Banana", "Cherry"]}
                placeholder="Select a fruit..."
                value={field.value}
                variantName="default"
                onValueChange={field.onChange}
              />
            )}
            rules={{ required: "Please select a fruit" }}
          />
          <button style={{ alignSelf: "flex-start" }} type="submit">
            Submit
          </button>
          {submitted && (
            <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: 0 }}>
              Submitted: {submitted}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export const selectDemo: ComponentDemo = {
  code: `import { Select } from "@components-kit/react";

{/* Basic */}
<Select
  options={["Apple", "Banana", "Cherry", "Date"]}
  placeholder="Select a fruit..."
  value={value}
  variantName="default"
  onValueChange={setValue}
/>

{/* With aria-label (accessibility) */}
<Select
  aria-label="Choose your favorite fruit"
  options={["Apple", "Banana", "Cherry", "Orange", "Grape"]}
  placeholder="Select..."
  variantName="default"
/>

{/* Labeled Options */}
<Select
  options={[
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
  ]}
  placeholder="Select a country..."
  variantName="default"
/>

{/* Disabled Items */}
<Select
  options={[
    { label: "Apple", value: "apple" },
    { label: "Banana (Out of Stock)", value: "banana", disabled: true },
    { label: "Cherry", value: "cherry" },
  ]}
  placeholder="Some items disabled..."
  variantName="default"
/>

{/* Grouped Options */}
<Select
  options={[
    { label: "Fruits", options: ["Apple", "Banana"], type: "group" },
    { type: "separator" },
    { label: "Vegetables", options: ["Carrot", "Broccoli"], type: "group" },
  ]}
  placeholder="Select food..."
  variantName="default"
/>

{/* Placement */}
<Select
  options={["Apple", "Banana", "Cherry"]}
  placement="top-start"
  placeholder="Opens upward..."
  variantName="default"
/>

{/* Open on Click Only */}
<Select
  openOnFocus={false}
  options={["Apple", "Banana", "Cherry", "Date"]}
  placeholder="Click to open (not on focus)..."
  variantName="default"
/>

{/* Default Open */}
<Select
  defaultOpen
  options={["Apple", "Banana", "Cherry", "Date"]}
  placeholder="Starts open..."
  variantName="default"
/>

{/* Read-only */}
<Select
  defaultValue="Banana"
  options={["Apple", "Banana", "Cherry"]}
  readOnly
  variantName="default"
/>

{/* Error State */}
<Select
  error
  options={["Apple", "Banana", "Cherry"]}
  placeholder="Invalid..."
  variantName="default"
/>

{/* Form Integration */}
<Select
  name="fruit"
  options={["Apple", "Banana", "Cherry"]}
  placeholder="Select for form..."
  required
  variantName="default"
/>

{/* Max Dropdown Height */}
<Select
  maxDropdownHeight={150}
  options={["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig"]}
  placeholder="Scroll dropdown..."
  variantName="default"
/>

{/* React Hook Form */}
import { Controller, useForm } from "react-hook-form";

const { control, handleSubmit } = useForm<{ fruit: string }>();

<form onSubmit={handleSubmit((data) => console.log(data))}>
  <Controller
    control={control}
    name="fruit"
    rules={{ required: "Please select a fruit" }}
    render={({ field, fieldState }) => (
      <Select
        options={["Apple", "Banana", "Cherry"]}
        value={field.value}
        onValueChange={field.onChange}
        error={!!fieldState.error}
        placeholder="Select a fruit..."
        variantName="default"
      />
    )}
  />
  <button type="submit">Submit</button>
</form>`,
  id: "select",
  name: "Select",
  preview: <SelectPreview />,
};
