import { GradientVisual } from "./gradient-visual";

const CORE = "@components-kit/react";

const PEERS = [
  { lib: "@tanstack/react-table", role: "Table" },
  { lib: "downshift", role: "Select" },
  { lib: "@floating-ui/react", role: "Positioning" },
  { lib: "sonner", role: "Toast" },
];

export function ModularVisual() {
  return (
    <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden will-change-transform">
      <GradientVisual
        className="absolute inset-0"
        darkGlows={[
          { blur: "blur-3xl", color: "oklch(39% 0.03 60 / 0.45)", position: "-top-20 -right-20", size: "h-64 w-64" },
          { blur: "blur-3xl", color: "oklch(37% 0.04 250 / 0.4)", position: "top-1/3 -left-16", size: "h-52 w-52" },
          { blur: "blur-3xl", color: "oklch(39% 0.02 55 / 0.5)", position: "-bottom-16 right-1/3", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(36% 0.04 245 / 0.3)", position: "bottom-1/4 left-1/4", size: "h-44 w-44" },
        ]}
        darkGradient="linear-gradient(125deg, oklch(39% 0.015 65) 0%, oklch(38% 0.012 258) 40%, oklch(36% 0.03 248) 100%)"
        glows={[
          { blur: "blur-3xl", color: "oklch(93% 0.02 60 / 0.45)", position: "-top-20 -right-20", size: "h-64 w-64" },
          { blur: "blur-3xl", color: "oklch(89% 0.03 250 / 0.4)", position: "top-1/3 -left-16", size: "h-52 w-52" },
          { blur: "blur-3xl", color: "oklch(94% 0.015 55 / 0.5)", position: "-bottom-16 right-1/3", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(87% 0.035 245 / 0.3)", position: "bottom-1/4 left-1/4", size: "h-44 w-44" },
        ]}
        gradient="linear-gradient(125deg, oklch(95% 0.012 65) 0%, oklch(91% 0.008 258) 40%, oklch(87% 0.025 248) 100%)"
      />

      {/* Dependency tree overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 sm:gap-10 px-6">
        {/* Core node */}
        <div className="relative z-10 rounded-lg border border-neutral-400 dark:border-neutral-500 bg-white/80 dark:bg-neutral-100/80 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 shadow-sm">
          <p className="text-xs sm:text-sm font-medium text-ink font-mono tracking-tight">
            {CORE}
          </p>
          <p className="text-[10px] sm:text-xs text-neutral-500 text-center mt-0.5">
            0 dependencies
          </p>
        </div>

        {/* Connecting lines — vertical stem + horizontal rail (desktop: 4-col, mobile: 2-col) */}
        <div className="relative z-0 -my-4 sm:-my-7 flex items-start justify-center w-full max-w-xs sm:max-w-lg">
          {/* Vertical stem */}
          <div className="absolute left-1/2 -translate-x-px top-0 h-4 sm:h-6 border-l border-dashed border-neutral-400 dark:border-neutral-500" />
          {/* Horizontal rail — mobile: spans 2 cols, desktop: spans 4 */}
          <div
            className="absolute top-4 sm:top-6 border-t border-dashed border-neutral-400 dark:border-neutral-500 left-[25%] right-[25%] sm:left-[12.5%] sm:right-[12.5%]"
          />
          {/* Vertical drops — mobile: 2 columns, desktop: 4 */}
          <div className="hidden sm:flex w-full justify-around">
            {PEERS.map((peer) => (
              <div key={peer.lib} className="flex justify-center" style={{ width: `${100 / PEERS.length}%` }}>
                <div className="h-8 sm:h-12 border-l border-dashed border-neutral-400 dark:border-neutral-500" />
              </div>
            ))}
          </div>
          <div className="flex sm:hidden w-full justify-around">
            {[0, 1].map((i) => (
              <div key={i} className="flex justify-center w-1/2">
                <div className="h-8 border-l border-dashed border-neutral-400 dark:border-neutral-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Peer nodes — mobile: 2×2 grid, desktop: single row */}
        <div className="relative z-10 w-full max-w-xs sm:max-w-lg">
          <div className="hidden sm:flex justify-around gap-3">
            {PEERS.map((peer) => (
              <div
                key={peer.lib}
                className="flex flex-col items-center rounded-lg border border-dashed border-neutral-400 dark:border-neutral-500 bg-white/50 dark:bg-neutral-100/80 backdrop-blur-sm px-3 py-2 shadow-sm"
              >
                <p className="text-xs font-medium text-neutral-600 font-mono leading-tight text-center">
                  {peer.lib}
                </p>
                <span className="mt-0.5 text-[10px] text-neutral-500 italic">
                  optional
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            {PEERS.map((peer) => (
              <div
                key={peer.lib}
                className="flex flex-col items-center rounded-lg border border-dashed border-neutral-400 dark:border-neutral-500 bg-white/50 dark:bg-neutral-100/80 backdrop-blur-sm px-2 py-1.5 shadow-sm"
              >
                <p className="text-[10px] font-medium text-neutral-600 font-mono leading-tight text-center">
                  {peer.lib}
                </p>
                <span className="mt-0.5 text-[9px] text-neutral-500 italic">
                  optional
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
