import type { HTMLAttributes, ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Separator between items */
  separator?: ReactNode;
  /** Max items to show (uses ellipsis for overflow) */
  maxItems?: number;
}
