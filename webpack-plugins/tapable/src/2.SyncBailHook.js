const { SyncBailHook } = require('tapable');
// Bail 执行每一个事件函数，遇到第一个结果 不为 null，就返回，不再继续执行。·
let syncBailHook = new SyncBailHook(['name', 'age']);
syncBailHook.tap('1', (name, age) => {
  console.log("🚀 ~ file: 1.syncBailHook.js ~ line 4 ~ syncBailHook.tap ~ '1'", name, age);
});

syncBailHook.tap('2', (name, age) => {
  console.log("🚀 ~ file: 1.syncBailHook.js ~ line 4 ~ syncBailHook.tap ~ '2'", name, age);
  return '111'
});
syncBailHook.tap('3', (name, age) => {
  console.log("🚀 ~ file: 1.syncBailHook.js ~ line 4 ~ syncBailHook.tap ~ '3'", name, age);
});

syncBailHook.call('bubbletg', 12);
