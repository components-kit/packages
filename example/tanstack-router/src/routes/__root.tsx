import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_COMPONENTS_KIT_URL ?? "";
const API_KEY = import.meta.env.VITE_COMPONENTS_KIT_KEY ?? "";
const BUNDLE_URL = `${BASE_URL}/v1/public/bundle.css?key=${API_KEY}`;
const FONTS_URL = `${BASE_URL}/v1/public/fonts.txt?key=${API_KEY}`;

function RootComponent() {
  useEffect(() => {
    // Preload CSS bundle
    const linkPreload = document.createElement("link");
    linkPreload.rel = "preload";
    linkPreload.href = BUNDLE_URL;
    linkPreload.as = "style";
    document.head.appendChild(linkPreload);

    // Load CSS bundle
    const linkStylesheet = document.createElement("link");
    linkStylesheet.rel = "stylesheet";
    linkStylesheet.href = BUNDLE_URL;
    document.head.appendChild(linkStylesheet);

    // Load fonts
    const linkFonts = document.createElement("link");
    linkFonts.rel = "stylesheet";
    linkFonts.href = FONTS_URL;
    document.head.appendChild(linkFonts);
  }, []);

  return <Outlet />;
}

export const Route = createRootRoute({
  component: RootComponent,
});
