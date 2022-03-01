/**
 * loader 的分类和顺序
 * pre 前置
 * normal 正常/普通
 * inline 行为
 * post 后置
 */

let path = require('path');
let fs = require('fs');
let runLoaders = require('./loader-runner')
let filePath = path.resolve(__dirname, 'src', 'index.js');
let request = `inline-loader!inline2-loader!${filePath}`;

let rules = [
  {
    test: /\.js$/,
    use: ['normal1-loader', 'normal2-loader'], // 普通的loader
  },
  {
    test: /\.js$/,
    enforce: 'post',
    use: ['post1-loader', 'post2-loader'], // post的loader 后置
  },
  {
    test: /\.js$/,
    enforce: 'pre',
    use: ['pre1-loader', 'pre2-loader'], // pre的loader 前置
  },
];

// loader 执行顺序
// post 后置 + inline 内联 + normal 普通 + pre 前置

let parts = request.split('!');
let resource = parts.pop();

let resourceLoader = (loader) => path.resolve(__dirname, 'loaders', loader);
let inlineLoader = parts;

let preLoaders = [],
  normalLoaders = [],
  postLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}
// inlineLoader = parts.map(resourceLoader);
// preLoaders = preLoaders.map(resourceLoader);
// normalLoaders = normalLoaders.map(resourceLoader);
// postLoaders = postLoaders.map(resourceLoader);

let loaders = [];
if (request.startsWith('!!')) {
  loaders = [...inlineLoader];
} else if (request.startsWith('-!')) {
  loaders = [...postLoaders, ...inlineLoader];
} else if (request.startsWith('!')) {
  loaders = [...postLoaders, ...inlineLoader, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoader, ...normalLoaders, ...preLoaders];
}

// console.log(loaders);

runLoaders(
  {
    resource, // 要加载和转换的模块
    loaders, // loaders 数组
    context: { name: 'bubbletg' },
    readResource: fs.readFile.bind(fs), // 读取硬件文件的方法
  },
  (err, result) => {
    console.log(err);
    console.log(result);
  }
);
