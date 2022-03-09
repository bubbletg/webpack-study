const {
  AsyncSeriesHook
} = require("../../tapable");

let queue2 = new AsyncSeriesHook(['name']);
console.time('cost2');
debugger
queue2.tapAsync('1', function (name, cb) {
  setTimeout(() => {
      console.log(name, 1);
      cb();
  }, 1000);
});
queue2.tapAsync('2', function (name, cb) {
  setTimeout(() => {
      console.log(name, 2);
      cb();
  }, 2000);
});
queue2.tapAsync('3', function (name, cb) {
  setTimeout(() => {
      console.log(name, 3);
      cb();
  }, 3000);
});
debugger
queue2.callAsync('webpack', (err) => {
  console.log(err);
  console.log('over');
  console.timeEnd('cost2');
}); 
// 执行结果
/* 
webpack 1
webpack 2
webpack 3
undefined
over
cost2: 6019.621ms
*/