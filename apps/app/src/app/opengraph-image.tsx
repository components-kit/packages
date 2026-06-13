import { ImageResponse } from "next/og";

export const alt = "ComponentsKit props-driven API preview";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

function CodeLine({ indent, text }: { indent?: boolean; text: string }) {
  return (
    <div
      style={{
        color: text.includes("variantName")
          ? "#93c5fd"
          : text.includes("radius")
            ? "#c4b5fd"
            : text.includes("title")
              ? "#86efac"
              : "#f8fafc",
        display: "flex",
        paddingLeft: indent ? 28 : 0,
        whiteSpace: "pre",
      }}
    >
      {text}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgb(239, 246, 255) 0%, rgb(224, 242, 254) 46%, rgb(245, 232, 255) 100%)",
          color: "#111827",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 64,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            width: "100%",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
            <div
              style={{
                alignItems: "center",
                background: "#2563eb",
                borderRadius: 16,
                color: "white",
                display: "flex",
                fontSize: 32,
                fontWeight: 800,
                height: 56,
                justifyContent: "center",
                width: 56,
              }}
            >
              C
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>
                ComponentsKit
              </div>
              <div style={{ color: "#4b5563", fontSize: 22 }}>
                AI-ready React components
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 42 }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 22,
                paddingTop: 18,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 760,
                  letterSpacing: -2,
                  lineHeight: 0.94,
                }}
              >
                Props-Driven API
              </div>
              <div
                style={{ color: "#374151", fontSize: 30, lineHeight: 1.25 }}
              >
                Cleaner DOM, typed variants, and component APIs that agents can
                generate with precision.
              </div>
            </div>

            <div
              style={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 24,
                boxShadow: "0 32px 80px rgba(15, 23, 42, 0.28)",
                color: "#e5e7eb",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                width: 500,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#111827",
                  borderBottom: "1px solid rgba(255,255,255,0.09)",
                  display: "flex",
                  gap: 10,
                  height: 48,
                  padding: "0 18px",
                }}
              >
                <span
                  style={{
                    background: "#ef4444",
                    borderRadius: 999,
                    height: 12,
                    width: 12,
                  }}
                />
                <span
                  style={{
                    background: "#f59e0b",
                    borderRadius: 999,
                    height: 12,
                    width: 12,
                  }}
                />
                <span
                  style={{
                    background: "#22c55e",
                    borderRadius: 999,
                    height: 12,
                    width: 12,
                  }}
                />
                <span
                  style={{
                    color: "#94a3b8",
                    fontFamily: "monospace",
                    fontSize: 18,
                    marginLeft: 14,
                  }}
                >
                  props-driven.tsx
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "monospace",
                  fontSize: 24,
                  gap: 12,
                  lineHeight: 1.3,
                  padding: 28,
                }}
              >
                <CodeLine text="<Alert" />
                <CodeLine indent text='  variantName="warning"' />
                <CodeLine indent text='  radius="large"' />
                <CodeLine indent text='  title="Review changes"' />
                <CodeLine text="/>" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
