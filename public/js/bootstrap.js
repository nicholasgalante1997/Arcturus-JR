import { marked } from "marked";
import hljs from 'highlight.js';

class BlogApp {
  constructor() {
    this.appElement = document.getElementById("app");
    this.routes = [
      { path: "/", view: this.homeView },
      { path: "/about", view: this.aboutView },
      { path: "/posts", view: this.postsListView },
      { path: "/post/:id", view: this.postView },
    ];

    this.setupEventListeners();
    this.router();

    // Initialize history
    window.addEventListener("popstate", () => this.router());
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-link]");
      if (link) {
        e.preventDefault();
        this.navigateTo(link.href);
      }
    });
  }

  navigateTo(url) {
    history.pushState(null, null, url);
    this.router();
  }

  getParamsFromPath(pathSpec, pathname) {
    const pathParts = pathSpec.split("/");
    const pathnameParts = pathname.split("/");

    if (pathParts.length !== pathnameParts.length) {
      return {};
    }

    const params = {};

    for (let i = 0; i < pathParts.length; i++) {
      const routePart = pathParts[i];
      const pathPart = pathnameParts[i];

      // Check if it's a parameter (starts with :)
      if (routePart.startsWith(":")) {
        params[routePart.slice(1)] = decodeURIComponent(pathPart);
        continue;
      }
    }

    return params;
  } 

  matchRoute(pathname) {
    const route = this.routes.find((route) => {
      // Convert route path to regex pattern
      const pathParts = route.path.split("/");
      const pathnameParts = pathname.split("/");

      if (pathParts.length !== pathnameParts.length) {
        return false;
      }

      const params = {};

      for (let i = 0; i < pathParts.length; i++) {
        const routePart = pathParts[i];
        const pathPart = pathnameParts[i];

        // Check if it's a parameter (starts with :)
        if (routePart.startsWith(":")) {
          params[routePart.slice(1)] = pathPart;
          continue;
        }

        // Regular part, should match exactly
        if (routePart !== pathPart) {
          return false;
        }
      }

      return true;
    });

    if (!route) return;

    return {
      ...route,
      params: this.getParamsFromPath(route.path, pathname),
    }
  }

  async router() {
    const pathname = location.pathname;

    // Find matching route
    const match = this.matchRoute(pathname);

    // If no match, show 404
    if (!match) {
      this.notFoundView();
      return;
    }

    console.info("Matched route:", match);

    const { view, params } = match;

    // Show loading state
    this.appElement.innerHTML = '<div class="loading"></div>';

    try {
      // Call the view function and pass params
      await view.call(this, params);
    } catch (error) {
      console.error("Error rendering view:", error);
      this.errorView();
    }

    // Update active navigation
    this.updateNav();
    hljs.highlightAll();
  }

  updateNav() {
    document.querySelectorAll("nav a").forEach((link) => {
      if (link.getAttribute("href") === location.pathname) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  async fetchMarkdown(file) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error fetching markdown:", error);
      throw error;
    }
  }

  renderMarkdown(markdown) {
    return marked(markdown);
  }

  // View renderers
  async homeView() {
    const markdown = await this.fetchMarkdown("content/home.md");
    const content = this.renderMarkdown(markdown);

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

  async aboutView() {
    const markdown = await this.fetchMarkdown("content/about.md");
    const content = this.renderMarkdown(markdown);

    this.appElement.innerHTML = `
            <div class="markdown-content">
                ${content}
            </div>
        `;
  }

  async postsListView() {
    this.appElement.innerHTML = `
            <h1>Blog Posts</h1>
            <div class="post-list" id="all-posts">
                <div class="loading"></div>
            </div>
        `;

    // Fetch and display all posts
    this.loadAllPosts();
  }

  async postView(params) {
    // Show loading state
    this.appElement.innerHTML = '<div class="loading"></div>';

    try {
      const post = await this.fetchPost(params.id);

      this.appElement.innerHTML = `
                <article class="post">
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        <time datetime="${post.date}">${new Date(
        post.date
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</time>
                    </div>
                    <div class="post-content markdown-content">
                        ${this.renderMarkdown(post.content)}
                    </div>
                </article>
            `;
    } catch (error) {
      this.notFoundView();
    }
  }

  notFoundView() {
    this.appElement.innerHTML = `
            <div class="error">
                <h1>404</h1>
                <p>Page not found</p>
                <p><a href="/" data-link>Go back home</a></p>
            </div>
        `;
  }

  errorView() {
    this.appElement.innerHTML = `
            <div class="error">
                <h1>Error</h1>
                <p>Something went wrong</p>
                <p><a href="/" data-link>Try again</a></p>
            </div>
        `;
  }

  // Data methods
  async loadRecentPosts() {
    try {
      const posts = await this.fetchPosts();
      const recentPosts = posts.slice(0, 3); // Get 3 most recent posts

      const postsContainer = document.getElementById("recent-posts");
      postsContainer.innerHTML = this.renderPostsList(recentPosts);
    } catch (error) {
      console.error("Error loading recent posts:", error);
      document.getElementById("recent-posts").innerHTML =
        '<p class="error">Failed to load recent posts</p>';
    }
  }

  async loadAllPosts() {
    try {
      const posts = await this.fetchPosts();

      const postsContainer = document.getElementById("all-posts");
      postsContainer.innerHTML = this.renderPostsList(posts);
    } catch (error) {
      console.error("Error loading all posts:", error);
      document.getElementById("all-posts").innerHTML =
        '<p class="error">Failed to load posts</p>';
    }
  }

  renderPostsList(posts) {
    if (posts.length === 0) {
      return "<p>No posts found</p>";
    }

    return posts
      .map(
        (post) => `
            <div class="post-card">
                <a href="/post/${post.id}" data-link>
                    <div class="post-card-content">
                        <h2>${post.title}</h2>
                        <div class="post-meta">
                            <time datetime="${post.date}">${new Date(
          post.date
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</time>
                        </div>
                        <p>${post.excerpt}</p>
                    </div>
                </a>
            </div>
        `
      )
      .join("");
  }

  async fetchPosts() {
    try {
      const response = await fetch("/content/posts.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  async fetchPost(id) {
    // First get the post metadata
    const posts = await this.fetchPosts();
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new Error("Post not found");
    }

    // Then fetch the actual content
    const content = await this.fetchMarkdown(`/content/posts/${id}.md`);

    return {
      ...post,
      content,
    };
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  new BlogApp();
});
