import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { NavLinkProps } from "./types";

function NavLinkView(
  {
    active = false,
    activeIndicator = "underline",
    size = "md",
    icon,
    disabled = false,
    className,
    children,
    href,
    ...props
  }: NavLinkProps,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  return (
    <a
      ref={ref}
      href={disabled ? undefined : href}
      className={clsx(
        "void-nav-link",
        `void-nav-link--${size}`,
        `void-nav-link--indicator-${activeIndicator}`,
        active && "void-nav-link--active",
        disabled && "void-nav-link--disabled",
        className
      )}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {icon && <span className="void-nav-link__icon">{icon}</span>}
      <span className="void-nav-link__text">{children}</span>
    </a>
  );
}

export default pipeline(memo)(forwardRef(NavLinkView));
