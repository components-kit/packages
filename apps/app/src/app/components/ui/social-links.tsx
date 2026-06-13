import { cva } from "class-variance-authority";

import { SOCIAL_LINKS } from "@/app/constants/navigation";
import { cn } from "@/app/utils/cn";

const linkVariants = cva("text-neutral-600 transition-colors hover:text-ink");
export interface SocialLink {
  ariaLabel: string;
  desktop: { height: number; width: number };
  href: string;
  mobile: { height: number; width: number };
  path: string;
  viewBox: string;
}

interface SocialLinksProps {
  className?: string;
  iconProfile?: "desktop" | "mobile";
  links?: ReadonlyArray<SocialLink>;
}

export function SocialLinks({
  className,
  iconProfile = "desktop",
  links = [...SOCIAL_LINKS],
}: SocialLinksProps) {
  return (
    <div className={className}>
      {links.map((item) => {
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
