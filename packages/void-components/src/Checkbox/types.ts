import type { InputHTMLAttributes } from "react";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Visual size of the checkbox */
  size?: CheckboxSize;
  /** Label text next to checkbox */
  label?: string;
  /** Helper text below checkbox */
  helperText?: string;
  /** Error message */
  error?: string;
}
