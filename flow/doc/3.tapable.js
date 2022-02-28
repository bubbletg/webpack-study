// let { SyncHook } = require('tapable');

// SyncHook 的实现
class SyncHook {
  constructor() {
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
  call() {
    this.taps.forEach((tap) => tap());
  }
}

let hook = new SyncHook();
hook.tap('a', () => {
  console.log('a');
});
hook.tap('b', () => {
  console.log('b');
});
hook.tap('c', () => {
  console.log('c');
});

hook.call();
