import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { LinkProps } from "./types";

function LinkView(
  {
    variant = "default",
    underline = "hover",
    external = false,
    disabled = false,
    className,
    children,
    href,
    ...props
  }: LinkProps,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const externalProps = external
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <a
      ref={ref}
      href={disabled ? undefined : href}
      className={clsx(
        "void-link",
        `void-link--${variant}`,
        `void-link--underline-${underline}`,
        disabled && "void-link--disabled",
        className
      )}
      aria-disabled={disabled}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <svg
          className="void-link__external-icon"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 3h5.5v5.5M9 3L3 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}

export default pipeline(memo)(forwardRef(LinkView));
