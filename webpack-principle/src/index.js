document.addEventListener('click', () => {
  // 会出现代码分割
  import('./title').then((res) => {
    console.log('🚀 ~ file: index.js ~ line 5 ~ document.addEventListener ~ name', res.name);
  });
});

/**
 *  使用 common.js 导出
 * const title = require('./title')
 *
 * 使用 esModule 导出
 * import title from './title';
 */
// const title = require('./title');
// import title from './title';
// console.log('🚀 ~ file: index.js ~ line 2 ~ title', title.name, title.age);
