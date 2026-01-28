import type { HTMLAttributes } from "react";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "solid" | "dashed" | "dotted";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Orientation of the divider */
  orientation?: DividerOrientation;
  /** Visual style */
  variant?: DividerVariant;
  /** Spacing around the divider */
  spacing?: "none" | "sm" | "md" | "lg";
}
