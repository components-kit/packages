"use client";

import { useEffect, useState } from "react";

import { componentDemos } from "../registry";
import { CodeBlock } from "./code-block";
import { PreviewCard } from "./preview-card";
import styles from "./showcase-layout.module.css";
import { Sidebar } from "./sidebar";

export function ShowcaseLayout() {
  const [activeId, setActiveId] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (hash && componentDemos.some((d) => d.id === hash)) {
        return hash;
      }
    }
    return componentDemos[0].id;
  });

  useEffect(() => {
    window.location.hash = activeId;
  }, [activeId]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && componentDemos.some((d) => d.id === hash)) {
        setActiveId(hash);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const activeDemo = componentDemos.find((d) => d.id === activeId)!;

  return (
    <div className={styles.layout}>
      <Sidebar
        activeId={activeId}
        demos={componentDemos}
        onSelect={setActiveId}
      />
      <main className={styles.content}>
        <h1 className={styles.heading}>{activeDemo.name}</h1>
        <PreviewCard>{activeDemo.preview}</PreviewCard>
        <CodeBlock code={activeDemo.code} />
      </main>
    </div>
  );
}
