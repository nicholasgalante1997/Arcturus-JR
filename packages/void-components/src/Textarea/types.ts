import type { TextareaHTMLAttributes } from "react";

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaVariant = "default" | "error" | "success";
export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Visual size of the textarea */
  size?: TextareaSize;
  /** Visual variant/state */
  variant?: TextareaVariant;
  /** Label text above textarea */
  label?: string;
  /** Helper text below textarea */
  helperText?: string;
  /** Error message (sets variant to error) */
  error?: string;
  /** Full width of container */
  fullWidth?: boolean;
  /** Resize behavior */
  resize?: TextareaResize;
}
