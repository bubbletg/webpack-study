let { SyncHook, HookMap } = require("../../tapable");
const map = new HookMap(() => new SyncHook(["name"]));

map.for("key1").tap("plugin1", (name) => {
  console.log("🚀 ~ file: 9.HookMap.js ~ line 5 ~ name", name);
});

map.for("key2").tap("plugin2", (name) => {
  console.log("🚀 ~ file: 9.HookMap.js ~ line 5 ~ name", name);
});


let hook = map.get('key1');
hook.call('bubbleTg')