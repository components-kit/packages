"use client";

import type { Token } from "marked";

import { FloatingPortal } from "@floating-ui/react";
import { type ReactNode, useCallback, useEffect, useState } from "react";

import { MarkdownRenderer } from "./ui/markdown-renderer";

interface DocModalProps {
  children: ReactNode;
  preview: ReactNode;
  title: string;
  tokens: Token[];
}

export function DocModal({
  children,
  preview,
  title,
  tokens,
}: DocModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <>
      <div
        className="min-w-0 cursor-pointer"
        aria-label={`View ${title} documentation`}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {children}
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            className="fixed inset-0 z-50 flex flex-col bg-studio"
            aria-label={`${title} documentation`}
            aria-modal="true"
            role="dialog"
          >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
              <h2 className="text-lg font-semibold text-ink">{title}</h2>
              <button
                className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-ink"
                aria-label="Close"
                type="button"
                onClick={close}
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mx-auto max-w-3xl px-4 sm:px-6">
                {/* Interactive preview */}
                <div className="flex items-center justify-center rounded-2xl bg-neutral-0 px-4 py-6 sm:px-6 sm:py-10 mt-2 mb-8">
                  {preview}
                </div>

                {/* Documentation */}
                <div className="pb-16">
                  <MarkdownRenderer tokens={tokens} />
                </div>
              </div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
