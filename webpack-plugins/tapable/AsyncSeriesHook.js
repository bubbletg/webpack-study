let Hook = require("./Hook");
let HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
  content({onDone}) {
    return this.callTapsSeries({onDone} );
  }
}

let factory = new SyncHookCodeFactory();

class AsyncSeriesHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncSeriesHook;
