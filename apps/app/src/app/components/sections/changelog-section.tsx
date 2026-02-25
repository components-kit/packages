import type { GitHubRelease } from "@/app/types/landing";

import { ReleaseList } from "./release-list";

const MAX_RELEASES = 3;
const GITHUB_RELEASES_URL =
  "https://github.com/components-kit/packages/releases";

export function ChangelogSection({ releases }: { releases: GitHubRelease[] }) {
  const visible = releases.slice(0, MAX_RELEASES);

  return (
    <section id="changelog" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-medium">What&apos;s New</h2>
      <p className="mt-2 max-w-lg text-neutral-600">
        New components, API improvements, and bug fixes — shipped regularly.
        Follow along on the{" "}
        <a
          className="underline hover:text-ink"
          href={GITHUB_RELEASES_URL}
          rel="noopener"
          target="_blank"
        >
          full changelog
        </a>
        .
      </p>

      <ReleaseList releases={visible} />

      {releases.length > MAX_RELEASES && (
        <div className="mt-10 sm:mt-16 text-center">
          <a
            className="text-sm text-neutral-500 hover:text-ink underline"
            href={GITHUB_RELEASES_URL}
            rel="noopener"
            target="_blank"
          >
            View full changelog &rarr;
          </a>
        </div>
      )}
    </section>
  );
}
