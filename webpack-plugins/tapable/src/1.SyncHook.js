const { SyncHook } = require('tapable');
let syncHook = new SyncHook(['name', 'age']);
syncHook.tap('1', (name, age) => {
  console.log("🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '1'", name, age);
});

syncHook.tap('2', (name, age) => {
  console.log("🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '2'", name, age);
});
syncHook.tap('3', (name, age) => {
  console.log("🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '3'", name, age);
});

syncHook.call('bubbletg',  12);
