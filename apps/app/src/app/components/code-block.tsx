"use client";

import { useRef, useState } from "react";

interface CodeBlockProps {
  code: string;
  copyable?: boolean;
  label?: string;
}

export function CodeBlock({ code, copyable = true, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-lg bg-gray-900">
      {(label || copyable) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          {label && (
            <span className="text-xs text-gray-400 font-medium">{label}</span>
          )}
          {copyable && (
            <button
              className={`ml-auto transition-colors ${copied ? "text-green-400" : "text-gray-500 hover:text-gray-300"}`}
              aria-label="Copy code"
              type="button"
              onClick={handleCopy}
            >
              {copied ? (
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  className="size-3.5"
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
          )}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="text-gray-100 font-mono">{code}</code>
      </pre>
    </div>
  );
}
