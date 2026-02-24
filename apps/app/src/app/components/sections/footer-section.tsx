import { NAV_LINKS } from "@/app/constants/navigation";

import { SocialLinks } from "../ui/social-links";

export function FooterSection() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                className="text-sm text-neutral-600 transition-colors hover:text-ink"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          <SocialLinks className="flex items-center gap-5" />
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
