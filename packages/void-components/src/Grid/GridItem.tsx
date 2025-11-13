import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { GridItemProps } from "./types";

function GridItemView(
  { span, spanSm, spanMd, spanLg, className, children, ...props }: GridItemProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={clsx(
        "void-grid-item",
        span && `void-grid-item--span-${span}`,
        spanSm && `void-grid-item--sm-span-${spanSm}`,
        spanMd && `void-grid-item--md-span-${spanMd}`,
        spanLg && `void-grid-item--lg-span-${spanLg}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const GridItem = pipeline(memo)(forwardRef(GridItemView));

export default GridItem;
