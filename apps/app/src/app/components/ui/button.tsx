import type { ReactNode } from "react";

import Link from "next/link";

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors";

const variants = {
  outline: `${base} border bg-transparent text-neutral-600 hover:text-ink hover:bg-surface`,
  primary: `${base} bg-brand text-white hover:bg-brand/90`,
} as const;

interface ButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: keyof typeof variants;
}

export function Button({
  children,
  className,
  href,
  variant = "primary",
}: ButtonProps) {
  const cls = className
    ? `${variants[variant]} ${className}`
    : variants[variant];

  if (href) {
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} type="button">
      {children}
    </button>
  );
}
