import type { Token, Tokens } from "marked";
import type { ReactNode } from "react";

export function renderInline(tokens: Token[]): ReactNode[] {
  return tokens.map((token, i) => {
    switch (token.type) {
      case "br":
        return <br key={i} />;
      case "codespan": {
        const t = token as Tokens.Codespan;
        return <code key={i}>{t.text}</code>;
      }
      case "del": {
        const t = token as Tokens.Del;
        return <del key={i}>{renderInline(t.tokens)}</del>;
      }
      case "em": {
        const t = token as Tokens.Em;
        return <em key={i}>{renderInline(t.tokens)}</em>;
      }
      case "escape":
        return (token as Tokens.Escape).text;
      case "image": {
        const t = token as Tokens.Image;
        return (
          <img
            key={i}
            alt={t.text}
            src={t.href}
            title={t.title ?? undefined}
          />
        );
      }
      case "link": {
        const t = token as Tokens.Link;
        return (
          <a key={i} href={t.href} title={t.title ?? undefined}>
            {renderInline(t.tokens)}
          </a>
        );
      }
      case "strong": {
        const t = token as Tokens.Strong;
        return <strong key={i}>{renderInline(t.tokens)}</strong>;
      }
      case "text": {
        const t = token as Tokens.Text;
        return t.tokens ? (
          <span key={i}>{renderInline(t.tokens)}</span>
        ) : (
          t.text
        );
      }
      default:
        return "raw" in token ? String((token as { raw: string }).raw) : null;
    }
  });
}
