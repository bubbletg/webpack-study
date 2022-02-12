const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
module.exports = (env) => {
  return {
    mode: process.env.NODE_ENV,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '',
    },
    // exports: {
    //   loader: '_', // 如果在模块内部引用了lodash这个模块，会从window._ 上取值
    //   jquery: 'jQuery', //如果在模块内部引用了jquery这个模块，会从window.jQuery上取值
    // },
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
    devServer: {
      // 配置额外的静态根目录
      // contentBase: path.resolve(__dirname, 'public'),
      compress: true, // 启动 gzip 压缩
      port: 8080,
      // open: true,
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
