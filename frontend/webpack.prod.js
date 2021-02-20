const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

// TODO: 本番作ったら設定する
const config = {
  // API_ORIGIN = 'http://localhost:3000/api/'
};

module.exports = merge(common, {
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'production',
  output: {
    path: dist,
    publicPath: '/',
    filename: 'bundle.js',
  },

  // devServer: {
  //   contentBase: path.join(__dirname, 'dist'),
  //   host: 'localhost',
  //   port: 8080,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  //     'Access-Control-Allow-Headers':
  //       'X-Requested-With, content-type, Authorization',
  //     'Access-Control-Allow-Credentials': 'true',
  //   },
  //   // /api以下へのリクエストの送信先を設定する
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000/',
  //       pathRewrite: { '^/api': '' },
  //     },
  //   },
  //   historyApiFallback: {
  //     rewrites: [{ from: /^\/*/, to: '/index.html' }],
  //   },
  // },
});
