"use client";

import { MultiSelect } from "@components-kit/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { type ComponentDemo } from "../types";
import { type User, users } from "./shared-data";

function MultiSelectPreview() {
  const [value, setValue] = useState<string[]>([]);
  const { control, handleSubmit } = useForm<{ frameworks: string[] }>({
    defaultValues: { frameworks: [] },
  });
  const [submitted, setSubmitted] = useState<string[]>();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "320px",
      }}
    >
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Basic
        </p>
        <MultiSelect
          options={["React", "Vue", "Angular", "Svelte", "Solid"]}
          placeholder="Select frameworks..."
          value={value}
          variantName="default"
          onValueChange={setValue}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Selected: {value.length > 0 ? value.join(", ") : "none"}
        </p>
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          With aria-label (no visible label)
        </p>
        <MultiSelect
          aria-label="Select your favorite programming languages"
          options={["JavaScript", "TypeScript", "Python", "Rust", "Go", "Java"]}
          placeholder="Choose languages..."
          variantName="default"
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Use aria-label for accessibility when there is no visible label
        </p>
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Labeled Options
        </p>
        <MultiSelect
          options={[
            { label: "United States", value: "us" },
            { label: "United Kingdom", value: "uk" },
            { label: "Canada", value: "ca" },
            { label: "Australia", value: "au" },
          ]}
          placeholder="Select countries..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          With Max Selection (3)
        </p>
        <MultiSelect
          maxSelected={3}
          options={["Red", "Blue", "Green", "Yellow", "Purple", "Orange"]}
          placeholder="Pick up to 3 colors..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Custom Empty & Max Reached Content
        </p>
        <MultiSelect
          defaultValue={["React", "Vue"]}
          emptyContent="Nothing matches your search"
          maxReachedContent="You've picked enough!"
          maxSelected={2}
          options={["React", "Vue", "Angular", "Svelte"]}
          placeholder="Custom messages..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Grouped
        </p>
        <MultiSelect
          options={[
            {
              label: "Frontend",
              options: ["React", "Vue", "Angular"],
              type: "group",
            },
            {
              label: "Backend",
              options: ["Node.js", "Python", "Go"],
              type: "group",
            },
          ]}
          placeholder="Select technologies..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Object Values
        </p>
        <MultiSelect<User>
          getOptionValue={(u) => u.id}
          options={users.map((u) => ({ label: u.name, value: u }))}
          placeholder="Select users..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Disabled
        </p>
        <MultiSelect
          disabled
          options={["React", "Vue"]}
          placeholder="Disabled"
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Clearable
        </p>
        <MultiSelect
          clearable
          defaultValue={["React", "Vue"]}
          options={["React", "Vue", "Angular", "Svelte"]}
          placeholder="Select and clear..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Fixed Values
        </p>
        <MultiSelect
          clearable
          defaultValue={["React", "Vue"]}
          fixedValues={["React"]}
          options={["React", "Vue", "Angular", "Svelte"]}
          placeholder="React is fixed..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Token Separators
        </p>
        <MultiSelect
          options={["React", "Vue", "Angular", "Svelte", "Solid"]}
          placeholder="Type or paste comma-separated..."
          tokenSeparators={[",", ";"]}
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Default Open
        </p>
        <MultiSelect
          defaultOpen
          options={["React", "Vue", "Angular", "Svelte"]}
          placeholder="Starts open..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Read-only
        </p>
        <MultiSelect
          defaultValue={["React", "Vue"]}
          options={["React", "Vue", "Angular"]}
          readOnly
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Error State
        </p>
        <MultiSelect
          error
          options={["React", "Vue", "Angular"]}
          placeholder="Invalid..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Custom Filter (Prefix Match)
        </p>
        <MultiSelect
          filterFn={(option, inputValue) =>
            option.label.toLowerCase().startsWith(inputValue.toLowerCase())
          }
          options={["React", "Redux", "Remix", "Vue", "Vite", "Angular"]}
          placeholder="Filter by prefix..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Placement (Top)
        </p>
        <MultiSelect
          options={["React", "Vue", "Angular", "Svelte"]}
          placeholder="Opens upward..."
          placement="top-start"
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Max Displayed Tags
        </p>
        <MultiSelect
          defaultValue={["React", "Vue", "Angular", "Svelte"]}
          maxDisplayedTags={2}
          options={["React", "Vue", "Angular", "Svelte", "Solid"]}
          placeholder="Shows +N more..."
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Form Integration
        </p>
        <MultiSelect
          name="frameworks"
          options={["React", "Vue", "Angular"]}
          placeholder="For form submission..."
          required
          variantName="default"
        />
      </div>
      <div>
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          React Hook Form
        </p>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          onSubmit={handleSubmit((data) => setSubmitted(data.frameworks))}
        >
          <Controller
            control={control}
            name="frameworks"
            render={({ field, fieldState }) => (
              <MultiSelect
                error={!!fieldState.error}
                options={["React", "Vue", "Angular", "Svelte"]}
                placeholder="Select frameworks..."
                value={field.value}
                variantName="default"
                onValueChange={field.onChange}
              />
            )}
            rules={{ validate: (v) => v.length > 0 || "Select at least one" }}
          />
          <button style={{ alignSelf: "flex-start" }} type="submit">
            Submit
          </button>
          {submitted && (
            <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: 0 }}>
              Submitted: {submitted.join(", ")}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export const multiSelectDemo: ComponentDemo = {
  code: `import { MultiSelect } from "@components-kit/react";

const value: string[] = [];
const setValue = (values: string[]) => {
  console.log("Selected values:", values);
};

<MultiSelect
  options={["React", "Vue", "Angular", "Svelte", "Solid"]}
  placeholder="Select frameworks..."
  value={value}
  variantName="default"
  onValueChange={setValue}
/>

{/* With aria-label (accessibility) */}
<MultiSelect
  aria-label="Select your favorite programming languages"
  options={["JavaScript", "TypeScript", "Python", "Rust", "Go", "Java"]}
  placeholder="Choose languages..."
  variantName="default"
/>

{/* Labeled Options */}
<MultiSelect
  options={[
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
    { label: "Australia", value: "au" },
  ]}
  placeholder="Select countries..."
  variantName="default"
/>

{/* With max selection */}
<MultiSelect
  maxSelected={3}
  options={["Red", "Blue", "Green", "Yellow"]}
  placeholder="Pick up to 3..."
  variantName="default"
/>

{/* Custom Empty & Max Reached Content */}
<MultiSelect
  defaultValue={["React", "Vue"]}
  emptyContent="Nothing matches your search"
  maxReachedContent="You've picked enough!"
  maxSelected={2}
  options={["React", "Vue", "Angular", "Svelte"]}
  placeholder="Custom messages..."
  variantName="default"
/>

{/* Grouped */}
<MultiSelect
  options={[
    { label: "Frontend", options: ["React", "Vue"], type: "group" },
    { label: "Backend", options: ["Node.js", "Go"], type: "group" },
  ]}
  placeholder="Select technologies..."
  variantName="default"
/>

{/* Clearable with fixed values */}
<MultiSelect
  clearable
  fixedValues={["React"]}
  defaultValue={["React", "Vue"]}
  options={["React", "Vue", "Angular", "Svelte"]}
  variantName="default"
/>

{/* Token separators */}
<MultiSelect
  options={["React", "Vue", "Angular", "Svelte"]}
  tokenSeparators={[",", ";"]}
  placeholder="Paste comma-separated..."
  variantName="default"
/>

{/* Default Open */}
<MultiSelect
  defaultOpen
  options={["React", "Vue", "Angular", "Svelte"]}
  placeholder="Starts open..."
  variantName="default"
/>

{/* Read-only */}
<MultiSelect
  defaultValue={["React", "Vue"]}
  options={["React", "Vue", "Angular"]}
  readOnly
  variantName="default"
/>

{/* Custom Filter (Prefix Match) */}
<MultiSelect
  filterFn={(option, inputValue) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  }
  options={["React", "Redux", "Remix", "Vue", "Vite", "Angular"]}
  placeholder="Filter by prefix..."
  variantName="default"
/>

{/* Max displayed tags */}
<MultiSelect
  defaultValue={["React", "Vue", "Angular", "Svelte"]}
  maxDisplayedTags={2}
  options={["React", "Vue", "Angular", "Svelte", "Solid"]}
  variantName="default"
/>

{/* Form integration */}
<MultiSelect
  name="frameworks"
  options={["React", "Vue", "Angular"]}
  required
  variantName="default"
/>

{/* React Hook Form */}
import { Controller, useForm } from "react-hook-form";

const { control, handleSubmit } = useForm<{ frameworks: string[] }>({
  defaultValues: { frameworks: [] },
});

<form onSubmit={handleSubmit((data) => console.log(data))}>
  <Controller
    control={control}
    name="frameworks"
    rules={{ validate: (v) => v.length > 0 || "Select at least one" }}
    render={({ field, fieldState }) => (
      <MultiSelect
        options={["React", "Vue", "Angular", "Svelte"]}
        value={field.value}
        onValueChange={field.onChange}
        error={!!fieldState.error}
        placeholder="Select frameworks..."
        variantName="default"
      />
    )}
  />
  <button type="submit">Submit</button>
</form>`,
  id: "multi-select",
  name: "MultiSelect",
  preview: <MultiSelectPreview />,
};
