// 对于自己的模块，模块ID 就是相对于根目录的相对路径
var modules = {
  './src/title.js': function (module, exports, require) {
    module.exports = 'title';
  },
};

// 缓存对象，模块加载后会把加载到的结果缓存到 chache 里
let chache = {};

function require(moduleId) {
  // 拿到缓存
  if (chache[moduleId] !== undefined) {
    return chache[moduleId];
  }
  // 定义一个模块
  let module = (chache[moduleId] = { exports: {} });

  modules[moduleId](module, module.exports, require);

  return module.exports;
}

const title = require('./src/title.js');
console.log('🚀 ~ file: index.js ~ line 2 ~ title', title);
