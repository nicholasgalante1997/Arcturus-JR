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
    const postsMarkup = this.#transformPostsToList(postsList.slice(0, 3));

    if (this.#appContainer) {
      this.#appContainer.innerHTML = `
        <div class="markdown-content">
          ${content}
        </div>
        <h2 class="recent-posts-label">Recent Posts</h2>
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
          <section class="article-container">
            <article class="article-root">
              
              <div class="article-supplementary-info-container text-container">
                <span class="article-date fira-sans-semibold">${post.date}</span>
                <span style="height:24px;width:1px;background-color:var(--pico-primary-inverse, #fff);border-radius:2px;"></span>
                <span class="article-series fira-sans-semibold">
                  Estimated Reading Time:&nbsp;
                  <b>${post['readingTime'] || 'Quick One'}</b>
                </span>
              </div>
      
              <div class="article-title-container text-container">
                <h1 class="article-title">${post.title}</h1>
              </div>
      
              <div class="article-description-container text-container">
                <p class="article-description noto-serif">${post.excerpt}</p>
              </div>
      
              <div class="article-author-container text-container">
                  <div style="display:flex;flex-direction:row;align-items:center;gap:8px;">
                    <img 
                      style="aspect-ratio: 1 / 1; object-fit: cover; object-position: center; image-orientation: from-image; image-rendering: optimizeQuality; border-radius: 24px;" 
                      height="48" 
                      width="48" 
                      src="/assets/headshot.jpg" 
                      alt="Nick's Avatar, a class photo of Butters Stotch against a pink background" 
                      class="post-card__author-avatar"
                    >
                    <p class="article-author noto-serif">
                      By
                      <a href="/about" class="post-card__author" data-link>
                        Nick G.
                      </a>
                    </p>
                  </div>
              </div>
      
              <div class="article-headline-image-container">
                <img
                  src="${post.image.src}"
                  alt="${post.image.alt}"
                  style="aspect-ratio: ${post.image.aspectRatio}; object-fit: cover; object-position: center; image-orientation: from-image; image-rendering: optimizeQuality; border-radius: 4px;"
                  class="article-headline-image"
                />
                <span class="article-headline-image-publisher">
                  ${post.$markdown.attribute('image')?.publisher ?? 'Doodles NFTs Collection, 2025'}
                </span>
              </div>

              <section class="article__markdown-root">
                ${post.$markdown.asHtml()}
              </section>
            </article>
          </section>
        </main>
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
