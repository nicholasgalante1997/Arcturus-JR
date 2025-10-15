import { merge } from 'webpack-merge';

var optimize = true;

/**
 * @param {import('webpack').Configuration} config
 * @param {boolean} optimize
 *
 * @returns {import('webpack').Configuration}
 */
export function addSplitChunksWebpackOptimization(config) {
  if (!optimize) {
    return config;
  }

  return merge(config, {
    optimization: {
      /** @see https://webpack.js.org/plugins/split-chunks-plugin */
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          'react-runtime': {
            test: /[\\/]node_modules[\\/](^react$|^react-dom$)[\\/]/,
            name: 'react-runtime',
            chunks: 'all',
            priority: 15,
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
            minSize: 30000 // Prevent tiny common chunks
          }
        }
      }
    }
  });
}

/**
 * @param {import('webpack').Configuration} config
 * @param {boolean} optimize
 *
 * @returns {import('webpack').Configuration}
 */
export function addWebpackRuntimeSplitChunkOptimization(config) {
  if (!optimize) {
    return config;
  }

  return merge(config, {
    optimization: {
      /** @see https://webpack.js.org/configuration/optimization/#optimizationruntimechunk */
      runtimeChunk: 'single'
    }
  });
}
