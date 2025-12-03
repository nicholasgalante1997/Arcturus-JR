import path from "path";

export async function getPeerDeps() {
    try {
        const packageJsonPath = path.resolve(process.cwd(), 'package.json');
        const packageJson = await Bun.file(packageJsonPath).json();
        if ("peerDependencies" in packageJson) {
            return Object.keys(packageJson.peerDependencies);
        }

        throw new Error("PackageJson missing key 'peerDependencies'");
    } catch(e) {
        console.warn('Unable to parse peer dependencies, ', e);
        // At a minimum these will always be external
        return ['react', 'react-dom'];
    }
}