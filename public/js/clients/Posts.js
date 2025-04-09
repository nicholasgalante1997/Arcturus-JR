import { fetchWithTimeout } from '../utils/fetchWithTimeout';
import Markdown from './Markdown.js';

class Posts {
  #postsUrl = 'content/posts.json';
  #markdown = new Markdown();

  async fetchPosts() {
    try {
      const response = await fetchWithTimeout(this.#postsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async fetchPost(id) {
    // First get the post metadata
    const posts = await this.fetchPosts();
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new Error('Post not found');
    }

    // Then fetch the actual content
    const content = await this.fetchMarkdown(`content/posts/${id}.md`);

    return {
      ...post,
      content
    };
  }
}

export default Posts;
