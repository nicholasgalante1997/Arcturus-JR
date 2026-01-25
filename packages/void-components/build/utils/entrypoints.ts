
export async function getESMEntrypoints() {
    const glob = new Bun.Glob('**/*.{ts,tsx}');
    const files = await Array.fromAsync(glob.scan({ cwd: './src', absolute: true, }));
    return files.filter((file) => file.endsWith('index.ts'));
}