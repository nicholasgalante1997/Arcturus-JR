import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { GridProps } from "./types";

function GridView(
  {
    cols = 1,
    colsSm,
    colsMd,
    colsLg,
    spacing = "md",
    as: Component = "div",
    className,
    children,
    ...props
  }: GridProps,
  ref: ForwardedRef<HTMLElement>
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        "void-grid",
        `void-grid--cols-${cols}`,
        colsSm && `void-grid--sm-cols-${colsSm}`,
        colsMd && `void-grid--md-cols-${colsMd}`,
        colsLg && `void-grid--lg-cols-${colsLg}`,
        `void-grid--spacing-${spacing}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default pipeline(memo)(forwardRef(GridView));
