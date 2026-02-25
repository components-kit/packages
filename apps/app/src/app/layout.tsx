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

const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('ck-dark-mode');var d=s==='true';if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`;

const DESCRIPTION =
  "Simplify your workflow with an AI-ready component bundle. Sync designer-led variants via CLI for full type-safety—accessible, props-driven, and ready to ship with zero complexity.";

const OG_TITLE = "ComponentsKit — Accessible React Components, Zero Complexity";
const OG_DESCRIPTION =
  "AI-ready component bundle with designer-led variants. Sync via CLI for full type-safety—accessible, props-driven, ready to ship.";

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    logo: "https://componentskit.com/logo-symbol.svg",
    name: "ComponentsKit",
    sameAs: [
      "https://github.com/components-kit/packages",
      "https://x.com/componentskit",
    ],
    url: "https://componentskit.com",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    applicationCategory: "DeveloperApplication",
    description: DESCRIPTION,
    name: "ComponentsKit",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    operatingSystem: "Any",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "https://componentskit.com" },
  description: DESCRIPTION,
  metadataBase: new URL("https://componentskit.com"),
  openGraph: {
    description: OG_DESCRIPTION,
    images: [{ height: 630, url: "/og-image.png", width: 1200 }],
    locale: "en_US",
    siteName: "ComponentsKit",
    title: OG_TITLE,
    type: "website",
    url: "https://componentskit.com",
  },
  title: "ComponentsKit — Accessible React Components, Zero Complexity",
  twitter: {
    card: "summary_large_image",
    description: OG_DESCRIPTION,
    images: ["/og-image.png"],
    title: OG_TITLE,
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
