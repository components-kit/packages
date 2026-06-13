import { ImageResponse } from "next/og";

import {
  EXCEL_PAGE_DESCRIPTION,
  EXCEL_PAGE_TITLE,
  OPEN_WORKBOOK_PRODUCT_NAME,
} from "./constants";

export const alt = "OpenWorkbook financial Excel automation preview";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

const rows = [
  ["Account", "Budget", "Actual", "Variance", "Status"],
  ["Software", "$18,400", "$21,120", "+14.8%", "Needs review"],
  ["Travel", "$9,200", "$11,050", "+20.1%", "Needs note"],
  ["Contractors", "$24,000", "$26,500", "+10.4%", "Ready"],
  ["Facilities", "$7,800", "$7,640", "-2.1%", "Ready"],
];

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        background: color,
        borderRadius: 999,
        height: 12,
        width: 12,
      }}
    />
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgb(236, 253, 245) 0%, rgb(220, 252, 231) 45%, rgb(224, 242, 254) 100%)",
          color: "#052e16",
          display: "flex",
          height: "100%",
          padding: 64,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: 46, width: "100%" }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 22,
              justifyContent: "center",
            }}
          >
            <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
              <div
                style={{
                  alignItems: "center",
                  background: "#15803d",
                  borderRadius: 15,
                  color: "white",
                  display: "flex",
                  fontSize: 30,
                  fontWeight: 800,
                  height: 52,
                  justifyContent: "center",
                  width: 52,
                }}
              >
                C
              </div>
              <span style={{ color: "#86a399", fontSize: 30 }}>/</span>
              <span style={{ fontSize: 30, fontWeight: 740 }}>
                {OPEN_WORKBOOK_PRODUCT_NAME}
              </span>
            </div>
            <div
              style={{
                color: "#052e16",
                fontSize: 68,
                fontWeight: 780,
                letterSpacing: -2,
                lineHeight: 0.96,
              }}
            >
              {EXCEL_PAGE_TITLE}
            </div>
            <div style={{ color: "#14532d", fontSize: 27, lineHeight: 1.28 }}>
              {EXCEL_PAGE_DESCRIPTION}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(21, 128, 61, 0.18)",
              borderRadius: 24,
              boxShadow: "0 34px 90px rgba(22, 101, 52, 0.22)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              width: 540,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "#f8fafc",
                borderBottom: "1px solid #d1fae5",
                display: "flex",
                gap: 12,
                height: 52,
                padding: "0 18px",
              }}
            >
              <Dot color="#ef4444" />
              <Dot color="#f59e0b" />
              <Dot color="#22c55e" />
              <span
                style={{
                  color: "#166534",
                  fontSize: 18,
                  fontWeight: 700,
                  marginLeft: 12,
                }}
              >
                Financial Close.xlsx
              </span>
            </div>

            <div
              style={{
                background: "#166534",
                color: "white",
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                padding: "10px 16px",
              }}
            >
              Review variance notes
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {rows.map((row, rowIndex) => (
                <div
                  key={row.join("-")}
                  style={{
                    background: rowIndex === 0 ? "#15803d" : "white",
                    borderBottom: "1px solid #dcfce7",
                    color: rowIndex === 0 ? "white" : "#14532d",
                    display: "flex",
                    fontSize: rowIndex === 0 ? 16 : 17,
                    fontWeight: rowIndex === 0 ? 760 : 560,
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <div
                      key={`${cell}-${cellIndex}`}
                      style={{
                        borderRight:
                          cellIndex === row.length - 1
                            ? "none"
                            : rowIndex === 0
                              ? "1px solid rgba(255,255,255,0.22)"
                              : "1px solid #dcfce7",
                        color:
                          rowIndex > 0 && cell.includes("+")
                            ? "#15803d"
                            : rowIndex > 0 && cell.includes("-")
                              ? "#475569"
                              : undefined,
                        display: "flex",
                        flex: cellIndex === 0 ? 1.35 : 1,
                        padding: "15px 13px",
                      }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div
              style={{
                alignItems: "center",
                background: "#f0fdf4",
                color: "#166534",
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                gap: 12,
                padding: 18,
              }}
            >
              <span
                style={{
                  background: "#22c55e",
                  borderRadius: 999,
                  height: 10,
                  width: 10,
                }}
              />
              AI wrote variance explanations and preserved formulas.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
