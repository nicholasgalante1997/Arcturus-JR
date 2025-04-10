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

    window.addEventListener('popstate', () => {
      this.#router.router();
    });
  }
}

export default App;
