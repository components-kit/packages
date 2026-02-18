import "./globals.css";

import type { Metadata } from "next";

import { Instrument_Sans } from "next/font/google";
import { Toaster } from "sonner";

const instrumentSans = Instrument_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

// const BASE_URL = "";
// const API_KEY = "";
const BUNDLE_URL = "";

export const metadata: Metadata = {
  description: "CSS ships instantly—no code, no redeploy, no maintenance",
  title: "ComponentsKit — pnpm add @components-kit/react",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={instrumentSans.variable} lang="en">
      <head>
        <link as="style" href={BUNDLE_URL} rel="preload" />
        <link href={BUNDLE_URL} rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
