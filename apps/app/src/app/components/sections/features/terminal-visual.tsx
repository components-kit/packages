import { codeToHtml } from "shiki";

import { EditorPanel } from "./editor-panel";

const radixSnippet = `<Alert>
  <InfoIcon />
  <AlertTitle>Update available</AlertTitle>
  <AlertDescription>
    A new version is ready to install.
  </AlertDescription>
  <AlertAction>
    <Button variant="outline">Install</Button>
  </AlertAction>
</Alert>`;

const propsSnippet = `<Alert
  icon={<InfoIcon />}
  heading="Update available"
  description="A new version is ready to install."
  action={{ children: "Install", variant: "outline" }}
/>`;

const radixLineCount = radixSnippet.split("\n").length;
const propsLineCount = propsSnippet.split("\n").length;

export async function TerminalVisual() {
  let radixHtml: string;
  let propsHtml: string;

  try {
    [radixHtml, propsHtml] = await Promise.all([
      codeToHtml(radixSnippet, {
        defaultColor: false,
        lang: "text",
        themes: { dark: "github-dark-dimmed", light: "github-light" },
      }),
      codeToHtml(propsSnippet, {
        defaultColor: false,
        lang: "tsx",
        themes: { dark: "github-dark-dimmed", light: "github-light" },
      }),
    ]);
  } catch {
    return <pre className="p-4 text-xs font-mono text-neutral-500">{propsSnippet}</pre>;
  }

  return (
    <>
      {/* Back editor — Radix compound style (partially visible) */}
      <EditorPanel
        className="absolute top-6 left-6 sm:top-10 sm:left-10 -right-8 -bottom-8 sm:-right-12 sm:-bottom-12 flex flex-col rounded-tl-lg overflow-hidden border border-neutral-200 shadow-xl opacity-40"
        style={{ backgroundColor: "oklch(96% 0.003 258)" }}
        darkStyle={{ backgroundColor: "#1e1e1e" }}
        filename="compound.tsx"
        html={radixHtml}
        lineCount={radixLineCount}
      />

      {/* Front editor — Props-based style (main focus) */}
      <EditorPanel
        className="absolute top-20 left-20 sm:top-28 sm:left-36 -right-4 -bottom-8 sm:-right-6 sm:-bottom-12 flex flex-col rounded-tl-lg overflow-hidden border border-neutral-200 shadow-2xl"
        style={{ backgroundColor: "oklch(97.5% 0.003 70)" }}
        darkStyle={{ backgroundColor: "#1e1e1e" }}
        filename="props-driven.tsx"
        html={propsHtml}
        lineCount={propsLineCount}
      />
    </>
  );
}
