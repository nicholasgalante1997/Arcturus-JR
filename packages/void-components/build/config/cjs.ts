import { BaseConfig } from './base';

export const ProdCJSBuild: typeof BaseConfig = {
    ...BaseConfig,
    entryPoints: ["src/index.ts"],
    format: "cjs",
    outdir: "dist",
    minify: true,
    outExtension: {
        '.js': '.cjs'
    }
};