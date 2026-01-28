import type { HTMLAttributes, ElementType } from "react";

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12 | "auto";
export type GridSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface GridProps extends Omit<HTMLAttributes<HTMLElement>, 'ref'> {
  /** Number of columns */
  cols?: GridCols;
  /** Columns at sm breakpoint */
  colsSm?: GridCols;
  /** Columns at md breakpoint */
  colsMd?: GridCols;
  /** Columns at lg breakpoint */
  colsLg?: GridCols;
  /** Gap between grid items */
  spacing?: GridSpacing;
  /** Render as a different element */
  as?: ElementType;
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Column span */
  span?: number;
  /** Column span at sm breakpoint */
  spanSm?: number;
  /** Column span at md breakpoint */
  spanMd?: number;
  /** Column span at lg breakpoint */
  spanLg?: number;
}
