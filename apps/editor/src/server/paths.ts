import path from 'path';

// The editor reads/writes packages/content-data/* directly — the source of
// truth — never apps/web/public/content (which is a generated copy target).
export const CONTENT_DATA_DIR = path.resolve(import.meta.dir, '../../../../packages/content-data');
export const POSTS_DIR = path.join(CONTENT_DATA_DIR, 'posts');
export const RFCS_DIR = path.join(CONTENT_DATA_DIR, 'rfcs');
export const ASSETS_DIR = path.resolve(import.meta.dir, '../../../../apps/web/public/assets');

const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

// Guards against path traversal from user-supplied ids before they ever touch
// a filesystem path — defense in depth even though this server only binds
// 127.0.0.1. A type guard so callers narrow `string | undefined` route params
// to `string` in one check.
export function isValidId(id: string | undefined): id is string {
  return typeof id === 'string' && SAFE_ID.test(id) && !id.includes('..');
}
