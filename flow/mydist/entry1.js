
  (() => {
  var __webpack_modules__ = {
    
    './src/title.js': (module) => {
      eval(
        `module.exports = 'sfsdafsadf'; //logger2//logger1`
      );
    },
    './src/index1.js': (module) => {
      eval(
        `let title = require("/Users/tiangui/Documents/Code/study/webpack-study/flow/src/title.js");

console.log('index', 111111, title); //logger2//logger1`
      );
    }
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  var __webpack_exports__ = __webpack_require__('./src/index1.js');
  })();
  