import type { ReactNode } from "react";

export interface Feature {
  className?: string;
  colSpan?: 2;
  description: ReactNode;
  title: string;
  visual?: ReactNode;
}

export interface GitHubRelease {
  body: string;
  html_url: string;
  published_at: string;
  tag_name: string;
}
