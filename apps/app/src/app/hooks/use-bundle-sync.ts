"use client";

import { useEffect, useMemo } from "react";

import { useTheme } from "@/app/components/theme-context";
import { buildBundleUrl } from "@/app/utils/build-bundle-url";

/**
 * Syncs the CK CSS bundle `<link>` and dark mode class with the current theme state.
 * Reusable across any page that renders themed components.
 */
export function useBundleSync() {
  const { borderRadius, darkMode, grayScale, primaryColor } = useTheme();

  const url = useMemo(
    () => buildBundleUrl(primaryColor, grayScale, borderRadius),
    [primaryColor, grayScale, borderRadius],
  );

  useEffect(() => {
    const oldLink = document.getElementById(
      "ck-bundle",
    ) as HTMLLinkElement | null;
    if (!oldLink || oldLink.href === url) return undefined;

    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = url;

    newLink.onload = () => {
      oldLink.remove();
      newLink.id = "ck-bundle";
    };

    newLink.onerror = () => {
      newLink.remove();
    };

    document.head.appendChild(newLink);

    return () => {
      if (!newLink.id && newLink.parentNode) {
        newLink.remove();
      }
    };
  }, [url]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    root.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);
}
