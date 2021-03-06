const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = (env) => {
  return {
    mode: 'none',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]].[hash].js',
      publicPath: '',
    },
    devServer: {
      hot: true, // 配置模块热更新
      compress: true, // 启动 压缩 gzip
      port: 8081, //
      open: true, //
      proxy: {
        '/api': {
          target: 'http://localhost:30001',
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env', // 只转换语法，不转换方法
                  // 使用  @babel/plugin-transform-runtime 就不用使用 useBuiltIns
                  // {
                  //   /**
                  //    * useBuiltIns 如果不设置，@babel/preset-env 只转化最新ES语法,不转化最新ES API,最新ES实例方
                  //    * 如果设置为 false 此时不对polyll做操作。如果引入@babe/polyfll ，则无视配置的浏览器兼容，引入所有的polyfll
                  //    */
                  //   useBuiltIns: 'usage',
                  //   corejs: {
                  //     version:3
                  //   },
                  // },
                ],
                '@babel/preset-react',
              ],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: 3, // 匹配corejs 可以转换API和方法
                    helpers: false,
                    regenerator: false, // 是否开启 generator 函数转换成 regenerator-runtime 来避免污染全局作用域
                  },
                ][('@babel/plugin-proposal-decorators', { legacy: true })], // legacy 旧的意思
                ['@babel/plugin-proposal-class-properties', { loose: true }], // loose 松散的意思
              ],
            },
          },
        },
        {
          test: /\.txt$/,
          type: 'asset/source',
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                // 启用/禁用 url() 处理
                url: true,
                // 启用/禁用 @import 处理
                import: true,
                // 启用/禁用 Sourcemap
                sourceMap: false,
              },
            },
            'postcss-loader',
            {
              loader: 'px2rem-loader',
              options: {
                remUnit: 75, // 一个rem 是多少个像素
                remPrecision: 8, //精度
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
      ],
    },
    plugins: [
      // 生成一个 index.html 文件，插入脚本
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        minify: {
          // 压缩html
          collapseWhitespace: true, //
          removeComments: true, //
        },
      }),
      new OptimizeCssAssetsWebpackPlugin(), // 压缩css
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'lodash',
            entry: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
            globalName: '_',
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/design'),
            to: path.resolve(__dirname, 'dist/design'),
          },
        ],
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPattern: '**/*.*',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
      }),
    ],
  };
};
