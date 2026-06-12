import { codeToHtml } from "shiki";

import { EditorPanel } from "./editor-panel";
import { GradientVisual } from "./gradient-visual";

const llmsSnippet = `# @components-kit/react

> Headless, accessible React components styled via
> data attributes. Bi-directional Figma design system
> sync — CSS ships instantly, no code, no redeploy.

## Components

- Alert: Contextual feedback messages
- Badge: Small status indicator, supports asChild
- Button: Polymorphic button with loading, icons
- Checkbox: Boolean selection with indeterminate
- Combobox: Searchable select with filtering
- Heading: Polymorphic heading (h1-h6)
- Input: Text input with type variants
- MultiSelect: Multi-value select with tags
- Select: Dropdown with keyboard navigation
- Table: Data table with sorting, pagination
- Tabs: Accessible tabs for content
- Text: Polymorphic text element
- Toast: Notification function (Sonner-based)`;

const lineCount = llmsSnippet.split("\n").length;

export async function LlmsVisual() {
  let html: string;

  try {
    html = await codeToHtml(llmsSnippet, {
      defaultColor: false,
      lang: "markdown",
      themes: { dark: "github-dark-dimmed", light: "github-light" },
    });
  } catch {
    return <pre className="p-4 text-xs font-mono text-neutral-500">{llmsSnippet}</pre>;
  }

  return (
    <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden will-change-transform">
      <GradientVisual
        className="absolute inset-0"
        darkGlows={[
          { blur: "blur-3xl", color: "oklch(45% 0.105 250 / 0.34)", position: "-top-20 -left-16", size: "h-56 w-56" },
          { blur: "blur-3xl", color: "oklch(47% 0.095 235 / 0.3)", position: "top-1/4 -right-12", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(43% 0.09 265 / 0.24)", position: "-bottom-16 left-1/3", size: "h-44 w-44" },
        ]}
        darkGradient="linear-gradient(145deg, oklch(22% 0.016 250) 0%, oklch(18.5% 0.018 235) 50%, oklch(16% 0.016 265) 100%)"
        glows={[
          { blur: "blur-3xl", color: "oklch(82% 0.125 250 / 0.4)", position: "-top-20 -left-16", size: "h-56 w-56" },
          { blur: "blur-3xl", color: "oklch(84% 0.11 235 / 0.32)", position: "top-1/4 -right-12", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(80% 0.105 265 / 0.26)", position: "-bottom-16 left-1/3", size: "h-44 w-44" },
        ]}
        gradient="linear-gradient(145deg, oklch(96% 0.024 250) 0%, oklch(92% 0.034 235) 52%, oklch(89.5% 0.032 265) 100%)"
      />
      <EditorPanel
        className="absolute top-6 left-6 sm:top-10 sm:left-10 -right-4 -bottom-8 sm:-right-6 sm:-bottom-12 flex flex-col rounded-tl-lg overflow-hidden border border-neutral-200 shadow-2xl"
        style={{ backgroundColor: "oklch(98% 0 0)" }}
        darkStyle={{ backgroundColor: "#1e1e1e" }}
        filename="llms.txt"
        html={html}
        lineCount={lineCount}
      />
    </div>
  );
}
