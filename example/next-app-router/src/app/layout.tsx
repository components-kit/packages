import "./globals.css";

import type { Metadata } from "next";

import { getImportMap } from "@components-kit/loader-nextjs";
import { CKProvider } from "@components-kit/loader-nextjs/client";

const BASE_URL = process.env.NEXT_PUBLIC_COMPONENTS_KIT_URL;
const API_KEY = process.env.NEXT_PUBLIC_COMPONENTS_KIT_KEY;
const BUNDLE_URL = `${BASE_URL}/v1/public/bundle.css?key=${API_KEY}`;
const FONTS_URL = `${BASE_URL}/v1/public/fonts.txt?key=${API_KEY}`;

export const metadata: Metadata = {
  description: "SSR example app for testing @components-kit/react",
  title: "Components Kit - Next.js Example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getImportMap()) }}
          type="importmap"
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link as="style" href={BUNDLE_URL} rel="preload" />
        <link href={BUNDLE_URL} rel="stylesheet" />
        <link href={FONTS_URL} rel="stylesheet" />
      </head>
      <body>
        <CKProvider>{children}</CKProvider>
      </body>
    </html>
  );
}
