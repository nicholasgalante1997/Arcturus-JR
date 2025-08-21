# Webpack Optimization Guide

This guide provides actionable optimizations for your webpack configuration to reduce build times and bundle sizes, including migration from Babel to SWC.

## 1. Enable Webpack Caching

**Current Issue**: Your `common.mjs` has `cache: false`

**Fix**: Enable persistent caching for faster rebuilds

```javascript
// webpack/common.mjs
export default {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  // ... rest of config
};
```

**Impact**: 50-90% faster subsequent builds

## 2. Replace Babel with SWC

**Benefits**: 10-20x faster transpilation, smaller bundle overhead

### Install SWC
```bash
bun add -D @swc/core swc-loader
bun remove babel-loader @babel/core @babel/preset-env
```

### Update webpack config
```javascript
// webpack/common.mjs - Replace babel-loader rule with:
{
  test: /\.(js|mjs|ts)$/,
  exclude: /node_modules/,
  use: {
    loader: 'swc-loader',
    options: {
      jsc: {
        parser: {
          syntax: 'ecmascript',
          jsx: false,
          dynamicImport: true,
          exportDefaultFrom: true
        },
        target: 'es2022',
        loose: false,
        externalHelpers: false,
        keepClassNames: false,
        minify: {
          compress: false,
          mangle: false
        }
      },
      module: {
        type: 'es6',
        strict: false,
        strictMode: true,
        lazy: false,
        noInterop: false
      },
      minify: false,
      sourceMaps: true
    }
  }
}
```

### Create .swcrc config
```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": false,
      "dynamicImport": true,
      "exportDefaultFrom": true
    },
    "target": "es2022",
    "loose": false,
    "externalHelpers": false
  },
  "module": {
    "type": "es6"
  },
  "sourceMaps": true
}
```

## 3. Optimize Bundle Splitting

**Current Issue**: Single entry point creates one large bundle

### Add to production config:
```javascript
// webpack/prod.mjs
const prod = {
  // ... existing config
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
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
          enforce: true
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
    sideEffects: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info']
          },
          mangle: true,
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  }
};
```

### Install TerserPlugin:
```bash
bun add -D terser-webpack-plugin
```

## 4. Enable Tree Shaking

### Update package.json:
```json
{
  "sideEffects": false
}
```

### For CSS files with side effects:
```json
{
  "sideEffects": ["*.css", "*.scss", "*.sass"]
}
```

## 5. Optimize Module Resolution

```javascript
// webpack/common.mjs
export default {
  resolve: {
    extensions: ['.js', '.mjs'], // Keep minimal - fewer lookups
    alias: {
      '@': path.resolve(process.cwd(), 'public', 'js')
    },
    modules: ['node_modules'], // Explicit module resolution
    symlinks: false, // Disable if not using symlinks
    cacheWithContext: false
  }
};
```

## 6. Production-Only Optimizations

```javascript
// webpack/prod.mjs
import TerserPlugin from 'terser-webpack-plugin';

const prod = {
  // ... existing config
  output: {
    clean: true, // Change from false to true
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].[contenthash:8].js', // Shorter hash
    chunkFilename: '[name].[contenthash:8].chunk.js',
    module: true,
    chunkFormat: 'module',
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]'
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 250000,
    maxAssetSize: 250000
  }
};
```

## 7. Development Optimizations

```javascript
// webpack/development.mjs
const dev = {
  // ... existing config
  cache: {
    type: 'memory'
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  output: {
    pathinfo: false
  },
  devServer: {
    // ... existing devServer config
    hot: true,
    liveReload: false // Use HMR instead
  }
};
```

## 8. Bundle Analysis

### Install bundle analyzer:
```bash
bun add -D webpack-bundle-analyzer
```

### Add script to package.json:
```json
{
  "scripts": {
    "analyze": "webpack-bundle-analyzer dist/main.*.js"
  }
}
```

## 9. Parallel Processing

### Install thread-loader for CPU-intensive tasks:
```bash
bun add -D thread-loader
```

### Use for SWC (if needed for large codebases):
```javascript
{
  test: /\.(js|mjs)$/,
  exclude: /node_modules/,
  use: [
    'thread-loader',
    {
      loader: 'swc-loader',
      // ... swc options
    }
  ]
}
```

## 10. Environment-Specific Plugins

### Remove ProgressPlugin in production:
```javascript
// webpack/common.mjs - Move ProgressPlugin to development only
// webpack/development.mjs
plugins: [
  new webpack.ProgressPlugin()
]
```

## Expected Performance Improvements

- **Build Time**: 60-80% reduction with SWC + caching
- **Bundle Size**: 20-40% reduction with proper splitting and tree shaking
- **Development**: Near-instant rebuilds with caching
- **Production**: Optimized chunks for better caching

## Implementation Order

1. Enable filesystem caching (immediate 50%+ build time improvement)
2. Replace Babel with SWC (major speed boost)
3. Add bundle splitting (better caching, smaller initial loads)
4. Enable tree shaking (smaller bundles)
5. Add production optimizations (final polish)

## Verification Commands

```bash
# Build and analyze
bun run build
bun run analyze

# Check build times
time bun run bundle

# Verify chunk sizes
ls -la dist/*.js
```

## Additional Notes

- Your project already uses ES modules (`"type": "module"`), which is optimal
- Consider adding TypeScript support to SWC config if you plan to migrate
- The `externals` configuration in your prod config is good for keeping peer dependencies external
- Your current target `es2023` is modern and efficient

This configuration should significantly improve your build performance while maintaining or improving bundle efficiency.
