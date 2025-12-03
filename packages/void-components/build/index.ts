import * as esbuild from 'esbuild';
import { ProdESMBuild } from './config/esm';
import { ProdCJSBuild } from './config/cjs';

export async function build() {
    console.log('esbuild process started')
    console.log('building esm...');
    try {
        await esbuild.build(ProdESMBuild);
        console.log('Finished esm build')
    } catch(e) {
        console.error('ESM build failed')
        console.error(e);
        process.exit(1);
    }

    console.log('building cjs...')
    try {
        await esbuild.build(ProdCJSBuild);
        console.log('Finished cjs build...');
    } catch(e) {
        console.error('CJS build failed')
        console.error(e);
        process.exit(1); 
    }

    console.log('Finished build');
}