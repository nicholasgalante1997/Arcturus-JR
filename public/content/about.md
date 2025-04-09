# About This Blog

This blog is a demonstration of building a modern web application without frameworks or bundlers. It showcases how to build a feature-rich blog using only:

- HTML5
- CSS3
- Vanilla ES6 JavaScript
- Import Maps for ES module management
- History API for client-side routing
- Marked library for Markdown rendering

## How It Works

The blog uses a component-based architecture with ES6 classes to organize the code. Each view is rendered dynamically based on the current URL path.

### Routing

The routing system uses the History API to handle navigation without page reloads. When you click on a link with the `data-link` attribute, the app intercepts the click, updates the URL, and renders the appropriate view.

### Markdown Rendering

All content is written in Markdown format and stored in static `.md` files. The app fetches these files when needed and renders them to HTML using the Marked library.

### Import Maps

Instead of using a bundler like Webpack or Rollup, this blog uses the newer Import Maps standard to manage ES module dependencies:

```html
<script type="importmap">
    {
        "imports": {
            "marked": "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
        }
    }
</script>
```

## Why No Frameworks?

Modern frameworks like React, Vue, and Angular are great, but they can add significant complexity and overhead. This project demonstrates that you can build a sophisticated web application with just vanilla JavaScript and a few well-chosen libraries.

Benefits of this approach include:

- **Performance**: No framework overhead means faster page loads
- **Simplicity**: Easier to understand the entire codebase
- **Future-proof**: Built on standard web APIs that won't go out of fashion
- **Learning**: Great for understanding how things work under the hood

## Getting Started

Interested in building something similar? Here are the basic steps:

1. Set up your HTML structure with Import Maps
2. Create a router using the History API
3. Define your views and content structure
4. Use fetch API to load Markdown content
5. Render the content using the Marked library

Feel free to clone this project and use it as a starting point for your own blog!