"use client";

import { useClipboard } from "@/app/hooks/use-clipboard";

export function CopyIconButton({ text }: { text: string }) {
  const { copied, copy } = useClipboard();

  return (
    <button
      className={`transition-colors ${copied ? "text-brand" : "text-neutral-600 hover:text-ink"}`}
      aria-label="Copy code"
      type="button"
      onClick={() => copy(text)}
    >
      {copied ? (
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect height="13" rx="2" width="13" x="9" y="9" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export function CopyButton({ text }: { text: string }) {
  return (
    <div className="mt-6 inline-flex items-center gap-3 rounded-lg border bg-surface px-4 py-3">
      <code className="text-sm text-ink">{text}</code>
      <CopyIconButton text={text} />
    </div>
  );
}

export function CopyAgentButton({ text }: { text: string }) {
  const { copied, copy } = useClipboard();

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
        copied
          ? "border-brand/30 bg-brand/5 text-brand"
          : "bg-surface text-neutral-600 hover:text-ink"
      }`}
      type="button"
      onClick={() => copy(text)}
    >
      {copied ? (
        <>
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            <path d="M20 3v4" />
            <path d="M22 5h-4" />
          </svg>
          Copy setup prompt for AI
        </>
      )}
    </button>
  );
}
