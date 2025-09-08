import { createBrowserRouter } from 'react-router';
import HomePage from '@/pages/Home';

let routes: ReturnType<typeof createBrowserRouter> | null = null;

function getLazyLoadedRoutes() {
  if (!routes) {
    routes = createBrowserRouter([
      {
        path: '/',
        element: <HomePage />
      }
    ]);
  }

  return routes;
}

export { getLazyLoadedRoutes };
