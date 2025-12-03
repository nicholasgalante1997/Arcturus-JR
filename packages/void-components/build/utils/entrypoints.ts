import { PUBLIC_COMPONENTS } from './components';

export async function getESMEntrypoints() {
    const glob = new Bun.Glob('**/*.{ts,tsx}');
    const files = await Array.fromAsync(glob.scan({ cwd: './src', absolute: true, }));
    return files.filter((file) => {
        if (!file.endsWith('index.ts')) return false;
        for (const component of PUBLIC_COMPONENTS) {
            if (file.includes(component)) return true;
        }

        return false;
    });
}