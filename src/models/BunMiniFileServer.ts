import debug from 'debug';
import path from 'path';
import { inspect } from 'util';

export type BunServerOptions<
  R extends { [K in keyof R]: Bun.RouterTypes.RouteValue<Extract<K, string>> } = {}
> = Bun.ServeFunctionOptions<unknown, R> & {
  static?: {};
};

export interface IBunMiniFileServerStaticDirectoryConfig {
  dirname: string;
}

export interface IBunMiniFileServerState {
  init: boolean;
  running: boolean;
  stopped: boolean;
}

export interface IBunMiniFileServerConfig {
  port?: number;
  host?: string;
  static?: Array<IBunMiniFileServerStaticDirectoryConfig>;
  overrides?: Partial<BunServerOptions>;
}

export interface IBunMiniFileServer {
  _config: IBunMiniFileServerConfig;
  _logger: debug.Debugger;
  _server: Bun.Server | null;
  _state: IBunMiniFileServerState;
  createServer(): Bun.Server;
  start(): void;
  stop(): void;
}

export interface BunMiniFileSeverConstructorOptions<R> {
  port?: number;
  host?: string;
  static?: Array<IBunMiniFileServerStaticDirectoryConfig>;
  routes?: R;
}

export default class BunMiniFileServer<
  R extends { [K in keyof R]: Bun.RouterTypes.RouteValue<Extract<K, string>> } = {}
> implements IBunMiniFileServer
{
  _config;
  _logger = debug('arc:bun-mini-file-server');
  _server: Bun.Server | null = null;
  _state = {
    init: false,
    running: false,
    stopped: false
  };
  _routes;

  constructor(options: BunMiniFileSeverConstructorOptions<R>) {
    this._config = {
      port: options.port || 8080,
      host: options.host || '0.0.0.0',
      static: options.static || [],
      overrides: {}
    };
    this._routes = options.routes || ({} as R);
  }

  createServer() {
    const self = this;
    const bso: BunServerOptions = {
      ...self._config.overrides,
      hostname: this._config.host,
      port: this._config.port,
      routes: this._routes,
      async fetch(req) {
        const filepath = new URL(req.url).pathname;
        self._logger('%s %s', req.method, filepath);
        for (const staticAssetDir of self._config.static) {
          try {
            const file = Bun.file(path.join(process.cwd(), staticAssetDir.dirname, filepath));
            return new Response(file);
          } catch (error) {
            continue;
          }
        }

        return new Response('File Not Found', { status: 404 });
      }
    };
    return Bun.serve(bso);
  }

  start() {
    if (this._server && this._state.init && this._state.running) {
      this._logger.extend('warn')('Server already running');
      return;
    }

    if (this._server && this._state.init && this._state.stopped) {
      this._server = this.createServer();
      this._state.running = true;
      this._state.stopped = false;
      return;
    }

    this._server = this.createServer();
    this._state.init = true;
    this._state.running = true;
    this._state.stopped = false;
  }

  stop() {
    this._server = null;
    this._state.running = false;
    this._state.stopped = true;
  }

  protected inspect() {
    this._logger(
      inspect(
        {
          _config: this._config,
          _state: this._state,
          _server: typeof this._server !== 'undefined' && this._server !== null ? 'BunServer' : null,
          _routes: this._routes
        },
        false,
        5,
        true
      )
    );
  }
}
