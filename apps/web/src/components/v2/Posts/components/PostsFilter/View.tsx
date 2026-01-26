import { Input } from "@arcjr/void-components";
import clsx from "clsx";
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";

import type { PostsFilterProps } from "../../types";

function PostsFilterView({
  selectedTag,
  onTagSelect,
  availableTags,
  searchQuery,
  onSearchChange,
}: PostsFilterProps) {
  return (
    <div className="v2-posts-filter">
      {/* Search */}
      <div className="v2-posts-filter__search">
        <Input
          type="search"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          leftElement={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M7 12a5 5 0 100-10 5 5 0 000 10zM14 14l-3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>

      {/* Tags */}
      <div className="v2-posts-filter__tags">
        <button
          type="button"
          className={clsx(
            "v2-posts-filter__tag",
            !selectedTag && "v2-posts-filter__tag--active"
          )}
          onClick={() => onTagSelect(null)}
        >
          All Posts
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={clsx(
              "v2-posts-filter__tag",
              selectedTag === tag && "v2-posts-filter__tag--active"
            )}
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default pipeline(memo)(PostsFilterView);
