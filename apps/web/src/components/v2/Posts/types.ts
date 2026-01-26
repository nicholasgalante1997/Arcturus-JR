import type { UseQueryResult } from "@tanstack/react-query";
import type { Post } from "@/types/Post";

export interface V2PostsPageViewProps {
  queries: [PostsQuery];
}

export type PostsQuery = UseQueryResult<Post[], Error>;

export interface PostsGridProps {
  posts: Post[];
}

export interface PostsFilterProps {
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  availableTags: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
