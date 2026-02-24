import type { CSSProperties } from "react";

export function EditorPanel({
  className,
  darkStyle,
  filename,
  html,
  lineCount,
  style,
}: {
  className: string;
  darkStyle?: CSSProperties;
  filename: string;
  html: string;
  lineCount: number;
  style?: CSSProperties;
}) {
  const titleBarLight = "oklch(96% 0.004 70)";
  const titleBarDark = "#181818";

  const content = (titleBarBg: string) => (
    <>
      {/* Title Bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-200"
        style={{ backgroundColor: titleBarBg }}
      >
        <div className="h-2 w-2 rounded-full bg-neutral-300" />
        <div className="h-2 w-2 rounded-full bg-neutral-300" />
        <div className="h-2 w-2 rounded-full bg-neutral-300" />
        <span className="ml-1.5 text-[10px] text-neutral-400 font-mono">
          {filename}
        </span>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex flex-1 overflow-hidden">
        <div className="shrink-0 select-none py-3 pl-4 pr-3 text-[11px] leading-4.5 sm:text-xs sm:leading-5 font-mono text-neutral-300 text-right">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div
          className="flex-1 overflow-hidden py-3 pr-4 text-[11px] leading-4.5 sm:text-xs sm:leading-5 [&_pre]:bg-transparent! [&_pre]:p-0! [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );

  if (!darkStyle) {
    return (
      <div className={className} style={style}>
        {content(titleBarLight)}
      </div>
    );
  }

  return (
    <>
      <div className={`${className} dark:hidden`} style={style}>
        {content(titleBarLight)}
      </div>
      <div className={`${className} hidden dark:flex`} style={darkStyle}>
        {content(titleBarDark)}
      </div>
    </>
  );
}
