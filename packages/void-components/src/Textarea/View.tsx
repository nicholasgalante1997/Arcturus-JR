import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { TextareaProps } from "./types";

function TextareaView(
  {
    size = "md",
    variant = "default",
    label,
    helperText,
    error,
    fullWidth = false,
    resize = "vertical",
    className,
    id,
    disabled,
    rows = 4,
    ...props
  }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  const textareaId =
    id || `void-textarea-${Math.random().toString(36).slice(2, 9)}`;
  const effectiveVariant = error ? "error" : variant;
  const effectiveHelperText = error || helperText;

  return (
    <div
      className={clsx(
        "void-textarea-wrapper",
        fullWidth && "void-textarea-wrapper--full-width",
        className
      )}
    >
      {label && (
        <label htmlFor={textareaId} className="void-textarea__label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={clsx(
          "void-textarea",
          `void-textarea--${size}`,
          `void-textarea--${effectiveVariant}`,
          `void-textarea--resize-${resize}`,
          disabled && "void-textarea--disabled"
        )}
        aria-invalid={effectiveVariant === "error"}
        aria-describedby={
          effectiveHelperText ? `${textareaId}-helper` : undefined
        }
        {...props}
      />
      {effectiveHelperText && (
        <span
          id={`${textareaId}-helper`}
          className={clsx(
            "void-textarea__helper",
            effectiveVariant === "error" && "void-textarea__helper--error"
          )}
        >
          {effectiveHelperText}
        </span>
      )}
    </div>
  );
}

export default pipeline(memo)(forwardRef(TextareaView));
