import { cva } from "class-variance-authority";

import { SOCIAL_LINKS } from "@/app/constants/navigation";
import { cn } from "@/app/utils/cn";

const linkVariants = cva("text-neutral-600 transition-colors hover:text-ink");

interface SocialLinksProps {
  className?: string;
  iconProfile?: "desktop" | "mobile";
}

export function SocialLinks({
  className,
  iconProfile = "desktop",
}: SocialLinksProps) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map((item) => {
        const size = item[iconProfile];

        return (
          <a
            key={item.ariaLabel}
            className={cn(linkVariants())}
            aria-label={item.ariaLabel}
            href={item.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              fill="currentColor"
              height={size.height}
              viewBox={item.viewBox}
              width={size.width}
            >
              <path d={item.path} />
            </svg>
          </a>
        );
      })}
    </div>
  );
}
