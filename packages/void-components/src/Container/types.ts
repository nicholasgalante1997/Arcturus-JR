import type { HTMLAttributes } from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum width of the container */
  size?: ContainerSize;
  /** Center the container horizontally */
  centered?: boolean;
  /** Add horizontal padding */
  padded?: boolean;
  /** Render as a different element */
  as?: "div" | "section" | "article" | "main" | "aside";
}
