const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  resolveLoader: {
    // 使用别名
    alias: {
      'babel-loader': path.resolve(__dirname, 'webpack-loader/babel-loader.js'),
    },
    // 使用模块
    modules: [path.resolve(__dirname, 'webpack-loader')],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          /**
           *  如何使用自定义 loader
           */
          {
            loader: 'babel-loader',
            options: { // options 在loader 中可以通过 this.getOptions 拿到
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
};
