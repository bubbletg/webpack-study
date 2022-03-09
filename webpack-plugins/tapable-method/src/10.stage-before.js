// const { SyncHook } = require("tapable");
const { SyncHook } = require("../../tapable");
debugger;
let syncHook = new SyncHook(["name", "age"]);
debugger
syncHook.tap({ name: "tap1", stage: 1 }, (name, age) => {
  console.log(
    "🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '1'",
    name,
    age
  );
});

syncHook.tap({ name: "tap2", stage: 3 }, (name, age) => {
  console.log(
    "🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '2'",
    name,
    age
  );
});

syncHook.tap({ name: "tap3", stage: 2 }, (name, age) => {
  console.log(
    "🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '3'",
    name,
    age
  );
});

syncHook.call("bubbletg", 12);
