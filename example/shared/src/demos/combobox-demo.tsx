"use client";

import { Combobox } from "@components-kit/react";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { type ComponentDemo } from "../types";
import { type User, users } from "./shared-data";

const allCities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
];

function AsyncComboboxExample() {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleInputChange = useCallback((query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query) {
      setOptions([]);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    timerRef.current = setTimeout(() => {
      const results = allCities.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase()),
      );
      setOptions(results);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Combobox
      error={error}
      loading={loading}
      options={options}
      placeholder="Search cities..."
      variantName="default"
      onInputValueChange={handleInputChange}
    />
  );
}

function ComboboxPreview() {
  const [value, setValue] = useState<string>();
  const { control, handleSubmit } = useForm<{ city: string }>();
  const [submitted, setSubmitted] = useState<string>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "320px" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Basic
        </p>
        <Combobox
          options={["Apple", "Banana", "Cherry", "Date", "Elderberry"]}
          placeholder="Search fruits..."
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
        <Combobox
          aria-label="Search for a programming language"
          options={["JavaScript", "TypeScript", "Python", "Rust", "Go"]}
          placeholder="Type to search..."
          variantName="default"
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Use aria-label for accessibility when there is no visible label
        </p>
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          With Labeled Options
        </p>
        <Combobox
          options={[
            { label: "United States", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "Canada", value: "ca" },
            { label: "Australia", value: "au" },
            { label: "Germany", value: "de" },
          ]}
          placeholder="Search countries..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Grouped
        </p>
        <Combobox
          options={[
            {
              label: "Fruits",
              options: ["Apple", "Banana", "Cherry"],
              type: "group",
            },
            {
              label: "Vegetables",
              options: ["Carrot", "Broccoli", "Spinach"],
              type: "group",
            },
          ]}
          placeholder="Search food..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Object Values
        </p>
        <Combobox<User>
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          placeholder="Search users..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Async Search
        </p>
        <AsyncComboboxExample />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Custom Error Content
        </p>
        <Combobox
          error
          errorContent="Oops! Could not fetch results."
          options={[]}
          placeholder="Shows custom error..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Clearable
        </p>
        <Combobox
          clearable
          options={["Apple", "Banana", "Cherry", "Date", "Elderberry"]}
          placeholder="Search fruits..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Open on Type/Click Only
        </p>
        <Combobox
          openOnFocus={false}
          options={["Apple", "Banana", "Cherry", "Date"]}
          placeholder="Type or click arrow to open..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Disabled
        </p>
        <Combobox
          disabled
          options={["Apple", "Banana"]}
          placeholder="Disabled"
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Read-only
        </p>
        <Combobox
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
        <Combobox
          error
          options={["Apple", "Banana", "Cherry"]}
          placeholder="Invalid..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Placement (Top)
        </p>
        <Combobox
          options={["Apple", "Banana", "Cherry", "Date"]}
          placeholder="Opens upward..."
          placement="top-start"
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Custom Empty Content
        </p>
        <Combobox
          emptyContent="No matches found — try a different search"
          options={["Apple", "Banana", "Cherry"]}
          placeholder="Search fruits..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Custom Filter (Prefix Match)
        </p>
        <Combobox
          filterFn={(option, inputValue) =>
            option.label.toLowerCase().startsWith(inputValue.toLowerCase())
          }
          options={["Apple", "Apricot", "Avocado", "Banana", "Blueberry"]}
          placeholder="Type to filter by prefix..."
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          Max Dropdown Height
        </p>
        <Combobox
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
          Form Integration
        </p>
        <Combobox
          name="city"
          options={["New York", "Los Angeles", "Chicago"]}
          placeholder="Select for form..."
          required
          variantName="default"
        />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}>
          React Hook Form
        </p>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          onSubmit={handleSubmit((data) => setSubmitted(data.city))}
        >
          <Controller
            control={control}
            name="city"
            render={({ field, fieldState }) => (
              <Combobox
                error={!!fieldState.error}
                options={["New York", "Los Angeles", "Chicago", "Houston"]}
                placeholder="Search cities..."
                value={field.value}
                variantName="default"
                onValueChange={field.onChange}
              />
            )}
            rules={{ required: "Please select a city" }}
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

export const comboboxDemo: ComponentDemo = {
  code: `import { Combobox } from "@components-kit/react";

<Combobox
  options={["Apple", "Banana", "Cherry", "Date", "Elderberry"]}
  placeholder="Search fruits..."
  value={value}
  variantName="default"
  onValueChange={setValue}
/>

{/* With aria-label (accessibility) */}
<Combobox
  aria-label="Search for a programming language"
  options={["JavaScript", "TypeScript", "Python", "Rust", "Go"]}
  placeholder="Type to search..."
  variantName="default"
/>

{/* Grouped */}
<Combobox
  options={[
    { label: "Fruits", options: ["Apple", "Banana"], type: "group" },
    { label: "Vegetables", options: ["Carrot", "Broccoli"], type: "group" },
  ]}
  placeholder="Search food..."
  variantName="default"
/>

{/* Async Search */}
<Combobox
  loading={loading}
  error={error}
  options={results}
  placeholder="Search cities..."
  variantName="default"
  onInputValueChange={handleSearch}
/>

{/* Custom Error Content */}
<Combobox
  error
  errorContent="Oops! Could not fetch results."
  options={[]}
  placeholder="Shows custom error..."
  variantName="default"
/>

{/* Clearable */}
<Combobox
  clearable
  options={["Apple", "Banana", "Cherry"]}
  placeholder="Search fruits..."
  variantName="default"
/>

{/* Open on Type/Click Only */}
<Combobox
  openOnFocus={false}
  options={["Apple", "Banana", "Cherry", "Date"]}
  placeholder="Type or click arrow to open..."
  variantName="default"
/>

{/* Read-only */}
<Combobox
  defaultValue="Banana"
  options={["Apple", "Banana", "Cherry"]}
  readOnly
  variantName="default"
/>

{/* Placement */}
<Combobox
  options={["Apple", "Banana", "Cherry"]}
  placement="top-start"
  placeholder="Opens upward..."
  variantName="default"
/>

{/* Custom Empty Content */}
<Combobox
  emptyContent="No matches found — try a different search"
  options={["Apple", "Banana", "Cherry"]}
  placeholder="Search fruits..."
  variantName="default"
/>

{/* Custom Filter (Prefix Match) */}
<Combobox
  filterFn={(option, inputValue) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  }
  options={["Apple", "Apricot", "Avocado", "Banana", "Blueberry"]}
  placeholder="Type to filter by prefix..."
  variantName="default"
/>

{/* Max Dropdown Height */}
<Combobox
  maxDropdownHeight={150}
  options={["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"]}
  placeholder="Scroll dropdown..."
  variantName="default"
/>

{/* Form Integration */}
<Combobox
  name="city"
  options={["New York", "Los Angeles", "Chicago"]}
  required
  placeholder="Select for form..."
  variantName="default"
/>

{/* React Hook Form */}
import { Controller, useForm } from "react-hook-form";

const { control, handleSubmit } = useForm<{ city: string }>();

<form onSubmit={handleSubmit((data) => console.log(data))}>
  <Controller
    control={control}
    name="city"
    rules={{ required: "Please select a city" }}
    render={({ field, fieldState }) => (
      <Combobox
        options={["New York", "Los Angeles", "Chicago"]}
        value={field.value}
        onValueChange={field.onChange}
        error={!!fieldState.error}
        placeholder="Search cities..."
        variantName="default"
      />
    )}
  />
  <button type="submit">Submit</button>
</form>`,
  id: "combobox",
  name: "Combobox",
  preview: <ComboboxPreview />,
};
