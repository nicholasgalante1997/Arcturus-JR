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
};
