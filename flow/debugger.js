let webpack = require('./webpack');

// 1. 获取初始化参数 从配置文件中读取配置对象，然后和shell参数进行合并得到最终的配置对象
const options = require('./webpack.config.js');

debugger
// 2. 通过 options 初始化 compiler
let compiler = webpack(options);

// 3.加载所有配置的插件

// 4.执行对象的run方法开始执行编译
compiler.run((err, stats) => {
  console.log('🚀 ~ file: debugger.js ~ line 8 ~ compiler.run ~ err', err);
  // 输出的结果在 doc/1.stats.js
  console.log(
    stats.toJson({
      entries: true,
      modules: true,
      chunks: true,
      assets: true,
      files: true,
    })
  );
});
