export {};

try {
    console.log('Starting build for @arcjr/config...');
    const start = performance.now();
    await Bun.build({
        entrypoints: ['src/index.ts'],
        format: 'esm',
        target: 'bun',
        minify: true,
        outdir: 'dist',
        naming: {
            entry: 'index.js',
        },
        external: [],
        splitting: false,
        packages: "bundle",
        sourcemap: 'external',
    });

    console.log('Build finished in ' + (performance.now() - start).toFixed(2) + 'ms');

    const glob = new Bun.Glob('*.*');
    const scan_cfg: Bun.GlobScanOptions = {
        absolute: false,
        cwd: './dist',
        dot: true,
        followSymlinks: true,
        onlyFiles: true,
        throwErrorOnBrokenSymlink: true,
    };
    for await (const file of glob.scan(scan_cfg)) {
        const fh = Bun.file(`./dist/${file}`);
        console.log(`- ${file} (${(await fh.arrayBuffer()).byteLength} bytes)`);
    }
} catch(e) {
    console.error('Build failed: ', e);
    await Bun.$`rm -rf ./dist`; /** Clean up dist */
    process.exit(1);
}