import "./globals.css";

import type { Metadata } from "next";

import { Instrument_Sans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

import { CK_BUNDLE_URL } from "./lib/api";

const DEFAULT_BUNDLE_HREF = `${CK_BUNDLE_URL}?borderRadius=8&grayScale=slate&primaryColor=blue`;

const instrumentSans = Instrument_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('ck-dark-mode');var d=s!==null?s==='true':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`;

const DESCRIPTION =
  "Simplify your workflow with an AI-ready component bundle. Sync designer-led variants via CLI for full type-safety—accessible, props-driven, and ready to ship with zero complexity.";

export const metadata: Metadata = {
  description: DESCRIPTION,
  metadataBase: new URL("https://componentskit.com"),
  openGraph: {
    description: DESCRIPTION,
    locale: "en_US",
    siteName: "ComponentsKit",
    title: "ComponentsKit",
    type: "website",
    url: "https://componentskit.com",
  },
  title: "ComponentsKit — pnpm add @components-kit/react",
  twitter: {
    card: "summary_large_image",
    description: DESCRIPTION,
    title: "ComponentsKit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={instrumentSans.variable} lang="en">
      <head>
        <link id="ck-bundle" href={DEFAULT_BUNDLE_HREF} rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
    </html>
  );
}
