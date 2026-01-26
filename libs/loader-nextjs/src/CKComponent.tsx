"use client";

import { useEffect, useRef, useState } from "react";

import type { CKComponentProps } from "./types";

interface ComponentModule {
  default: React.ComponentType<Record<string, unknown>>;
}

/**
 * Client component that hydrates SSR-rendered CK components.
 * Uses native import() with import maps - requires CKProvider and import map in layout.
 */
export function CKComponent({ host, renderData }: CKComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [Component, setComponent] = useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);

  useEffect(() => {
    const cdnUrl = `${host}${renderData.cdnUrl}`;

    import(/* webpackIgnore: true */ cdnUrl)
      .then((mod: ComponentModule) => {
        setComponent(() => mod.default);
      })
      .catch(console.error);
  }, [host, renderData.cdnUrl]);

  // Once component is loaded, render it with props (replacing SSR HTML)
  if (Component) {
    return (
      <div data-ck-component={renderData.name}>
        <Component {...renderData.props} />
      </div>
    );
  }

  // SSR HTML displayed until component loads
  return (
    <div
      dangerouslySetInnerHTML={{ __html: renderData.html }}
      data-ck-component={renderData.name}
      ref={containerRef}
    />
  );
}
