// pathモジュールを読む(output.pathに絶対パスを指定するため)
const path = require('path');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 指定可能対象：none,development,production
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development',
  entry: ['whatwg-fetch', src + '/index.js'],

  output: {
    path: dist,
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
          // babelのオプションを指定する
          options: {
            // reactが使用するjsxを解釈できるようにする
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-runtime',
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
    // contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  },

  // webpackで生成したJavaScriptやCSSを埋め込んだHTMLを生成
  // ここで指定されたファイルをベースにして、bundle.jsを埋め込んだファイルをdist内に生成する
  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html',
    }),
  ],
};
