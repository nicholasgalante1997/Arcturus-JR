import path from 'path';
import url from 'url';
import webpack from 'webpack';

var __filename = url.fileURLToPath(import.meta.url)

/**
 * @type {webpack.Configuration}
 */
export default {
  cache: {
    buildDependencies: {
      config: [__filename]
    },
    type: 'filesystem',
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
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.mjs'],
    modules: ['node_modules'],
    alias: {
      '@': path.resolve(process.cwd(), 'public', 'js')
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
    new webpack.EnvironmentPlugin({ ...process.env }),
    new webpack.ProgressPlugin()
  ]
};
