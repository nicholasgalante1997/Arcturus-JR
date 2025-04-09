# Client-Side Routing with the History API

Modern web applications often need to handle navigation without full page reloads. The History API provides a native way to achieve this with clean URLs and proper browser navigation support.

## Understanding the History API

The History API allows manipulation of the browser's session history through JavaScript. It lets you:

1. Add entries to the browser history
2. Navigate between history entries
3. Change the URL without triggering a page reload
4. Respond to back/forward navigation

## Key History API Methods

### pushState

The `pushState()` method adds a new entry to the browser's history stack:

```javascript
history.pushState(state, title, url);
```

Parameters:
- `state`: An object that is associated with the new history entry
- `title`: Currently ignored by most browsers (for future use)
- `url`: The new URL to display in the address bar

Example:
```javascript
// Navigate to /about without page reload
history.pushState(null, '', '/about');
```

### replaceState

Similar to `pushState()`, but replaces the current history entry instead of adding a new one:

```javascript
history.replaceState(state, title, url);
```

### popstate Event

The `popstate` event is fired when the active history entry changes due to navigation (back/forward buttons):

```javascript
window.addEventListener('popstate', event => {
  // Handle navigation
  console.log('Navigation occurred', event.state);
  renderCurrentPage();
});
```

## Building a Client-Side Router

Here's how to create a basic router using the History API:

### 1. Define Your Routes

```javascript
const routes = [
  { path: '/', view: homeView },
  { path: '/about', view: aboutView },
  { path: '/posts', view: postsView },
  { path: '/post/:id', view: postView }
];
```

### 2. Create a Navigation Method

```javascript
function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}
```

### 3. Handle Link Clicks

```javascript
document.addEventListener('click', e => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});
```

### 4. Match Routes and Render Content

```javascript
function router() {
  // Find matching route
  const match = routes.find(route => {
    // Convert route path to regex
    return matchRoute(route.path, location.pathname);
  });
  
  if (!match) {
    // 404 handling
    return renderNotFound();
  }
  
  // Render the view
  match.view(match.params);
}
```

### 5. Listen for Back/Forward Navigation

```javascript
window.addEventListener('popstate', router