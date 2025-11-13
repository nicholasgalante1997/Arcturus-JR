# Build System and Webpack Rules

## Purpose
Define standards for Webpack configuration, build optimization, and bundling strategies.

## Priority
**Medium**

## Instructions

### Webpack Configuration Structure

**ALWAYS** use modular Webpack configuration split by environment (ID: MODULAR_CONFIG)

**ALWAYS** use `.mjs` extension for Webpack config files (ID: MJS_EXTENSION)

**ALWAYS** maintain separate configs for common, development, and production (ID: SEPARATE_CONFIGS)

```
webpack/
├── common.mjs       # Shared configuration
├── development.mjs  # Dev server config
├── prod.mjs         # Production optimizations
├── swc/             # SWC compiler options
└── utils/           # Build utilities
```

### Module Resolution

**ALWAYS** configure path aliases matching tsconfig.json (ID: PATH_ALIASES)

```javascript
resolve: {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
    '@public': path.resolve(process.cwd(), 'public')
  }
}
```

**ALWAYS** resolve extensions in this order: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs` (ID: EXTENSION_ORDER)

**ALWAYS** disable Node.js polyfills for browser bundles (ID: NO_NODE_POLYFILLS)

### Compilation with SWC

**ALWAYS** use SWC loader instead of Babel for TypeScript/JSX compilation (ID: USE_SWC)

**ALWAYS** use thread-loader for parallel compilation (ID: THREAD_LOADER)

```javascript
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
}
```

**ALWAYS** target ES2022 for modern browsers (ID: ES2022_TARGET)

**ALWAYS** use React 19's automatic JSX runtime in SWC config (ID: AUTO_JSX_RUNTIME)

### Code Splitting Strategy

**ALWAYS** split vendor code into separate chunk (ID: VENDOR_CHUNK)

**ALWAYS** extract Webpack runtime into separate chunk (ID: RUNTIME_CHUNK)

**ALWAYS** create separate chunk for React runtime (ID: REACT_CHUNK)

**ALWAYS** use lazy loading for route components (ID: LAZY_ROUTES)

```javascript
optimization: {
  runtimeChunk: 'single',
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
        minSize: 30000
      }
    }
  }
}
```

### Magic Comments for Dynamic Imports

**ALWAYS** use Webpack magic comments for lazy-loaded routes (ID: MAGIC_COMMENTS)

```typescript
import(
  /* webpackChunkName: "[request]~chunk" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  '@/pages/' + page
)
```

**ALWAYS** enable prefetch for route chunks (ID: PREFETCH_ROUTES)

**ALWAYS** use descriptive chunk names (ID: CHUNK_NAMES)

### Production Optimizations

**ALWAYS** enable Terser minification with SWC in production (ID: TERSER_MINIFY)

**ALWAYS** generate source maps for debugging (ID: SOURCE_MAPS)

**ALWAYS** remove comments in production builds (ID: REMOVE_COMMENTS)

**ALWAYS** enable tree shaking for dead code elimination (ID: TREE_SHAKING)

**ALWAYS** use content hashes in filenames for cache busting (ID: CONTENT_HASH)

**ALWAYS** use ES modules output format (ID: ES_MODULES_OUTPUT)

### Development Configuration

**ALWAYS** use Webpack Dev Server for local development (ID: DEV_SERVER)

**ALWAYS** enable Hot Module Replacement (HMR) (ID: HMR)

**ALWAYS** use React Refresh for fast refresh (ID: REACT_REFRESH)

```javascript
devServer: {
  hot: true,
  port: 3000,
  historyApiFallback: true
}
```

### Environment Variables

**ALWAYS** inject environment variables using EnvironmentPlugin (ID: ENV_PLUGIN)

**ALWAYS** use `.env` files for environment-specific configuration (ID: ENV_FILES)

**NEVER** commit sensitive environment variables to version control (ID: NO_COMMIT_SECRETS)

### Build Scripts

**ALWAYS** run these build steps in order (ID: BUILD_ORDER):
1. Clean previous builds (`rm -rf dist`)
2. Bundle with Webpack (`webpack --config webpack/prod.mjs`)
3. Copy static assets (ciphers, workers, markdown, styles)
4. Prerender routes (`bun run scripts/prerender.tsx`)
5. Process CSS with PostCSS

### Asset Handling

**ALWAYS** place static assets in `public/` directory (ID: PUBLIC_ASSETS)

**ALWAYS** copy assets to `dist/` during build (ID: COPY_ASSETS)

**NEVER** import CSS files in TypeScript - use native link tags (ID: NO_CSS_IMPORTS)

### Performance Monitoring

**ALWAYS** use webpack-bundle-analyzer for bundle size analysis (ID: BUNDLE_ANALYZER)

**ALWAYS** monitor chunk sizes and optimize large bundles (ID: MONITOR_CHUNKS)

**ALWAYS** aim for initial bundle size under 200KB gzipped (ID: BUNDLE_SIZE_TARGET)

### Caching Strategy

**ALWAYS** use filesystem caching in development (ID: FS_CACHE)

**ALWAYS** disable caching in Docker builds (ID: NO_DOCKER_CACHE)

**ALWAYS** include config files in cache dependencies (ID: CACHE_DEPS)

### Docker Considerations

**ALWAYS** disable parallel processing in Docker environments (ID: NO_DOCKER_PARALLEL)

**ALWAYS** check `BUILD_ENV` environment variable for Docker detection (ID: DOCKER_ENV_CHECK)

## Error Handling

Build errors should fail fast with clear error messages. Use Webpack's stats configuration to control output verbosity.

## Examples

### Complete Production Webpack Config

```javascript
// webpack/prod.mjs
import 'dotenv/config.js';

import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import { debugConfig } from './utils/debug.mjs';
import {
  addSplitChunksWebpackOptimization,
  addWebpackRuntimeSplitChunkOptimization
} from './utils/optimizations.mjs';
import { pipeline } from './utils/pipeline.mjs';
import WebpackCommonConfig from './common.mjs';

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
    }),
    process.env?.CI &&
      sentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'nickg',
        project: 'sentry-arc'
      })
  ].filter(Boolean)
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
```

### Complete Common Webpack Config

```javascript
// webpack/common.mjs
import os from 'os';
import path from 'path';
import url from 'url';
import webpack from 'webpack';

import swc_prod from './swc/prod.mjs';

var __filename = url.fileURLToPath(import.meta.url);
var inDockerEnv = process.env.BUILD_ENV === 'docker';

/** @type {webpack.Configuration} */
export default {
  cache: inDockerEnv
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
```

### SWC Production Configuration

```javascript
// webpack/swc/prod.mjs
export default {
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
};
```

### Split Chunks Optimization Utility

```javascript
// webpack/utils/optimizations.mjs
import { merge } from 'webpack-merge';

export function addSplitChunksWebpackOptimization(config) {
  return merge(config, {
    optimization: {
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
            minSize: 30000
          }
        }
      }
    }
  });
}

export function addWebpackRuntimeSplitChunkOptimization(config) {
  return merge(config, {
    optimization: {
      runtimeChunk: 'single'
    }
  });
}
```
