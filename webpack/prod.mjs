import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';
import { merge } from 'webpack-merge';
import PackageJson from '../package.json' with { type: 'json' };
import WebpackCommonConfig from './common.mjs';
import { debugConfig } from './utils/debug.mjs';
import { mapPeerDependenciesToExternals } from './utils/externals.mjs';
import { pipeline } from './utils/pipeline.mjs';
import {
  addSplitChunksWebpackOptimization,
  addWebpackRuntimeSplitChunkOptimization
} from './utils/optimizations.mjs';

/** @type {import('webpack').Configuration} */
const prod = {
  mode: 'production',
  entry: path.resolve(process.cwd(), 'src', 'main.tsx'),
  output: {
    clean: false,
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].[contenthash].js',
    module: true,
    chunkFormat: 'module'
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('webpack/html/prod.html'),
      filename: 'index.html',
      inject: 'head',
      chunks: ['main'],
      publicPath: '/',
      title: 'nickgalante.tech | A place for ideas about software.',
      minify: {
        html5: true
      },
      scriptLoading: 'module'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true
    })
  ]
};

/** @type {import('webpack').Configuration} */
const config = pipeline(
  addSplitChunksWebpackOptimization,
  addWebpackRuntimeSplitChunkOptimization
)(merge(WebpackCommonConfig, prod));

if (process.env.ARCJR_WEBPACK_DEBUG_CONFIG) {
  debugConfig(config);
}

export default config;
