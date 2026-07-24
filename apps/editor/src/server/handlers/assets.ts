import { readdir } from 'fs/promises';

import { ASSETS_DIR } from '../paths';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

export async function listAssets(): Promise<Response> {
  const entries = await readdir(ASSETS_DIR, { withFileTypes: true, recursive: true });
  const images = entries
    .filter((e) => e.isFile())
    .map((e) => `${e.parentPath.slice(ASSETS_DIR.length)}/${e.name}`.replace(/\\/g, '/'))
    .filter((relPath) => IMAGE_EXTENSIONS.has(relPath.slice(relPath.lastIndexOf('.')).toLowerCase()))
    .map((relPath) => `/assets${relPath}`)
    .sort();

  return Response.json(images);
}
