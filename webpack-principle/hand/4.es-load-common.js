var modules = {
  './src/title.js': (module, exports, require) => {
    module.exports = {
      name: 'title_name',
      age: 'title_age',
    };
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

// 标识模块
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  Object.defineProperty(exports, '__esModule', { value: true });
};

require.d = (exports, definition) => {
  for (let key in definition) {
    Object.defineProperty(exports, key, { get: definition[key] });
  }
};

// 返回获取defalut 默认导出的 getter 方法
require.n = (module) => {
  var getter = module && module.__esModule ? () => module['default'] : () => module;
  return getter;
};
var exports = {};
require.r(exports);

const title = require('./src/title.js');

let title_defalut = require.n(title);
console.log('🚀 ~ file: main.js ~ line 43 ~ title', title_defalut().name, title_defalut().age);
