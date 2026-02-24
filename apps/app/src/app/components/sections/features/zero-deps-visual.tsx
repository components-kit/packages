import { codeToHtml } from "shiki";

import { EditorPanel } from "./editor-panel";
import { GradientVisual } from "./gradient-visual";

const packageJsonSnippet = `{
  "name": "@components-kit/react",
  "dependencies": {},
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "@floating-ui/react": { "optional": true },
    "@tanstack/react-table": { "optional": true },
    "downshift": { "optional": true },
    "sonner": { "optional": true }
  }
}`;

const lineCount = packageJsonSnippet.split("\n").length;

export async function ZeroDepsVisual() {
  let html: string;

  try {
    html = await codeToHtml(packageJsonSnippet, {
      defaultColor: false,
      lang: "json",
      themes: { dark: "github-dark-dimmed", light: "github-light" },
    });
  } catch {
    return <pre className="p-4 text-xs font-mono text-neutral-500">{packageJsonSnippet}</pre>;
  }

  return (
    <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
      <GradientVisual
        className="absolute inset-0"
        darkGlows={[
          { blur: "blur-3xl", color: "oklch(38% 0.04 248 / 0.5)", position: "-top-16 -left-16", size: "h-56 w-56" },
          { blur: "blur-3xl", color: "oklch(39% 0.02 258 / 0.45)", position: "bottom-1/4 -right-12", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(36% 0.045 240 / 0.35)", position: "-bottom-20 left-1/3", size: "h-52 w-52" },
        ]}
        darkGradient="linear-gradient(160deg, oklch(40% 0.012 258) 0%, oklch(38% 0.025 250) 50%, oklch(36% 0.035 242) 100%)"
        glows={[
          { blur: "blur-3xl", color: "oklch(90% 0.035 248 / 0.5)", position: "-top-16 -left-16", size: "h-56 w-56" },
          { blur: "blur-3xl", color: "oklch(94% 0.015 258 / 0.45)", position: "bottom-1/4 -right-12", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(87% 0.04 240 / 0.35)", position: "-bottom-20 left-1/3", size: "h-52 w-52" },
        ]}
        gradient="linear-gradient(160deg, oklch(96% 0.008 258) 0%, oklch(91.5% 0.02 250) 50%, oklch(86.5% 0.03 242) 100%)"
      />
      <EditorPanel
        className="absolute top-6 left-6 sm:top-10 sm:left-10 -right-4 -bottom-8 sm:-right-6 sm:-bottom-12 flex flex-col rounded-tl-lg overflow-hidden border border-neutral-200 shadow-2xl"
        style={{ backgroundColor: "oklch(97.5% 0.003 258)" }}
        darkStyle={{ backgroundColor: "#1e1e1e" }}
        filename="package.json"
        html={html}
        lineCount={lineCount}
      />
    </div>
  );
}
