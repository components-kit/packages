import { GradientVisual } from "./gradient-visual";
import { TerminalVisual } from "./terminal-visual";

export function PropsDrivenVisual() {
  return (
    <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
      <GradientVisual
        className="absolute inset-0"
        darkGlows={[
          { blur: "blur-3xl", color: "oklch(38% 0.04 55 / 0.5)", position: "-top-20 -right-20", size: "h-64 w-64" },
          { blur: "blur-3xl", color: "oklch(39% 0.02 85 / 0.6)", position: "top-1/3 -left-16", size: "h-52 w-52" },
          { blur: "blur-3xl", color: "oklch(36% 0.045 40 / 0.35)", position: "-bottom-16 right-1/4", size: "h-56 w-56" },
          { blur: "blur-2xl", color: "oklch(39% 0.015 258 / 0.4)", position: "bottom-1/4 left-1/3", size: "h-44 w-44" },
        ]}
        darkGradient="linear-gradient(135deg, oklch(40% 0.02 75) 0%, oklch(38% 0.03 60) 50%, oklch(36% 0.035 45) 100%)"
        glows={[
          { blur: "blur-3xl", color: "oklch(90% 0.035 55 / 0.5)", position: "-top-20 -right-20", size: "h-64 w-64" },
          { blur: "blur-3xl", color: "oklch(95% 0.015 85 / 0.6)", position: "top-1/3 -left-16", size: "h-52 w-52" },
          { blur: "blur-3xl", color: "oklch(87% 0.04 40 / 0.35)", position: "-bottom-16 right-1/4", size: "h-56 w-56" },
          { blur: "blur-2xl", color: "oklch(93% 0.01 258 / 0.4)", position: "bottom-1/4 left-1/3", size: "h-44 w-44" },
        ]}
        gradient="linear-gradient(135deg, oklch(96% 0.015 75) 0%, oklch(91% 0.025 60) 50%, oklch(87% 0.03 45) 100%)"
      />
      <TerminalVisual />
    </div>
  );
}
