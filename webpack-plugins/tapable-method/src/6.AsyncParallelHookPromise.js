let { AsyncParallelHook } = require("../../tapable");

let asyncParalleHook = new AsyncParallelHook(["name", "age"]);
console.time("cost");
asyncParalleHook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000);
  });
});

asyncParalleHook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve();
    }, 2000);
  });
});

asyncParalleHook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 3000);
  });
});

debugger

asyncParalleHook.callPromise("bubbletg", 10, (err) => {
  console.log(err);
  console.time("cost");
});
