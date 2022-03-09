class Hook {
  constructor(args) {
    if (!Array.isArray(args)) {
      args = [];
    }
    this.args = args;
    this.taps = [];
    this.call = CALL_DELEGATE;
    this.callAsync = CALL_ASYNC_DELEGATE;
    this.callPromise = CALL_PROMISE_DELEGATE;
    this.interceptors = [];
  }
  interceptor(interceptor) {
    this.interceptors.push(interceptor);
  }
  tap(options, fn) {
    this._tap("sync", options, fn);
  }
  tapAsync(options, fn) {
    this._tap("async", options, fn);
  }
  tapPromise(options, fn) {
    this._tap("promise", options, fn);
  }
  _tap(type, options, fn) {
    if (typeof options === "string") {
      options = {
        name: options,
      };
    }
    let tapInfo = { ...options, type, fn };
    // register 拦截器
    tapInfo = this._runRegisterInterceptors(tapInfo);
    this._insert(tapInfo);
  }
  _runRegisterInterceptors(tapInfo) {
    for (let interceptor of this.interceptors) {
      if (interceptor) {
        let newTapInfo = interceptor.register(tapInfo);
        if (newTapInfo) {
          tapInfo = newTapInfo;
        }
      }
    }
    return tapInfo;
  }
  _resetCompilation() {
    this.call = CALL_DELEGATE;
  }
  
  _insert(tapInfo) {
    this._resetCompilation();
    let stage = 0;

    let before;
    if (typeof tapInfo.before === "string") {
      before = new Set([tapInfo.before]);
    } else if (Array.isArray(tapInfo.before)) {
      before = new Set(tapInfo.before);
    }

    if (typeof tapInfo.stage === "number") {
      stage = tapInfo.stage;
    }
    let i = this.taps.length;
    while (i > 0) {
      i--;
      const x = this.taps[i];
      this.taps[i + 1] = x;
      const XStage = x.stage || 0;
      if (before) {
        if (before.has(x.name)) {
          // 已经存在了，删除已经存在的
          before.delete(x.name);
          continue;
        }
        if (before.size > 0) {
          // 删除后，还大于 0，说明还没有找到放在之前的位置的元素
          continue;
        }
      }
      if (XStage > stage) {
        continue;
      }
      i++;
      break;
    }
    this.taps[i] = tapInfo;
    //
    // this.taps.push(tapInfo);
  }

  compile() {
    throw new Error("Abstract: should be override");
  }
  _createCall(type) {
    return this.compile({
      taps: this.taps,
      args: this.args,
      interceptors: this.interceptors,
      type,
    });
  }
}

const CALL_DELEGATE = function (...args) {
  this.call = this._createCall("sync");
  return this.call(...args);
};
const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};
const CALL_PROMISE_DELEGATE = function (...args) {
  this.callPromise = this._createCall("promise");
  return this.callPromise(...args);
};

module.exports = Hook;
