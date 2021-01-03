const webpack = require('webpack');
// pathモジュールを読む(output.pathに絶対パスを指定するため)
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// ここでの__dirnameはfrontendディレクトリ自体を指していると考えられる
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development',
  devtool: 'source-map',
  entry: ['whatwg-fetch', src + '/index.js'],

  output: {
    // ローカルにおける出力先（絶対パス）
    path: dist,
    // publicpathを指定しないと、どうやらページをリロードした際にbundle.jsはブラウザ上のカレントディレクトリに出力されるらしい
    // TODO: なぜbundle.jsはルート直下に置いておかないといけないのか
    publicPath: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        // loaderが処理するファイルの拡張子
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
    // :id指定でリロードした場合、何故かbundle.jsにhtmlが読み込まれている
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
    }),
  ],
};
