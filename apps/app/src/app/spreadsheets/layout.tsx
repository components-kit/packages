import type { Metadata } from "next";

import { absoluteUrl, SITE_LOCALE, SITE_NAME } from "../metadata";
import {
  EXCEL_PAGE_DESCRIPTION,
  EXCEL_PAGE_TITLE,
  OPEN_WORKBOOK_PRODUCT_NAME,
} from "./constants";

const EXCEL_PAGE_URL = absoluteUrl("/spreadsheets");
const EXCEL_METADATA_TITLE = `${OPEN_WORKBOOK_PRODUCT_NAME} — ${EXCEL_PAGE_TITLE}`;
const EXCEL_OG_IMAGE = "/og/openworkbook-excel.png";
const EXCEL_OG_IMAGE_ALT =
  "OpenWorkbook Excel MCP automation preview for live desktop spreadsheets";

export const metadata: Metadata = {
  alternates: { canonical: EXCEL_PAGE_URL },
  description: EXCEL_PAGE_DESCRIPTION,
  keywords: [
    "OpenWorkbook",
    "Excel MCP",
    "Excel automation",
    "AI spreadsheet automation",
    "desktop Excel",
    "Model Context Protocol",
    "spreadsheet agent",
  ],
  openGraph: {
    description: EXCEL_PAGE_DESCRIPTION,
    images: [
      {
        alt: EXCEL_OG_IMAGE_ALT,
        height: 630,
        url: EXCEL_OG_IMAGE,
        width: 1200,
      },
    ],
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    title: EXCEL_METADATA_TITLE,
    type: "website",
    url: EXCEL_PAGE_URL,
  },
  title: EXCEL_METADATA_TITLE,
  twitter: {
    card: "summary_large_image",
    description: EXCEL_PAGE_DESCRIPTION,
    images: [EXCEL_OG_IMAGE],
    site: "@componentskit",
    title: EXCEL_METADATA_TITLE,
  },
};

export default function ExcelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
