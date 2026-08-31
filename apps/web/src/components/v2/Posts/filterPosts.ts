import type { Post } from '@/types/Post';

export function filterPosts(posts: readonly Post[], query: string): Post[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [...posts];

  return posts.filter((post) => {
    const searchableValues = [
      post.title,
      post.excerpt,
      post.category,
      ...post.tags,
      ...post.searchTerms
    ];

    return searchableValues.some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery)
    );
  });
}
