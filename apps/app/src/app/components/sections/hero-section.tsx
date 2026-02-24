import { codeToHtml } from "shiki";

import { INSTALL_CMD } from "@/app/constants/features";

import { CopyIconButton } from "../copy-button";

export async function HeroSection() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-32 sm:pt-40">
      <h1 className="text-3xl sm:text-4xl tracking-tighter font-medium">
        Effortless by design.
      </h1>
      <p className="mt-4 max-w-xl text-base sm:text-lg text-neutral-600">
        Simplify your workflow with an AI-ready component bundle. Sync
        designer-led variants via CLI for full type-safety—accessible,
        props-driven, and ready to ship with zero complexity.
      </p>

      <div className="mt-6 inline-flex overflow-hidden rounded-lg border">
        <div
          className="overflow-x-auto [&_pre]:bg-transparent [&_pre]:px-4 [&_pre]:py-3 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:font-mono"
          dangerouslySetInnerHTML={{
            __html: await codeToHtml(INSTALL_CMD, {
              defaultColor: false,
              lang: "bash",
              themes: { dark: "github-dark-dimmed", light: "github-light" },
            }),
          }}
        />
        <div className="flex items-center border-l bg-surface px-3">
          <CopyIconButton text={INSTALL_CMD} />
        </div>
      </div>
    </main>
  );
}
