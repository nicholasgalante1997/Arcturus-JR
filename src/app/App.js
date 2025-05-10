import Config from '../config/index.js';
import AppRouter from '../routes/Router.js';
import routes from '../routes/routes.js';

import Scroller from '../utils/scroll.js';

/**
 * @param {typeof routes} routes
 */
function getPublicRoutes(routes) {
  return routes.filter((route) => Config.ROUTES.PUBLIC.includes(route.view));
}

class App {
  #router;
  constructor() {
    this.#router = new AppRouter(getPublicRoutes(routes));
    this.#router.router();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        this.#router.push(link.href);
        Scroller.top();
      }
    });

    const ghIconButton = document.getElementById('gh-icon-link');
    ghIconButton.addEventListener('click', () => {
      window.open(Config.LINKS.GITHUB, '_blank');
    });

    const inIconButton = document.getElementById('in-icon-link');
    inIconButton.addEventListener('click', () => {
      window.open(Config.LINKS.LINKEDIN, '_blank');
    });

    window.addEventListener('popstate', () => {
      this.#router.router();
    });
  }
}

export default App;
