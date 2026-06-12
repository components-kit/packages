import { GradientVisual } from "./gradient-visual";
import { TerminalVisual } from "./terminal-visual";

export function PropsDrivenVisual() {
  return (
    <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden will-change-transform">
      <GradientVisual
        className="absolute inset-0"
        darkGlows={[
          { blur: "blur-3xl", color: "oklch(46% 0.09 245 / 0.36)", position: "-top-20 -right-20", size: "h-64 w-64" },
          { blur: "blur-3xl", color: "oklch(45% 0.075 205 / 0.34)", position: "top-1/3 -left-16", size: "h-52 w-52" },
          { blur: "blur-3xl", color: "oklch(48% 0.095 285 / 0.28)", position: "-bottom-16 right-1/4", size: "h-56 w-56" },
          { blur: "blur-2xl", color: "oklch(50% 0.065 175 / 0.26)", position: "bottom-1/4 left-1/3", size: "h-44 w-44" },
        ]}
        darkGradient="linear-gradient(135deg, oklch(23% 0.018 255) 0%, oklch(19% 0.02 235) 52%, oklch(16% 0.018 285) 100%)"
        glows={[
          { blur: "blur-3xl", color: "oklch(78% 0.13 245 / 0.58)", position: "-top-20 -right-20", size: "h-64 w-64" },
          { blur: "blur-3xl", color: "oklch(82% 0.105 205 / 0.54)", position: "top-1/3 -left-16", size: "h-52 w-52" },
          { blur: "blur-3xl", color: "oklch(78% 0.13 285 / 0.4)", position: "-bottom-16 right-1/4", size: "h-56 w-56" },
          { blur: "blur-2xl", color: "oklch(84% 0.09 175 / 0.38)", position: "bottom-1/4 left-1/3", size: "h-44 w-44" },
        ]}
        gradient="linear-gradient(135deg, oklch(94% 0.028 245) 0%, oklch(89.5% 0.045 205) 48%, oklch(86% 0.058 285) 100%)"
      />
      <TerminalVisual />
    </div>
  );
}
