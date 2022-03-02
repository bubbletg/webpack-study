const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
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
            options: {
              // options 在loader 中可以通过 this.getOptions 拿到
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /(jpg|png|gif|bmp|jpeg)$/,
        use: [
          {
            loader: 'url-loader2',
            options: {
              // filename: '[hash].[ext]',
              limit: 1024 * 10,
              fallback: path.resolve(__dirname, 'webpack-loader/file-loader2.js'),
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: ['style-loader2', 'less-loader2'],
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
