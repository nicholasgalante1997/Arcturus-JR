import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { InputProps } from "./types";

function InputView(
  {
    size = "md",
    variant = "default",
    label,
    helperText,
    error,
    fullWidth = false,
    leftElement,
    rightElement,
    className,
    id,
    disabled,
    ...props
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const inputId = id || `void-input-${Math.random().toString(36).slice(2, 9)}`;
  const effectiveVariant = error ? "error" : variant;
  const effectiveHelperText = error || helperText;

  return (
    <div
      className={clsx(
        "void-input-wrapper",
        fullWidth && "void-input-wrapper--full-width",
        className
      )}
    >
      {label && (
        <label htmlFor={inputId} className="void-input__label">
          {label}
        </label>
      )}
      <div className="void-input__container">
        {leftElement && (
          <span className="void-input__left-element">{leftElement}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={clsx(
            "void-input",
            `void-input--${size}`,
            `void-input--${effectiveVariant}`,
            leftElement && "void-input--has-left",
            rightElement && "void-input--has-right",
            disabled && "void-input--disabled"
          )}
          aria-invalid={effectiveVariant === "error"}
          aria-describedby={
            effectiveHelperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {rightElement && (
          <span className="void-input__right-element">{rightElement}</span>
        )}
      </div>
      {effectiveHelperText && (
        <span
          id={`${inputId}-helper`}
          className={clsx(
            "void-input__helper",
            effectiveVariant === "error" && "void-input__helper--error"
          )}
        >
          {effectiveHelperText}
        </span>
      )}
    </div>
  );
}

export default pipeline(memo)(forwardRef(InputView));
