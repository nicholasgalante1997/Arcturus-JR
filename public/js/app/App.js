import AppRouter from '../routes/Router.js';
import ViewEngine from '../models/View.js';

class App {

  #router;

  constructor() {
    this.#router = new AppRouter([
      { path: '/', view: 'home' },
      { path: '/about', view: 'about' },
      { path: '/posts', view: 'posts' },
      { path: '/post/:id', view: 'post/:id' }
    ]);
    
    this.#router.router();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        this.navigateTo(link.href);
      }
    });

    window.addEventListener('popstate', () => {
      this.#router.router();
    });
  }
}

export default App;
