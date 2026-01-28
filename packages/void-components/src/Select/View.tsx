import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { SelectProps } from "./types";

function SelectView(
  {
    size = "md",
    variant = "default",
    label,
    helperText,
    error,
    fullWidth = false,
    options,
    placeholder,
    className,
    id,
    disabled,
    ...props
  }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>
) {
  const selectId =
    id || `void-select-${Math.random().toString(36).slice(2, 9)}`;
  const effectiveVariant = error ? "error" : variant;
  const effectiveHelperText = error || helperText;

  return (
    <div
      className={clsx(
        "void-select-wrapper",
        fullWidth && "void-select-wrapper--full-width",
        className
      )}
    >
      {label && (
        <label htmlFor={selectId} className="void-select__label">
          {label}
        </label>
      )}
      <div className="void-select__container">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={clsx(
            "void-select",
            `void-select--${size}`,
            `void-select--${effectiveVariant}`,
            disabled && "void-select--disabled"
          )}
          aria-invalid={effectiveVariant === "error"}
          aria-describedby={
            effectiveHelperText ? `${selectId}-helper` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className="void-select__icon" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {effectiveHelperText && (
        <span
          id={`${selectId}-helper`}
          className={clsx(
            "void-select__helper",
            effectiveVariant === "error" && "void-select__helper--error"
          )}
        >
          {effectiveHelperText}
        </span>
      )}
    </div>
  );
}

export default pipeline(memo)(forwardRef(SelectView));
