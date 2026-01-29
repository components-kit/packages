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
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  Separator,
  Skeleton,
  Slider,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  toast,
} from "@components-kit/react";
import { useState } from "react";

// Sample data for Table
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

// Simple SVG icon
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

export default function Home() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [radioValue, setRadioValue] = useState("option1");
  const [selectValue, setSelectValue] = useState<string>();
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <main>
      <h1>Components Kit - Next.js SSR Example</h1>
      <p>All 19 components from @components-kit/react (raw/unstyled)</p>
      <hr />

      {/* 1. Alert */}
      <section>
        <h2>1. Alert</h2>
        <Alert
          description="This is an alert description."
          heading="Alert Heading"
          icon={<InfoIcon />}
          variantName="info"
        />
        <br />
        <Alert
          action={{ children: "Dismiss", onClick: () => alert("Dismissed") }}
          description="Alert with action button."
          heading="With Action"
          variantName="warning"
        />
      </section>

      {/* 2. Badge */}
      <section>
        <h2>2. Badge</h2>
        <Badge variantName="default">Default</Badge>{" "}
        <Badge variantName="success">Success</Badge>{" "}
        <Badge variantName="warning">Warning</Badge>{" "}
        <Badge variantName="error">Error</Badge>{" "}
        <Badge size="sm" variantName="default">
          Small
        </Badge>{" "}
        <Badge size="lg" variantName="default">
          Large
        </Badge>
      </section>

      {/* 3. Button */}
      <section>
        <h2>3. Button</h2>
        <div>
          <Button variantName="primary">Primary</Button>{" "}
          <Button variantName="secondary">Secondary</Button>{" "}
          <Button variantName="outline">Outline</Button>{" "}
          <Button variantName="destructive">Destructive</Button>
        </div>
        <br />
        <div>
          <Button size="sm" variantName="primary">
            Small
          </Button>{" "}
          <Button size="md" variantName="primary">
            Medium
          </Button>{" "}
          <Button size="lg" variantName="primary">
            Large
          </Button>
        </div>
        <br />
        <div>
          <Button leadingIcon={<SearchIcon />} variantName="primary">
            With Icon
          </Button>{" "}
          <Button isLoading variantName="primary">
            Loading
          </Button>{" "}
          <Button disabled variantName="primary">
            Disabled
          </Button>
        </div>
        <br />
        <div>
          <Button asChild variantName="outline">
            <a
              href="https://example.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              As Link (asChild)
            </a>
          </Button>
        </div>
      </section>

      {/* 4. Checkbox */}
      <section>
        <h2>4. Checkbox</h2>
        <div>
          <Checkbox
            id="cb1"
            checked={checkboxChecked}
            variantName="default"
            onChange={(e) => setCheckboxChecked(e.target.checked)}
          />
          <label htmlFor="cb1">
            {" "}
            Controlled (checked: {String(checkboxChecked)})
          </label>
        </div>
        <div>
          <Checkbox id="cb2" defaultChecked variantName="default" />
          <label htmlFor="cb2"> Default checked</label>
        </div>
        <div>
          <Checkbox id="cb3" disabled variantName="default" />
          <label htmlFor="cb3"> Disabled</label>
        </div>
      </section>

      {/* 5. Heading */}
      <section>
        <h2>5. Heading</h2>
        <Heading as="h1" variantName="h1">
          Heading 1
        </Heading>
        <Heading as="h2" variantName="h2">
          Heading 2
        </Heading>
        <Heading as="h3" variantName="h3">
          Heading 3
        </Heading>
        <Heading as="h4" variantName="h4">
          Heading 4
        </Heading>
        <Heading as="h5" variantName="h5">
          Heading 5
        </Heading>
        <Heading as="h6" variantName="h6">
          Heading 6
        </Heading>
      </section>

      {/* 6. Icon */}
      <section>
        <h2>6. Icon</h2>
        <Icon aria-hidden="true" height="16px" width="16px">
          <InfoIcon />
        </Icon>{" "}
        <Icon aria-hidden="true" height="24px" width="24px">
          <InfoIcon />
        </Icon>{" "}
        <Icon aria-hidden="true" height="32px" width="32px">
          <InfoIcon />
        </Icon>{" "}
        <Icon aria-hidden="true" height="48px" width="48px">
          <SearchIcon />
        </Icon>
      </section>

      {/* 7. Input */}
      <section>
        <h2>7. Input</h2>
        <div>
          <label htmlFor="input1">Text Input: </label>
          <Input
            id="input1"
            placeholder="Enter text..."
            value={inputValue}
            variantName="default"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <span> Value: {inputValue}</span>
        </div>
        <div>
          <label htmlFor="input2">Email: </label>
          <Input
            id="input2"
            placeholder="you@example.com"
            type="email"
            variantName="default"
          />
        </div>
        <div>
          <label htmlFor="input3">Disabled: </label>
          <Input
            id="input3"
            disabled
            placeholder="Disabled"
            variantName="default"
          />
        </div>
      </section>

      {/* 8. Progress */}
      <section>
        <h2>8. Progress</h2>
        <h3>With Label</h3>
        <Progress label="Uploading files..." value={50} variantName="default" />
        <br />
        <Progress label="Processing..." value={80} variantName="success" />
        <h3>Determinate (aria-label)</h3>
        <Progress aria-label="Just started" value={10} variantName="default" />
        <h3>Custom Range</h3>
        <Progress
          aria-valuetext="Step 3 of 5"
          label="Steps completed"
          max={5}
          min={0}
          value={3}
          variantName="default"
        />
        <h3>Complete</h3>
        <Progress label="Complete" value={100} variantName="success" />
        <h3>Indeterminate (loading)</h3>
        <Progress label="Loading..." variantName="default" />
      </section>

      {/* 9. RadioGroup */}
      <section>
        <h2>9. RadioGroup</h2>
        <RadioGroup aria-label="Select option" variantName="default">
          <div>
            <RadioGroupItem
              id="r1"
              checked={radioValue === "option1"}
              name="radio"
              value="option1"
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <label htmlFor="r1"> Option 1</label>
          </div>
          <div>
            <RadioGroupItem
              id="r2"
              checked={radioValue === "option2"}
              name="radio"
              value="option2"
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <label htmlFor="r2"> Option 2</label>
          </div>
          <div>
            <RadioGroupItem
              id="r3"
              checked={radioValue === "option3"}
              name="radio"
              value="option3"
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <label htmlFor="r3"> Option 3</label>
          </div>
        </RadioGroup>
        <p>Selected: {radioValue}</p>
      </section>

      {/* 10. Select */}
      <section>
        <h2>10. Select</h2>
        <Select
          options={["Apple", "Banana", "Cherry", "Date"]}
          placeholder="Select a fruit..."
          value={selectValue}
          variantName="default"
          onValueChange={setSelectValue}
        />
        <p>Selected: {selectValue ?? "none"}</p>
      </section>

      {/* 11. Separator */}
      <section>
        <h2>11. Separator</h2>
        <p>Content above</p>
        <Separator />
        <p>Content below</p>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "8px",
            height: "24px",
          }}
        >
          <span>Left</span>
          <Separator orientation="vertical" />
          <span>Middle</span>
          <Separator orientation="vertical" />
          <span>Right</span>
        </div>
      </section>

      {/* 12. Skeleton */}
      <section>
        <h2>12. Skeleton</h2>
        <Skeleton height="20px" variantName="skeleton" width="200px" />
        <br />
        <Skeleton height="16px" variantName="skeleton" width="150px" />
        <br />
        <Skeleton height="100px" variantName="skeleton" width="100px" />
      </section>

      {/* 13. Switch */}
      <section>
        <h2>13. Switch</h2>
        <div>
          <Switch
            id="sw1"
            checked={switchChecked}
            variantName="default"
            onChange={(e) => setSwitchChecked(e.target.checked)}
          />
          <label htmlFor="sw1">
            {" "}
            Controlled (checked: {String(switchChecked)})
          </label>
        </div>
        <div>
          <Switch id="sw2" defaultChecked variantName="default" />
          <label htmlFor="sw2"> Default checked</label>
        </div>
        <div>
          <Switch id="sw3" disabled variantName="default" />
          <label htmlFor="sw3"> Disabled</label>
        </div>
      </section>

      {/* 14. Table */}
      <section>
        <h2>14. Table</h2>
        <Table
          aria-label="Users table"
          columns={columns}
          data={users}
          enablePagination
          enableSorting
          pageSize={2}
          variantName="default"
        />
      </section>

      {/* 15. Text */}
      <section>
        <h2>15. Text</h2>
        <Text as="p" variantName="body">
          This is body text (p).
        </Text>
        <Text as="span" variantName="caption">
          This is caption text (span).
        </Text>
        <br />
        <Text as="strong" variantName="bold">
          This is bold text (strong).
        </Text>
        <br />
        <Text as="em" variantName="italic">
          This is italic text (em).
        </Text>
      </section>

      {/* 16. Textarea */}
      <section>
        <h2>16. Textarea</h2>
        <div>
          <label htmlFor="ta1">Message: </label>
          <br />
          <Textarea
            id="ta1"
            placeholder="Type here..."
            rows={3}
            value={textareaValue}
            variantName="default"
            onChange={(e) => setTextareaValue(e.target.value)}
          />
          <p>Value: {textareaValue}</p>
        </div>
        <div>
          <label htmlFor="ta2">Disabled: </label>
          <br />
          <Textarea
            id="ta2"
            disabled
            placeholder="Disabled"
            rows={2}
            variantName="default"
          />
        </div>
      </section>

      {/* 17. Toast */}
      <section>
        <h2>17. Toast</h2>
        <p>
          <strong>Note:</strong> Toast uses Sonner. The{" "}
          <code>&lt;Toaster /&gt;</code> component is imported from{" "}
          <code>sonner</code> directly in <code>layout.tsx</code>, not from{" "}
          <code>@components-kit/react</code>.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {/* Basic toast */}
          <Button
            variantName="primary"
            onClick={() =>
              toast({
                title: "Success",
                variantName: "success",
              })
            }
          >
            Basic Toast
          </Button>

          {/* Toast with description */}
          <Button
            variantName="primary"
            onClick={() =>
              toast({
                description: "Your changes have been saved successfully.",
                title: "Settings saved",
                variantName: "success",
              })
            }
          >
            With Description
          </Button>

          {/* Toast with action button */}
          <Button
            variantName="primary"
            onClick={() =>
              toast({
                button: {
                  label: "Undo",
                  onClick: () => alert("Undo action clicked"),
                },
                description: "The item has been removed from your list.",
                title: "Item deleted",
                variantName: "info",
              })
            }
          >
            With Action
          </Button>

          {/* Different variants */}
          <Button
            variantName="secondary"
            onClick={() =>
              toast({
                description: "This is an informational message.",
                title: "Information",
                variantName: "info",
              })
            }
          >
            Info Variant
          </Button>

          <Button
            variantName="secondary"
            onClick={() =>
              toast({
                description: "Please review your input before proceeding.",
                title: "Warning",
                variantName: "warning",
              })
            }
          >
            Warning Variant
          </Button>

          <Button
            variantName="destructive"
            onClick={() =>
              toast({
                description: "An error occurred while processing your request.",
                title: "Error",
                variantName: "error",
              })
            }
          >
            Error Variant
          </Button>

          {/* Different positions */}
          <Button
            variantName="outline"
            onClick={() =>
              toast({
                description: "This toast appears at the top right.",
                position: "top-right",
                title: "Top Right",
                variantName: "info",
              })
            }
          >
            Top Right
          </Button>

          <Button
            variantName="outline"
            onClick={() =>
              toast({
                description: "This toast appears at the top center.",
                position: "top-center",
                title: "Top Center",
                variantName: "info",
              })
            }
          >
            Top Center
          </Button>

          <Button
            variantName="outline"
            onClick={() =>
              toast({
                description: "This toast appears at the bottom left.",
                position: "bottom-left",
                title: "Bottom Left",
                variantName: "info",
              })
            }
          >
            Bottom Left
          </Button>

          {/* Custom duration */}
          <Button
            variantName="outline"
            onClick={() =>
              toast({
                description: "This toast will disappear in 10 seconds.",
                duration: 10000,
                title: "Long duration",
                variantName: "info",
              })
            }
          >
            10s Duration
          </Button>

          {/* Title only */}
          <Button
            variantName="outline"
            onClick={() =>
              toast({
                title: "Quick notification",
                variantName: "default",
              })
            }
          >
            Title Only
          </Button>

          {/* Rich content */}
          <Button
            variantName="outline"
            onClick={() =>
              toast({
                button: {
                  label: "View details",
                  onClick: () => alert("View details clicked"),
                },
                description: (
                  <div>
                    <p>Version 2.0.0 is ready to install.</p>
                    <ul>
                      <li>Performance improvements</li>
                      <li>Bug fixes</li>
                      <li>New features</li>
                    </ul>
                  </div>
                ),
                title: "Update Available",
                variantName: "info",
              })
            }
          >
            Rich Content
          </Button>
        </div>
      </section>

      {/* 18. Tabs */}
      <section>
        <h2>18. Tabs</h2>
        <h3>Basic</h3>
        <Tabs
          defaultValue="tab1"
          tabs={[
            { id: "tab1", label: "Account" },
            { id: "tab2", label: "Security" },
            { id: "tab3", label: "Notifications" },
          ]}
          variantName="default"
        >
          <div data-tab-panel="tab1">Account settings content</div>
          <div data-tab-panel="tab2">Security settings content</div>
          <div data-tab-panel="tab3">Notification preferences content</div>
        </Tabs>
        <br />
        <h3>With Icons</h3>
        <Tabs
          defaultValue="info"
          tabs={[
            { icon: <InfoIcon />, id: "info", label: "Info" },
            { icon: <SearchIcon />, id: "search", label: "Search" },
          ]}
          variantName="default"
        >
          <div data-tab-panel="info">Information panel</div>
          <div data-tab-panel="search">Search panel</div>
        </Tabs>
        <br />
        <h3>Vertical</h3>
        <Tabs
          defaultValue="general"
          orientation="vertical"
          tabs={[
            { id: "general", label: "General" },
            { id: "advanced", label: "Advanced" },
          ]}
          variantName="default"
        >
          <div data-tab-panel="general">General options</div>
          <div data-tab-panel="advanced">Advanced options</div>
        </Tabs>
        <br />
        <h3>With Disabled Tab</h3>
        <Tabs
          defaultValue="enabled"
          tabs={[
            { id: "enabled", label: "Available" },
            { disabled: true, id: "locked", label: "Locked" },
            { id: "other", label: "Other" },
          ]}
          variantName="default"
        >
          <div data-tab-panel="enabled">This tab is accessible</div>
          <div data-tab-panel="locked">This tab is locked</div>
          <div data-tab-panel="other">Other content</div>
        </Tabs>
      </section>

      {/* 19. Slider */}
      <section>
        <h2>19. Slider</h2>
        <h3>Controlled</h3>
        <label id="slider-controlled">Volume: {sliderValue}</label>
        <Slider
          aria-labelledby="slider-controlled"
          value={sliderValue}
          variantName="default"
          onValueChange={setSliderValue}
        />
        <h3>Uncontrolled (defaultValue)</h3>
        <Slider
          aria-label="Brightness"
          defaultValue={75}
          variantName="default"
        />
        <h3>Custom Range & Step</h3>
        <Slider
          aria-label="Temperature"
          defaultValue={22}
          max={40}
          min={0}
          step={0.5}
          variantName="default"
        />
        <h3>Disabled</h3>
        <Slider
          aria-label="Locked slider"
          defaultValue={30}
          disabled
          variantName="default"
        />
        <h3>With aria-valuetext</h3>
        <Slider
          aria-label="Priority"
          aria-valuetext="Medium priority"
          defaultValue={3}
          max={5}
          min={1}
          step={1}
          variantName="default"
        />
      </section>

      <hr />
      <p>@components-kit/react - Next.js App Router (SSR) Example</p>
    </main>
  );
}
