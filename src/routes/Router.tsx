import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

interface RouterProps {
  router: ReturnType<typeof createBrowserRouter>;
}

function Router({ router }: RouterProps) {
  return <RouterProvider router={router} />;
}

export default Router;
