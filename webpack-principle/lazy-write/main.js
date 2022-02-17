var modules = {};

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

// 通过 require.m 属性活动 模块定义HMR
require.m = modules;

// 判断一个对象是否有某个属性
require.ownProperty = (obj, prop) => obj.hasOwnProperty(prop);

// 标识模块
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  Object.defineProperty(exports, '__esModule', { value: true });
};

// 给一个对象定义属性
require.d = require.defineProperties = (exports, definition) => {
  for (let key in definition) {
    if (require.ownProperty(definition, key)) {
      Object.defineProperty(exports, key, { get: definition[key] });
    }
  }
};

require.f = require.functions = {};

// key 是代码块的名字，0标识此代码块已经加载了
let installedChunks = {
  main: 0,
};

// 通过 jsonp 加载一部代码块
require.e = require.ensure = (chunkId) => {
  let promises = [];
  Object.keys(require.f).forEach((func) => require.f[func](chunkId, promises));
  return Promise.all(promises);
};

// 通过 jsonp 加载 chunk 代码，创建promise 放到数组里
require.f.j = require.functions.jsonp = (chunkId, promises) => {
  // 拿到 Chunk
  let installedChunkData = require.ownProperty(installedChunks, chunkId)
    ? installedChunks[chunkId]
    : null;

  // 没有加载成功
  if (installedChunkData !== 0) {
    if (installedChunkData) {
      // 没有加载成功，但是有值，说明正在加载中。。。
      promises.push(installedChunkData[2]);
    } else {
      let promise = new Promise((resolve, reject) => {
        installedChunkData = installedChunks[chunkId] = [resolve, reject];
      });

      installedChunkData[2] = promise; // [resolve, reject,promise]
      promises.push(promise);
      // 要加载文件的地址
      let url = require.p + require.u(chunkId);
      // 通过 jsonp 加载
      require.l(url);
    }
  }
};

// 拿到文件（模块）名
require.u = (chunkId) => {
  return '' + chunkId + '.main.js';
};
// 拿到文件地址
require.p = require.publicPath = '';

// jsonp 原理
require.l = require.load = (url) => {
  let script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
};

// 把加载的模块添加在全局上
function webpackJsonpCallback(data) {
  let [chunkIds, moreModules, runtime] = data;
  // 合并，把异步拿到的模块合并到 modules 上
  for (let moduleId in moreModules) {
    if (require.ownProperty(moreModules, moduleId)) {
      require.m[moduleId] = moreModules[moduleId];
    }
  }
  let chunkId,
    i = 0;
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    installedChunks[chunkId][0](); // 就是模块加载成功后，执行 promis.resolve
    installedChunks[chunkId] = 0;
  }
}

// 返回获取defalut 默认导出的 getter 方法
require.n = (module) => {
  var getter = module && module.__esModule ? () => module['default'] : () => module;
  return getter;
};
var exports = {};
require.r(exports);

let chunkLoadingGlobal = (window['webpackChunkwebpack_principle'] = []);
chunkLoadingGlobal.push = webpackJsonpCallback;


var __webpack_exports__ = {};
document.addEventListener('click', () => {
  require
    .e('src_title_js')
    .then(require.bind(require, './src/title.js'))
    .then((res) => {
      console.log('🚀 ~ file: index.js ~ line 5 ~ document.addEventListener ~ name', res);
    });
});
