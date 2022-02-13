const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = (env) => {
  return {
    mode: process.env.NODE_ENV,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '',
    },
    // watch: true, // 添加监控模式
    // watchOptions: {
    //   ignored: /node_modules/, // 忽略的文件夹
    //   aggregateTimeout: 300, //监听到变化发生后会等300再去执行 其实是一个防抖的优化
    //   poll: 1000,
    // },
    // exports: {
    //   loader: '_', // 如果在模块内部引用了lodash这个模块，会从window._ 上取值
    //   jquery: 'jQuery', //如果在模块内部引用了jquery这个模块，会从window.jQuery上取值
    // },
    devServer: {
      hot: true, // 配置模块热更新
      // contentBase: path.resolve(__dirname, 'public'),
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
        // {
        //   test: require.resolve('lodash'),
        //   loader: 'expose-loader',
        //   options: {
        //     exposes: {
        //       globalName: '_',
        //       override: true,
        //     },
        //   },
        // },
        // {
        //   test: /\.jsx?$/,
        //   loader: 'eslint-loader', // This loader has been deprecated. Please use eslint-webpack-plugin
        //   enforce: 'pre',
        //   options: {
        //     fix: true,
        //   },
        //   exclude: /node_modules/, // 对于
        // },
        {
          test: /\.jsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }], // legacy 旧的意思
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
            {
              loader: 'style-loader',
            },
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
          ],
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          // use: [
          //   {
          //     loader: 'url-loader',
          //     options: {
          //       name: '[hash:10].[ext]',
          //       esModule: false, // 是否包装成一个 ES6 模块
          //       limit: 8*1024,
          //     },
          //   },
          // ],
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
      }),
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
        cleanOnceBeforeBuildPattern: '**/.*',
      }),
      // // 不让 webpack 生成 sourcemap
      // new webpack.SourceMapDevToolPlugin({
      //   // 会在打包后文件的尾部添加一行这样的文件
      //   append: `\n//# sourceMappingURL=http://127.0.0.1:8080/[url]`,
      // }),
      // // 文件管理插件，可以帮我们拷贝文件。
      // new FileManagerPlugin({
      //   events: {
      //     onEnd: {
      //       copy: [ // 拷贝
      //         {
      //           source: './dist/*.map', // 要拷贝的文件
      //           destination: '/dist/', // 拷贝的目录
      //         },
      //       ],
      //       delete: [ // 删除

      //       ]
      //     },
      //   },
      // }),
      // // 自动动向模块内部注入lodash模块，在模块内部可以通过_引用
      // new webpack.ProvidePlugin({
      //   _: 'lodash',
      // }),
    ],
  };
};
