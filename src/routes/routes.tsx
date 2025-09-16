import { createBrowserRouter } from 'react-router';
import AboutPage from '@/pages/About';
import ContactPage from '@/pages/Contact';
import HomePage from '@/pages/Home';
import PostsPage from '@/pages/Posts';
import PostPage from '@/pages/Post';

let routes: ReturnType<typeof createBrowserRouter> | null = null;

function getLazyLoadedRoutes() {
  if (!routes) {
    routes = createBrowserRouter([
      {
        path: '/',
        Component: HomePage
      },
      {
        path: '/about',
        Component: AboutPage
      },
      {
        path: '/contact',
        Component: ContactPage
      },
      {
        path: '/posts',
        Component: PostsPage
      },
      {
        path: '/post/:id',
        Component: PostPage
      }
    ]);
  }

  return routes;
}

export { getLazyLoadedRoutes };
