let Hook = require("./Hook");
let HookCodeFactory = require('./HookCodeFactory')


class AsyncParallelHookCodeFactory extends HookCodeFactory{
  content({onDone}){
    return this.callTapParallel({onDone})// 异步钩子
  }
}

let factory = new AsyncParallelHookCodeFactory()

class AsyncParallelHook extends Hook {
compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook 
