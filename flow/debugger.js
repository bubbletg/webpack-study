let webpack = require('webpack');
const options = require('./webpack.config.js');

let compiler = webpack(options);

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
