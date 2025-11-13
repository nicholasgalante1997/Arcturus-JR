# SWC Complete Guide: From Basics to React Integration

## What is SWC?

**SWC (Speedy Web Compiler)** is a super-fast TypeScript/JavaScript compiler written in Rust. It's designed as a drop-in replacement for Babel with significantly better performance.

### SWC vs Babel Comparison

| Feature | SWC | Babel |
|---------|-----|-------|
| **Language** | Rust | JavaScript |
| **Speed** | 10-20x faster | Baseline |
| **Bundle Size** | Smaller runtime | Larger runtime |
| **Memory Usage** | Lower | Higher |
| **Plugin Ecosystem** | Growing | Mature |
| **Configuration** | Similar to Babel | Extensive |
| **TypeScript** | Native support | Requires preset |
| **JSX** | Native support | Requires preset |
| **Minification** | Built-in | Requires plugins |

### Performance Benefits

```bash
# Typical build time improvements:
# Small project (1000 files): 5s → 1s
# Medium project (5000 files): 30s → 3s  
# Large project (10000+ files): 2min → 10s
```

## SWC Configuration Deep Dive

### Basic .swcrc Structure

```json
{
  "jsc": {
    "parser": { /* Parser options */ },
    "transform": { /* Transform options */ },
    "target": "es2022",
    "loose": false,
    "externalHelpers": false,
    "keepClassNames": false,
    "minify": { /* Minification options */ }
  },
  "module": { /* Module system options */ },
  "minify": false,
  "sourceMaps": true,
  "env": { /* Environment-specific configs */ }
}
```

### Parser Configuration (`jsc.parser`)

Controls how SWC parses your source code:

```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript", // or "typescript"
      "jsx": false, // Enable JSX parsing
      "dynamicImport": true, // Support dynamic imports
      "privateMethod": true, // Support private methods
      "functionBind": false, // Support :: bind operator
      "exportDefaultFrom": true, // Support export v from "mod"
      "exportNamespaceFrom": true, // Support export * as ns from "mod"
      "decorators": false, // Support decorators
      "decoratorsBeforeExport": false, // Decorator placement
      "topLevelAwait": true, // Support top-level await
      "importMeta": true // Support import.meta
    }
  }
}
```

**What each option does:**

- **`syntax`**: Language to parse (`"ecmascript"` or `"typescript"`)
- **`jsx`**: Enables JSX syntax parsing (required for React)
- **`dynamicImport`**: Allows `import()` expressions
- **`privateMethod`**: Enables `#privateMethod()` syntax
- **`exportDefaultFrom`**: Allows `export default from "./module"`
- **`topLevelAwait`**: Enables `await` at module top level
- **`importMeta`**: Enables `import.meta.url` etc.

### Transform Configuration (`jsc.transform`)

Controls code transformations:

```json
{
  "jsc": {
    "transform": {
      "react": {
        "runtime": "automatic", // or "classic"
        "importSource": "react", // Custom JSX import source
        "pragma": "React.createElement", // JSX pragma (classic mode)
        "pragmaFrag": "React.Fragment", // Fragment pragma
        "throwIfNamespace": true, // Error on <ns:tag>
        "development": false, // Enable dev helpers
        "useBuiltins": false, // Use built-in helpers
        "refresh": false // Enable React Fast Refresh
      },
      "optimizer": {
        "globals": {
          "vars": {
            "__DEBUG__": "false",
            "process.env.NODE_ENV": "production"
          }
        },
        "simplify": true, // Simplify expressions
        "jsonify": {
          "minCost": 0 // Convert objects to JSON when beneficial
        }
      },
      "legacyDecorator": false, // Use legacy decorator transform
      "decoratorMetadata": false // Emit decorator metadata
    }
  }
}
```

### Target and Compatibility (`jsc.target`)

```json
{
  "jsc": {
    "target": "es2022", // Target ECMAScript version
    "loose": false, // Use loose transformations (faster, less spec-compliant)
    "externalHelpers": false, // Use external helper library
    "keepClassNames": false // Preserve class names in minified code
  }
}
```

**Target options:**
- `es3`, `es5`, `es2015`, `es2016`, `es2017`, `es2018`, `es2019`, `es2020`, `es2021`, `es2022`
- **`loose: true`**: Faster but less spec-compliant transformations
- **`externalHelpers`**: Reduces bundle size by using shared helpers

### Module System (`module`)

```json
{
  "module": {
    "type": "es6", // "commonjs", "umd", "amd", "es6"
    "strict": false, // Add "use strict"
    "strictMode": true, // Parse in strict mode
    "lazy": false, // Lazy evaluation of modules
    "noInterop": false // Disable interop helpers
  }
}
```

### Minification (`jsc.minify`)

```json
{
  "jsc": {
    "minify": {
      "compress": {
        "arguments": true, // Optimize arguments usage
        "arrows": true, // Convert functions to arrows when possible
        "booleans": true, // Optimize boolean expressions
        "booleans_as_integers": false, // Convert booleans to 0/1
        "collapse_vars": true, // Collapse single-use variables
        "comparisons": true, // Optimize comparisons
        "computed_props": true, // Optimize computed properties
        "conditionals": true, // Optimize if statements
        "dead_code": true, // Remove unreachable code
        "directives": true, // Remove redundant directives
        "drop_console": false, // Remove console.* calls
        "drop_debugger": true, // Remove debugger statements
        "evaluate": true, // Evaluate constant expressions
        "expression": false, // Preserve completion values
        "hoist_funs": false, // Hoist function declarations
        "hoist_props": true, // Hoist properties from constants
        "hoist_vars": false, // Hoist var declarations
        "if_return": true, // Optimize if/return sequences
        "join_vars": true, // Join consecutive var statements
        "keep_classnames": false, // Keep class names
        "keep_fargs": true, // Keep function arguments
        "keep_fnames": false, // Keep function names
        "keep_infinity": false, // Keep Infinity literal
        "loops": true, // Optimize loops
        "negate_iife": true, // Negate IIFEs for better compression
        "properties": true, // Optimize property access
        "reduce_funcs": true, // Reduce function calls
        "reduce_vars": true, // Reduce variables
        "side_effects": true, // Remove side-effect-free code
        "switches": true, // Optimize switch statements
        "typeofs": true, // Optimize typeof expressions
        "unsafe": false, // Enable unsafe optimizations
        "unsafe_arrows": false, // Convert functions to arrows unsafely
        "unsafe_comps": false, // Unsafe comparison optimizations
        "unsafe_function": false, // Unsafe function optimizations
        "unsafe_math": false, // Unsafe math optimizations
        "unsafe_symbols": false, // Unsafe symbol optimizations
        "unsafe_methods": false, // Unsafe method optimizations
        "unsafe_proto": false, // Unsafe prototype optimizations
        "unsafe_regexp": false, // Unsafe regex optimizations
        "unsafe_undefined": false, // Unsafe undefined optimizations
        "unused": true // Remove unused variables
      },
      "mangle": {
        "props": {
          "regex": "^_", // Mangle properties matching regex
          "undeclared": false, // Mangle undeclared properties
          "reserved": [] // Reserved property names
        },
        "top_level": false, // Mangle top-level names
        "keep_class_names": false, // Keep class names when mangling
        "keep_fn_names": false, // Keep function names when mangling
        "keep_private_props": false, // Keep private properties
        "ie8": false, // IE8 compatibility
        "safari10": false // Safari 10 compatibility
      }
    }
  }
}
```

## Your Project Configuration

Based on your current setup, here's an optimized SWC config:

```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": false,
      "dynamicImport": true,
      "exportDefaultFrom": true,
      "topLevelAwait": true,
      "importMeta": true
    },
    "target": "es2022",
    "loose": false,
    "externalHelpers": false,
    "keepClassNames": false
  },
  "module": {
    "type": "es6",
    "strict": false,
    "strictMode": true
  },
  "sourceMaps": true,
  "env": {
    "targets": {
      "chrome": "90",
      "firefox": "90",
      "safari": "14",
      "edge": "90"
    }
  }
}
```

## SWC with React and Webpack

### Step 1: Install Dependencies

```bash
# Remove Babel
bun remove babel-loader @babel/core @babel/preset-env @babel/preset-react

# Install SWC
bun add -D @swc/core swc-loader
```

### Step 2: React SWC Configuration

Create `.swcrc` for React project:

```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": true,
      "dynamicImport": true,
      "privateMethod": true,
      "functionBind": false,
      "exportDefaultFrom": true,
      "exportNamespaceFrom": true,
      "decorators": false,
      "decoratorsBeforeExport": false,
      "topLevelAwait": true,
      "importMeta": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "importSource": "react",
        "pragma": "React.createElement",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": false,
        "refresh": true
      },
      "optimizer": {
        "globals": {
          "vars": {
            "__DEV__": "false",
            "process.env.NODE_ENV": "production"
          }
        }
      }
    },
    "target": "es2020",
    "loose": false,
    "externalHelpers": false,
    "keepClassNames": false
  },
  "module": {
    "type": "es6",
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  },
  "sourceMaps": true,
  "env": {
    "targets": {
      "chrome": "61",
      "firefox": "60",
      "safari": "11",
      "edge": "16"
    }
  }
}
```

### Step 3: Webpack Configuration for React

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            // Options can be specified here or in .swcrc
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
                dynamicImport: true,
                topLevelAwait: true
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: process.env.NODE_ENV === 'development',
                  refresh: process.env.NODE_ENV === 'development'
                }
              },
              target: 'es2020'
            },
            module: {
              type: 'es6'
            }
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
```

### Step 4: Environment-Specific Configurations

```json
{
  "env": {
    "development": {
      "jsc": {
        "transform": {
          "react": {
            "development": true,
            "refresh": true
          }
        }
      },
      "sourceMaps": "inline"
    },
    "production": {
      "jsc": {
        "minify": {
          "compress": {
            "drop_console": true,
            "drop_debugger": true,
            "dead_code": true
          },
          "mangle": true
        }
      },
      "minify": true,
      "sourceMaps": false
    }
  }
}
```

### Step 5: TypeScript Support (Optional)

For TypeScript + React:

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    },
    "target": "es2020"
  }
}
```

### Step 6: Advanced React Features

#### React Fast Refresh (Hot Reloading)

```javascript
// webpack.config.js - Development
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  plugins: [
    new ReactRefreshWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              transform: {
                react: {
                  refresh: true // Enable Fast Refresh
                }
              }
            }
          }
        }
      }
    ]
  }
};
```

#### Emotion/Styled-Components Support

```json
{
  "jsc": {
    "experimental": {
      "plugins": [
        ["@swc/plugin-emotion", {
          "sourceMap": true,
          "autoLabel": "dev-only"
        }]
      ]
    }
  }
}
```

## Migration Checklist

### From Babel to SWC:

1. **Remove Babel dependencies**
   ```bash
   bun remove babel-loader @babel/core @babel/preset-env @babel/preset-react
   ```

2. **Install SWC**
   ```bash
   bun add -D @swc/core swc-loader
   ```

3. **Update webpack.config.js**
   - Replace `babel-loader` with `swc-loader`
   - Update file extensions to include `.tsx` if using TypeScript

4. **Create .swcrc**
   - Convert Babel presets to SWC config
   - Enable JSX parsing for React

5. **Test thoroughly**
   - Verify all features work
   - Check bundle size and performance
   - Test development and production builds

### Common Migration Issues:

1. **Plugin compatibility**: Some Babel plugins don't have SWC equivalents
2. **Syntax differences**: Minor config syntax differences
3. **Source maps**: May need adjustment for debugging
4. **Build tools**: Update any build scripts that reference Babel

## Performance Comparison

### Before (Babel):
```bash
# Typical React build times
npm run build  # 45s
npm run dev    # 8s initial, 2s rebuilds
```

### After (SWC):
```bash
# With SWC
npm run build  # 12s (73% faster)
npm run dev    # 2s initial, 0.3s rebuilds (85% faster)
```

## Best Practices

1. **Use .swcrc for shared config** across different tools
2. **Enable source maps** in development
3. **Use environment-specific configs** for optimization
4. **Test thoroughly** after migration
5. **Monitor bundle size** - SWC can produce smaller bundles
6. **Leverage built-in minification** instead of separate tools

This guide covers everything you need to understand SWC and migrate from Babel, whether for your current vanilla JS project or future React projects.
