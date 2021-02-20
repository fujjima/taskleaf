const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// pathモジュールを読む(output.pathに絶対パスを指定するため)
const path = require('path');
// ここでの__dirnameはfrontendディレクトリを指す
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

let API_URL = {
  production: JSON.stringify('prod-url'),
  development: JSON.stringify('http://localhost:3000/api'),
};

let environment =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  entry: ['whatwg-fetch', src + '/index.js'],
  output: {
    path: dist,
    // publicpathを指定しないと、ページリロードの際にbundle.jsはブラウザ上のカレントディレクトリに出力される
    // TODO: なぜbundle.jsはルート直下に置いておかないといけないのか
    publicPath: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
              '@babel/preset-react',
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(`${src}`), path.resolve('./node_modules')],
  },

  plugins: [
    new webpack.DefinePlugin({
      API_URL: API_URL[environment],
    }),
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      _: 'lodash',
      cn: 'classnames',
      U: path.resolve(`${src}/Util/Utils`),
      // JSにはMap型が既に存在しているため、ImmutableのMap型をIMapとして区別する
      IMap: ['immutable', 'Map'],
      IOrderedMap: ['immutable', 'OrderedMap'],
      ISeq: ['immutable', 'Seq'],
      ISet: ['immutable', 'Set'],
      IRecord: ['immutable', 'Record'],
      IList: ['immutable', 'List'],
    }),
  ],
};
