import type { Tokens } from "marked";
import type { CSSProperties } from "react";

import { renderInline } from "@/app/lib/render-inline-tokens";

type TextAlign = CSSProperties["textAlign"];

interface DocTableProps {
  align: Array<"center" | "left" | "right" | null>;
  header: Tokens.TableCell[];
  rows: Tokens.TableCell[][];
}

export function DocTable({ align, header, rows }: DocTableProps) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border bg-neutral-100">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th
                key={i}
                className="whitespace-nowrap border-b bg-neutral-200 px-3 py-2 text-left text-sm font-semibold text-ink"
                style={{ textAlign: (align[i] ?? "left") as TextAlign }}
              >
                {cell.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b px-3 py-2 text-sm text-neutral-600"
                  style={{ textAlign: (align[j] ?? "left") as TextAlign }}
                >
                  {renderInline(cell.tokens)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
