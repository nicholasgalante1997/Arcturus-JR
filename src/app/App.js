import Config from '../config/index.js';
import AppRouter from '../routes/Router.js';
import routes from '../routes/routes.js';

class App {
  #router;
  constructor() {
    this.#router = new AppRouter(routes);
    this.#router.router();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        this.#router.push(link.href);
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
