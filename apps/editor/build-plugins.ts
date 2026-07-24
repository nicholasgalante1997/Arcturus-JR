import path from 'path';

import type { BunPlugin } from 'bun';

const WEB_SRC_DIR = path.resolve(import.meta.dir, '../web/src');
const CANDIDATE_EXTENSIONS = ['.tsx', '.ts', '/index.tsx', '/index.ts'];

async function resolveWithExtension(basePath: string): Promise<string> {
  for (const ext of CANDIDATE_EXTENSIONS) {
    const candidate = `${basePath}${ext}`;
    if (await Bun.file(candidate).exists()) return candidate;
  }
  return basePath;
}

// apps/web resolves its own `@/*` imports via webpack's resolve.alias (see
// apps/web/webpack/common.mjs) -> apps/web/src. Editor code reaches into that
// tree explicitly via `@web/*` (see tsconfig.json) to reuse Base/Markdown
// directly for preview parity (execution spec's R3 mitigation — reuse, don't
// fork). Once inside a file under apps/web/src, though, that file's own `@/`
// imports (e.g. Base/Markdown's `@/utils/pipeline`) need the *same* remap —
// Bun's native tsconfig-paths resolution only knows about editor's own
// tsconfig, not apps/web's. Scoped by importer so editor's own `@/*` imports
// (resolved natively via editor's tsconfig) are left alone.
export const webSrcAliasPlugin: BunPlugin = {
  name: 'web-src-alias',
  setup(build) {
    build.onResolve({ filter: /^@web\// }, async (args) => {
      const relative = args.path.slice('@web/'.length);
      const resolved = await resolveWithExtension(path.resolve(WEB_SRC_DIR, relative));
      return { path: resolved };
    });

    build.onResolve({ filter: /^@\// }, async (args) => {
      if (!args.importer.startsWith(WEB_SRC_DIR)) return undefined;
      const relative = args.path.slice(2);
      const resolved = await resolveWithExtension(path.resolve(WEB_SRC_DIR, relative));
      return { path: resolved };
    });
  }
};
