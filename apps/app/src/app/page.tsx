import { GetStarted } from "@/app/components/get-started";
import { Navbar } from "@/app/components/navbar";
import { ChangelogSection } from "@/app/components/sections/changelog-section";
import { FeaturesSection } from "@/app/components/sections/features-section";
import { FooterSection } from "@/app/components/sections/footer-section";
import { HeroSection } from "@/app/components/sections/hero-section";
import { ThemeConfigurator } from "@/app/components/theme-configurator";
import { ThemeProvider } from "@/app/components/theme-context";
import { getComponentDocs, getReleases } from "@/app/lib/landing-data";

/* ── Page ── */
export default async function Home() {
  const componentDocs = getComponentDocs();
  const releases = await getReleases();

  return (
    <>
      <Navbar />
      <HeroSection />
      <ThemeProvider>
        <FeaturesSection />
        <ThemeConfigurator componentDocs={componentDocs} />
        <GetStarted />
      </ThemeProvider>
      <ChangelogSection releases={releases} />
      <FooterSection />
    </>
  );
}
