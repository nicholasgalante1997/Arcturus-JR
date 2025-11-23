import os from 'os';
import path from 'path';
import webpack from 'webpack';

import swc_prod from './swc/prod.mjs';

/**
 * @type {webpack.Configuration}
 */
export default {
  cache: false,
  target: ['web', 'es2023'],
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
            options: swc_prod
          }
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    modules: ['node_modules'],
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '@public': path.resolve(process.cwd(), 'public')
    },
    fallback: {
      buffer: false,
      fs: false,
      path: false,
      process: false,
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.EnvironmentPlugin({ ...process.env })
  ]
};
