import AppRouter from "../routes/Router.js";
import ViewEngine from "../models/View.js";

class App {
  #views;
  #root;
  #router;
  constructor() {
    this.#views = new ViewEngine();
    this.#router = new AppRouter([
      { path: "/", view: this.homeView },
      { path: "/about", view: this.aboutView },
      { path: "/posts", view: this.postsListView },
      { path: "/post/:id", view: this.postView },
    ]);
    this.#root = document.getElementById("app");
    if (this.#root) {
      this.setupEventListeners();
    }
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
}

export default App;
