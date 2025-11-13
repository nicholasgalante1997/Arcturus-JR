#!/usr/bin/env bun

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'postcss';
import { build } from './build/index';

export {};

console.log("🌌 Building Void Components...\n");

const startTime = performance.now();

try {

  console.log('Building js output...')
  await bundle();
  console.log('Built js output!')

  console.log('Building css output...')
  await bundleCSS();
  console.log('Built css output!')

  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log("\n✨ Build complete!");
  console.log(`⏱️  Build time: ${duration}s`);
  console.log("\n📦 Output:");
  console.log("  - dist/index.js");
  console.log("  - dist/index.css");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}

async function bundle() {
  await build();
}

async function bundleCSS() {
    // Bundle CSS - concatenate all component CSS
  const cssFiles = new Bun.Glob("src/**/*.css");
  const cssContent: string[] = [];

  for await (const file of cssFiles.scan(".")) {
    const content = await Bun.file(file).text();
    const transform = await postcss([autoprefixer, cssnano]).process(content, {
      from: file,
      to: file
    })
    cssContent.push(`/* ${file} */\n${transform.css}\n`);
  }

  await Bun.write("dist/index.css", cssContent.join("\n"));
}
