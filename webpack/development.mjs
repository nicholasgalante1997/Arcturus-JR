import 'dotenv/config.js';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import os from 'os';
import path from 'path';
import { merge } from 'webpack-merge';

import swc_dev from './swc/dev.mjs';
import WebpackCommonConfig from './common.mjs';

/**
 * @type {import('webpack').Configuration}
 */
const dev = {
  mode: 'development',
  entry: path.resolve(process.cwd(), 'src', 'main.tsx'),
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 4200,
    open: true,
    static: [
      {
        directory: path.resolve(process.cwd(), 'public', 'css'),
        publicPath: '/css'
      },
      {
        directory: path.resolve(process.cwd(), 'public', 'assets'),
        publicPath: '/assets'
      },
      {
        directory: path.resolve(process.cwd(), 'public', 'content'),
        publicPath: '/content'
      }
    ]
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1
            }
          },
          {
            loader: 'swc-loader',
            options: swc_dev
          }
        ]
      }
    ]
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'webpack/html/dev.html',
      inject: 'body',
      chunks: 'all',
      publicPath: '/'
    })
  ]
};

export default merge(WebpackCommonConfig, dev);

/**
 * SECTION Related Links
 * https://webpack.js.org/guides/code-splitting/#dynamic-imports (Chunking output for optimization)
 * https://webpack.js.org/configuration/entry-context/#naming (Chunking shared deps in entry object)
 * https://web.dev/publish-modern-javascript/?utm_source=lighthouse&utm_medium=devtools
 */
