import CacheWithExpiry from '@/models/CacheWithExpiry';
import Markdown from '@/services/Markdown';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

import type { IPostsService } from '../types';
import type { Post, PostWithMarkdown } from '@/types/Post';

interface PostsStaticCache {
  posts?: Post[];
  post: CacheWithExpiry<string, PostWithMarkdown>;
}

class Posts implements IPostsService {
  private static __endpoint = '/content/posts.json';
  private static __caches: PostsStaticCache = {
    post: new CacheWithExpiry<string, PostWithMarkdown>()
  };
  private static get __hasCachedPosts(): boolean {
    return Boolean(Posts.__caches?.posts && Posts.__caches.posts.length);
  }
  private markdownService = new Markdown();

  async fetchPosts() {
    /**
     * Step 0
     *
     * If we've already loaded `posts`,
     * we can cache the result in the Class
     * and use that result going forward,
     * as opposed to re-firing a network req
     * */
    if (Posts.__hasCachedPosts) return Posts.__caches.posts as Post[];

    /**
     * Step 1
     * Request /content/posts.json
     * Which contains an Array<Post> structure
     */
    try {
      const response = await fetchWithTimeout(Posts.__endpoint);

      /**
       * Step 1.1
       * If the response is corrupt or indicates error,
       * re-throw the server response
       */
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      /**
       * Step 1.2
       * Parse a valid JSON Object from the response,
       * Which in our case is an Array<Post>
       */
      const posts: Post[] = await response.json();

      /**
       * Step 1.3
       * Check the posts response
       * to ensure it contains an array of valid posts
       *
       * If not,
       * throw an error
       */
      if (!posts || posts?.length === 0) {
        console.error('No Posts Found, posts: ', posts);
        throw new Error('No posts found');
      }

      /**
       * Step 1.4
       * Sort the response array (Array<Post>)
       * by most recently uploaded posts
       */
      const sorted = posts
        .filter((post) => post.visible)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      /**
       * Step 1.5
       * Cache the response in the Model
       * So that we can avoid network requests
       * on subsequent calls for the /content/posts.json
       */
      Posts.__caches.posts = sorted;

      /**
       * Step 1.6
       * Return the sorted Array<Post>
       */
      return sorted;
    } catch (error) {
      console.error('Posts[fetchPosts]: has thrown an error:', error);
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async fetchPost(id: string): Promise<PostWithMarkdown> {
    /**
     * Step 0: Check the cache for the post
     */
    if (Posts.__caches.post.has(id)) return Posts.__caches.post.get(id) as PostWithMarkdown;

    try {
      /**
       * Step 1: Load all posts from the Model cache
       */
      const posts = await this.fetchPosts();

      /**
       * Step 2: Find the post by id
       */
      const post = posts.find((post) => post.id === id);

      if (!post) {
        throw new Error('Post not found');
      }

      const markdown = await this.markdownService.fetchMarkdown(`/content/posts/${id}.md`);
      const postWithMarkdown = {
        ...post,
        markdownContent: markdown
      };

      Posts.__caches.post.set(id, postWithMarkdown);

      return postWithMarkdown;
    } catch (e) {
      console.error('An error occurred in an instance of "Posts" during execution of fn "fetchPosts"');
      console.error('Error fetching post:', e);
      throw e;
    }
  }
}

export default Posts;
