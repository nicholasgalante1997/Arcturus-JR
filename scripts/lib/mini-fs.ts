/**
 * Mini File Server
 */

import debug from 'debug';

import BoundQueue from './models/BoundQueue';

interface BunMiniFileServerState {
  init: boolean;
  running: boolean;
  stopped: boolean;
  metadata: {
    last_request: Date | null;
    errs?: BoundQueue<Error>;
  };
}

interface BunMiniFileServer {
  /** @private */
  _logger: debug.Debugger;
  /** @private */
  _server?: Bun.Server | null;
  /** @private */
  _state: BunMiniFileServerState;
  /** @private */
  _createServer(port?: number, host?: string): Bun.Server;

  staticAssetDirectory: string;
  setStaticAssetDirectory(path: string): void;
  start(port?: number, host?: string): void;
  stop(): void;
}

const BunMiniFileServer: BunMiniFileServer = {
  /** @private */
  _logger: debug('arc:mini-fs'),
  /** @private */
  _server: null,
  /** @private */
  _state: {
    init: false,
    running: false,
    stopped: false,
    metadata: {
      last_request: null,
      errs: new BoundQueue([], 1000)
    }
  },
  /** @private */
  _createServer(port: number = 8080, host: string = '0.0.0.0') {
    return Bun.serve({
      hostname: host,
      port,
      fetch(req) {
        const filepath = new URL(req.url).pathname;
        BunMiniFileServer._logger('%s %s', req.method, filepath);
        const file = Bun.file(BunMiniFileServer.staticAssetDirectory + filepath);
        BunMiniFileServer._state.metadata.last_request = new Date();
        if (!file.size) return new Response('File Not Found', { status: 404 });
        return new Response(file);
      }
    });
  },

  staticAssetDirectory: 'public',
  setStaticAssetDirectory(path: string) {
    this.staticAssetDirectory = path;
  },
  start(port: number = 8080, host: string = '0.0.0.0') {
    if (this._server && this._state.init && this._state.running) {
      this._logger.extend('warn')('Server already running');
      return;
    }

    if (this._server && this._state.init && this._state.stopped) {
      this._server = this._createServer(port, host);
    }

    this._server = this._createServer(port, host);
    this._state.init = true;
    this._state.running;
  },
  stop() {
    delete this._server;
    this._server = null;
    this._state.running = false;
    this._state.stopped = true;
  }
};

export default BunMiniFileServer;