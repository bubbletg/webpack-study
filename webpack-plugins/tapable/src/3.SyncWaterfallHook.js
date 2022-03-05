const { SyncWaterfallHook } = require('tapable');
// waterfall 如果有一个事件函数的结果，且不为 undefined ,就把结果作为第二函数的第一个参数。
let syncWaterfallHook = new SyncWaterfallHook(['name', 'age']);
syncWaterfallHook.tap('1', (name, age) => {
  console.log("🚀 ~ file: 1.syncWaterfallHook.js ~ line 4 ~ syncWaterfallHook.tap ~ '1'", name, age);
});

syncWaterfallHook.tap('2', (name, age) => {
  console.log("🚀 ~ file: 1.syncWaterfallHook.js ~ line 4 ~ syncWaterfallHook.tap ~ '2'", name, age);
  return '111';
});
syncWaterfallHook.tap('3', (name, age) => {
  console.log("🚀 ~ file: 1.syncWaterfallHook.js ~ line 4 ~ syncWaterfallHook.tap ~ '3'", name, age);
});

syncWaterfallHook.call('bubbletg', 12);
