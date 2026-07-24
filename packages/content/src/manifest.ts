import { POST_RECORD_KEY_ORDER, type Post, RFC_RECORD_KEY_ORDER, type Rfc } from './schema';

const POST_IMAGE_KEY_ORDER = ['src', 'alt', 'aspectRatio'] as const;

// Pure functions, no I/O — the caller (content-data/build.ts) owns Bun.write.
// JSON.stringify's array-form replacer filters AND orders keys at every depth,
// so a single array covers both the record shape and the nested `image` shape.
export function buildPostManifest(records: readonly Post[]): string {
  const keyFilter = [...POST_RECORD_KEY_ORDER, ...POST_IMAGE_KEY_ORDER];
  return JSON.stringify(records, keyFilter, 2) + '\n';
}

export function buildRfcManifest(records: readonly Rfc[]): string {
  const keyFilter = [...RFC_RECORD_KEY_ORDER];
  return JSON.stringify(records, keyFilter, 2) + '\n';
}
