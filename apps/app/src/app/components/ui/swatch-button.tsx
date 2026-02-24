import { cva } from "class-variance-authority";

import { cn } from "@/app/utils/cn";

const swatchVariants = cva(
  "relative h-6 w-6 cursor-pointer rounded-lg border-2 border-neutral-0 outline-none transition-none focus-visible:ring-3 focus-visible:ring-brand-ring",
  {
    defaultVariants: {
      active: false,
    },
    variants: {
      active: {
        false: "",
        true: "ring-2 ring-brand",
      },
    },
  },
);

interface SwatchButtonProps {
  active: boolean;
  ariaLabel: string;
  color: string;
  onClick: () => void;
}

export function SwatchButton({
  active,
  ariaLabel,
  color,
  onClick,
}: SwatchButtonProps) {
  return (
    <button
      className={cn(swatchVariants({ active }))}
      style={{ backgroundColor: color }}
      aria-label={ariaLabel}
      type="button"
      onClick={onClick}
    />
  );
}
