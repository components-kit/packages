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
    <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden will-change-transform">
      <GradientVisual
        className="absolute inset-0"
        darkGlows={[
          { blur: "blur-3xl", color: "oklch(45% 0.105 235 / 0.36)", position: "-top-16 -left-16", size: "h-56 w-56" },
          { blur: "blur-3xl", color: "oklch(44% 0.095 250 / 0.3)", position: "bottom-1/4 -right-12", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(48% 0.085 220 / 0.24)", position: "-bottom-20 left-1/3", size: "h-52 w-52" },
        ]}
        darkGradient="linear-gradient(160deg, oklch(22% 0.016 235) 0%, oklch(18.5% 0.018 245) 54%, oklch(16% 0.016 255) 100%)"
        glows={[
          { blur: "blur-3xl", color: "oklch(82% 0.125 235 / 0.46)", position: "-top-16 -left-16", size: "h-56 w-56" },
          { blur: "blur-3xl", color: "oklch(84% 0.105 250 / 0.34)", position: "bottom-1/4 -right-12", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(86% 0.09 220 / 0.26)", position: "-bottom-20 left-1/3", size: "h-52 w-52" },
        ]}
        gradient="linear-gradient(160deg, oklch(96% 0.024 235) 0%, oklch(92.5% 0.036 245) 52%, oklch(89.5% 0.034 255) 100%)"
      />
      <EditorPanel
        className="absolute top-6 left-6 sm:top-10 sm:left-10 -right-4 -bottom-8 sm:-right-6 sm:-bottom-12 flex flex-col rounded-tl-lg overflow-hidden border border-neutral-200 shadow-2xl"
        style={{ backgroundColor: "oklch(98% 0 0)" }}
        darkStyle={{ backgroundColor: "#1e1e1e" }}
        filename="package.json"
        html={html}
        lineCount={lineCount}
      />
    </div>
  );
}
