import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFloating } from "./use-floating";

describe("useFloating", () => {
  it("should return referenceProps, floatingProps, and context", () => {
    const { result } = renderHook(() =>
      useFloating({
        isOpen: true,
      }),
    );

    expect(result.current).toHaveProperty("referenceProps");
    expect(result.current).toHaveProperty("floatingProps");
    expect(result.current).toHaveProperty("context");
  });

  it("should return refs in referenceProps and floatingProps", () => {
    const { result } = renderHook(() =>
      useFloating({
        isOpen: true,
      }),
    );

    expect(result.current.referenceProps).toHaveProperty("ref");
    expect(result.current.floatingProps).toHaveProperty("ref");
    expect(result.current.floatingProps).toHaveProperty("style");
  });

  it("should accept custom configuration", () => {
    const { result } = renderHook(() =>
      useFloating({
        isOpen: true,
        offsetDistance: 16,
        placement: "top-start",
        strategy: "fixed",
        viewportPadding: 12,
      }),
    );

    expect(result.current).toHaveProperty("referenceProps");
    expect(result.current).toHaveProperty("floatingProps");
  });

  it("should work when isOpen is false", () => {
    const { result } = renderHook(() =>
      useFloating({
        isOpen: false,
      }),
    );

    expect(result.current).toHaveProperty("referenceProps");
    expect(result.current).toHaveProperty("floatingProps");
    expect(result.current).toHaveProperty("context");
  });
});
