"use client";

import type { GitHubRelease } from "@/app/types/landing";

import { Fragment, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

import { CopyIconButton } from "@/app/components/copy-button";
import { ChangelogSection } from "@/app/components/sections/changelog-section";
import { FooterSection } from "@/app/components/sections/footer-section";
import { COMPONENTS_PRODUCT_LINK, SOCIAL_LINKS } from "@/app/constants/navigation";

import {
  EXCEL_PAGE_DESCRIPTION,
  EXCEL_PAGE_TITLE,
  OPEN_WORKBOOK_GITHUB_URL,
} from "./constants";

const EXCEL_GITHUB_RELEASES_API =
  "https://api.github.com/repos/components-kit/open-workbook/releases";
const EXCEL_GITHUB_RELEASES_URL = `${OPEN_WORKBOOK_GITHUB_URL}/releases`;
const EXCEL_SETUP_CMD = "npx -y @components-kit/open-workbook setup";
const EXCEL_SKILLS_CMD =
  "npx skills add components-kit/open-workbook \\\n--skill open-workbook-excel";
const EXCEL_INSTALL_CMD = `${EXCEL_SETUP_CMD}\n${EXCEL_SKILLS_CMD}`;

const EXCEL_FOOTER_NAV_LINKS = [
  { href: "#openworkbook-hero", label: "Home" },
  { href: "#changelog", label: "Changelog" },
  COMPONENTS_PRODUCT_LINK,
] as const;

const EXCEL_SOCIAL_LINKS = SOCIAL_LINKS.map((item) =>
  item.ariaLabel === "GitHub"
    ? { ...item, href: OPEN_WORKBOOK_GITHUB_URL }
    : item,
);

const AI_PROVIDERS = [
  { logo: "/openworkbook/ai/ollama.svg", name: "Ollama" },
  { logo: "/openworkbook/ai/huggingface.svg", name: "Hugging Face" },
  { logo: "/openworkbook/ai/meta.svg", name: "Meta" },
  { logo: "/openworkbook/ai/mistralai.svg", name: "Mistral AI" },
  { logo: "/openworkbook/ai/deepseek.svg", name: "DeepSeek" },
  { logo: "/openworkbook/ai/anthropic.svg", name: "Anthropic" },
  { logo: "/openworkbook/ai/openai.svg", name: "OpenAI" },
  { logo: "/openworkbook/ai/googlegemini.svg", name: "Gemini" },
  { logo: "/openworkbook/ai/xai.svg", name: "xAI" },
] as const;

const EXCEL_DEPARTMENTS = [
  "Accounting",
  "Sales",
  "Operations",
  "Inventory",
  "HR",
] as const;
const EXCEL_DEPARTMENT_ROTATION_MS = 22000;

function AIProviderLogo({
  logo,
  name,
}: {
  logo: string;
  name: string;
}) {
  return (
    <div className="mr-3 flex h-16 min-w-32 items-center justify-center rounded-lg border bg-neutral-0 px-5 transition-colors hover:bg-surface sm:h-20 sm:min-w-40 sm:px-7 dark:bg-neutral-100 dark:hover:bg-neutral-200">
      <img
        className="max-h-7 max-w-28 opacity-70 brightness-0 grayscale sm:max-h-9 sm:max-w-36 dark:invert"
        alt={name}
        src={logo}
      />
    </div>
  );
}

function AITrustBar() {
  return (
    <div className="relative left-1/2 mt-10 w-screen -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:mt-12">
      <Marquee autoFill gradient={false} pauseOnHover speed={32}>
        {AI_PROVIDERS.map((provider) => (
          <AIProviderLogo key={provider.name} {...provider} />
        ))}
      </Marquee>
    </div>
  );
}

function ExcelChangelog() {
  const [isLoading, setIsLoading] = useState(true);
  const [releases, setReleases] = useState<GitHubRelease[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadReleases() {
      try {
        const response = await fetch(EXCEL_GITHUB_RELEASES_API);
        if (!response.ok) return;

        const data = (await response.json()) as GitHubRelease[];
        if (isMounted) {
          setReleases(
            data.map((release) => ({
              ...release,
              body: release.body ?? "",
            })),
          );
        }
      } catch {
        if (isMounted) setReleases([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReleases();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
        <div className="mt-6 space-y-4">
          <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </section>
    );
  }

  return (
    <ChangelogSection
      description="OpenWorkbook updates, fixes, and workflow improvements — shipped from the repo."
      releases={releases}
      releasesUrl={EXCEL_GITHUB_RELEASES_URL}
    />
  );
}

const EXCEL_COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"] as const;

const EXCEL_DEPARTMENT_SHEETS = {
  Accounting: {
    animatedColumns: [1, 2],
    headerColor: "#276749",
    mobileAnimatedColumns: [1, 2],
    rows: [
      [
        "Account",
        "Budget",
        "Actual",
        "Variance",
        "Threshold",
        "Explanation",
        "Owner",
        "Review",
        "Status",
      ],
      [
        "Software",
        "$18,400",
        "$21,120",
        "+14.8%",
        "10%",
        "Annual renewal moved forward",
        "M. Chen",
        "Controller",
        "Needs review",
      ],
      [
        "Travel",
        "$9,200",
        "$11,050",
        "+20.1%",
        "12%",
        "Customer onsite visit",
        "A. Wells",
        "Controller",
        "Needs note",
      ],
      [
        "Contractors",
        "$24,000",
        "$26,500",
        "+10.4%",
        "10%",
        "Close support extension",
        "S. Kim",
        "Approved",
        "Ready",
      ],
      [
        "Facilities",
        "$7,800",
        "$7,640",
        "-2.1%",
        "8%",
        "Within tolerance",
        "N. Brooks",
        "Approved",
        "Ready",
      ],
      [
        "Training",
        "$4,500",
        "$5,260",
        "+16.9%",
        "10%",
        "New compliance cohort",
        "J. Rivera",
        "Controller",
        "Needs review",
      ],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ],
  },
  HR: {
    animatedColumns: [1, 2],
    headerColor: "#be123c",
    mobileAnimatedColumns: [1, 2],
    rows: [
      [
        "Department",
        "Role",
        "Approved HC",
        "Open",
        "Start Target",
        "Budget",
        "Gap",
        "Note",
        "Status",
      ],
      [
        "Engineering",
        "Platform Engineer",
        "12",
        "2",
        "15-Jun",
        "Approved",
        "Backfill",
        "Prioritize infra coverage",
        "Needs approval",
      ],
      [
        "Operations",
        "Shift Lead",
        "8",
        "1",
        "20-Jun",
        "Approved",
        "Backfill",
        "Critical for weekend queue",
        "Needs approval",
      ],
      [
        "Sales",
        "Account Executive",
        "18",
        "3",
        "01-Jul",
        "Approved",
        "Growth",
        "Territory expansion",
        "Open",
      ],
      [
        "Inventory",
        "Planner",
        "6",
        "1",
        "24-Jun",
        "Pending",
        "Coverage",
        "Demand planning support",
        "Finance review",
      ],
      [
        "Finance",
        "Analyst",
        "5",
        "0",
        "Closed",
        "Approved",
        "None",
        "Plan on target",
        "Ready",
      ],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ],
  },
  Inventory: {
    animatedColumns: [1, 2],
    headerColor: "#7c3aed",
    mobileAnimatedColumns: [1, 2],
    rows: [
      [
        "SKU",
        "Item",
        "On Hand",
        "Demand",
        "Reorder",
        "Supplier",
        "Lead Time",
        "Risk",
        "Approval",
      ],
      [
        "SKU-1184",
        "Thermal label",
        "420",
        "780",
        "600",
        "Atlas Supply",
        "9 days",
        "Stockout",
        "Expedite",
      ],
      [
        "SKU-2041",
        "Packing sleeve",
        "1,240",
        "980",
        "0",
        "Northstar",
        "14 days",
        "Low",
        "Baseline",
      ],
      [
        "SKU-3109",
        "Scanner battery",
        "86",
        "210",
        "180",
        "VoltWorks",
        "21 days",
        "High",
        "Review",
      ],
      [
        "SKU-4022",
        "Safety seal",
        "540",
        "630",
        "300",
        "Atlas Supply",
        "8 days",
        "Medium",
        "Approve",
      ],
      [
        "SKU-5220",
        "Return carton",
        "310",
        "640",
        "500",
        "PackRight",
        "12 days",
        "Stockout",
        "Expedite",
      ],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ],
  },
  Operations: {
    animatedColumns: [1, 2],
    headerColor: "#0f766e",
    mobileAnimatedColumns: [1, 2],
    rows: [
      [
        "Order",
        "Customer",
        "Carrier",
        "SLA",
        "Delay",
        "Root Cause",
        "Owner",
        "Action",
        "Escalation",
      ],
      [
        "ORD-1042",
        "Northwind",
        "BlueLine",
        "24h",
        "6h",
        "Carrier handoff missed",
        "A. Patel",
        "Recover today",
        "Yes",
      ],
      [
        "ORD-1057",
        "Acme",
        "ShipFast",
        "48h",
        "10h",
        "Dock queue backlog",
        "S. Morgan",
        "Add second pickup",
        "No",
      ],
      [
        "ORD-1088",
        "Vertex",
        "NorthRail",
        "24h",
        "4h",
        "Address confirmation",
        "M. Chen",
        "Customer update",
        "Yes",
      ],
      [
        "ORD-1091",
        "Summit",
        "BlueLine",
        "72h",
        "8h",
        "Weather hold",
        "A. Patel",
        "Monitor route",
        "No",
      ],
      [
        "ORD-1104",
        "Pioneer",
        "ShipFast",
        "24h",
        "12h",
        "Inventory release delay",
        "N. Brooks",
        "Escalate warehouse",
        "Yes",
      ],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ],
  },
  Sales: {
    animatedColumns: [1, 2],
    headerColor: "#1d4ed8",
    mobileAnimatedColumns: [1, 2],
    rows: [
      [
        "Region",
        "Pipeline",
        "Closed",
        "Coverage",
        "Confidence",
        "Movement",
        "Risk Note",
        "Owner",
        "Status",
      ],
      [
        "North",
        "$420K",
        "$188K",
        "3.1x",
        "High",
        "+$52K",
        "Enterprise renewals pulled in",
        "J. Rivera",
        "Updated",
      ],
      [
        "Europe",
        "$360K",
        "$154K",
        "2.8x",
        "High",
        "+$41K",
        "Expansion deal moved to commit",
        "L. Meyer",
        "Updated",
      ],
      [
        "West",
        "$210K",
        "$96K",
        "1.6x",
        "Medium",
        "-$18K",
        "Coverage below planning target",
        "A. Wells",
        "Needs note",
      ],
      [
        "APAC",
        "$184K",
        "$88K",
        "2.0x",
        "Medium",
        "+$9K",
        "Partner forecast refreshed",
        "S. Tan",
        "Updated",
      ],
      [
        "Strategic",
        "$590K",
        "$221K",
        "3.4x",
        "High",
        "+$64K",
        "Two late-stage contracts added",
        "N. Brooks",
        "Updated",
      ],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ],
  },
} satisfies Record<
  (typeof EXCEL_DEPARTMENTS)[number],
  {
    animatedColumns: readonly number[];
    headerColor: string;
    mobileAnimatedColumns: readonly number[];
    rows: readonly (readonly string[])[];
  }
>;

const EXCEL_DEPARTMENT_WORKFLOWS = {
  Accounting: {
    followUp:
      "After the review, write the approved notes back to the close tracker and mark rows that need controller approval before export.",
    prompt:
      "Act as our accounting operations agent: review the May close workbook, compare actuals against budget, identify unusual expense movement, and prepare controller-ready variance notes.",
    response:
      "I found 4 expense outliers, added explanations, and refreshed Close Tracker.xlsx.",
    summary:
      "Summary ready: travel, software, and contractor spend need approval notes before the close package is exported.",
    thinking: [
      "Reviewing GL totals and variance thresholds",
      "Checking journal notes and close ownership",
    ],
    update:
      "I can update the workbook with variance labels, draft explanations, and a controller review status while preserving the existing formulas.",
  },
  HR: {
    followUp:
      "Add concise notes beside each department plan so finance and hiring managers can approve changes without leaving Excel.",
    prompt:
      "Serve as the workforce planning agent: update the headcount workbook, reconcile open roles with approved budget, and summarize hiring gaps by department.",
    response:
      "The headcount sheet is current. I added notes for 3 priority roles.",
    summary:
      "Summary ready: Engineering and Operations need approval on backfills before the monthly workforce review.",
    thinking: [
      "Checking openings and start dates",
      "Reconciling budget and headcount approvals",
    ],
    update:
      "I can reconcile role status, add hiring-gap notes, and mark budget exceptions directly in the workforce plan.",
  },
  Inventory: {
    followUp:
      "Update the inventory plan with recommended purchase quantities and label items where demand is moving faster than the baseline.",
    prompt:
      "Act as the inventory planning agent: scan the purchasing workbook, identify stockout risk, rebalance reorder quantities, and explain every exception before the next buy run.",
    response:
      "Reorder quantities are recalculated and high-risk SKUs are marked for review.",
    summary:
      "Summary ready: 8 SKUs need accelerated purchase orders, and 5 should stay on the baseline plan.",
    thinking: [
      "Scanning stockouts and reorder points",
      "Checking supplier lead times and SKU velocity",
    ],
    update:
      "I can write recommended reorder quantities, explain exceptions, and tag high-risk SKUs for purchasing approval.",
  },
  Operations: {
    followUp:
      "Write owner actions directly into the weekly review sheet and flag any customer commitments that need escalation today.",
    prompt:
      "Work as the operations control agent: inspect the weekly order workbook, find delayed shipments, compare them with SLA targets, and draft a recovery plan by owner.",
    response:
      "I highlighted 12 delayed orders and wrote owner notes for the weekly review.",
    summary:
      "Summary ready: carrier delays explain most exceptions, with 3 customer commitments needing same-day escalation.",
    thinking: [
      "Comparing cycle time and carrier status",
      "Checking fulfillment queues and SLA exposure",
    ],
    update:
      "I can populate owner actions, assign escalation status, and keep delayed-order notes tied to the source rows.",
  },
  Sales: {
    followUp:
      "Then update the leadership forecast tab with confidence levels, risk notes, and the regions driving the largest movement.",
    prompt:
      "Operate as the sales planning agent: refresh the regional pipeline workbook, reconcile current opportunities with CRM exports, and rebuild the quarterly forecast assumptions.",
    response:
      "Forecast cells are updated. North and Europe now explain 73% of growth.",
    summary:
      "Summary ready: upside is concentrated in enterprise renewals, while West needs a pipeline coverage note.",
    thinking: [
      "Reading stage changes and weighted pipeline",
      "Checking quota coverage and win-rate history",
    ],
    update:
      "I can rebuild the forecast tab, annotate risky regions, and keep the assumptions sheet traceable for finance review.",
  },
} satisfies Record<
  (typeof EXCEL_DEPARTMENTS)[number],
  {
    followUp: string;
    prompt: string;
    response: string;
    summary: string;
    thinking: readonly [string, string];
    update: string;
  }
>;

function ExcelDepartmentChatMockup({
  department,
}: {
  department: (typeof EXCEL_DEPARTMENTS)[number];
}) {
  const workflow = EXCEL_DEPARTMENT_WORKFLOWS[department];

  return (
    <div className="relative flex h-full min-h-0 items-start overflow-hidden pt-1 lg:pr-3">
      <div className="excel-chat-fade" />
      <div className="excel-chat-feed w-full pt-24 sm:pt-20">
        <div className="excel-chat-line excel-chat-line-1 ml-auto w-fit max-w-[88%] rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-ink shadow-sm dark:bg-neutral-100">
          {workflow.prompt}
        </div>

        <div className="excel-chat-line excel-chat-line-2 max-w-[92%] space-y-3">
          <p className="text-sm leading-6 text-ink">
            {department} teams can control spreadsheet agents with detailed
            instructions, workbook context, and approval rules.
          </p>
          <p className="excel-thinking-text text-sm leading-6 text-neutral-600">
            <span className="excel-thinking-line excel-thinking-line-1">
              {workflow.thinking[0]}
            </span>
            <span className="excel-thinking-line excel-thinking-line-2">
              {workflow.thinking[1]}
            </span>
          </p>
        </div>

        <div className="excel-chat-line excel-chat-line-3 max-w-[92%]">
          <p className="text-sm leading-6 text-ink">{workflow.update}</p>
        </div>

        <div className="excel-chat-line excel-chat-line-4 ml-auto w-fit max-w-[88%] rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-ink shadow-sm dark:bg-neutral-100">
          {workflow.followUp}
        </div>

        <div className="excel-chat-line excel-chat-line-5 max-w-[92%]">
          <p className="text-sm leading-6 text-ink">{workflow.response}</p>
        </div>

        <div className="excel-chat-line excel-chat-line-6 max-w-[92%] pb-2">
          <p className="text-sm leading-6 text-neutral-600">
            {workflow.summary}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExcelHeroMockup({
  department,
}: {
  department: (typeof EXCEL_DEPARTMENTS)[number];
}) {
  const sheet = EXCEL_DEPARTMENT_SHEETS[department];
  const [selectedCell, setSelectedCell] = useState({
    columnIndex: 2,
    rowIndex: 2,
  });

  useEffect(() => {
    setSelectedCell({ columnIndex: 2, rowIndex: 2 });
  }, [department]);

  const selectedCellName = `${EXCEL_COLUMNS[selectedCell.columnIndex]}${
    selectedCell.rowIndex + 1
  }`;
  const selectedCellValue =
    sheet.rows[selectedCell.rowIndex]?.[selectedCell.columnIndex] ?? "";

  return (
    <div className="relative z-10 h-full min-h-0 overflow-hidden">
      <div className="absolute top-5 left-4 -right-44 -bottom-8 overflow-hidden rounded-tl-lg border bg-neutral-0/94 shadow-2xl backdrop-blur-xl sm:top-10 sm:left-10 sm:-right-40 sm:-bottom-16 dark:bg-neutral-50/92">
        <div className="flex h-9 items-center gap-3 border-b bg-neutral-50/85 px-3 dark:bg-neutral-100/72">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[10px] font-medium text-neutral-500">
            AutoSave
          </span>
          <span className="h-3.5 w-7 rounded-full bg-neutral-300" />
          <div className="ml-2 flex items-center gap-2 text-[13px] text-neutral-500">
            <span>⌂</span>
            <span>□</span>
            <span>↺</span>
          </div>
        </div>

        <div className="border-b bg-neutral-0 dark:bg-neutral-50">
          <div className="flex h-8 items-end gap-6 overflow-hidden px-3 text-[11px] font-medium text-neutral-700">
            {[
              "Home",
              "Insert",
              "Page Layout",
              "Formulas",
              "Data",
              "Review",
              "View",
              "Table",
            ].map((item) => (
              <span
                key={item}
                className={`shrink-0 pb-2 ${
                  item === "Home"
                    ? "border-b-2 border-emerald-700 text-ink"
                    : item === "Table"
                      ? "text-emerald-700"
                      : ""
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex h-10 items-center gap-3 overflow-hidden border-t px-3 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <span className="h-6 w-7 rounded border bg-neutral-50" />
              <span>Paste</span>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="h-6 w-32 rounded border bg-neutral-0 px-2 leading-6 text-ink">
              Calibri (Body)
            </div>
            <div className="h-6 w-12 rounded border bg-neutral-0 px-2 leading-6 text-ink">
              11
            </div>
            <span className="font-semibold text-ink">B</span>
            <span className="underline">U</span>
            <div className="h-6 w-px bg-neutral-200" />
            <span className="rounded bg-neutral-200 px-2 py-1 text-ink">
              Wrap Text
            </span>
            <div className="h-6 w-24 rounded border bg-neutral-0 px-2 leading-6 text-ink">
              General
            </div>
          </div>
        </div>

        <div className="flex h-8 items-center gap-2 border-b bg-neutral-0 px-2 text-[11px] dark:bg-neutral-50">
          <div className="h-6 w-16 rounded border bg-neutral-0 px-2 leading-6 text-neutral-600">
            {selectedCellName}
          </div>
          <span className="text-neutral-300">×</span>
          <span className="text-neutral-300">✓</span>
          <span className="font-serif text-sm text-neutral-500">fx</span>
          <div className="h-6 min-w-[300px] flex-1 rounded border bg-neutral-0 px-2 leading-6 text-neutral-700">
            {selectedCellValue}
          </div>
        </div>

        <div className="overflow-hidden bg-neutral-0 dark:bg-neutral-50">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[32px_116px_64px_74px_216px_144px_80px_98px_98px_150px] text-[10px] sm:text-[11px]">
              <div className="border-r border-b bg-neutral-100" />
              {EXCEL_COLUMNS.map((column) => (
                <div
                  key={column}
                  className="border-r border-b bg-neutral-100 px-2 py-1 text-center font-medium text-neutral-500 last:border-r-0"
                >
                  {column}
                </div>
              ))}
              {sheet.rows.map((row, rowIndex) => (
                <Fragment key={`sheet-row-${rowIndex}`}>
                  <div
                    className={`border-r border-b px-2 text-center font-medium ${
                      rowIndex === 0
                        ? "bg-neutral-100 py-2 text-neutral-400"
                        : rowIndex === 2
                          ? "bg-neutral-0 py-10 text-emerald-700"
                          : "bg-neutral-0 py-4 text-neutral-400"
                    }`}
                  >
                    {rowIndex + 1}
                  </div>
                  {row.map((cell, cellIndex) => {
                    const isHeader = rowIndex === 0;
                    const isSelected =
                      rowIndex === selectedCell.rowIndex &&
                      cellIndex === selectedCell.columnIndex;
                    const isAgentWrittenCell =
                      rowIndex > 0 &&
                      cell.length > 0 &&
                      sheet.animatedColumns.includes(cellIndex);
                    const isMobileAgentWrittenCell =
                      rowIndex > 0 &&
                      cell.length > 0 &&
                      sheet.mobileAnimatedColumns.includes(cellIndex);
                    const shouldDelayCellAnimation =
                      isAgentWrittenCell || isMobileAgentWrittenCell;
                    const rowPadding = isHeader
                      ? "py-2"
                      : rowIndex === 2
                        ? "py-10"
                        : "py-4";
                    const writeDelay =
                      2800 + (rowIndex - 1) * 620 + cellIndex * 95;

                    return (
                      <button
                        key={`${rowIndex}-${cellIndex}`}
                        className={`cursor-cell overflow-hidden border-r border-b px-2 text-left text-neutral-700 last:border-r-0 focus:outline-none ${
                          isHeader
                            ? "font-semibold text-white"
                            : "bg-neutral-0"
                        } ${
                          isAgentWrittenCell ? "excel-sheet-agent-cell" : ""
                        } ${
                          isMobileAgentWrittenCell
                            ? "excel-sheet-agent-cell-mobile"
                            : ""
                        } ${rowPadding} ${
                          isSelected
                            ? "relative z-10 ring-2 ring-inset ring-emerald-700"
                            : ""
                        }`}
                        style={
                          isHeader
                            ? { backgroundColor: sheet.headerColor }
                            : shouldDelayCellAnimation
                              ? { animationDelay: `${writeDelay}ms` }
                            : undefined
                        }
                        type="button"
                        onClick={() =>
                          setSelectedCell({ columnIndex: cellIndex, rowIndex })
                        }
                      >
                        <span
                          className={`block truncate ${
                            isAgentWrittenCell ? "excel-sheet-written-cell" : ""
                          } ${
                            isMobileAgentWrittenCell
                              ? "excel-sheet-written-cell-mobile"
                              : ""
                          }`}
                          style={
                            shouldDelayCellAnimation
                              ? { animationDelay: `${writeDelay + 220}ms` }
                              : undefined
                          }
                        >
                          {cell}
                        </span>
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type AgentPortalWindow = "excel" | "terminal" | "workspace";

function AgentPortalTerminalMock({
  isTop,
  onFocus,
}: {
  isTop: boolean;
  onFocus: () => void;
}) {
  return (
    <div
      className={`absolute left-2 bottom-2 hidden h-72 w-[440px] max-w-[78%] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#111318] text-left font-mono text-[10px] text-neutral-200 shadow-2xl sm:left-3 sm:bottom-3 sm:flex sm:h-[25rem] sm:w-[540px] sm:text-[11px] lg:left-4 lg:bottom-4 lg:h-[28rem] lg:w-[600px] ${
        isTop ? "z-50" : "z-30"
      }`}
      aria-label="Terminal Excel workflow mockup"
      role="button"
      tabIndex={0}
      onClick={onFocus}
      onFocus={onFocus}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onFocus();
      }}
    >
      <div className="flex h-8 items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-neutral-400">
          workbook-agent
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-hidden p-3 leading-relaxed sm:p-4">
        <div className="rounded bg-[#24262d] px-3 py-2 text-neutral-100">
          <span className="text-neutral-500">&gt;</span> Update Status for
          budget variances over 10% and keep Excel open.
        </div>

        <p className="text-neutral-300">
          I&apos;ll inspect the live workbook first, then update only the
          Accounting table cells that need review.
        </p>

        <div className="space-y-1">
          <p className="text-neutral-300">Explored 1 search</p>
          <p className="text-neutral-100">Open-Workbook-Excel</p>
        </div>

        <div className="space-y-2.5">
          {[
            [
              "openworkbook_excel_runtime_get_status",
              "probeFileBridge=false",
            ],
            ["openworkbook_excel_runtime_get_active_context", ""],
            ["openworkbook_excel_workbook_get_workbook_map", ""],
            [
              "openworkbook_excel_runtime_get_capabilities",
              "includePreview=false",
            ],
            [
              "openworkbook_excel_collab_get_status",
              "workbookId=May Close Tracker.xlsx",
            ],
          ].map(([tool, detail]) => (
            <p key={tool} className="flex min-w-0 gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-300" />
              <span className="min-w-0">
                Called{" "}
                <span className="text-neutral-100">`{tool}`</span>{" "}
                <span className="text-neutral-500">{detail}</span>
              </span>
            </p>
          ))}
        </div>

        <p className="text-neutral-300">
          The workbook has live monthly close data. I found the Accounting
          table and will read the active range before writing changes.
        </p>

        <div className="space-y-2.5">
          {[
            [
              "openworkbook_excel_range_read_values",
              "sheetName=Accounting address=A1:F16",
            ],
            [
              "openworkbook_excel_range_write_values",
              "sheetName=Accounting address=F2:F16",
            ],
            [
              "openworkbook_excel_workbook_validate",
              "formulas=true styles=true",
            ],
          ].map(([tool, detail]) => (
            <p key={tool} className="flex min-w-0 gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-300" />
              <span className="min-w-0">
                Called{" "}
                <span className="text-neutral-100">`{tool}`</span>{" "}
                <span className="text-neutral-500">{detail}</span>
              </span>
            </p>
          ))}
        </div>

        <p className="text-neutral-300">
          Updated the workbook in real time: 5 over-threshold rows are marked
          for review, formulas passed, and Excel stayed open.
        </p>
      </div>

      <div className="border-t border-white/10 bg-[#0f1117] px-3 py-2">
        <div className="rounded bg-[#24262d] px-2 py-1.5 text-neutral-100">
          <span className="text-neutral-500">&gt;</span> Update the workbook and
          validate formulas
        </div>
      </div>

      <div className="flex h-8 items-center gap-2 overflow-hidden border-t border-white/10 bg-[#0b0d11] px-3 text-[10px] text-neutral-400 whitespace-nowrap">
        <span className="rounded bg-emerald-400/15 px-2 py-0.5 text-emerald-300">
          Excel: connected
        </span>
        <span>model: DeepSeek V4 Flash</span>
        <span className="ml-auto text-neutral-500">MCP</span>
      </div>
    </div>
  );
}

function AgentPortalWorkspaceMock({
  isTop,
  onFocus,
}: {
  isTop: boolean;
  onFocus: () => void;
}) {
  return (
    <div
      className={`absolute top-2 left-3 flex h-[22rem] w-[82%] max-w-none flex-col overflow-hidden rounded-lg border bg-neutral-0/96 text-left shadow-2xl backdrop-blur-xl sm:top-8 sm:left-12 sm:h-[25rem] sm:w-[540px] sm:max-w-[80%] lg:top-10 lg:left-20 lg:h-[28rem] lg:w-[600px] dark:bg-neutral-50/95 ${
        isTop ? "z-50" : "z-40"
      }`}
      aria-label="AI workspace Excel workflow mockup"
      role="button"
      tabIndex={0}
      onClick={onFocus}
      onFocus={onFocus}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onFocus();
      }}
    >
      <div className="flex h-8 items-center gap-2 border-b bg-neutral-50 px-3 dark:bg-neutral-100">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] font-medium text-neutral-500">
          workbook review
        </span>
        <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
          Excel live
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 text-[11px] sm:grid-cols-[156px_1fr] lg:grid-cols-[176px_1fr]">
        <div className="hidden border-r bg-neutral-50/80 p-3 text-neutral-500 sm:block dark:bg-neutral-100/70">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
            Workspace
          </p>
          {[
            "May Close Tracker.xlsx",
            "Accounting!A1:F16",
            "Status column",
            "Variance > 10%",
          ].map((item, index) => (
            <div
              key={item}
              className={`mt-2 truncate rounded px-2 py-1.5 ${
                index === 0
                  ? "bg-neutral-0 font-medium text-ink shadow-sm"
                  : "text-neutral-500"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex min-h-0 min-w-0 flex-col">
          <div className="flex items-center gap-2 border-b px-3 py-2 text-[10px] text-neutral-500 whitespace-nowrap">
            <span className="rounded bg-neutral-100 px-2 py-1 text-ink">
              DeepSeek V4 Flash
            </span>
            <span>via MCP</span>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-hidden p-3">
            <div className="ml-6 rounded-lg bg-neutral-100 px-3 py-2 text-ink">
              Mark rows over 10% variance for review.
            </div>
            <div className="mr-6 rounded-lg border px-3 py-2 text-neutral-600">
              I&apos;ll inspect the open workbook and update only the Status
              column.
            </div>
            <div className="rounded border bg-neutral-50 px-3 py-2 font-mono text-[10px] text-neutral-500">
              Called `openworkbook_excel_range_read_values`
            </div>
            <div className="mr-6 rounded-lg border px-3 py-2 text-neutral-600">
              Found five matching rows: Software, Travel, Contractor,
              Training, Security.
            </div>
            <div className="rounded border bg-neutral-50 px-3 py-2 font-mono text-[10px] text-neutral-500">
              Called `openworkbook_excel_range_write_values`
            </div>
            <div className="mr-6 rounded-lg border px-3 py-2 text-neutral-600">
              Updated live Excel. Formulas passed and table styling stayed
              intact.
            </div>
          </div>
          <div className="border-t bg-neutral-50 p-2 dark:bg-neutral-100">
            <div className="flex items-center gap-2 rounded border bg-neutral-0 px-2 py-1.5 text-[10px] text-neutral-500">
              <span className="flex-1 truncate">
                Ask the agent to inspect, edit, or validate this workbook...
              </span>
              <span className="rounded bg-ink px-2 py-1 font-medium text-neutral-0">
                Send
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExcelPage() {
  const [selectedDepartment, setSelectedDepartment] =
    useState<(typeof EXCEL_DEPARTMENTS)[number]>("Accounting");
  const [agentPortalTopWindow, setAgentPortalTopWindow] =
    useState<AgentPortalWindow>("terminal");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSelectedDepartment((currentDepartment) => {
        const currentIndex = EXCEL_DEPARTMENTS.indexOf(currentDepartment);
        const nextIndex = (currentIndex + 1) % EXCEL_DEPARTMENTS.length;

        return EXCEL_DEPARTMENTS[nextIndex];
      });
    }, EXCEL_DEPARTMENT_ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      <main>
        <section
          id="openworkbook-hero"
          className="relative overflow-hidden"
        >
          <div className="pointer-events-none relative mx-auto flex w-full max-w-7xl flex-col px-4 pt-32 pb-14 text-left sm:px-6 sm:pt-40 sm:pb-16">
            <div className="max-w-xl">
              <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl">
                {EXCEL_PAGE_TITLE}
              </h1>
              <p className="mt-4 text-base text-neutral-600 sm:text-lg">
                {EXCEL_PAGE_DESCRIPTION}
              </p>
              <div className="pointer-events-auto mt-6 inline-flex max-w-full overflow-hidden rounded-lg border">
                <div className="flex min-w-0 max-w-full">
                  <div className="min-w-0 flex-1 overflow-x-auto [&_pre]:bg-transparent [&_pre]:px-4 [&_pre]:py-3 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:font-mono">
                    <pre className="shiki shiki-themes github-dark-dimmed github-light">
                      <code>
                        <span className="line block whitespace-nowrap">
                          <span className="excel-install-token-command">
                            npx
                          </span>
                          <span className="excel-install-token-option">
                            {" -y"}
                          </span>
                          <span className="excel-install-token-package">
                            {" @components-kit/open-workbook"}
                          </span>
                          <span className="excel-install-token-package">
                            {" setup"}
                          </span>
                        </span>
                        <span className="line block whitespace-nowrap">
                          <span className="excel-install-token-command">
                            npx
                          </span>
                          <span className="excel-install-token-package">
                            {" skills"}
                          </span>
                          <span className="excel-install-token-package">
                            {" add components-kit/open-workbook"}
                          </span>
                          <span className="excel-install-token-package">
                            {" \\"}
                          </span>
                        </span>
                        <span className="line block whitespace-nowrap">
                          <span className="excel-install-token-option">
                            --skill
                          </span>
                          <span className="excel-install-token-package">
                            {" open-workbook-excel"}
                          </span>
                        </span>
                      </code>
                    </pre>
                  </div>
                  <div className="flex shrink-0 items-center border-l bg-surface px-3">
                    <CopyIconButton text={EXCEL_INSTALL_CMD} />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="pointer-events-auto mt-10 flex flex-wrap gap-2 sm:mt-12"
              aria-label="Select department workbook"
              role="group"
            >
              {EXCEL_DEPARTMENTS.map((department) => {
                const isSelected = selectedDepartment === department;

                return (
                  <button
                    key={department}
                    className={`inline-flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "excel-department-badge-selected text-emerald-800 dark:text-emerald-200"
                        : "border border-neutral-200 bg-transparent text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700 dark:border-neutral-300 dark:hover:bg-neutral-100"
                    }`}
                    aria-pressed={isSelected}
                    type="button"
                    onClick={() => setSelectedDepartment(department)}
                  >
                    {department}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 grid w-full items-stretch gap-4 overflow-hidden sm:mt-4 lg:h-[560px] lg:grid-cols-[0.82fr_1.18fr] lg:gap-5">
              <div
                className="order-2 h-[360px] overflow-hidden sm:h-[400px] lg:order-1 lg:h-full lg:min-h-0"
                aria-hidden="true"
              >
                <ExcelDepartmentChatMockup
                  key={selectedDepartment}
                  department={selectedDepartment}
                />
              </div>
              <div
                className="excel-hero-card pointer-events-auto order-1 h-[360px] min-h-0 w-full rounded-lg sm:h-[430px] lg:order-2 lg:h-full"
                aria-hidden="true"
                data-department={selectedDepartment}
              >
                <ExcelHeroMockup
                  key={selectedDepartment}
                  department={selectedDepartment}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="agent-portals"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24"
        >
          <div className="max-w-2xl text-left">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Agent workspace ready
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tighter sm:text-3xl">
              Update Excel from any AI workflow.
            </h2>
            <p className="mt-4 text-base text-neutral-600 sm:text-lg">
              OpenWorkbook connects live Excel workbooks to MCP, letting agents
              inspect, edit, and validate spreadsheets from the terminal,
              code editors, or any compatible assistant while your workbook
              stays open.
            </p>
          </div>

          <div
            className="excel-hero-card mt-10 h-[30rem] overflow-hidden rounded-lg border sm:mt-12 sm:h-[34rem] lg:h-[38rem]"
          >
            <div className="relative z-10 h-full">
              <div
                className={`absolute top-10 right-0 bottom-0 w-[82%] max-w-none origin-top-right scale-100 overflow-hidden rounded-tl-lg border bg-neutral-0/96 shadow-2xl backdrop-blur-xl sm:-top-20 sm:bottom-0 sm:w-[660px] sm:max-w-[86%] sm:scale-[0.96] lg:w-[700px] lg:scale-100 dark:bg-neutral-50/94 ${
                  agentPortalTopWindow === "excel" ? "z-50" : "z-10"
                }`}
                aria-label="Excel workbook mockup"
                role="button"
                tabIndex={0}
                onClick={() => setAgentPortalTopWindow("excel")}
                onFocus={() => setAgentPortalTopWindow("excel")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setAgentPortalTopWindow("excel");
                  }
                }}
              >
                <div className="flex h-9 items-center gap-3 border-b bg-neutral-50/85 px-3 dark:bg-neutral-100/72">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-500">
                    AutoSave
                  </span>
                  <span className="h-3.5 w-7 rounded-full bg-neutral-300" />
                  <div className="ml-2 flex items-center gap-2 text-[13px] text-neutral-500">
                    <span>⌂</span>
                    <span>□</span>
                    <span>↺</span>
                  </div>
                  <span className="ml-auto text-[11px] font-medium text-neutral-500">
                    May Close Tracker
                  </span>
                </div>

                <div className="border-b bg-neutral-0 dark:bg-neutral-50">
                  <div className="flex h-8 items-end gap-6 overflow-hidden px-3 text-[11px] font-medium whitespace-nowrap text-neutral-700">
                    {[
                      "Home",
                      "Insert",
                      "Page Layout",
                      "Formulas",
                      "Data",
                      "Review",
                      "View",
                      "Table",
                    ].map((item) => (
                      <span
                        key={item}
                        className={`shrink-0 pb-2 ${
                          item === "Home"
                            ? "border-b-2 border-emerald-700 text-ink"
                            : item === "Table"
                              ? "text-emerald-700"
                            : ""
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="flex h-10 items-center gap-3 overflow-hidden border-t px-3 text-[11px] whitespace-nowrap text-neutral-500">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-7 rounded border bg-neutral-50" />
                      <span>Paste</span>
                    </div>
                    <div className="h-6 w-px bg-neutral-200" />
                    <div className="h-6 w-28 rounded border bg-neutral-0 px-2 leading-6 text-ink">
                      Calibri (Body)
                    </div>
                    <div className="h-6 w-10 rounded border bg-neutral-0 px-2 leading-6 text-ink">
                      11
                    </div>
                    <span className="font-semibold text-ink">B</span>
                    <span className="underline">U</span>
                    <div className="h-6 w-px bg-neutral-200" />
                    <span className="rounded bg-neutral-100 px-2 py-1 text-ink">
                      Wrap Text
                    </span>
                    <div className="h-6 w-20 rounded border bg-neutral-0 px-2 leading-6 text-ink">
                      General
                    </div>
                  </div>
                </div>

                <div className="flex h-[calc(100%-7.375rem)] min-h-0">
                  <div className="min-w-0 flex-1 overflow-hidden bg-neutral-0 dark:bg-neutral-50">
                    <div className="flex h-8 items-center gap-2 border-b px-2 text-[11px]">
                      <div className="h-6 w-14 rounded border bg-neutral-0 px-2 leading-6 text-neutral-600">
                        A9
                      </div>
                      <span className="font-serif text-sm text-neutral-500">
                        fx
                      </span>
                      <div className="h-6 flex-1 rounded border bg-neutral-0 px-2 leading-6 text-neutral-500" />
                    </div>
                    <div className="h-full w-full">
                      <div className="grid min-h-full grid-cols-[28px_1.15fr_0.95fr_0.95fr_0.85fr_1fr_1.1fr] grid-rows-[24px_repeat(16,32px)] text-[10px]">
                        <div className="border-r border-b bg-neutral-100" />
                        {["A", "B", "C", "D", "E", "F"].map((column) => (
                          <div
                            key={column}
                            className="border-r border-b bg-neutral-100 px-2 leading-6 text-center font-medium whitespace-nowrap text-neutral-500"
                          >
                            {column}
                          </div>
                        ))}
                        {[
                          [
                            "Account",
                            "Budget",
                            "Actual",
                            "Var.",
                            "Owner",
                            "Status",
                          ],
                          [
                            "Software",
                            "$18.4K",
                            "$21.1K",
                            "+14.8%",
                            "M. Chen",
                            "Review",
                          ],
                          [
                            "Travel",
                            "$9.2K",
                            "$11.1K",
                            "+20.1%",
                            "A. Wells",
                            "Needs note",
                          ],
                          [
                            "Contractor",
                            "$24.0K",
                            "$26.5K",
                            "+10.4%",
                            "S. Kim",
                            "Ready",
                          ],
                          [
                            "Facilities",
                            "$7.8K",
                            "$7.6K",
                            "-2.1%",
                            "N. Brooks",
                            "Ready",
                          ],
                          [
                            "Training",
                            "$4.5K",
                            "$5.3K",
                            "+16.9%",
                            "J. Rivera",
                            "Review",
                          ],
                          [
                            "Licenses",
                            "$12.0K",
                            "$12.4K",
                            "+3.3%",
                            "M. Chen",
                            "Ready",
                          ],
                          [
                            "Payroll",
                            "$86.0K",
                            "$85.6K",
                            "-0.5%",
                            "S. Kim",
                            "Ready",
                          ],
                          [
                            "Benefits",
                            "$18.0K",
                            "$19.2K",
                            "+6.7%",
                            "A. Wells",
                            "Review",
                          ],
                          [
                            "Hosting",
                            "$15.5K",
                            "$16.0K",
                            "+3.2%",
                            "N. Brooks",
                            "Ready",
                          ],
                          [
                            "Security",
                            "$6.2K",
                            "$7.1K",
                            "+14.5%",
                            "J. Rivera",
                            "Review",
                          ],
                          [
                            "Supplies",
                            "$3.8K",
                            "$3.4K",
                            "-10.5%",
                            "A. Wells",
                            "Ready",
                          ],
                          [
                            "Legal",
                            "$10.0K",
                            "$9.7K",
                            "-3.0%",
                            "M. Chen",
                            "Ready",
                          ],
                          [
                            "Events",
                            "$5.0K",
                            "$6.2K",
                            "+24.0%",
                            "N. Brooks",
                            "Review",
                          ],
                          [
                            "Banking",
                            "$1.2K",
                            "$1.1K",
                            "-8.3%",
                            "S. Kim",
                            "Ready",
                          ],
                          [
                            "Taxes",
                            "$28.0K",
                            "$28.4K",
                            "+1.4%",
                            "M. Chen",
                            "Ready",
                          ],
                        ].map((row, rowIndex) => (
                          <Fragment key={`agent-card-row-${rowIndex}`}>
                            <div className="border-r border-b bg-neutral-50 px-2 leading-8 text-center font-medium text-neutral-400">
                              {rowIndex + 1}
                            </div>
                            {row.map((cell, cellIndex) => (
                              <div
                                key={`${rowIndex}-${cellIndex}`}
                                className={`overflow-hidden border-r border-b px-2 leading-8 ${
                                  rowIndex === 0
                                    ? "bg-[#4f81bd] font-semibold whitespace-nowrap text-white"
                                    : rowIndex % 2 === 0
                                      ? "bg-[#dbeafe] text-ink"
                                      : "bg-neutral-0 text-ink"
                                } ${
                                  rowIndex === 8 && cellIndex === 5
                                    ? "ring-2 ring-inset ring-emerald-700"
                                    : ""
                                }`}
                              >
                                <span className="block truncate">{cell}</span>
                              </div>
                            ))}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <AgentPortalWorkspaceMock
                isTop={agentPortalTopWindow === "workspace"}
                onFocus={() => setAgentPortalTopWindow("workspace")}
              />
              <AgentPortalTerminalMock
                isTop={agentPortalTopWindow === "terminal"}
                onFocus={() => setAgentPortalTopWindow("terminal")}
              />
            </div>
          </div>
        </section>

        <section
          id="ai-models"
          className="mx-auto max-w-7xl px-4 pt-10 pb-28 sm:px-6 sm:pt-12 sm:pb-36"
        >
          <div className="max-w-xl text-left">
            <h2 className="text-2xl font-medium tracking-tighter sm:text-3xl">
              Use the AI you already trust.
            </h2>
            <p className="mt-3 text-base text-neutral-600 sm:text-lg">
              Connect Excel to open models, frontier models, and the workflows
              your team already uses.
            </p>
          </div>
          <AITrustBar />
        </section>
        <ExcelChangelog />
      </main>
      <FooterSection
        navLinks={EXCEL_FOOTER_NAV_LINKS}
        socialLinks={EXCEL_SOCIAL_LINKS}
      />
    </>
  );
}
