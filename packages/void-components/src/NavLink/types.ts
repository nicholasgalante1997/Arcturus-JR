import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether the link is currently active */
  active?: boolean;
  /** Visual indicator style when active */
  activeIndicator?: "underline" | "background" | "border" | "none";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Icon to display before text */
  icon?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
}
