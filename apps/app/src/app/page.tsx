import { ComponentShowcase } from "./components/component-showcase";
import { CopyButton } from "./components/copy-button";
import { GetStarted } from "./components/get-started";

const INSTALL_CMD = "pnpm add @components-kit/react";

/* ── GitHub Releases ── */

interface GitHubRelease {
  body: string;
  html_url: string;
  published_at: string;
  tag_name: string;
}

async function getReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(
    "https://api.github.com/repos/components-kit/packages/releases",
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return [];

  return res.json();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function renderMarkdown(body: string) {
  return body.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("## "))
      return (
        <h4 key={i} className="mt-4 mb-1 text-sm font-semibold text-ink">
          {trimmed.slice(3)}
        </h4>
      );
    if (trimmed.startsWith("- "))
      return (
        <li key={i} className="ml-4 text-sm text-gray-600 list-disc">
          {trimmed.slice(2)}
        </li>
      );
    if (trimmed.startsWith("```") || trimmed.startsWith("**Full Changelog**"))
      return null;
    return (
      <p key={i} className="text-sm text-gray-600">
        {trimmed}
      </p>
    );
  });
}

/* ── Page ── */
export default async function Home() {
  const releases = await getReleases();

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-studio">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <a href="#">
            <img className="h-9" alt="ComponentsKit" src="/logo-symbol.svg" />
          </a>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <a
              className="text-sm text-gray-500 transition-colors hover:text-ink"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm text-gray-500 transition-colors hover:text-ink"
              href="#showcase"
            >
              Showcase
            </a>
            <a
              className="text-sm text-gray-500 transition-colors hover:text-ink"
              href="#get-started"
            >
              Get Started
            </a>
            <a
              className="text-sm text-gray-500 transition-colors hover:text-ink"
              href="#changelog"
            >
              Changelog
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5">
            {/* GitHub */}
            <a
              className="text-gray-600 transition-colors hover:text-ink"
              aria-label="GitHub"
              href="https://github.com/components-kit/packages"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                fill="currentColor"
                height="20"
                viewBox="0 0 24 24"
                width="20"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              className="text-gray-600 transition-colors hover:text-ink"
              aria-label="X"
              href="https://x.com/componentskit"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                fill="currentColor"
                height="18"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="mx-auto max-w-7xl px-6 pt-24">
        <h1 className="text-4xl tracking-tighter font-medium">
          Effortless by design.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          Simplify your workflow with an AI-ready component bundle.
          Props-driven, accessible, and ready to ship—zero complexity required.
        </p>

        {/* Install command */}
        <CopyButton text={INSTALL_CMD} />
      </main>

      {/* ── Bento Features ── */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Row 1 */}
          <div className="overflow-hidden rounded-2xl bg-surface md:col-span-2">
            <div className="aspect-2/1 bg-gray-200" />
            <div className="p-6">
              <h3 className="text-lg">Props-Driven API</h3>
              <p className="mt-1 text-sm text-gray-600">
                Fully typed, controlled components with a clean props interface.
                Generics, callbacks, and full HTML attribute support — no magic,
                just props.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-surface">
            <div className="aspect-square bg-gray-200" />
            <div className="p-6">
              <h3 className="text-lg">Zero Dependencies</h3>
              <p className="mt-1 text-sm text-gray-600">
                Empty dependency tree. Only React as a peer. Install only what
                you need — your bundle stays minimal.
              </p>
            </div>
          </div>

          {/* Row 2 — three equal columns */}
          <div className="overflow-hidden rounded-2xl bg-surface">
            <div className="aspect-square bg-gray-200" />
            <div className="p-6">
              <h3 className="text-lg">Template Configuration</h3>
              <p className="mt-1 text-sm text-gray-600">
                Style via data attributes, not code. Ship CSS from Figma — no
                variants to maintain, no theme objects to configure.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-surface">
            <div className="aspect-square bg-gray-200" />
            <div className="p-6">
              <h3 className="text-lg">CLI Type Generation</h3>
              <p className="mt-1 text-sm text-gray-600">
                Generate TypeScript types for every component variant straight
                from the CLI. One command, fully typed props — always in sync
                with your design tokens.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-surface">
            <div className="aspect-square bg-gray-200" />
            <div className="p-6">
              <h3 className="text-lg">LLM-Ready Docs</h3>
              <p className="mt-1 text-sm text-gray-600">
                Structured documentation optimized for AI agents. LLM.txt
                ensures your copilot understands every component and prop.
              </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="overflow-hidden rounded-2xl bg-surface">
            <div className="aspect-square bg-gray-200" />
            <div className="p-6">
              <h3 className="text-lg">Accessibility Built-in</h3>
              <p className="mt-1 text-sm text-gray-600">
                WAI-ARIA compliant out of the box. Keyboard navigation, screen
                reader support, focus management, and live regions — every
                component, every pattern.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-surface md:col-span-2">
            <div className="aspect-2/1 bg-gray-200" />
            <div className="p-6">
              <h3 className="text-lg">Headless Peer Dependencies</h3>
              <p className="mt-1 text-sm text-gray-600">
                Advanced components powered by best-in-class libraries —
                Downshift for selection, Floating UI for positioning, TanStack
                Table for data grids, and Sonner for toasts. All optional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Showcase ── */}
      <ComponentShowcase />

      {/* ── Get Started ── */}
      <GetStarted />

      {/* ── Changelog ── */}
      <section id="changelog" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl">Changelog</h2>
        <p className="mt-2 text-gray-500">
          Release history pulled from{" "}
          <a
            className="underline hover:text-ink"
            href="https://github.com/components-kit/packages/releases"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>

        <div className="mt-8 space-y-10">
          {releases.map((release) => (
            <article key={release.tag_name}>
              <div className="flex items-baseline gap-3">
                <a
                  className="text-lg font-semibold text-ink hover:underline"
                  href={release.html_url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {release.tag_name}
                </a>
                <time
                  className="text-sm text-gray-400"
                  dateTime={release.published_at}
                >
                  {formatDate(release.published_at)}
                </time>
              </div>
              <div className="mt-2">{renderMarkdown(release.body)}</div>
            </article>
          ))}

          {releases.length === 0 && (
            <p className="text-sm text-gray-400">No releases found.</p>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <a
                className="text-sm text-gray-500 transition-colors hover:text-ink"
                href="#features"
              >
                Features
              </a>
              <a
                className="text-sm text-gray-500 transition-colors hover:text-ink"
                href="#showcase"
              >
                Showcase
              </a>
              <a
                className="text-sm text-gray-500 transition-colors hover:text-ink"
                href="#get-started"
              >
                Get Started
              </a>
              <a
                className="text-sm text-gray-500 transition-colors hover:text-ink"
                href="#changelog"
              >
                Changelog
              </a>
            </div>

            <div className="flex items-center gap-5">
              <a
                className="text-gray-600 transition-colors hover:text-ink"
                aria-label="GitHub"
                href="https://github.com/components-kit/packages"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  fill="currentColor"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                className="text-gray-600 transition-colors hover:text-ink"
                aria-label="X"
                href="https://x.com/componentskit"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  fill="currentColor"
                  height="18"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-400">
              &copy; 2026 ComponentsKit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
