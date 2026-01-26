import { memo } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { MenuItemProps } from "./types";

function MenuItemView({ item, size = "md", onClick }: MenuItemProps) {
  if (item.divider) {
    return <li className="void-menu__divider" role="separator" />;
  }

  const handleClick = () => {
    if (!item.disabled && onClick) {
      onClick(item);
    }
  };

  const content = (
    <>
      {item.icon && <span className="void-menu-item__icon">{item.icon}</span>}
      <span className="void-menu-item__label">{item.label}</span>
    </>
  );

  const itemClasses = clsx(
    "void-menu-item",
    `void-menu-item--${size}`,
    item.disabled && "void-menu-item--disabled"
  );

  if (item.href && !item.disabled) {
    return (
      <li role="none">
        <a
          href={item.href}
          className={itemClasses}
          role="menuitem"
          onClick={handleClick}
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li role="none">
      <button
        type="button"
        className={itemClasses}
        role="menuitem"
        disabled={item.disabled}
        onClick={handleClick}
      >
        {content}
      </button>
    </li>
  );
}

export default pipeline(memo)(MenuItemView);
