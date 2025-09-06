import { createBrowserRouter } from 'react-router';

let routes: ReturnType<typeof createBrowserRouter> | null = null;

function getLazyLoadedRoutes() {
  if (!routes) {
    routes = createBrowserRouter([
      {
        path: '/',
        element: <div>Hello World</div>
      }
    ]);
  }

  return routes;
}

export { getLazyLoadedRoutes };
