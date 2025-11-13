import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import MenuItem from "./MenuItem";
import type { MenuProps } from "./types";

function MenuView(
  {
    items,
    orientation = "vertical",
    size = "md",
    onItemClick,
    className,
    ...props
  }: MenuProps,
  ref: ForwardedRef<HTMLElement>
) {
  return (
    <nav
      ref={ref}
      className={clsx(
        "void-menu",
        `void-menu--${orientation}`,
        `void-menu--${size}`,
        className
      )}
      {...props}
    >
      <ul className="void-menu__list" role="menu">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            size={size}
            onClick={onItemClick}
          />
        ))}
      </ul>
    </nav>
  );
}

export default pipeline(memo)(forwardRef(MenuView));
