import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { CheckboxProps } from "./types";

function CheckboxView(
  {
    size = "md",
    label,
    helperText,
    error,
    className,
    id,
    disabled,
    ...props
  }: CheckboxProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const checkboxId =
    id || `void-checkbox-${Math.random().toString(36).slice(2, 9)}`;
  const effectiveHelperText = error || helperText;

  return (
    <div className={clsx("void-checkbox-wrapper", className)}>
      <label
        htmlFor={checkboxId}
        className={clsx(
          "void-checkbox__label",
          disabled && "void-checkbox__label--disabled"
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          disabled={disabled}
          className={clsx(
            "void-checkbox",
            `void-checkbox--${size}`,
            error && "void-checkbox--error"
          )}
          aria-invalid={!!error}
          aria-describedby={
            effectiveHelperText ? `${checkboxId}-helper` : undefined
          }
          {...props}
        />
        {label && <span className="void-checkbox__text">{label}</span>}
      </label>
      {effectiveHelperText && (
        <span
          id={`${checkboxId}-helper`}
          className={clsx(
            "void-checkbox__helper",
            error && "void-checkbox__helper--error"
          )}
        >
          {effectiveHelperText}
        </span>
      )}
    </div>
  );
}

export default pipeline(memo)(forwardRef(CheckboxView));
