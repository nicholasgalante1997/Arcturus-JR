import type { AnchorHTMLAttributes } from "react";

export type LinkVariant = "default" | "muted" | "accent" | "nav";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Visual variant */
  variant?: LinkVariant;
  /** Show underline on hover only */
  underline?: "always" | "hover" | "none";
  /** External link (adds rel and target attributes) */
  external?: boolean;
  /** Disabled state */
  disabled?: boolean;
}
