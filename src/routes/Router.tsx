import { createBrowserRouter, RouterProvider } from 'react-router';

interface RouterProps {
  router: ReturnType<typeof createBrowserRouter>;
}

function Router({ router }: RouterProps) {
  return <RouterProvider router={router} />;
}

export default Router;
