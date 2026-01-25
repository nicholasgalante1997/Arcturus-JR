import type { InputHTMLAttributes } from "react";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "error" | "success";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visual size of the input */
  size?: InputSize;
  /** Visual variant/state */
  variant?: InputVariant;
  /** Label text above input */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message (sets variant to error) */
  error?: string;
  /** Full width of container */
  fullWidth?: boolean;
  /** Left icon/element */
  leftElement?: React.ReactNode;
  /** Right icon/element */
  rightElement?: React.ReactNode;
}
