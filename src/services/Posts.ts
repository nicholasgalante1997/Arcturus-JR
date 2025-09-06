import { fetchWithTimeout } from '../utils/fetchWithTimeout.js';
import type { Post, PostWithMarkdown } from '../types/Post';
import Markdown from './Markdown';

export default class Posts {
  private static postsEndpoint = '/content/posts.json';
  private markdownService = new Markdown();

  async fetchPosts() {
    try {
      const response = await fetchWithTimeout(Posts.postsEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts: Post[] = await response.json();
      return posts
        .filter((post) => post.visible)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Posts[fetchPosts]: has thrown an error:', error);
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async fetchPost(id: string): Promise<PostWithMarkdown> {
    const posts = await this.fetchPosts();
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new Error('Post not found');
    }

    const mdoc = await this.markdownService.fetchMarkdown(`/content/posts/${id}.md`);

    return {
      ...post,
      markdownContent: mdoc
    };
  }
}
