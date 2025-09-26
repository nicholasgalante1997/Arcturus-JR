import { RouterProvider } from 'react-router/dom';

import { getLazyLoadedRoutes } from './routes';

function Router() {
  return <RouterProvider router={getLazyLoadedRoutes()} />;
}

export default Router;
