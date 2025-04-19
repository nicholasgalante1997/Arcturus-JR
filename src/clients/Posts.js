import { fetchWithTimeout } from '../utils/fetchWithTimeout.js';
import Markdown from './Markdown.js';

class Posts {
  #postsUrl = '/content/posts.json';
  #markdown = new Markdown();

  /**
   * @returns {Promise<Post[]>}
   */
  async fetchPosts() {
    try {
      const response = await fetchWithTimeout(this.#postsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      /** @type {Post[]} */
      const posts = await response.json();
      return posts.filter((post) => post.visible).sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Posts[fetchPosts]: has thrown an error:', error);
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async fetchPost(id) {
    const posts = await this.fetchPosts();
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new Error('Post not found');
    }

    const mdoc = await this.#markdown.fetchMarkdown(`/content/posts/${id}.md`);

    return {
      ...post,
      $markdown: mdoc
    };
  }
}

export default Posts;

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} title
 * @property {string} date
 * @property {string} excerpt
 * @property {Array<string>} tags
 * @property {{ src: string, alt: string, aspectRatio: string }} image
 * @property {string} readingTime
 * @property {string} category
 * @property {string} subcategory
 * @property {string[]} searchTerms
 * @property {string} slug
 * @property {boolean} visible
 */
