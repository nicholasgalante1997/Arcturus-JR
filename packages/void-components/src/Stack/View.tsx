import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { StackProps } from "./types";

function StackView(
  {
    direction = "vertical",
    align = "stretch",
    justify = "start",
    spacing = "md",
    wrap = false,
    as: Component = "div",
    className,
    children,
    ...props
  }: StackProps,
  ref: ForwardedRef<HTMLElement>
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        "void-stack",
        `void-stack--${direction}`,
        `void-stack--align-${align}`,
        `void-stack--justify-${justify}`,
        `void-stack--spacing-${spacing}`,
        wrap && "void-stack--wrap",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default pipeline(memo)(forwardRef(StackView));
