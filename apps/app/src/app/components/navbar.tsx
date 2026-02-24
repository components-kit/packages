"use client";

import { useEffect, useState } from "react";

import { NAV_LINKS } from "@/app/constants/navigation";

import { SocialLinks } from "./ui/social-links";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 bg-studio">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <a href="#">
            <img className="h-9" alt="ComponentsKit" src="/logo-symbol.svg" />
          </a>

          {/* Nav links — desktop */}
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

          {/* Social links — desktop */}
          <SocialLinks className="hidden items-center gap-5 md:flex" />

          {/* Hamburger — mobile */}
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
        </div>
      </nav>

      {/* Fullscreen mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-studio md:hidden">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <a href="#" onClick={close}>
              <img className="h-9" alt="ComponentsKit" src="/logo-symbol.svg" />
            </a>
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

          {/* Nav links */}
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
          </div>

          {/* Social links */}
          <SocialLinks
            className="flex items-center justify-center gap-6 pb-10"
            iconProfile="mobile"
          />
        </div>
      )}
    </>
  );
}
