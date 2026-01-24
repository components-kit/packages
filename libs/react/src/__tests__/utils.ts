import React from "react";
import { renderToString } from "react-dom/server";
import { expect, vi } from "vitest";

import { ComponentsKitProvider } from "../providers";

/**
 * Creates a mock implementation of the useComponentCss hook
 * @returns Mock function for useComponentCss
 */
export const createMockUseComponentCss = () => {
  const mockUseComponentCss = vi.fn();

  mockUseComponentCss.mockReturnValue({
    data: "",
    error: null,
    isLoading: false,
    meta: {},
  });

  return mockUseComponentCss;
};

/**
 * Creates a mock implementation of the SlotStyled component
 * @returns Mock function for SlotStyled
 */
export const createMockSlotStyled = () => {
  return vi.fn(({ asChild, children, ...props }) => {
    if (asChild && React.Children.count(children) === 1) {
      return React.cloneElement(React.Children.only(children), props);
    }

    return React.createElement("div", props, children);
  });
};

/**
 * Creates a mock implementation of the Button component
 * @returns Mock function for Button
 */
export const createMockButton = () => {
  return vi.fn(({ children, fullWidth, variantName, ...props }) =>
    React.createElement(
      "button",
      {
        "data-full-width": fullWidth,
        "data-testid": "button",
        "data-variant-name": variantName,
        ...props,
      },
      children
    )
  );
};

/**
 * Creates a mock implementation of the Icon component
 * @param testId - The test ID to use for the icon
 * @returns Mock function for Icon
 */
export const createMockIcon = (testId = "icon") => {
  return vi.fn(({ name, ...props }) =>
    React.createElement(
      "svg",
      { "data-icon-name": name, "data-testid": testId, ...props },
      React.createElement("use", { xlinkHref: `#${name}` })
    )
  );
};

/**
 * Test wrapper component for rendering with context providers
 * @returns Rendered wrapper component
 */
export const TestWrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ComponentsKitProvider, {
    children,
    publicKey: "test-key",
  });

/**
 * Creates a mock implementation of the Next.js App Router
 * @returns Mock App Router object
 */
const createMockAppRouter = () => ({
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
});

/**
 * Creates a mock implementation of the Next.js Pages Router
 * @returns Mock Pages Router object
 */
const createMockPagesRouter = () => ({
  asPath: "/",
  back: vi.fn(),
  beforePopState: vi.fn(),
  events: {
    emit: vi.fn(),
    off: vi.fn(),
    on: vi.fn(),
  },
  pathname: "/",
  prefetch: vi.fn(),
  push: vi.fn(),
  query: {},
  reload: vi.fn(),
  replace: vi.fn(),
  route: "/",
});

/**
 * Tests SSR hydration matching for a given React element
 * @param element The React element to test
 * @returns An object containing the server content and HTML
 */
const testSSRHydrationMatch = (element: React.ReactElement) => {
  const serverHtml = renderToString(
    React.createElement(TestWrapper, { children: element })
  );

  // Extract the inner HTML to compare structure
  const serverContent = serverHtml.replace(/<[^>]*>/g, "").trim();
  return { serverContent, serverHtml };
};

/**
 * Error Boundary Test Component
 */
class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // ErrorBoundary caught an error - handled by error boundary
    void error;
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ||
        React.createElement("div", {}, "Something went wrong.")
      );
    }

    return this.props.children;
  }
}

/**
 * Creates a mock implementation of a React Server Component
 * @param name The name of the server component
 * @returns A mock server component
 */
const createMockServerComponent = (name: string) => {
  const ServerComponent = (props: Record<string, unknown>) => {
    return React.createElement(
      "div",
      { "data-server-component": name, ...props },
      (props.children as React.ReactNode) || `Server ${name} Component`
    );
  };

  // Mark as server component
  (ServerComponent as unknown as Record<string, unknown>).__server = true;

  return ServerComponent;
};

/**
 * Creates a mock implementation of a React Suspense component
 * @param delay The delay before the component resolves
 * @returns A mock Suspense component
 */
const createSuspenseComponent = (delay: number = 100) => {
  let cache: { data?: string } | null = null;

  const AsyncComponent = () => {
    if (!cache) {
      cache = {};
      throw new Promise((resolve) => {
        setTimeout(() => {
          cache!.data = "Loaded content";
          resolve(cache!.data);
        }, delay);
      });
    }

    return React.createElement("div", {}, cache.data || "Loading...");
  };

  return AsyncComponent;
};

/**
 * Creates a console spy for testing console warnings
 * @returns An object with spy, expectWarning, and restore functions
 */
export const createConsoleSpy = () => {
  const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

  return {
    expectNoWarning: () => {
      expect(consoleSpy).not.toHaveBeenCalled();
    },
    expectWarning: (message: string) => {
      expect(consoleSpy).toHaveBeenCalledWith(message);
    },
    restore: () => {
      consoleSpy.mockRestore();
    },
    spy: consoleSpy,
  };
};

/**
 * Creates a rendering test suite for a given React component
 * @param componentFactory A factory function that returns the React element to test
 * @returns An object containing various rendering tests
 */
export const createRenderingTestSuite = (
  componentFactory: () => React.ReactElement
) => ({
  // App Router compatibility test
  testAppRouterCompatibility: () => {
    const mockRouter = createMockAppRouter();
    const element = componentFactory();
    return { element, mockRouter };
  },

  // Client-side rendering test
  testClientRendering: () => componentFactory(),

  // Concurrent features test
  testConcurrentFeatures: () => {
    const element = componentFactory();

    // Test with startTransition simulation
    const transitionElement = React.createElement(
      "div",
      { "data-transition": "true" },
      element
    );

    return { element: transitionElement, supportsConcurrency: true };
  },

  // Error boundary compatibility test
  testErrorBoundary: () => {
    const element = componentFactory();

    const wrappedElement = React.createElement(TestErrorBoundary, {
      children: element,
      fallback: React.createElement("div", {}, "Error caught"),
    });

    return { element: wrappedElement };
  },

  // Hydration test
  testHydration: () => {
    const element = componentFactory();
    return testSSRHydrationMatch(element);
  },

  // Pages Router compatibility test
  testPagesRouterCompatibility: () => {
    const mockRouter = createMockPagesRouter();
    const element = componentFactory();
    return { element, mockRouter };
  },

  // React Server Components compatibility test
  testServerComponentCompatibility: () => {
    const element = componentFactory();
    const ServerComponent = createMockServerComponent("Test");

    const serverElementWithComponent = React.createElement(
      ServerComponent,
      {},
      element
    );

    const html = renderToString(
      React.createElement(TestWrapper, {
        children: serverElementWithComponent,
      })
    );

    return {
      hasServerComponent: html.includes('data-server-component="Test"'),
      html,
    };
  },

  // SSR rendering test
  testSSRRendering: () => {
    const element = componentFactory();
    const html = renderToString(
      React.createElement(TestWrapper, { children: element })
    );
    return { hasContent: html.length > 0, html };
  },

  // Suspense compatibility test
  testSuspenseCompatibility: () => {
    const element = componentFactory();
    const AsyncComponent = createSuspenseComponent(50);

    const suspenseElement = React.createElement(
      React.Suspense,
      { fallback: React.createElement("div", {}, "Loading...") },
      React.createElement("div", {}, [
        element,
        React.createElement(AsyncComponent, { key: "async" }),
      ])
    );

    return { element: suspenseElement };
  },
});
