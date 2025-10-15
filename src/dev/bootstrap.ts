import BunMiniDevServer from '@/models/BunMiniDevServer';
import DevApp from './html/dev.html';

const routes = {
  '/': DevApp
};

type Routes = typeof routes;

const server = new BunMiniDevServer<Routes>({
  host: '0.0.0.0',
  port: 8080,
  static: [{ dirname: 'public' }],
  routes
});

server.start();
server._logger('listening...');
server.debug();
