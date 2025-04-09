import hljs from 'highlight.js';
import ViewEngine from '../models/View';

class AppRouter {

  /** @type {Array<{ path: string, view: string }>} */
  routes;

  views = new ViewEngine();

  /**
   * @param {Array<{ path: string, view: string }>} routes 
   */
  constructor(routes) {
    this.routes = routes;
  }

  navigateTo(url) {
    window.history.pushState(null, null, url);
    this.router();
  }

  getParamsFromPath(pathSpec, pathname) {
    const pathParts = pathSpec.split('/');
    const pathnameParts = pathname.split('/');

    if (pathParts.length !== pathnameParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < pathParts.length; i++) {
      const routePart = pathParts[i];
      const pathPart = pathnameParts[i];

      // Check if it's a parameter (starts with :)
      if (routePart.startsWith(':')) {
        params[routePart.slice(1)] = decodeURIComponent(pathPart);
        continue;
      }
    }

    return params;
  }

  matchRoute(pathname) {
    const route = this.routes.find((route) => {
      const pathParts = route.path.split('/');
      const pathnameParts = pathname.split('/');

      if (pathParts.length !== pathnameParts.length) {
        return false;
      }

      for (let i = 0; i < pathParts.length; i++) {
        const routePart = pathParts[i];
        const pathPart = pathnameParts[i];

        // Check if it's a parameter (starts with ":") Assume it matches anything
        if (routePart.startsWith(':')) {
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
      params: this.getParamsFromPath(route.path, pathname)
    };
  }

  async router() {
    const pathname = window.location.pathname;

    // Find matching route
    const match = this.matchRoute(pathname);

    // If no match, show 404
    if (!match) {
      this.views.render('404');
      return;
    }

    console.info('Matched route:', match);

    const { view, params } = match;

    // Show loading state
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = '<div class="loading"></div>';
    }
   
    try {
      await this.views.render(view, params);
    } catch (error) {
      console.error('Error rendering view:', error);
      await this.views.render('error');
    }

    // Update active navigation
    this.updateNav();
    hljs.highlightAll();
  }

  updateNav() {
    document.querySelectorAll('nav a').forEach((link) => {
      if (link.getAttribute('href') === location.pathname) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

export default AppRouter;
