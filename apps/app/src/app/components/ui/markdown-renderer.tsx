"use client";

import type { Token, Tokens } from "marked";
import type { ReactNode } from "react";

import { renderInline } from "@/app/lib/render-inline-tokens";

import { DocCodeBlock } from "./doc-code-block";
import { DocTable } from "./doc-table";

function renderBlock(token: Token, key: number): ReactNode {
  switch (token.type) {
    case "blockquote": {
      const t = token as Tokens.Blockquote;
      return (
        <blockquote key={key}>
          {t.tokens.map((child, j) => renderBlock(child, j))}
        </blockquote>
      );
    }

    case "code": {
      const t = token as Tokens.Code;
      return <DocCodeBlock key={key} code={t.text} lang={t.lang} />;
    }

    case "heading": {
      const t = token as Tokens.Heading;
      const Tag = `h${t.depth}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return <Tag key={key}>{renderInline(t.tokens)}</Tag>;
    }

    case "hr":
      return <hr key={key} />;

    case "html": {
      const t = token as Tokens.HTML;
      return <div key={key} dangerouslySetInnerHTML={{ __html: t.text }} />;
    }

    case "list": {
      const t = token as Tokens.List;
      const Tag = t.ordered ? "ol" : "ul";
      return (
        <Tag key={key} start={t.ordered ? (t.start as number) : undefined}>
          {t.items.map((item, j) => (
            <li key={j}>
              {item.tokens.map((child, k) => {
                if (child.type === "text" && (child as Tokens.Text).tokens) {
                  return (
                    <span key={k}>
                      {renderInline((child as Tokens.Text).tokens!)}
                    </span>
                  );
                }
                return renderBlock(child, k);
              })}
            </li>
          ))}
        </Tag>
      );
    }

    case "paragraph": {
      const t = token as Tokens.Paragraph;
      return <p key={key}>{renderInline(t.tokens)}</p>;
    }

    case "space":
      return null;

    case "table": {
      const t = token as Tokens.Table;
      return (
        <DocTable
          key={key}
          align={t.align}
          header={t.header}
          rows={t.rows}
        />
      );
    }

    default:
      if ("raw" in token) {
        return (
          <div
            key={key}
            dangerouslySetInnerHTML={{
              __html: String((token as { raw: string }).raw),
            }}
          />
        );
      }
      return null;
  }
}

interface MarkdownRendererProps {
  tokens: Token[];
}

export function MarkdownRenderer({ tokens }: MarkdownRendererProps) {
  return (
    <div className="doc-prose">
      {tokens.map((token, i) => renderBlock(token, i))}
    </div>
  );
}
