import { act, renderHook } from "@testing-library/react";
import { createRef, type RefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useExitTransition } from "./use-exit-transition";

/**
 * Helper to create a mock element with addEventListener/removeEventListener
 * and the ability to fire events for testing nodeRef-based detection.
 */
function createMockNode() {
  const listeners: Record<string, Set<EventListener>> = {};
  const node = {
    addEventListener: vi.fn((type: string, handler: EventListener) => {
      if (!listeners[type]) listeners[type] = new Set();
      listeners[type].add(handler);
    }),
    removeEventListener: vi.fn((type: string, handler: EventListener) => {
      listeners[type]?.delete(handler);
    }),
  } as unknown as HTMLElement;

  /**
   * Fire an event on the mock node with an optional custom target.
   * Defaults to the node itself as the event target.
   */
  const fireEvent = (type: string, target?: unknown) => {
    const event = { target: target ?? node, type } as unknown as Event;
    listeners[type]?.forEach((handler) => handler(event));
  };

  return { fireEvent, node };
}

function createNodeRef(node: HTMLElement): RefObject<HTMLElement | null> {
  const ref = createRef<HTMLElement | null>();
  (ref as { current: HTMLElement | null }).current = node;
  return ref;
}

describe("useExitTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: [
        "setTimeout",
        "clearTimeout",
        "requestAnimationFrame",
        "cancelAnimationFrame",
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns isMounted=false and dataState='closed' when initially closed", () => {
    const { result } = renderHook(() =>
      useExitTransition({ isOpen: false }),
    );

    expect(result.current.isMounted).toBe(false);
    expect(result.current.dataState).toBe("closed");
  });

  it("returns isMounted=true and dataState='open' when initially open", () => {
    const { result } = renderHook(() =>
      useExitTransition({ isOpen: true }),
    );

    expect(result.current.isMounted).toBe(true);
    expect(result.current.dataState).toBe("open");
  });

  it("mounts immediately and sets dataState='open' after rAF when isOpen changes to true", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ isOpen }),
      { initialProps: { isOpen: false } },
    );

    rerender({ isOpen: true });

    // isMounted is true immediately, but dataState waits for rAF
    expect(result.current.isMounted).toBe(true);
    expect(result.current.dataState).toBe("closed");

    // After rAF fires, dataState transitions to "open"
    act(() => {
      vi.advanceTimersByTime(16);
    });
    expect(result.current.dataState).toBe("open");
  });

  it("sets dataState='closed' immediately when isOpen changes to false", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ isOpen }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    expect(result.current.dataState).toBe("closed");
    expect(result.current.isMounted).toBe(true);
  });

  it("keeps isMounted=true during the duration window after closing", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ duration: 200, isOpen }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    // Halfway through duration — still mounted
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.isMounted).toBe(true);
    expect(result.current.dataState).toBe("closed");
  });

  it("sets isMounted=false after duration elapses", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ duration: 200, isOpen }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isMounted).toBe(false);
    expect(result.current.dataState).toBe("closed");
  });

  it("uses default duration of 150ms", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ isOpen }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    // Still mounted before 150ms
    act(() => {
      vi.advanceTimersByTime(149);
    });
    expect(result.current.isMounted).toBe(true);

    // Unmounted at 150ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isMounted).toBe(false);
  });

  it("cancels pending close when re-opened quickly", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ duration: 200, isOpen }),
      { initialProps: { isOpen: true } },
    );

    // Close
    rerender({ isOpen: false });
    expect(result.current.dataState).toBe("closed");

    // Partially through exit duration
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Re-open before duration expires
    rerender({ isOpen: true });
    expect(result.current.isMounted).toBe(true);

    // After rAF fires, dataState transitions to "open"
    act(() => {
      vi.advanceTimersByTime(16);
    });
    expect(result.current.dataState).toBe("open");

    // Advance past original duration — should still be mounted
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.isMounted).toBe(true);
    expect(result.current.dataState).toBe("open");
  });

  it("cleans up timer on unmount", () => {
    const { rerender, unmount } = renderHook(
      ({ isOpen }) => useExitTransition({ duration: 200, isOpen }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });
    unmount();

    // Should not throw or cause state update warnings
    act(() => {
      vi.advanceTimersByTime(200);
    });
  });

  it("uses custom duration", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ duration: 500, isOpen }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current.isMounted).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isMounted).toBe(false);
  });

  describe("onExitComplete", () => {
    it("fires after timer-based unmount", () => {
      const onExitComplete = vi.fn();
      const { rerender } = renderHook(
        ({ isOpen }) => useExitTransition({ isOpen, onExitComplete }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });
      expect(onExitComplete).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(onExitComplete).toHaveBeenCalledOnce();
    });

    it("fires after event-based unmount via nodeRef", () => {
      const onExitComplete = vi.fn();
      const { fireEvent, node } = createMockNode();
      const nodeRef = createNodeRef(node);

      const { rerender } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 500, isOpen, nodeRef, onExitComplete }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      // Fire transitionend before timeout
      act(() => {
        fireEvent("transitionend");
      });

      expect(onExitComplete).toHaveBeenCalledOnce();
    });

    it("is called with no arguments", () => {
      const onExitComplete = vi.fn();
      const { rerender } = renderHook(
        ({ isOpen }) => useExitTransition({ isOpen, onExitComplete }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(onExitComplete).toHaveBeenCalledWith();
    });

    it("propagates errors from onExitComplete to the caller", () => {
      const onExitComplete = vi.fn(() => {
        throw new Error("callback error");
      });
      const { rerender } = renderHook(
        ({ isOpen }) => useExitTransition({ isOpen, onExitComplete }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      // The callback throw propagates out of the timer
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(150);
        });
      }).toThrow("callback error");

      // The callback was called exactly once
      expect(onExitComplete).toHaveBeenCalledTimes(1);
    });

    it("does NOT fire when re-opened before exit completes", () => {
      const onExitComplete = vi.fn();
      const { rerender } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 200, isOpen, onExitComplete }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      // Re-open before exit completes
      rerender({ isOpen: true });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(onExitComplete).not.toHaveBeenCalled();
    });

    it("does NOT fire on component unmount during exit", () => {
      const onExitComplete = vi.fn();
      const { rerender, unmount } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 200, isOpen, onExitComplete }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });
      unmount();

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(onExitComplete).not.toHaveBeenCalled();
    });
  });

  describe("nodeRef (event-based detection)", () => {
    it("unmounts on transitionend before timeout", () => {
      const { fireEvent, node } = createMockNode();
      const nodeRef = createNodeRef(node);

      const { rerender, result } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 500, isOpen, nodeRef }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });
      expect(result.current.isMounted).toBe(true);

      // Fire transitionend at 50ms (well before 500ms timeout)
      act(() => {
        vi.advanceTimersByTime(50);
      });
      act(() => {
        fireEvent("transitionend");
      });

      expect(result.current.isMounted).toBe(false);
    });

    it("unmounts on animationend before timeout", () => {
      const { fireEvent, node } = createMockNode();
      const nodeRef = createNodeRef(node);

      const { rerender, result } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 500, isOpen, nodeRef }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      act(() => {
        fireEvent("animationend");
      });

      expect(result.current.isMounted).toBe(false);
    });

    it("falls back to timeout if no event fires", () => {
      const { node } = createMockNode();
      const nodeRef = createNodeRef(node);

      const { rerender, result } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 200, isOpen, nodeRef }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      // No event fired — still mounted before timeout
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(result.current.isMounted).toBe(true);

      // Unmounts at timeout
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.isMounted).toBe(false);
    });

    it("ignores bubbled events from child elements", () => {
      const { fireEvent, node } = createMockNode();
      const nodeRef = createNodeRef(node);
      const childElement = document.createElement("span");

      const { rerender, result } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 500, isOpen, nodeRef }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      // Fire transitionend with a child as the target (simulates bubbling)
      act(() => {
        fireEvent("transitionend", childElement);
      });

      // Should still be mounted — event was from a child
      expect(result.current.isMounted).toBe(true);

      // Falls back to timeout
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current.isMounted).toBe(false);
    });

    it("only unmounts once when multiple transitionend events fire", () => {
      const { fireEvent, node } = createMockNode();
      const nodeRef = createNodeRef(node);
      const onExitComplete = vi.fn();

      const { rerender, result } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 500, isOpen, nodeRef, onExitComplete }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      // Fire transitionend twice (e.g. multiple CSS properties transitioning)
      act(() => {
        fireEvent("transitionend");
      });
      expect(result.current.isMounted).toBe(false);
      expect(onExitComplete).toHaveBeenCalledOnce();

      // Second fire is a no-op due to settled flag
      act(() => {
        fireEvent("transitionend");
      });
      expect(onExitComplete).toHaveBeenCalledOnce();
    });

    it("falls back to timer when nodeRef.current is null at close time", () => {
      const nodeRef = createNodeRef(null as unknown as HTMLElement);
      (nodeRef as { current: HTMLElement | null }).current = null;

      const { rerender, result } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 200, isOpen, nodeRef }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });

      // No crash, still mounted before timer
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(result.current.isMounted).toBe(true);

      // Falls back to timeout
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.isMounted).toBe(false);
    });

    it("cleans up event listeners on unmount", () => {
      const { node } = createMockNode();
      const nodeRef = createNodeRef(node);

      const { rerender, unmount } = renderHook(
        ({ isOpen }) =>
          useExitTransition({ duration: 200, isOpen, nodeRef }),
        { initialProps: { isOpen: true } },
      );

      rerender({ isOpen: false });
      unmount();

      expect(
        (node.removeEventListener as ReturnType<typeof vi.fn>).mock.calls.some(
          ([type]: [string]) => type === "transitionend",
        ),
      ).toBe(true);
      expect(
        (node.removeEventListener as ReturnType<typeof vi.fn>).mock.calls.some(
          ([type]: [string]) => type === "animationend",
        ),
      ).toBe(true);
    });
  });

  it("unmounts immediately when duration is 0", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ duration: 0, isOpen }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.isMounted).toBe(false);
  });

  it("stays mounted for very long durations until timer fires", () => {
    const { rerender, result } = renderHook(
      ({ isOpen }) => useExitTransition({ duration: 5000, isOpen }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(result.current.isMounted).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isMounted).toBe(false);
  });

  describe("animateOnMount", () => {
    it("starts with dataState='closed' when animateOnMount is true and isOpen is true", () => {
      const { result } = renderHook(() =>
        useExitTransition({ animateOnMount: true, isOpen: true }),
      );

      // Before rAF: dataState should be "closed" to allow enter animation
      expect(result.current.isMounted).toBe(true);
      expect(result.current.dataState).toBe("closed");
    });

    it("transitions to dataState='open' after rAF when animateOnMount is true", () => {
      const { result } = renderHook(() =>
        useExitTransition({ animateOnMount: true, isOpen: true }),
      );

      act(() => {
        vi.advanceTimersByTime(16);
      });

      expect(result.current.isMounted).toBe(true);
      expect(result.current.dataState).toBe("open");
    });

    it("defaults to dataState='open' when animateOnMount is false (default)", () => {
      const { result } = renderHook(() =>
        useExitTransition({ isOpen: true }),
      );

      expect(result.current.dataState).toBe("open");
    });

    it("has no effect when isOpen starts as false", () => {
      const { result } = renderHook(() =>
        useExitTransition({ animateOnMount: true, isOpen: false }),
      );

      expect(result.current.isMounted).toBe(false);
      expect(result.current.dataState).toBe("closed");
    });
  });
});
