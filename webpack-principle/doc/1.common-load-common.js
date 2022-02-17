(() => {
  var __webpack_modules__ = {
    './src/title.js': (__unused_webpack_module, exports) => {
      exports.name = 'title_name';
      exports.age = 'title_age';
    },
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
  var __webpack_exports__ = {};
  (() => {
    const title = __webpack_require__('./src/title.js');
    console.log('🚀 ~ file: index.js ~ line 2 ~ title', title.name, title.age);
  })();
})();
