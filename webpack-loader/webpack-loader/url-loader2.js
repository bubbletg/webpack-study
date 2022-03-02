const mime = require('mime');
const path = require('path');
function loader(content) {
  // getOptions 拿到 loader 配置的options
  let options = this.getOptions();
  let { limit, fallback = path.resolve(__dirname, 'webpack-loader/file-loader2.js') } = options;
  if (limit) {
    limit = parseInt(limit, 10);
  }
  if (!limit || content.length < limit) {
    // resourcePath 要加载的路径
    // mime.lookup 得到文件类型
    let mimeType = mime.lookup(this.resourcePath);
    // 转换成 base64
    let base64Str = 'data:' + mimeType + ';base64,' + content.toString('base64');
    return 'module.exports = ' + JSON.stringify(base64Str);
  } else {
    // 通过 file-loader2 处理
    let fileLoader2 = require(fallback ||
      path.resolve(__dirname, 'webpack-loader/file-loader2.js'));
    return fileLoader2.call(this, content);
  }
}

loader.raw = true;

module.exports = loader;
