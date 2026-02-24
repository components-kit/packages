import { cva } from "class-variance-authority";

import { cn } from "@/app/utils/cn";

const switchVariants = cva("relative h-5 w-9 rounded-full transition-colors", {
  defaultVariants: {
    checked: false,
  },
  variants: {
    checked: {
      false: "bg-neutral-300",
      true: "bg-brand",
    },
  },
});

const thumbVariants = cva(
  "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
  {
    defaultVariants: {
      checked: false,
    },
    variants: {
      checked: {
        false: "translate-x-0",
        true: "translate-x-4",
      },
    },
  },
);

interface ToggleSwitchProps {
  ariaLabel: string;
  checked: boolean;
  onToggle: () => void;
}

export function ToggleSwitch({
  ariaLabel,
  checked,
  onToggle,
}: ToggleSwitchProps) {
  return (
    <button
      className={cn(switchVariants({ checked }))}
      aria-checked={checked}
      aria-label={ariaLabel}
      role="switch"
      type="button"
      onClick={onToggle}
    >
      <span className={cn(thumbVariants({ checked }))} />
    </button>
  );
}
