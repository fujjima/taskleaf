const { merge } = require('webpack-merge');
const common = require('./webpack.common.ts');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = merge(common, {
  // webpackのoption以外の設定
  // config: {
  //   API_ORIGIN: 'http://localhost:3000/api/',
  // },

  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development',
  devtool: 'inline-source-map',

  output: {
    path: dist,
    // publicpathを指定しないと、ページリロードの際にbundle.jsはブラウザ上のカレントディレクトリに出力される
    // TODO: なぜbundle.jsはルート直下に置いておかないといけないのか
    publicPath: '/',
    filename: 'bundle.js',
  },

  devServer: {
    // ref) https://qiita.com/chocomint_t/items/4bc57945bce081922582
    static: {
      directory: path.join(__dirname, 'dist'),
    },
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
});
