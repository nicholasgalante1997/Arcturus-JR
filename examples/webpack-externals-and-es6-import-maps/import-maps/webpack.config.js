const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PackageJson = require('./package.json');

function mapDependenciesToExternals(peerDependencies) {
  return Object.keys(peerDependencies)
    .map((dep) => ({ [dep]: dep }))
    .reduce((acc, next) => Object.assign(acc, next), {});
}

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  target: ['web', 'es2023'],
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
  externalsType: 'module',
  externals: mapDependenciesToExternals(PackageJson.dependencies),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html',
      inject: 'head',
      chunks: ['main'],
      publicPath: '/',
      title: 'PokeGrade',
      minify: {
        html5: true
      },
      scriptLoading: 'module'
    })
  ]
};
