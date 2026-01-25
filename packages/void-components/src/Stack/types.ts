import type { HTMLAttributes, ElementType } from "react";

export type StackDirection = "vertical" | "horizontal";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
export type StackSpacing =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export interface StackProps extends Omit<HTMLAttributes<HTMLElement>, 'ref'> {
  /** Direction of the stack */
  direction?: StackDirection;
  /** Alignment of items on cross axis */
  align?: StackAlign;
  /** Justification of items on main axis */
  justify?: StackJustify;
  /** Gap between items */
  spacing?: StackSpacing;
  /** Wrap items to next line */
  wrap?: boolean;
  /** Render as a different element */
  as?: ElementType;
}
