import os from 'os';
import path from 'path';
import url from 'url';
import webpack from 'webpack';

var __filename = url.fileURLToPath(import.meta.url);
var inDockerEnv = process.env.BUILD_ENV === 'docker';

/**
 * @type {webpack.Configuration}
 */
export default {
  cache: inDockerEnv /** Unnecessary to cache in the docker environment */
    ? false
    : {
        buildDependencies: {
          config: [__filename]
        },
        type: 'filesystem'
      },
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
                    development: false,
                    refresh: false
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
      process: false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.EnvironmentPlugin({ ...process.env })
  ]
};
