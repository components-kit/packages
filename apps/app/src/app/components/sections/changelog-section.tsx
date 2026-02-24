import { marked } from "marked";

import type { GitHubRelease } from "@/app/types/landing";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function renderMarkdown(body: string) {
  const cleaned = body
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      return (
        t !== "---" &&
        !t.startsWith("**Full Changelog**") &&
        !t.startsWith("**npm:**")
      );
    })
    .join("\n");

  const html = marked.parse(cleaned, { async: false }) as string;

  return (
    <div
      className="changelog-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ChangelogSection({ releases }: { releases: GitHubRelease[] }) {
  return (
    <section id="changelog" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-medium">What&apos;s New</h2>
      <p className="mt-2 max-w-lg text-neutral-600">
        New components, API improvements, and bug fixes — shipped regularly.
        Follow along on{" "}
        <a
          className="underline hover:text-ink"
          href="https://github.com/components-kit/packages/releases"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub Releases
        </a>
        .
      </p>

      <div className="mt-8 space-y-10 sm:space-y-16">
        {releases.map((release) => (
          <article
            key={release.tag_name}
            className="grid gap-x-8 sm:gap-x-16 gap-y-4 sm:grid-cols-[180px_1fr]"
          >
            <div className="sm:sticky sm:top-20 sm:self-start">
              <a
                className="text-lg font-semibold text-ink hover:underline"
                href={release.html_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {release.tag_name}
              </a>
              <time
                className="mt-1 block text-sm text-neutral-600"
                dateTime={release.published_at}
              >
                {formatDate(release.published_at)}
              </time>
            </div>
            <div>{renderMarkdown(release.body)}</div>
          </article>
        ))}

        {releases.length === 0 && (
          <p className="text-sm text-neutral-500">No releases found.</p>
        )}
      </div>
    </section>
  );
}
