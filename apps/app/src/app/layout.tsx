import "./globals.css";

import type { Metadata } from "next";

import { Instrument_Sans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

import { Navbar } from "./components/navbar";
import { CK_BUNDLE_URL } from "./lib/api";
import {
  absoluteUrl,
  DEFAULT_KEYWORDS,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_METADATA,
  DEFAULT_OG_TITLE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "./metadata";

const DEFAULT_BUNDLE_HREF = `${CK_BUNDLE_URL}?borderRadius=8&grayScale=neutral&primaryColor=blue`;

const instrumentSans = Instrument_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('ck-dark-mode');var d=s==='true';if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`;

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    logo: absoluteUrl("/logo-symbol.svg"),
    name: SITE_NAME,
    sameAs: [
      "https://github.com/components-kit/packages",
      "https://x.com/componentskit",
    ],
    url: SITE_URL,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: DEFAULT_META_DESCRIPTION,
    name: SITE_NAME,
    url: SITE_URL,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    applicationCategory: "DeveloperApplication",
    description: DEFAULT_META_DESCRIPTION,
    name: SITE_NAME,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    operatingSystem: "Any",
    url: SITE_URL,
  },
];

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  category: "developer tools",
  creator: SITE_NAME,
  description: DEFAULT_META_DESCRIPTION,
  keywords: [...DEFAULT_KEYWORDS],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: DEFAULT_OG_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_METADATA],
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    title: DEFAULT_OG_TITLE,
    type: "website",
    url: SITE_URL,
  },
  publisher: SITE_NAME,
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: "ComponentsKit — Accessible React Components, Zero Complexity",
  twitter: {
    card: "summary_large_image",
    description: DEFAULT_OG_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    site: "@componentskit",
    title: DEFAULT_OG_TITLE,
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
        <link href="/logo-symbol.svg" rel="icon" type="image/svg+xml" />
        <link as="style" href={DEFAULT_BUNDLE_HREF} rel="preload" />
        <link id="ck-bundle" href={DEFAULT_BUNDLE_HREF} rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
          type="application/ld+json"
        />
      </head>
      <body>
        <Navbar />
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
