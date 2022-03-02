const { fsyncSync } = require('fs');

function createLoaderObject(request) {
  let loaderObj = {
    request, // loader 的绝对路径
    normal: null, // loader 函数本身
    pitch: null, // loader 的 pitch 函数
    raw: false, // 是否转换成字符串
    data: {}, // 每一个 loader 都有一个 自定义的数据对象
    pitchExecuted: false, // loader 的 pitch 函数 是否已经执行过了
    normalExecuted: false, //loader  函数 是否已经执行过了
  };

  let normal = require(loaderObj.request); // 加载这个模块
  loaderObj.normal = normal;
  loaderObj.pitch = normal.pitch;
  loaderObj.raw = normal.raw;
  return loaderObj;
}

function runSyncOrAsync(fn, loaderContext, args, callback) {
  let isSync = true; // 是否同步
  let isDone = false; // fn 是否已经执行完毕
  let isError = false; // internal error

  const innerCallback = (loaderContext.async = function (err, ...args) {
    isDone = true;
    isSync = false;
    callback(null, ...args);
  });

  loaderContext.async = function () {
    isSync = false;
    return innerCallback;
  };

  let result = fn.apply(loaderContext, args); // loader 里的pitch 执行返回
  if (isSync) {
    isDone = true;
    return callback(null, result);
  }
}

function processResource(processOptions, loaderContext, finalCallback) {
  loaderContext.loaderIndex = loaderContext.loaders.length - 1;
  let resource = loaderContext.resource;
  loaderContext.readResource(resource, (err, resourceBuffer) => {
    if (err) return finalCallback(err);
    processOptions.resourceBuffer = resourceBuffer;
    console.log("🚀 ~ file: loader-runner.js ~ line 50 ~ loaderContext.readResource ~ resourceBuffer", resourceBuffer)
    iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], finalCallback);
  });
}

/**
 *
 * @param {*} processOptions
 * @param {*} loaderContext
 * @param {*} args 上一个loader 给我的参数
 * @param {*} finalCallback
 * @returns
 */
function iterateNormalLoaders(processOptions, loaderContext, args, finalCallback) {
  // loader 执行完毕
  if (loaderContext.loaderIndex < 0) {
    return finalCallback(null, args);
  }
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(processOptions, loaderContext, args, finalCallback);
  }
  let normalFunction = currentLoaderObject.normal;
  currentLoaderObject.normalExecuted = true;
  // 转换
  convertArgs(args, currentLoaderObject.raw);

  runSyncOrAsync(normalFunction, loaderContext, args, (err, ...values) => {
    if (err) return finalCallback(err);
    iterateNormalLoaders(processOptions, loaderContext, values, finalCallback);
  });
}

function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0]); // 把 不是Buffer 转换为 Buffer
  } else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString('utf8'); // 把buffer 转换为字符串
  }
}

function iteratePitchingLoaders(processOptions, loaderContext, finalCallback) {
  // 所有pitch 执行完
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, finalCallback);
  }
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
  }
  let pitchFunction = currentLoaderObject.pitch;
  currentLoaderObject.pitchExecuted = true;
  // 不存在执行下一个 pitch 函数
  if (!pitchFunction) {
    return iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
  }

  runSyncOrAsync(
    pitchFunction,
    loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      (currentLoaderObject.data = {}),
    ],
    function (err, ...args) {
      let hasArg = args.some(function (value) {
        return value !== undefined;
      });
      if (hasArg) {
        loaderContext.loaderIndex--;
        iterateNormalLoaders(processOptions, loaderContext, args, finalCallback);
      } else {
        return iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
      }
    }
  );
}

function runLoaders(options, callback) {
  let resource = options.resource || '';
  let loaders = options.loaders || [];
  let loaderContext = options.context || {};
  let readResource = options.readResource || fsyncSync.readFile;

  let loadersObjects = loaders.map(createLoaderObject);
  loaderContext.resource = resource;
  loaderContext.readResource = readResource;
  loaderContext.loaderIndex = 0;
  loaderContext.loaders = loadersObjects;
  loaderContext.callback = null;
  loaderContext.async = null;

  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext.loaders
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join('!');
    },
  });
  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join('!');
    },
  });

  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join('!');
    },
  });

  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((l) => l.request)
        .join('!');
    },
  });

  Object.defineProperty(loaderContext, 'data', {
    get() {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    },
  });

  let processOptions = {
    resourceBuffer: null, // 要读取的资源二进制内容，转换前要加载的内容
  };
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    callback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer,
    });
  });
}

exports.runLoaders = runLoaders;
