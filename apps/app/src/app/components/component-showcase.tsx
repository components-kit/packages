"use client";

import {
  Alert,
  Badge,
  Button,
  Checkbox,
  type ColumnDef,
  Heading,
  Icon,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  Separator,
  Skeleton,
  Switch,
  Table,
  Text,
  Textarea,
} from "@components-kit/react";
import { useState } from "react";

/* ── Shared data ── */

interface User {
  email: string;
  id: number;
  name: string;
  role: string;
}

const users: User[] = [
  { email: "alice@example.com", id: 1, name: "Alice Johnson", role: "Admin" },
  { email: "bob@example.com", id: 2, name: "Bob Smith", role: "User" },
  { email: "carol@example.com", id: 3, name: "Carol White", role: "Editor" },
];

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

const InfoIcon = () => (
  <svg fill="currentColor" height="20" viewBox="0 0 20 20" width="20">
    <path
      clipRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      fillRule="evenodd"
    />
  </svg>
);

const SearchIcon = () => (
  <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
    <path
      clipRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      fillRule="evenodd"
    />
  </svg>
);

/* ── Preview components ── */

function AlertPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Alert
        description="This is an alert description."
        heading="Alert Heading"
        variantName="default"
      />
      <Alert
        action={{ children: "Dismiss", onClick: () => alert("Dismissed") }}
        description="Alert with action button."
        heading="With Action"
        variantName="default"
      />
      <Alert
        description="Something went wrong. Please try again."
        heading="Error"
        variantName="destructive"
      />
    </div>
  );
}

function BadgePreview() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <Badge variantName="primary">Primary</Badge>
      <Badge size="sm" variantName="primary">
        Small
      </Badge>
      <Badge size="lg" variantName="primary">
        Large
      </Badge>
    </div>
  );
}

function ButtonPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <Button variantName="primary">Primary</Button>
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Button size="sm" variantName="primary">
          Small
        </Button>
        <Button size="md" variantName="primary">
          Medium
        </Button>
        <Button size="lg" variantName="primary">
          Large
        </Button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <Button leadingIcon={<SearchIcon />} variantName="primary">
          With Icon
        </Button>
        <Button isLoading variantName="primary">
          Loading
        </Button>
        <Button disabled variantName="primary">
          Disabled
        </Button>
      </div>
    </div>
  );
}

function CheckboxPreview() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <Checkbox
          id="cb-demo-1"
          checked={checked}
          variantName="default"
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label htmlFor="cb-demo-1">
          {" "}
          Controlled (checked: {String(checked)})
        </label>
      </div>
      <div>
        <Checkbox id="cb-demo-2" defaultChecked variantName="default" />
        <label htmlFor="cb-demo-2"> Default checked</label>
      </div>
      <div>
        <Checkbox id="cb-demo-3" disabled variantName="default" />
        <label htmlFor="cb-demo-3"> Disabled</label>
      </div>
    </div>
  );
}

function HeadingPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Heading as="h1" variantName="h1">
        Heading 1
      </Heading>
      <Heading as="h2" variantName="h1">
        Heading 2
      </Heading>
      <Heading as="h3" variantName="h1">
        Heading 3
      </Heading>
      <Heading as="h4" variantName="h1">
        Heading 4
      </Heading>
      <Heading as="h5" variantName="h1">
        Heading 5
      </Heading>
      <Heading as="h6" variantName="h1">
        Heading 6
      </Heading>
    </div>
  );
}

function IconPreview() {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
      <Icon>
        <InfoIcon />
      </Icon>
      <Icon>
        <SearchIcon />
      </Icon>
    </div>
  );
}

function InputPreview() {
  const [value, setValue] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "320px",
      }}
    >
      <div>
        <label htmlFor="input-demo-1">Text Input: </label>
        <Input
          id="input-demo-1"
          placeholder="Enter text..."
          value={value}
          variantName="default"
          onChange={(e) => setValue(e.target.value)}
        />
        <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
          {" "}
          Value: {value}
        </span>
      </div>
      <div>
        <label htmlFor="input-demo-2">Email: </label>
        <Input
          id="input-demo-2"
          placeholder="you@example.com"
          type="email"
          variantName="default"
        />
      </div>
      <div>
        <label htmlFor="input-demo-3">Disabled: </label>
        <Input
          id="input-demo-3"
          disabled
          placeholder="Disabled"
          variantName="default"
        />
      </div>
    </div>
  );
}

function RadioGroupPreview() {
  const [value, setValue] = useState("option1");

  return (
    <div>
      <RadioGroup aria-label="Select option" variantName="default">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div>
            <RadioGroupItem
              id="rg-demo-1"
              checked={value === "option1"}
              name="radio-demo"
              value="option1"
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="rg-demo-1"> Option 1</label>
          </div>
          <div>
            <RadioGroupItem
              id="rg-demo-2"
              checked={value === "option2"}
              name="radio-demo"
              value="option2"
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="rg-demo-2"> Option 2</label>
          </div>
          <div>
            <RadioGroupItem
              id="rg-demo-3"
              checked={value === "option3"}
              name="radio-demo"
              value="option3"
              onChange={(e) => setValue(e.target.value)}
            />
            <label htmlFor="rg-demo-3"> Option 3</label>
          </div>
        </div>
      </RadioGroup>
      <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
        Selected: {value}
      </p>
    </div>
  );
}

function SelectPreview() {
  const [value, setValue] = useState<string>();

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
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
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
        <p
          style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 4px" }}
        >
          Disabled
        </p>
        <Select
          disabled
          options={["Apple", "Banana"]}
          placeholder="Disabled"
          variantName="default"
        />
      </div>
    </div>
  );
}

function SeparatorPreview() {
  return (
    <div>
      <p style={{ margin: "0 0 8px" }}>Content above</p>
      <Separator />
      <p style={{ margin: "8px 0" }}>Content below</p>
      <Separator />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "8px",
          height: "24px",
          marginTop: "16px",
        }}
      >
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Middle</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Skeleton height="20px" variantName="default" width="200px" />
      <Skeleton height="16px" variantName="default" width="150px" />
      <Skeleton height="100px" variantName="default" width="100px" />
    </div>
  );
}

function SwitchPreview() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <Switch
          id="sw-demo-1"
          checked={checked}
          variantName="default"
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label htmlFor="sw-demo-1">
          {" "}
          Controlled (checked: {String(checked)})
        </label>
      </div>
      <div>
        <Switch id="sw-demo-2" defaultChecked variantName="default" />
        <label htmlFor="sw-demo-2"> Default checked</label>
      </div>
      <div>
        <Switch id="sw-demo-3" disabled variantName="default" />
        <label htmlFor="sw-demo-3"> Disabled</label>
      </div>
    </div>
  );
}

function TablePreview() {
  return (
    <Table
      aria-label="Users table"
      columns={columns}
      data={users}
      enableSorting
      variantName="default"
    />
  );
}

function TextPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Text as="p" variantName="body1">
        This is body text (p).
      </Text>
      <Text as="span" variantName="body1">
        This is span text.
      </Text>
      <Text as="strong" variantName="body1">
        This is bold text (strong).
      </Text>
      <Text as="em" variantName="body1">
        This is italic text (em).
      </Text>
    </div>
  );
}

function TextareaPreview() {
  const [value, setValue] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "400px",
      }}
    >
      <div>
        <label htmlFor="ta-demo-1">Message: </label>
        <Textarea
          id="ta-demo-1"
          placeholder="Type here..."
          rows={3}
          value={value}
          variantName="default"
          onChange={(e) => setValue(e.target.value)}
        />
        <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "4px 0 0" }}>
          Value: {value}
        </p>
      </div>
      <div>
        <label htmlFor="ta-demo-2">Disabled: </label>
        <Textarea
          id="ta-demo-2"
          disabled
          placeholder="Disabled"
          rows={2}
          variantName="default"
        />
      </div>
    </div>
  );
}

/* ── Demo registry ── */

const demos = [
  { id: "alert", name: "Alert", preview: <AlertPreview /> },
  { id: "badge", name: "Badge", preview: <BadgePreview /> },
  { id: "button", name: "Button", preview: <ButtonPreview /> },
  { id: "checkbox", name: "Checkbox", preview: <CheckboxPreview /> },
  { id: "heading", name: "Heading", preview: <HeadingPreview /> },
  { id: "icon", name: "Icon", preview: <IconPreview /> },
  { id: "input", name: "Input", preview: <InputPreview /> },
  { id: "radio-group", name: "RadioGroup", preview: <RadioGroupPreview /> },
  { id: "select", name: "Select", preview: <SelectPreview /> },
  { id: "separator", name: "Separator", preview: <SeparatorPreview /> },
  { id: "skeleton", name: "Skeleton", preview: <SkeletonPreview /> },
  { id: "switch", name: "Switch", preview: <SwitchPreview /> },
  { id: "table", name: "Table", preview: <TablePreview /> },
  { id: "text", name: "Text", preview: <TextPreview /> },
  { id: "textarea", name: "Textarea", preview: <TextareaPreview /> },
];

/* ── Showcase section ── */

export function ComponentShowcase() {
  return (
    <section id="showcase" className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-medium">Components</h2>
      <p className="mt-2 max-w-lg text-gray-500">
        Every component is interactive, accessible, and styled from your design
        system.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <div
            key={demo.id}
            className="overflow-hidden rounded-2xl bg-surface p-6"
          >
            <h3 className="mb-4 text-lg">{demo.name}</h3>
            <div>{demo.preview}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
