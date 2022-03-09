const { SyncHook } = require("../../tapable");
let syncHook = new SyncHook(["name", "age"]);
// 调用拦截器
syncHook.interceptor({
  // 每当注册一个新的回调函数触发
  register: (tapInfo) => {
    console.log("🚀 ~ file: 7.interceptor.js ~ line 7 ~ tapInfo", tapInfo);
  },
  // 每个回调函数都会触发一次
  tap:(tapInfo)=>{
  console.log("🚀 ~ file: 7.interceptor.js ~ line 11 ~ tapInfo", tapInfo)
  },
  // 执行call 触发回调
  call:(tapInfo)=>{
  console.log("🚀 ~ file: 7.interceptor.js ~ line 14 ~ tapInfo", tapInfo)
  }
});

syncHook.interceptor({
  // 每当注册一个新的回调函数触发
  register: (tapInfo) => {
    console.log("🚀 ~ file: 7.interceptor.js ~ line 22 ~ tapInfo", tapInfo);
  },
  // 每个回调函数都会触发一次
  tap:(tapInfo)=>{
  console.log("🚀 ~ file: 7.interceptor.js ~ line 26 ~ tapInfo", tapInfo)
  },
  // 执行call 触发回调
  call:(tapInfo)=>{
  console.log("🚀 ~ file: 7.interceptor.js ~ line 30 ~ tapInfo", tapInfo)
  }
});

syncHook.tap("1", (name, age) => {
  console.log(
    "🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '1'",
    name,
    age
  );
});

syncHook.tap("2", (name, age) => {
  console.log(
    "🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '2'",
    name,
    age
  );
});
syncHook.tap("3", (name, age) => {
  console.log(
    "🚀 ~ file: 1.SyncHook.js ~ line 4 ~ syncHook.tap ~ '3'",
    name,
    age
  );
});
debugger

syncHook.call("bubbletg", 12);
