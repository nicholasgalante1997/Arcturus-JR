type RouteHandler = (req: Bun.BunRequest) => Response | Promise<Response>;
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type RouteTable = Record<string, Partial<Record<Method, RouteHandler>>>;

export interface Router {
  get(path: string, handler: RouteHandler): Router;
  post(path: string, handler: RouteHandler): Router;
  put(path: string, handler: RouteHandler): Router;
  delete(path: string, handler: RouteHandler): Router;
  routes: RouteTable;
}

function joinPath(prefix: string, path: string): string {
  if (path === '/') return prefix || '/';
  return `${prefix}${path}`;
}

// Minimal functional router matching the project's `createRouter('/path').get(...)`
// convention. Produces a route table in the exact shape Bun.serve's native
// `routes` option expects (including `:param` segments), so no separate
// path-matching logic is needed at request time.
export function createRouter(prefix: string): Router {
  const routes: RouteTable = {};

  function addRoute(method: Method, path: string, handler: RouteHandler): void {
    const fullPath = joinPath(prefix, path);
    routes[fullPath] = { ...routes[fullPath], [method]: handler };
  }

  const router: Router = {
    get(path, handler) {
      addRoute('GET', path, handler);
      return router;
    },
    post(path, handler) {
      addRoute('POST', path, handler);
      return router;
    },
    put(path, handler) {
      addRoute('PUT', path, handler);
      return router;
    },
    delete(path, handler) {
      addRoute('DELETE', path, handler);
      return router;
    },
    routes
  };

  return router;
}

export function mergeRouters(...routers: Router[]): RouteTable {
  const merged: RouteTable = {};
  for (const router of routers) {
    for (const [path, methods] of Object.entries(router.routes)) {
      merged[path] = { ...merged[path], ...methods };
    }
  }
  return merged;
}
