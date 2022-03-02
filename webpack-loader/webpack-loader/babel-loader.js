const babel = require('@babel/core');

/**
 * 根据老代码生成新代码
 * @param {*} source
 * @returns
 */
function loader(source, inputSourceMap, data) {
  // getOptions 拿到 loader 配置的options
  let options = this.getOptions();
  if (!options) {
    options = {
      presets: ['@babel/preset-env'],
    };
  }
  options.sourceMap = true; // 生成 sourcemap
  options.inputSourceMap = inputSourceMap;
  options.filename = this.request.split('!')[1].split('/').pop();

  let { code, map, ast } = babel.transform(source, options);
  this.callback(null, code, map, ast); // 返回多个值使用 callback
  // return source; 返回一个值可return
}

loader.pitch = function () {};

module.exports = loader;
