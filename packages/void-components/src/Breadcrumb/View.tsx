import { forwardRef, memo, type ForwardedRef } from "react";
import clsx from "clsx";

import { pipeline } from "../utils/pipeline";
import type { BreadcrumbProps } from "./types";

const DefaultSeparator = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function BreadcrumbView(
  {
    items,
    separator = <DefaultSeparator />,
    maxItems,
    className,
    ...props
  }: BreadcrumbProps,
  ref: ForwardedRef<HTMLElement>
) {
  let displayItems = items;

  // Handle overflow with ellipsis
  if (maxItems && items.length > maxItems && items[0]) {
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [
      firstItem,
      { label: "...", href: undefined, active: false },
      ...lastItems,
    ];
  }

  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={clsx("void-breadcrumb", className)}
      {...props}
    >
      <ol className="void-breadcrumb__list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === "...";

          return (
            <li key={index} className="void-breadcrumb__item">
              {isEllipsis ? (
                <span className="void-breadcrumb__ellipsis">{item.label}</span>
              ) : item.href && !item.active ? (
                <a href={item.href} className="void-breadcrumb__link">
                  {item.label}
                </a>
              ) : (
                <span
                  className={clsx(
                    "void-breadcrumb__text",
                    item.active && "void-breadcrumb__text--active"
                  )}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="void-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default pipeline(memo)(forwardRef(BreadcrumbView));
