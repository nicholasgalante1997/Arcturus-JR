import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { ContainerProps } from "./types";

function ContainerView(
  {
    size = "xl",
    centered = true,
    padded = true,
    as: Component = "div",
    className,
    children,
    ...props
  }: ContainerProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        "void-container",
        `void-container--${size}`,
        centered && "void-container--centered",
        padded && "void-container--padded",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default pipeline(memo)(forwardRef(ContainerView));
