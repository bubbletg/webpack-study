let Compiler = require('./compiler');

function webpack(options) {
  // 1. 获取初始化参数 从配置文件中读取配置对象，然后和shell参数进行合并得到最终的配置对象
  let shellOptions = process.argv.slice(2).reduce((config, args) => {
    let [key, value] = args.split('=');
    config[key] = value;
    return config;
  }, {});
  let finalOptions = { ...options, ...shellOptions };

  // 2. 通过 options 初始化 compiler
  let compiler = new Compiler(finalOptions);
  // 3.加载所有配置的插件
  if (finalOptions.plugins && Array.isArray(finalOptions.plugins)) {
    for (let plugin of options.plugins) {
      plugin.apply(compiler);
    }
  }

  return compiler;
}

module.exports = webpack;
