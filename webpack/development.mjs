import path from 'path';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import WebpackCommonConfig from './common.mjs';

/**
 * @type {import('webpack').Configuration}
 */
const dev = {
  mode: 'development',
  entry: path.resolve(process.cwd(), 'public', 'js', 'bootstrap.js'),
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
      },
      {
        directory: path.resolve(process.cwd(), 'public', 'js'),
        publicPath: '/js'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'webpack/html/index.html',
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
