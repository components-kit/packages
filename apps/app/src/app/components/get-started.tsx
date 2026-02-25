"use client";

import { useMemo } from "react";

import { buildBundleUrl } from "@/app/utils/build-bundle-url";

import { CopyAgentButton, CopyIconButton } from "./copy-button";
import { useTheme } from "./theme-context";
import { ThemeControls } from "./theme-controls";

/* ── Step builders ── */

function buildStep2Code(bundleUrl: string) {
  return `<head>
  ...
  <link
    as="style"
    href="${bundleUrl}"
    rel="preload"
  />
  <link
    href="${bundleUrl}"
    rel="stylesheet"
  />
</head>`;
}

const STEP_1_CODE = "pnpm add @components-kit/react";

const STEP_3_CODE = `pnpm add -D @components-kit/cli
npx ck init && npx ck generate`;

const STEP_4_CODE = `import { Button } from "@components-kit/react";

export default function Page() {
  return (
    <main>
      <h1>Welcome</h1>
      <Button variantName="primary">
        Get Started
      </Button>
    </main>
  );
}`;

function buildAgentPrompt(
  bundleUrl: string,
  theme: { borderRadius: string; grayScale: string; primaryColor: string },
) {
  return `## Set up components-kit in this project

Follow these steps to install and configure @components-kit/react.

**Theme:** primaryColor=${theme.primaryColor}, grayScale=${theme.grayScale}, borderRadius=${theme.borderRadius}

### Step 1: Install the dependencies

Run this command in the terminal:

\`\`\`bash
${STEP_1_CODE}
\`\`\`

### Step 2: Connect the styles

Add these two link tags inside the \`<head>\` of your root layout (e.g., \`app/layout.tsx\` for Next.js, or \`index.html\` for Vite):

\`\`\`html
<link
  as="style"
  href="${bundleUrl}"
  rel="preload"
/>
<link
  href="${bundleUrl}"
  rel="stylesheet"
/>
\`\`\`

### Step 3: Initialize the CLI and generate types

Run these commands in the terminal:

\`\`\`bash
${STEP_3_CODE}
\`\`\`

This creates a local config file and generates TypeScript types for all component variants.

### Step 4: Use a component

Here is an example of importing and using a component:

\`\`\`tsx
${STEP_4_CODE}
\`\`\`

Every variant name (like \`"primary"\`) is strictly typed and validated against your config at build time.`;
}

interface Step {
  code: string;
  description: string;
  label: string;
  lineNumbers: boolean;
  preRenderedHtml?: string;
  title: string;
}

function buildSteps(
  bundleUrl: string,
  preRenderedHtml: Record<string, string>,
): Step[] {
  return [
    {
      code: STEP_1_CODE,
      description:
        "Install the core package along with the CLI as a dev dependency. React is the only required peer—advanced components like TanStack Table are opt-in.",
      label: "Terminal",
      lineNumbers: false,
      preRenderedHtml: preRenderedHtml.step1,
      title: "Install the dependencies",
    },
    {
      code: buildStep2Code(bundleUrl),
      description:
        "Connect the edge-cached CSS bundle. Use query params to customize your theme—like primaryColor or borderRadius—without touching a single CSS file.",
      label: "layout.tsx",
      lineNumbers: true,
      title: "Connect the styles",
    },
    {
      code: STEP_3_CODE,
      description:
        "Initialize your config file and run the generator. This creates a local schema that syncs your design tokens with TypeScript for full autocomplete.",
      label: "Terminal",
      lineNumbers: false,
      preRenderedHtml: preRenderedHtml.step3,
      title: "Initialize & Generate",
    },
    {
      code: STEP_4_CODE,
      description:
        "Import your components and pass props with confidence. Every variant name is strictly typed and validated against your config at build time.",
      label: "page.tsx",
      lineNumbers: true,
      preRenderedHtml: preRenderedHtml.step4,
      title: "Ship type-safe code",
    },
  ];
}

/* ── Highlighted code block ── */

function CodeBlock({
  code,
  label,
  lineNumbers,
  preRenderedHtml,
}: {
  code: string;
  label: string;
  lineNumbers: boolean;
  preRenderedHtml?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-neutral-100">
      <div className="flex items-center justify-between border-b bg-neutral-200 px-4 py-2">
        <span className="select-none text-xs text-neutral-600">{label}</span>
        <CopyIconButton text={code} />
      </div>
      {preRenderedHtml ? (
        <div
          className={`overflow-x-auto [&_pre]:bg-transparent [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:font-mono${
            lineNumbers
              ? " [&_.line]:before:mr-6 [&_.line]:before:inline-block [&_.line]:before:w-4 [&_.line]:before:text-right [&_.line]:before:text-neutral-400 [&_.line]:before:content-[counter(line)] [&_.line]:before:[counter-increment:line] [&_code]:[counter-reset:line]"
              : ""
          }`}
          dangerouslySetInnerHTML={{ __html: preRenderedHtml }}
        />
      ) : (
        <div className="overflow-x-auto p-4">
          <pre className="bg-transparent text-sm leading-relaxed">
            <code className="font-mono text-neutral-700">{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/* ── Section ── */

export interface GetStartedProps {
  preRenderedHtml: Record<string, string>;
}

export function GetStarted({ preRenderedHtml }: GetStartedProps) {
  const { borderRadius, grayScale, primaryColor } = useTheme();

  const bundleUrl = useMemo(
    () => buildBundleUrl(primaryColor, grayScale, borderRadius),
    [primaryColor, grayScale, borderRadius],
  );

  const steps = useMemo(
    () => buildSteps(bundleUrl, preRenderedHtml),
    [bundleUrl, preRenderedHtml],
  );
  const agentPrompt = useMemo(
    () =>
      buildAgentPrompt(bundleUrl, { borderRadius, grayScale, primaryColor }),
    [bundleUrl, primaryColor, grayScale, borderRadius],
  );

  return (
    <section id="get-started" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-medium">Installation</h2>
      <p className="mt-2 max-w-lg text-neutral-500">
        Go from zero to your first type-safe component in four steps. Minimal
        configuration, automated type generation, and a seamless developer
        experience — just install, generate, and ship.
      </p>

      <div className="mt-6">
        <CopyAgentButton text={agentPrompt} />
      </div>

      <div className="relative mt-10">
        {/* Dashed vertical connector line */}
        <div
          className="absolute left-3.5 top-4 bottom-4 w-px border-l border-dashed border-neutral-300"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-10 sm:gap-14">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-3 sm:gap-5">
              {/* Timeline indicator */}
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-neutral-600">
                {index + 1}
              </div>

              {/* Step content — full width vertical stack */}
              <div className="min-w-0 flex-1">
                <h3 className="text-lg">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                  {step.description}
                </p>
                {index === 1 && (
                  <div className="mt-4">
                    <ThemeControls showDarkMode={false} />
                  </div>
                )}
                <div className="mt-4">
                  <CodeBlock
                    code={step.code}
                    label={step.label}
                    lineNumbers={step.lineNumbers}
                    preRenderedHtml={step.preRenderedHtml}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
