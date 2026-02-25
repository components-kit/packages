import { Suspense } from "react";
import { codeToHtml } from "shiki";

import { GetStarted } from "@/app/components/get-started";
import { Navbar } from "@/app/components/navbar";
import { ChangelogSection } from "@/app/components/sections/changelog-section";
import { FeaturesSection } from "@/app/components/sections/features-section";
import { FooterSection } from "@/app/components/sections/footer-section";
import { HeroSection } from "@/app/components/sections/hero-section";
import { ThemeConfigurator } from "@/app/components/theme-configurator";
import { ThemeProvider } from "@/app/components/theme-context";
import { getComponentDocs, getReleases } from "@/app/lib/landing-data";

const SHIKI_OPTS = {
  defaultColor: false as const,
  themes: {
    dark: "github-dark-dimmed" as const,
    light: "github-light" as const,
  },
};

async function preRenderCodeBlocks() {
  const [step1, step3, step4] = await Promise.all([
    codeToHtml("pnpm add @components-kit/react", {
      ...SHIKI_OPTS,
      lang: "bash",
    }),
    codeToHtml(
      "pnpm add -D @components-kit/cli\nnpx ck init && npx ck generate",
      { ...SHIKI_OPTS, lang: "bash" },
    ),
    codeToHtml(
      `import { Button } from "@components-kit/react";

export default function Page() {
  return (
    <main>
      <h1>Welcome</h1>
      <Button variantName="primary">
        Get Started
      </Button>
    </main>
  );
}`,
      { ...SHIKI_OPTS, lang: "tsx" },
    ),
  ]);
  return { step1, step3, step4 };
}

async function ChangelogLoader() {
  const releases = await getReleases();
  return <ChangelogSection releases={releases} />;
}

/* ── Page ── */
export default async function Home() {
  const componentDocs = getComponentDocs();
  const preRenderedHtml = await preRenderCodeBlocks();

  return (
    <>
      <Navbar />
      <HeroSection />
      <ThemeProvider>
        <FeaturesSection />
        <ThemeConfigurator componentDocs={componentDocs} />
        <GetStarted preRenderedHtml={preRenderedHtml} />
      </ThemeProvider>
      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
            <div className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
            <div className="mt-6 space-y-4">
              <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
            </div>
          </section>
        }
      >
        <ChangelogLoader />
      </Suspense>
      <FooterSection />
    </>
  );
}
