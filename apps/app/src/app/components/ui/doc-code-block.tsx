import { CopyIconButton } from "../copy-button";

interface DocCodeBlockProps {
  code: string;
  lang?: string;
}

export function DocCodeBlock({ code, lang }: DocCodeBlockProps) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 dark:bg-neutral-200">
        <span className="select-none truncate text-xs font-medium text-neutral-600">
          {lang || "text"}
        </span>
        <CopyIconButton text={code} />
      </div>
      <pre className="overflow-x-auto bg-white p-4 text-sm leading-relaxed dark:bg-neutral-100">
        <code className="font-mono text-ink">{code}</code>
      </pre>
    </div>
  );
}
