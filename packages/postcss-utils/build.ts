import { build } from 'bun';

import { peerDependencies } from "./package.json";

export {};

console.log("🌌 Building PostCSS Utils...\n");

await build({
    entrypoints: ['lib/index.ts'],
    external: Object.keys(peerDependencies),
    format: 'esm',
    target: 'bun',
    footer: `// @made with bun & postcss!`,
    minify: false,
    naming: {
        entry: 'postcss.js'
    },
    outdir: 'dist',
    packages: "external",
    splitting: true,
    sourcemap: "linked",
});