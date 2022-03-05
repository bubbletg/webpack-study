let Hook = require("./Hook");
let HookCodeFactory = require('./HookCodeFactory')


class SyncHookCodeFactory extends HookCodeFactory{
  content(){
    return this.callTapsSeries()// 同步钩子
  }
}

let factory = new SyncHookCodeFactory()

class SyncHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = SyncHook 
