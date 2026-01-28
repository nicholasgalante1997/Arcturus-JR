import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import PostsService from '@/services/Posts';
import { isPost, isPostWithMarkdown, type Post, type PostWithMarkdown } from '@/types/Post';
import { getJavascriptEnvironment } from '@/utils/env';

export async function getPosts(): Promise<Post[]> {
  return new PostsService().fetchPosts();
}

export async function getPost(postId: string): Promise<PostWithMarkdown> {
  return new PostsService().fetchPost(postId);
}

export async function getRelatedPosts(postId: string): Promise<Post[]> {
  const postsService = new PostsService();
  const [currentPost, allPosts] = await Promise.all([
    postsService.fetchPost(postId),
    postsService.fetchPosts()
  ]);

  // Find related posts based on matching tags
  const currentTags = new Set(currentPost.tags || []);

  const relatedPosts = allPosts
    .filter((post) => {
      // Exclude current post
      if (post.id === postId) return false;
      // Check for tag overlap
      return post.tags?.some((tag) => currentTags.has(tag));
    })
    .sort((a, b) => {
      // Sort by number of matching tags (descending)
      const aMatches = a.tags?.filter((tag) => currentTags.has(tag)).length || 0;
      const bMatches = b.tags?.filter((tag) => currentTags.has(tag)).length || 0;
      return bMatches - aMatches;
    })
    .slice(0, 3); // Return top 3 related posts

  return relatedPosts;
}

export function useGetPosts(): UseQueryResult<Post[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['posts'];

  if (getJavascriptEnvironment() === 'server') {
    const data: Array<Post> = queryClient.getQueryData(queryKey) as Array<Post>;

    if (!Array.isArray(data)) {
      const error = `[useGetPosts:::server] data from query prefetch ${queryKey} is not an array.`;
      console.error(error, data);
      throw new Error(error);
    }

    if (!data.every(isPost)) {
      const error = `[useGetPosts:::server] data from query prefetch ${queryKey} is not an array of Post(s).`;
      console.error(error, data);
      throw new Error(error);
    }

    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post[], Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getPosts()
  });
}

export function useGetPost(postId: string): UseQueryResult<PostWithMarkdown, Error> {
  const queryClient = useQueryClient();
  const queryKey = ['post', postId];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as PostWithMarkdown;

    if (!isPostWithMarkdown(data)) {
      const error = `[useGetPost:::server] data from query prefetch ${queryKey} is not a valid PostWithMarkdown.`;
      console.error(error, data);
      throw new Error(error);
    }

    return { data, promise: Promise.resolve(data) } as UseQueryResult<PostWithMarkdown, Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getPost(postId)
  });
}

export function useGetRelatedPosts(postId: string): UseQueryResult<Post[], Error> {
  const queryClient = useQueryClient();
  const queryKey = ['relatedPosts', postId];

  if (getJavascriptEnvironment() === 'server') {
    const data = queryClient.getQueryData(queryKey) as Post[];

    if (!Array.isArray(data)) {
      const error = `[useGetRelatedPosts:::server] data from query prefetch ${queryKey} is not an array.`;
      console.error(error, data);
      throw new Error(error);
    }

    if (!data.every(isPost)) {
      const error = `[useGetRelatedPosts:::server] data from query prefetch ${queryKey} is not an array of Post(s).`;
      console.error(error, data);
      throw new Error(error);
    }

    return { data, promise: Promise.resolve(data) } as UseQueryResult<Post[], Error>;
  }

  return useQuery({
    queryKey,
    queryFn: () => getRelatedPosts(postId)
  });
}
