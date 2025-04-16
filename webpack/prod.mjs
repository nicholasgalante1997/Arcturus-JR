import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { merge } from 'webpack-merge';
import WebpackCommonConfig from './common.mjs';
import PackageJson from '../package.json' with { type: 'json' };

function mapPeerDependenciesToExternals(peerDependencies) {
  return Object.keys(peerDependencies)
    .map((dep) => ({ [dep]: dep }))
    .reduce((acc, next) => Object.assign(acc, next), {});
}

/** @type {import('webpack').Configuration} */
const prod = {
  mode: 'production',
  entry: path.resolve(process.cwd(), 'src', 'bootstrap.js'),
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
  externalsType: 'module',
  externals: mapPeerDependenciesToExternals(PackageJson.peerDependencies),
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('webpack/html/index.html'),
      filename: 'index.html',
      inject: 'head',
      chunks: ['main'],
      publicPath: '/',
      title: 'nickgbytes.co | A place for ideas.',
      minify: {
        html5: true
      },
      scriptLoading: 'module'
    })
  ]
};

export default merge(WebpackCommonConfig, prod);
