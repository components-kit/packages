import { CopyIconButton } from "../copy-button";

interface DocCodeBlockProps {
  code: string;
  lang?: string;
}

export function DocCodeBlock({ code, lang }: DocCodeBlockProps) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border bg-neutral-100">
      <div className="flex items-center justify-between border-b bg-neutral-200 px-4 py-2">
        <span className="select-none text-xs text-neutral-600">
          {lang || "text"}
        </span>
        <CopyIconButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
