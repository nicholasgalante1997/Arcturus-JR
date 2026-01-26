import type { SelectHTMLAttributes } from "react";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant = "default" | "error" | "success";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Visual size of the select */
  size?: SelectSize;
  /** Visual variant/state */
  variant?: SelectVariant;
  /** Label text above select */
  label?: string;
  /** Helper text below select */
  helperText?: string;
  /** Error message (sets variant to error) */
  error?: string;
  /** Full width of container */
  fullWidth?: boolean;
  /** Array of options to display */
  options: SelectOption[];
  /** Placeholder text for empty selection */
  placeholder?: string;
}
