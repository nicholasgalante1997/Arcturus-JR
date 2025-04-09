import MarkdownEngine from '../clients/Markdown.js';
import Posts from '../clients/Posts.js';
import { getAppContainerElement, getPostsContainerElement } from '../utils/getDOMElements.js';

class ViewEngine {
  #appContainer = getAppContainerElement();
  #postsContainer = getPostsContainerElement();
  #markdownEngine = new MarkdownEngine();
  #posts = new Posts();
  views = new Map();

  constructor() {
    this.views.set('home', this.renderHomeView.bind(this));
    this.views.set('about', this.renderAboutView.bind(this));
  }

  async render(view, params = {}) {
    try {
      const render = this.views.get(view);
      if (render && typeof render === 'function') {
        await Promise.resolve(render(params));
      } else {
        console.error(`View "${view}" not found`);
        throw new Error('View "' + view + '" not found');
      }
    } catch (e) {
      /**
       * Render an error state
       */
      console.error(e);
      this.#appContainer.innerHTML = '<p class="error">' + e.message + '</p>';
    }
  }

  // View renderers
  async renderHomeView(...params) {
    const markdown = await this.#fetchView('content/home.md');
    const content = markdown.asHtml();
    const postsList = await this.#posts.fetchPosts();

   if (this.#appContainer) {
    this.#appContainer.innerHTML = `
      <div class="markdown-content">
        ${content}
      </div>
      <h2>Recent Posts</h2>
      <div class="post-list" id="recent-posts">
        <div class="loading"></div>
      </div>
    `;
   }


    // Fetch and display recent posts
    this.loadRecentPosts();
  }

  async renderAboutView(...params) {
    const markdown = await this.fetchMarkdown('content/about.md');
    const content = this.renderMarkdown(markdown);

    this.appElement.innerHTML = `
            <div class="markdown-content">
                ${content}
            </div>
        `;
  }

  async #fetchView(view) {
    return await this.#markdownEngine.fetchMarkdown(`/content/${view}`);
  }
}

export default ViewEngine;
