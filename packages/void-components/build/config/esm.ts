import { getESMEntrypoints } from '../utils/entrypoints';
import { BaseConfig } from './base';

export const ProdESMBuild: typeof BaseConfig = {
    ...BaseConfig,
    entryPoints: ["src/index.ts", ...(await getESMEntrypoints())],
    format: "esm",
    outdir: "dist",
    minify: false,
};