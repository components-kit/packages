"use client";

import type { Token, Tokens } from "marked";
import type { CSSProperties } from "react";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

type TextAlign = CSSProperties["textAlign"];

import { renderInline } from "@/app/lib/render-inline-tokens";

interface DocTableProps {
  align: Array<"center" | "left" | "right" | null>;
  header: Tokens.TableCell[];
  rows: Tokens.TableCell[][];
}

type RowData = Record<string, Token[]>;

function InlineTokens({ tokens }: { tokens: Token[] }) {
  return <>{renderInline(tokens)}</>;
}

export function DocTable({ align, header, rows }: DocTableProps) {
  const columns = useMemo<ColumnDef<RowData>[]>(
    () =>
      header.map((cell, colIndex) => ({
        accessorKey: String(colIndex),
        cell: ({ getValue }) => (
          <InlineTokens tokens={getValue<Token[]>()} />
        ),
        header: cell.text,
        meta: { align: align[colIndex] },
      })),
    [header, align],
  );

  const data = useMemo<RowData[]>(
    () =>
      rows.map((row) =>
        Object.fromEntries(
          row.map((cell, colIndex) => [String(colIndex), cell.tokens]),
        ),
      ),
    [rows],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-3 overflow-x-auto rounded-lg border bg-neutral-100">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="whitespace-nowrap border-b bg-neutral-200 px-3 py-2 text-left text-sm font-semibold text-ink"
                  style={{
                    textAlign:
                      (h.column.columnDef.meta as { align?: TextAlign })?.align ??
                      "left",
                  }}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b px-3 py-2 text-sm text-neutral-600"
                  style={{
                    textAlign:
                      (cell.column.columnDef.meta as { align?: TextAlign })
                        ?.align ?? "left",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
