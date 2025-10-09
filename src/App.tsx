import { createBrowserRouter } from 'react-router';
import withProviders from './layout/withProviders';
import Router from '@/routes/Router';

interface AppProps {
  router: ReturnType<typeof createBrowserRouter>;
}

function App({ router }: AppProps) {
  return <Router router={router} />;
}

export default withProviders(App);
