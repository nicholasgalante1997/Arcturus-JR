#!/usr/bin/env bun

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
  // Bundle JS/TS
  const result = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "browser",
    format: "esm",
    sourcemap: "external",
    minify: false,
    splitting: false,
    external: ["react", "react-dom"],
  });

  if (!result.success) {
    console.error("❌ Build failed");
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }
}

async function bundleCSS() {
    // Bundle CSS - concatenate all component CSS
  const cssFiles = new Bun.Glob("src/**/*.css");
  const cssContent: string[] = [];

  for await (const file of cssFiles.scan(".")) {
    const content = await Bun.file(file).text();
    cssContent.push(`/* ${file} */\n${content}\n`);
  }

  await Bun.write("dist/index.css", cssContent.join("\n"));
}
