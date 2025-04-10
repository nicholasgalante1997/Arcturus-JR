import MarkdownEngine from '../clients/Markdown.js';
import Posts from '../clients/Posts.js';
import { getAppContainerElement } from '../utils/getDOMElements.js';

class ViewEngine {
  #appContainer = getAppContainerElement();
  #markdownEngine = new MarkdownEngine();
  #posts = new Posts();
  #views = new Map();

  constructor() {
    this.#views.set('home', this.#renderHomeView.bind(this));
    this.#views.set('about', this.#renderAboutView.bind(this));
    this.#views.set('posts', this.#renderPostsView.bind(this));
    this.#views.set('post', this.#renderPostView.bind(this));
    this.#views.set('error', this.#renderErrorView.bind(this));
    this.#views.set('404', this.#renderNotFoundView.bind(this));
  }

  async render(view, params = {}) {
    try {
      const render = this.#views.get(view);
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

  async #renderHomeView() {
    const markdown = await this.#fetchView('home.md');
    const content = markdown.asHtml();
    const postsList = await this.#posts.fetchPosts();
    console.log({ postsList });
    const postsMarkup = this.#transformPostsToList(postsList.slice(0, 3));

    if (this.#appContainer) {
      this.#appContainer.innerHTML = `
        <div class="markdown-content">
          ${content}
        </div>
        <h2>Recent Posts</h2>
        <div class="post-list" id="recent-posts">
          ${postsMarkup}
        </div>
      `;
    }
  }

  async #renderAboutView() {
    const markdown = await this.#fetchView('about.md');
    const content = markdown.asHtml();

    this.#appContainer.innerHTML = `
      <div class="markdown-content">
        ${content}
      </div>
    `;
  }

  async #renderPostsView() {
    const posts = await this.#posts.fetchPosts();
    const postsMarkup = this.#transformPostsToList(posts);
    this.#appContainer.innerHTML = `
      <h1>Blog Posts</h1>
      <div class="post-list" id="all-posts">
        ${postsMarkup}
      </div>
    `;
  }

  async #renderPostView(params) {
    this.#appContainer.innerHTML = '<div class="loading"></div>';

    if (!params?.id) {
      this.#renderNotFoundView();
      return;
    }

    try {
      const post = await this.#posts.fetchPost(params.id);
      console.log('Post is', post);
      this.#appContainer.innerHTML = `
        <article class="post">
          <h1>${post.title}</h1>
          <div class="post-meta">
            <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</time>
          </div>
          <div class="post-content markdown-content">
            ${post.$markdown.asHtml()}
          </div>
        </article>
      `;
    } catch (error) {
      this.#renderErrorView({ error });
    }
  }

  #renderNotFoundView() {
    this.#appContainer.innerHTML = `
      <div class="error">
        <h1>404</h1>
        <p>Page not found</p>
        <p><a href="/" data-link>Go back home</a></p>
      </div>
    `;
  }

  #renderErrorView(params) {
    this.#appContainer.innerHTML = `
      <div class="error">
        <h1>Error</h1>
        <p>Something went wrong</p>
        <pre>
          <code language="json">${JSON.stringify({ error: params.error })}</code>
        </pre>
        <p><a href="/" data-link>Try again</a></p>
      </div>
    `;
  }

  /**
   * @typedef {Object} Post
   * @property {string} id
   * @property {string} title
   * @property {string} date
   * @property {string} excerpt
   * @property {Array<string>} tags
   *
   * @param {Array<Post>} posts
   * @returns {string}
   */
  #transformPostsToList(posts) {
    if (posts.length === 0) {
      return '<p>No posts found</p>';
    }

    return posts
      .map(
        (post) => `
          <div class="post-card">
            <a href="/post/${post.id}" data-link>
              <div class="post-card-content">
                <h2>${post.title}</h2>
                <div class="post-meta">
                  <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</time>
                </div>
                <p>${post.excerpt}</p>

                <div class="post-card-actions">
                  <button class="btn btn-primary">Read more</button>
                  <button class="btn btn-secondary">RSS</button>
                </div>
              </div>
            </a>
          </div>
        `
      )
      .join('');
  }

  async #fetchView(view) {
    return await this.#markdownEngine.fetchMarkdown(`/content/${view}`);
  }
}

export default ViewEngine;
