import path from 'path';

import Markdown from '@/services/Markdown';

import type { IPostsService } from '../types';
import type { Post, PostWithMarkdown } from '@/types/Post';

class ServerPostsService implements IPostsService {
  private posts: Array<Post> | null = null;
  private markdownService = new Markdown();

  async fetchPosts(): Promise<Array<Post>> {
    if (this.posts) return this.posts;
    try {
      const _path = path.resolve(process.cwd(), 'public', 'content', 'posts.json');
      const posts = await Bun.file(_path).json();
      if (Array.isArray(posts) && posts.length > 0) {
        this.posts = posts
          .filter((post) => post?.visible)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return this.posts;
      }

      throw new Error('Unable to load posts');
    } catch (e) {
      console.error('Error fetching posts:', e);
      throw e;
    }
  }

  async fetchPost(id: string): Promise<PostWithMarkdown> {
    const posts = this.posts || (await this.fetchPosts());
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new Error('Post not found');
    }

    const markdown = await this.markdownService.fetchMarkdown(`/content/posts/${id}.md`);
    const postWithMarkdown = {
      ...post,
      markdownContent: markdown
    };

    return postWithMarkdown;
  }
}

export default ServerPostsService;
