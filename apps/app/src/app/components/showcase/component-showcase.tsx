"use client";

import type { ComponentDocs } from "@/app/types/showcase";

import { DocModal } from "../doc-modal";
import { ExpandIcon } from "./icons";
import { componentShowcaseRegistry } from "./registry";

interface ComponentShowcaseProps {
  componentDocs: ComponentDocs;
}

export function ComponentShowcase({ componentDocs }: ComponentShowcaseProps) {
  return (
    <div className="mt-10 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {componentShowcaseRegistry.map((demo) => {
        const card = (
          <div className="group min-w-0 flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-colors hover:bg-neutral-50 dark:bg-neutral-100 dark:hover:bg-neutral-200">
            <div className="p-1.5 pb-0 sm:p-2 sm:pb-0">
              <div className="flex h-36 items-center justify-center overflow-hidden rounded-md bg-white p-4 sm:h-44 sm:p-6 dark:bg-neutral-0 **:pointer-events-none">
                {demo.preview}
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3">
              <h3 className="text-sm font-medium">{demo.name}</h3>
              <span className="text-neutral-400 transition-colors group-hover:text-blue-600">
                <ExpandIcon />
              </span>
            </div>
          </div>
        );

        return (
          <DocModal
            key={demo.id}
            componentId={demo.id}
            preview={demo.fullPreview}
            title={demo.name}
            tokens={componentDocs[demo.id] ?? []}
          >
            {card}
          </DocModal>
        );
      })}
    </div>
  );
}
