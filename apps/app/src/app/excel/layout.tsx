import type { Metadata } from "next";

import {
  EXCEL_PAGE_DESCRIPTION,
  EXCEL_PAGE_TITLE,
  OPEN_WORKBOOK_PRODUCT_NAME,
} from "./constants";

const EXCEL_PAGE_URL = "https://componentskit.com/excel";
const EXCEL_METADATA_TITLE = `${OPEN_WORKBOOK_PRODUCT_NAME} — ${EXCEL_PAGE_TITLE}`;
const EXCEL_OG_IMAGE = "/excel/opengraph-image";

export const metadata: Metadata = {
  alternates: { canonical: EXCEL_PAGE_URL },
  description: EXCEL_PAGE_DESCRIPTION,
  openGraph: {
    description: EXCEL_PAGE_DESCRIPTION,
    images: [{ height: 630, url: EXCEL_OG_IMAGE, width: 1200 }],
    title: EXCEL_METADATA_TITLE,
    type: "website",
    url: EXCEL_PAGE_URL,
  },
  title: EXCEL_METADATA_TITLE,
  twitter: {
    card: "summary_large_image",
    description: EXCEL_PAGE_DESCRIPTION,
    images: [EXCEL_OG_IMAGE],
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
