const { SyncHook } = require('tapable');
const types = require('babel-types');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const path = require('path');
const fs = require('fs');
const { toUnixPath } = require('./utils');

let rootPath = process.cwd();

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 开始编译
      emit: new SyncHook(), // 写入文件系统
      done: new SyncHook(), // 编译工作全部完成
    };

    this.entries = new Set();
    this.modules = new Set();
    this.chunks = new Set();
    this.assets = new Set();
    this.files = new Set();
  }
  run(fn) {
    this.hooks.run.call();
    // 5.根据配置中的entry 找出入口文件
    let entry = {};
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }

    console.log('开始编译~~~~~~~~~~~~~');

    for (let entryName in entry) {
      let entryPath = toUnixPath(path.join(rootPath, entry[entryName]));
      let entryModule = this.buildModule(entryName, entryPath);
      this.entries.add(entryModule);
      this.modules.add(entryModule);
      // 8.根据入口和模块之间的依赖关系,组装成-个个包含多 个模块的Chunk
      let chunk = {
        name: entryName,
        entryModule,
        modules: [...this.modules].filter((module) => module.name === entryName),
      };
      this.chunks.add(chunk);
    }

    let output = this.options.output;
    //9. 再把每个Chunk转换成一个单独的文件加入到输出列表;
    this.chunks.forEach((chunk) => {
      let filename = path.join(output.path, output.filename.replace('[name]', chunk.name));
      this.assets[filename] = getSource(chunk);
    });

    // 写入文件
    this.files = Object.keys(this.assets);
    for (let file in this.assets) {
      // let filePath = path.join(output.path, file);
      fs.writeFileSync(file, this.assets[file]);
    }

    this.hooks.done.call();
    fn(null, {
      toJson: () => ({
        entries: this.entries,
        chunks: this.chunks,
        modules: this.modules,
        files: this.files,
        assets: this.assets,
      }),
    });
  }

  // 处理模块
  buildModule(entryName, modulePath) {
    // 1. 读取此模块的内容
    let originalSourceCode = fs.readFileSync(modulePath, 'utf8');
    let targetSourceCode = originalSourceCode;
    // 2. 调用所有配置的Loader 对模块进行编译
    let rules = this.options.module.rules;
    // 拿到所有 loader
    let loaders = [];
    for (let i = 0; i < rules.length; i++) {
      if (modulePath.match(rules[i].test)) {
        loaders = [...loaders, ...rules[i].use];
      }
    }
    // 让 loader 执行
    for (let i = loaders.length - 1; i >= 0; i--) {
      targetSourceCode = require(loaders[i])(targetSourceCode);
    }

    // 7.再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    let moduleId = './' + path.posix.relative(rootPath, modulePath);
    let module = { id: moduleId, dependencies: [], name: entryName };
    // 找到该模块依赖的模块，转化成抽象语法书
    let ast = parser.parse(targetSourceCode, { sourceType: 'module' });
    traverse(ast, {
      CallExpression: ({ node }) => {
        if (node.callee.name === 'require') {
          // 要引入模块的相对路径
          let moduleName = node.arguments[0].value;
          let dirName = path.posix.dirname(modulePath);
          let depModulePath = path.posix.join(dirName, moduleName);
          let extensions = this.options.resolve.extensions;
          depModulePath = tryExtensions(depModulePath, extensions, moduleName, dirName);
          let depModuleId = './' + path.posix.relative(rootPath, depModulePath);
          node.arguments = [types.stringLiteral(depModulePath)];
          // 如果已经编译过的模块的里不包含这个依赖模块的话才添加，如果已经包含了，就不要添加了
          let arlreadyModuleIds = Array.from(this.modules).map((module) => module.id);
          if (!arlreadyModuleIds.includes(depModuleId)) {
            module.dependencies.push(depModulePath);
          }
        }
      },
    });

    let { code } = generator(ast);
    module._source = code;
    // 递归编译
    module.dependencies.forEach((dependency) => {
      // 6.从入口文件出发调用所有配置的Loader 对模块进行编译
      let depModule = this.buildModule(entryName, dependency);
      this.modules.add(depModule);
    });

    return module;
  }
}
function getSource(chunk) {
console.log("🚀 ~ file: compiler.js ~ line 136 ~ getSource ~ chunk", chunk)
  return `
  (() => {
  var __webpack_modules__ = {
    ${chunk.modules
      .map(
        (module) => `
    '${module.id}': (module) => {
      eval(
        \`${module._source}\`
      );
    }`
    ).join(',')}
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
  var __webpack_exports__ = __webpack_require__('${chunk.entryModule.id}');
  })();
  `;
}

// 处理导入文件不添加文件后缀
function tryExtensions(modulePath, extensions, originModulePath, moduleContext) {
  extensions.unshift('');
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(modulePath + extensions[i])) {
      return modulePath + extensions[i];
    }
  }
  throw new Error('~~~~~~~~~~~~~~~');
}

module.exports = Compiler;
