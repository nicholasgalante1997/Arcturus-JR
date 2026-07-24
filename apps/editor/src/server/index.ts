import { createRouter, mergeRouters } from './router';
import { listPosts, getPost, createPost, updatePost, deletePost } from './handlers/posts';
import { listRfcs, getRfc, createRfc, updateRfc, deleteRfc } from './handlers/rfcs';
import { listAssets } from './handlers/assets';
import { ASSETS_DIR } from './paths';

const postsRouter = createRouter('/api/posts')
  .get('/', listPosts)
  .post('/', createPost)
  .get('/:id', getPost)
  .put('/:id', updatePost)
  .delete('/:id', deletePost);

const rfcsRouter = createRouter('/api/rfcs')
  .get('/', listRfcs)
  .post('/', createRfc)
  .get('/:id', getRfc)
  .put('/:id', updateRfc)
  .delete('/:id', deleteRfc);

const assetsRouter = createRouter('/api/assets').get('/', listAssets);

const CLIENT_DIR = `${import.meta.dir}/../../dist/client`;

async function serveStatic(pathname: string): Promise<Response> {
  const relative = pathname === '/' ? '/index.html' : pathname;
  const file = Bun.file(`${CLIENT_DIR}${relative}`);
  if (await file.exists()) return new Response(file);
  return new Response(Bun.file(`${CLIENT_DIR}/index.html`));
}

const port = Number(process.env.EDITOR_PORT ?? 4500);

const server = Bun.serve({
  hostname: '127.0.0.1',
  port,
  routes: mergeRouters(postsRouter, rfcsRouter, assetsRouter),
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname.startsWith('/api/')) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    if (pathname.startsWith('/assets/')) {
      const file = Bun.file(`${ASSETS_DIR}${pathname.slice('/assets'.length)}`);
      if (await file.exists()) return new Response(file);
      return new Response('Not found', { status: 404 });
    }
    return serveStatic(pathname);
  }
});

console.log(`@arcjr/editor listening on http://${server.hostname}:${server.port} (local-only, no auth)`);
