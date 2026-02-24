"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki/bundle/web";

import { CopyIconButton } from "../copy-button";

interface DocCodeBlockProps {
  code: string;
  lang?: string;
}

export function DocCodeBlock({ code, lang }: DocCodeBlockProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!lang) return undefined;
    let cancelled = false;
    codeToHtml(code, {
      defaultColor: false,
      lang,
      themes: { dark: "github-dark-dimmed", light: "github-light" },
    }).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return (
    <div className="mt-3 overflow-hidden rounded-lg border bg-neutral-100">
      <div className="flex items-center justify-between border-b bg-neutral-200 px-4 py-2">
        <span className="select-none text-xs text-neutral-600">
          {lang || "text"}
        </span>
        <CopyIconButton text={code} />
      </div>
      {html ? (
        <div
          className="overflow-x-auto [&_pre]:bg-transparent [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto bg-neutral-50 p-4 text-sm leading-relaxed">
          <code className="font-mono">{code}</code>
        </pre>
      )}
    </div>
  );
}
