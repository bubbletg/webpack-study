let { AsyncParallelHook } = require("../../tapable");

let asyncParalleHook = new AsyncParallelHook(['name','age']);
console.time("cost");
asyncParalleHook.tapAsync("1", (name, age, callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    callback();
  }, 1000);
});

asyncParalleHook.tapAsync("2", (name, age, callback) => {
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000);
});

asyncParalleHook.tapAsync("3", (name, age, callback) => {
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000);
});

asyncParalleHook.callAsync("bubbletg", 10, (err) => {
  console.log(err);
  console.time("cost");
});
