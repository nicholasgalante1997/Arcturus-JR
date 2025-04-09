import MarkdownEngine from "../clients/Markdown.js";

class ViewEngine {
  #markdownEngine = new MarkdownEngine();
  views = new Map();

  constructor() {
    this.views.set("home", this.renderHomeView.bind(this));
    this.views.set("about", this.renderAboutView.bind(this));
  }

  render(view) {
    try {
      const render = this.views.get(view);
      if (render) {
        render();
      } else {
        console.error(`View "${view}" not found`);
        throw new Error('View "' + view + '" not found');
      }
    } catch (e) {}
  }

  // View renderers
  async renderHomeView() {
    const markdown = await this.#fetchView("content/home.md");
    const content = markdown.asHtml();
    this.appElement.innerHTML = `
            <div class="markdown-content">
                ${content}
            </div>
            
            <h2>Recent Posts</h2>
            <div class="post-list" id="recent-posts">
                <div class="loading"></div>
            </div>
        `;

    // Fetch and display recent posts
    this.loadRecentPosts();
  }

  async renderAboutView() {
    const markdown = await this.fetchMarkdown("content/about.md");
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
