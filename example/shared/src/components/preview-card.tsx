import { type ReactNode } from "react";

import styles from "./preview-card.module.css";

export function PreviewCard({ children }: { children: ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
