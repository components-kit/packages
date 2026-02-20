"use client";

import { CodeBlock } from "./code-block";

const STEP_1_CODE = `npm install @components-kit/react`;

const STEP_2_CODE = `# .env
NEXT_PUBLIC_COMPONENTS_KIT_URL=https://api.componentskit.com
NEXT_PUBLIC_COMPONENTS_KIT_KEY=your_api_key_here`;

const STEP_3_CODE = `const BASE_URL = process.env.NEXT_PUBLIC_COMPONENTS_KIT_URL;
const API_KEY = process.env.NEXT_PUBLIC_COMPONENTS_KIT_KEY;
const BUNDLE_URL = \`\${BASE_URL}/v1/public/bundle.css?key=\${API_KEY}\`;

// In your root layout <head>:
<link as="style" href={BUNDLE_URL} rel="preload" />
<link href={BUNDLE_URL} rel="stylesheet" />`;

const STEP_4_CODE = `import { Button } from "@components-kit/react";

<Button variantName="primary">Get Started</Button>`;

const steps = [
  {
    code: STEP_1_CODE,
    description:
      "Add ComponentsKit to your project with your preferred package manager.",
    label: "Terminal",
    title: "Install the package",
  },
  {
    code: STEP_2_CODE,
    description:
      "The CSS bundle is served from the ComponentsKit API. Add your project URL and API key to your environment.",
    label: ".env",
    title: "Set up environment variables",
  },
  {
    code: STEP_3_CODE,
    description:
      "Add the stylesheet links to your root layout so styles are available on first paint.",
    label: "layout.tsx",
    title: "Preload the CSS bundle",
  },
  {
    code: STEP_4_CODE,
    description:
      "Import any component and pass a variant name. No theme providers, no wrappers.",
    label: "page.tsx",
    title: "Use a component",
  },
];

export function GetStarted() {
  return (
    <section id="get-started" className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-medium">Get Started</h2>
      <p className="mt-2 max-w-lg text-gray-500">
        Four steps to go from install to your first component.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {steps.map((step, index) => (
          <div key={index} className="rounded-2xl bg-surface p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                <div className="mt-4">
                  <CodeBlock code={step.code} label={step.label} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
