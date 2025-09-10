import { createBrowserRouter } from 'react-router';
import AboutPage from '@/pages/About';
import HomePage from '@/pages/Home';

let routes: ReturnType<typeof createBrowserRouter> | null = null;

const appRoutes = [
  { path: '/', view: 'home' },
  { path: '/about', view: 'about' },
  { path: '/contact', view: 'contact' },
  { path: '/posts', view: 'posts' },
  { path: '/post/:id', view: 'post' },
  { path: '/ee/addendum', view: 'ee:addendum' }
];

function getLazyLoadedRoutes() {
  if (!routes) {
    routes = createBrowserRouter([
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/about',
        element: <AboutPage />
      },
      // {
      //   path: '/contact',
      //   element: <ContactPage />
      // },
      // {
      //   path: '/posts',
      //   element: <PostsPage />
      // },
      // {
      //   path: '/post/:id',
      //   element: <PostPage />
      // }
    ]);
  }

  return routes;
}

export { getLazyLoadedRoutes };
