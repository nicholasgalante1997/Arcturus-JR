import 'dotenv/config.js';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
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

var inDockerEnv = process.env.BUILD_ENV === 'docker';

/** @type {import('webpack').Configuration} */
const prod = {
  devtool: 'source-map',
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        parallel: !inDockerEnv, // Avoid worker_threads issues
        terserOptions: {
          compress: {
            ecma: 2020,
            passes: 2
          },
          mangle: true,
          format: {
            ecma: 2020,
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
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
