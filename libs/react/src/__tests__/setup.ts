import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

// Mock pointer capture APIs for Sonner toast swipe interactions
if (typeof HTMLElement !== "undefined") {
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
  HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
}

const originalError = console.error;

/**
 * Setup globals for vitest
 */
global.console = {
  ...console,
  error: (...args: unknown[]) => {
    // Disable SSR warnings for useLayoutEffect in styled-components
    if (
      typeof args[0] === "string" &&
      args[0].includes("useLayoutEffect does nothing on the server")
    ) {
      return;
    }
    originalError(...args);
  },
  warn: vi.fn(),
};
