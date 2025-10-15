import BunMiniFileServer, {
  IBunMiniFileServer,
  BunMiniFileSeverConstructorOptions,
  BunServerOptions
} from './BunMiniFileServer';

type BunServerRouteOptions<R extends { [K in keyof R]: Bun.RouterTypes.RouteValue<Extract<K, string>> }> =
  BunServerOptions<R>['routes'];

type BunMiniDevServerConstructorOptions<
  R extends { [K in keyof R]: Bun.RouterTypes.RouteValue<Extract<K, string>> } = {}
> = BunMiniFileSeverConstructorOptions<R> & {
  routes?: BunServerRouteOptions<R>;
};

export default class BunMiniDevServer<
    R extends { [K in keyof R]: Bun.RouterTypes.RouteValue<Extract<K, string>> } = {}
  >
  extends BunMiniFileServer
  implements IBunMiniFileServer
{
  constructor(options: BunMiniDevServerConstructorOptions<R>) {
    super(options as BunMiniFileSeverConstructorOptions<R>);
    this._routes = options.routes as R;
    this._config.overrides = {
      /**
       * @see https://bun.com/docs/bundler/fullstack#development-mode
       */
      development: {
        hmr: true,
        console: true
      }
    };
  }

  get routes(): R {
    return this._routes as R;
  }

  set routes(routes: R) {
    this._routes = routes;
  }

  public debug() {
    this.inspect();
  }
}
