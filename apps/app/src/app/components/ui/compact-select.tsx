import type { SelectHTMLAttributes } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/app/utils/cn";

const selectVariants = cva(
  "appearance-none rounded-md border border-neutral-200 bg-transparent bg-size-[12px_12px] bg-position-[right_4px_center] bg-no-repeat pl-1.5 pr-5 text-xs text-neutral-700 outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand-ring cursor-pointer",
  {
    defaultVariants: {
      size: "md",
    },
    variants: {
      size: {
        md: "h-6",
      },
    },
  },
);

const CHEVRON_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
};

type CompactSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function CompactSelect({ className, ...props }: CompactSelectProps) {
  return (
    <select
      className={cn(selectVariants(), className)}
      style={CHEVRON_STYLE}
      {...props}
    />
  );
}
