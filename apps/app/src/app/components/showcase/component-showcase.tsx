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
          <div className="min-w-0 flex flex-col rounded-lg bg-neutral-200/60 overflow-hidden transition-colors hover:bg-neutral-200 group">
            <div className="p-1.5 pb-0 sm:p-2 sm:pb-0">
              <div
                className="flex h-36 sm:h-44 items-center justify-center p-4 sm:p-6 rounded-md bg-neutral-0 overflow-hidden **:pointer-events-none"
              >
                {demo.preview}
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto px-3 py-2.5 sm:px-4 sm:py-3">
              <h3 className="text-sm font-medium">{demo.name}</h3>
              <span className="text-neutral-400 transition-transform group-hover:scale-110">
                <ExpandIcon />
              </span>
            </div>
          </div>
        );

        return componentDocs[demo.id]?.length ? (
          <DocModal
            key={demo.id}
            preview={demo.fullPreview}
            title={demo.name}
            tokens={componentDocs[demo.id]}
          >
            {card}
          </DocModal>
        ) : (
          <div key={demo.id} className="min-w-0">
            {card}
          </div>
        );
      })}
    </div>
  );
}
