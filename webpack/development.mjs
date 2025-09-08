import os from "os";
import path from 'path';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

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
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                  topLevelAwait: true,
                  importMeta: true,
                  exportDefaultFrom: false
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: true,
                    refresh: true
                  }
                },
                target: 'es2022',
                loose: false,
                externalHelpers: false,
                keepClassNames: true
              },
              module: {
                type: 'es6',
                strict: false,
                strictMode: true
              },
              sourceMaps: true,
              minify: false
            }
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
