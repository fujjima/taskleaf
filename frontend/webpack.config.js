const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// pathモジュールを読む(output.pathに絶対パスを指定するため)
const path = require('path');
// ここでの__dirnameはfrontendディレクトリ自体を指す
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development',
  devtool: 'source-map',
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

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: 'localhost',
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
    // /api以下へのリクエストの送信先を設定する
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        pathRewrite: { '^/api': '' },
      },
    },
    historyApiFallback: {
      rewrites: [{ from: /^\/*/, to: '/index.html' }],
    },
  },

  // webpackで生成したJavaScriptやCSSを埋め込んだHTMLを生成
  // ここで指定されたファイルをベースにして、bundle.jsを埋め込んだファイルをdist内に生成する
  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      _: 'lodash',
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
