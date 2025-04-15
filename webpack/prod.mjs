import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { merge } from 'webpack-merge';
import WebpackCommonConfig from './common.mjs';

/** @type {import('webpack').Configuration} */
const prod = {
  mode: 'production',
  entry: path.resolve(process.cwd(), 'public', 'js', 'bootstrap.js'),
  output: {
    clean: false,
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].[hash].js',
    module: true,
    chunkFormat: 'module'
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('webpack/html/index.html'),
      filename: 'index.html',
      inject: 'head',
      chunks: ['main'],
      publicPath: '/',
      title: 'nickgbytes.co | A place for ideas.'
    })
  ]
};

export default merge(WebpackCommonConfig, prod);