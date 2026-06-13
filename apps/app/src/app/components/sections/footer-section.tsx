import type { SocialLink } from "../ui/social-links";

import {
  LANDING_FOOTER_NAV_LINKS,
  SOCIAL_LINKS,
} from "@/app/constants/navigation";

import { SocialLinks } from "../ui/social-links";

interface FooterSectionProps {
  navLinks?: ReadonlyArray<{ href: string; label: string }>;
  socialLinks?: ReadonlyArray<SocialLink>;
}

export function FooterSection({
  navLinks = LANDING_FOOTER_NAV_LINKS,
  socialLinks = SOCIAL_LINKS,
}: FooterSectionProps) {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="text-sm text-neutral-600 transition-colors hover:text-ink"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          <SocialLinks className="flex items-center gap-5" links={socialLinks} />
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm text-neutral-500">
            &copy; 2026 ComponentsKit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
