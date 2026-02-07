"use client";

import { type ComponentDemo } from "../types";
import styles from "./sidebar.module.css";

interface SidebarProps {
  activeId: string;
  demos: ComponentDemo[];
  onSelect: (id: string) => void;
}

export function Sidebar({ activeId, demos, onSelect }: SidebarProps) {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>Components</span>
      </div>
      <ul className={styles.list}>
        {demos.map((demo) => (
          <li key={demo.id}>
            <button
              className={`${styles.item} ${demo.id === activeId ? styles.active : ""}`}
              onClick={() => onSelect(demo.id)}
            >
              {demo.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
