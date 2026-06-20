"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  COMPONENTS_PRODUCT_LINK,
  NAV_LINKS,
  OPEN_WORKBOOK_PRODUCT_LINK,
  SOCIAL_LINKS,
} from "@/app/constants/navigation";
import {
  OPEN_WORKBOOK_GITHUB_URL,
  OPEN_WORKBOOK_PRODUCT_NAME,
} from "@/app/openworkbook/constants";

import { SocialLinks } from "./ui/social-links";

const OPEN_WORKBOOK_SOCIAL_LINKS = SOCIAL_LINKS.map((item) =>
  item.ariaLabel === "GitHub"
    ? { ...item, href: OPEN_WORKBOOK_GITHUB_URL }
    : item,
);
const OPEN_WORKBOOK_GITHUB_LINK = OPEN_WORKBOOK_SOCIAL_LINKS.find(
  (item) => item.ariaLabel === "GitHub",
);

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPassedOpenWorkbookHero, setHasPassedOpenWorkbookHero] =
    useState(false);
  const isOpenWorkbookPage = pathname === "/openworkbook";
  const isLandingPage = pathname === "/";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
  }

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpenWorkbookPage) {
      setHasPassedOpenWorkbookHero(false);
      return () => {};
    }

    function updateHeaderSurface() {
      const hero = document.getElementById("openworkbook-hero");
      if (!hero) return;

      setHasPassedOpenWorkbookHero(hero.getBoundingClientRect().bottom <= 64);
    }

    updateHeaderSurface();
    window.addEventListener("scroll", updateHeaderSurface, { passive: true });
    window.addEventListener("resize", updateHeaderSurface);

    return () => {
      window.removeEventListener("scroll", updateHeaderSurface);
      window.removeEventListener("resize", updateHeaderSurface);
    };
  }, [isOpenWorkbookPage]);

  if (!isOpenWorkbookPage && !isLandingPage) return null;

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 bg-studio transition-colors duration-300 ${
          isOpenWorkbookPage ? "pointer-events-none" : ""
        } ${isOpenWorkbookPage && hasPassedOpenWorkbookHero ? "border-b" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            className={`inline-flex min-w-0 items-center gap-2 ${
              isOpenWorkbookPage ? "pointer-events-auto" : ""
            }`}
            aria-label="ComponentsKit home"
            href={isOpenWorkbookPage ? COMPONENTS_PRODUCT_LINK.href : "#"}
          >
            <img
              className="h-9 shrink-0"
              alt="ComponentsKit"
              src="/logo-symbol.svg"
            />
            {isOpenWorkbookPage && (
              <>
                <span className="shrink-0 text-neutral-300">/</span>
                <span className="truncate text-sm font-medium text-ink">
                  {OPEN_WORKBOOK_PRODUCT_NAME}
                </span>
              </>
            )}
          </Link>

          {isLandingPage && (
            <>
              <div className="hidden items-center gap-6 md:flex">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-ink"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="hidden items-center gap-5 md:flex">
                <Link
                  className="excel-department-badge-selected inline-flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-medium text-emerald-800 dark:text-emerald-200"
                  href={OPEN_WORKBOOK_PRODUCT_LINK.href}
                >
                  {OPEN_WORKBOOK_PRODUCT_LINK.label}
                </Link>
                <SocialLinks className="flex items-center gap-5" />
              </div>

              <button
                className="text-neutral-600 md:hidden"
                aria-label="Open menu"
                type="button"
                onClick={() => setIsOpen(true)}
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {isOpenWorkbookPage && (
            <div className="pointer-events-auto flex items-center gap-4">
              <Link
                className="components-product-badge-selected hidden h-7 items-center justify-center rounded-full px-2.5 text-xs font-medium sm:inline-flex"
                href={COMPONENTS_PRODUCT_LINK.href}
              >
                {COMPONENTS_PRODUCT_LINK.label}
              </Link>
              <SocialLinks
                className="hidden items-center gap-5 sm:flex"
                links={OPEN_WORKBOOK_SOCIAL_LINKS}
              />
              {OPEN_WORKBOOK_GITHUB_LINK && (
                <SocialLinks
                  className="flex items-center gap-5 sm:hidden"
                  links={[OPEN_WORKBOOK_GITHUB_LINK]}
                />
              )}
            </div>
          )}
        </div>
      </nav>

      {isLandingPage && isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-studio md:hidden">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="#" onClick={close}>
              <img className="h-9" alt="ComponentsKit" src="/logo-symbol.svg" />
            </Link>
            <button
              className="text-neutral-600"
              aria-label="Close menu"
              type="button"
              onClick={close}
            >
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18 18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                className="text-2xl text-neutral-500 transition-colors hover:text-ink"
                href={link.href}
                onClick={close}
              >
                {link.label}
              </a>
            ))}
            <Link
              className="excel-department-badge-selected inline-flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-medium text-emerald-800 dark:text-emerald-200"
              href={OPEN_WORKBOOK_PRODUCT_LINK.href}
              onClick={close}
            >
              {OPEN_WORKBOOK_PRODUCT_LINK.label}
            </Link>
          </div>

          <SocialLinks
            className="flex items-center justify-center gap-6 pb-10"
            iconProfile="mobile"
          />
        </div>
      )}
    </>
  );
}
