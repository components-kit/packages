import type { ReactNode } from "react";

import { Button } from "@/app/components/ui/button";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 pb-20">
      <Button href="/" variant="outline">
        &larr; Back to home
      </Button>
      <main className="mt-8">{children}</main>
    </div>
  );
}
