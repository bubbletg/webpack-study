const { interpolateName } = require('loader-utils');
/**
 * 1.先成一个新的文件名
 * 2.告诉 webpack 把这个文件拷贝到目标路径里面去
 * @param {*} source
 * @returns
 */
function loader(content) {
  // getOptions 拿到 loader 配置的options
  let options = this.getOptions();
  // interpolateName 方法可以根据options.name 以及文件内容生成唯一的文件名
  let filename = interpolateName(this, options.filename, {
    content,
  });
  // emitFile 告诉 webpack 要创建一个文件，webpack 会根据参数创建对应的文件，放到publicPath 目录下
  this.emitFile(filename, content);
  // 把原来路径替换为编译后的路径
  return 'module.exports = ' + JSON.stringify(filename);
}

loader.raw = true;

module.exports = loader;
