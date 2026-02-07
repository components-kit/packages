import { type ReactNode } from "react";

export interface ComponentDemo {
  /** Raw source code string for the code block */
  code: string;
  /** Unique slug used as URL hash and sidebar key */
  id: string;
  /** Display name shown in sidebar and heading */
  name: string;
  /** Live rendered preview */
  preview: ReactNode;
}
