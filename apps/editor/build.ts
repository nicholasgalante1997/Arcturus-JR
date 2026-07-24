import { watch } from 'fs';

import { webSrcAliasPlugin } from './build-plugins';

export {};

const OUTDIR = 'dist/client';
const WATCH = process.argv.includes('--watch');

async function bundleJs(): Promise<void> {
  await Bun.build({
    entrypoints: ['src/client/bootstrap.tsx'],
    format: 'esm',
    target: 'browser',
    minify: !WATCH,
    outdir: OUTDIR,
    naming: { entry: 'bootstrap.js' },
    splitting: false,
    sourcemap: 'external',
    plugins: [webSrcAliasPlugin]
  });
}

async function buildCss(): Promise<void> {
  await Bun.$`bunx postcss src/client/styles.css -o ${OUTDIR}/styles.css`.quiet();
}

async function copyHtml(): Promise<void> {
  await Bun.write(`${OUTDIR}/index.html`, await Bun.file('src/client/index.html').text());
}

async function build(): Promise<void> {
  const start = performance.now();
  await Promise.all([bundleJs(), buildCss(), copyHtml()]);
  console.log(`@arcjr/editor client built in ${(performance.now() - start).toFixed(0)}ms`);
}

try {
  console.log('Building @arcjr/editor (client)...');
  await Bun.$`rm -rf ${OUTDIR}`.quiet();
  await build();

  if (WATCH) {
    let pending: ReturnType<typeof setTimeout> | null = null;
    console.log('Watching src/client for changes...');
    watch('src/client', { recursive: true }, () => {
      if (pending) clearTimeout(pending);
      pending = setTimeout(() => {
        build().catch((e) => console.error('Rebuild failed:', e));
      }, 80);
    });
  }
} catch (e) {
  console.error('Build failed: ', e);
  if (!WATCH) {
    await Bun.$`rm -rf ${OUTDIR}`.quiet();
    process.exit(1);
  }
}
