import path from 'path';
import webpack from 'webpack';

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
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.mjs'],
    alias: {
      '@': path.resolve(process.cwd(), 'public', 'js')
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
    new webpack.EnvironmentPlugin({ ...process.env }),
    new webpack.ProgressPlugin()
  ]
};
