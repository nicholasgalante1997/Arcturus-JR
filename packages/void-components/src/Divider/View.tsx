import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { DividerProps } from "./types";

function DividerView(
  {
    orientation = "horizontal",
    variant = "solid",
    spacing = "md",
    className,
    ...props
  }: DividerProps,
  ref: ForwardedRef<HTMLHRElement>
) {
  return (
    <hr
      ref={ref}
      className={clsx(
        "void-divider",
        `void-divider--${orientation}`,
        `void-divider--${variant}`,
        `void-divider--spacing-${spacing}`,
        className
      )}
      aria-orientation={orientation}
      {...props}
    />
  );
}

export default pipeline(memo)(forwardRef(DividerView));
