class HookCodeFactory {
  setup(hookInstance, options) {
    hookInstance._x = options.taps.map((tapInfo) => tapInfo.fn);
  }
  init(options) {
    this.options = options;
  }
  deinit() {
    this.options = null;
  }

  args(options = {}) {
    let { before, after } = options;
    let allArgs = this.options.args || [];
    if (before) {
      allArgs = [before, ...allArgs];
    }
    if (after) {
      allArgs = [...allArgs, after];
    }
    return allArgs.join(",");
  }

  header() {
    let code = ``;
    code += `var _x = this._x;`;
    // call 拦截器
    let { interceptors = [] } = this.options;
    if (interceptors.length > 0) {
      code += ` var _taps = this.taps;\n
     var _interceptors = this.interceptors;`;
      for (let i = 0; i < interceptors.length; i++) {
        if (interceptors[i].call) {
          code += `_interceptors[${i}].call(${this.args()});`;
        }
      }
    }
    return code;
  }

  // callTapsSeries() {
  //   let { taps } = this.options;
  //   if (taps.length === 0) return "";
  //   let code = "";

  //   for (let j = 0; j < taps.length; j++) {
  //     const content = this.callTap(j);
  //     code += content;
  //   }
  //   return code;
  // }
  callTapsSeries({ onDone }) {
    let { taps } = this.options;
    if (taps.length === 0) return onDone;
    let code = ``;
    let current = onDone;
    for (let i = taps.length - 1; i >= 0; i--) {
      if (i < taps.length - 1) {
        code += `function _next${i}(){\n`;
        code += current();
        code += `}\n`;
        current = () => `_next${i}()`;
      }
      const done = current;
      const content = this.callTap(i, { onDone: done });
      current = () => content;
    }
    code += current();
    return code;
  }

  callTapParallel({ onDone }) {
    let { taps } = this.options;
    if (taps.length === 0) return;
    let code = `var _counter = ${taps.length}\n`;
    code + `var _done = (function(){ \n ${onDone()}; \n});`;
    for (let j = 0; j < taps.length; j++) {
      const content = this.callTap(j, {
        onDone: ` if(--_counter ===0) _done();`,
      });
      code += content;
    }

    return code;
  }

  callTap(tapIndex, { onDone }) {
    let code = "";
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
    // tap 拦截器
    let { interceptors = [] } = this.options;
    if (interceptors.length > 0) {
      for (let i = 0; i < interceptors.length; i++) {
        if (interceptors[i].tap) {
          code += `var _tap${i} = _taps[${i}];\n
          _interceptors[${i}].tap(_tap${i});\n`;
        }
      }
    }

    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case "sync":
        code += `_fn${tapIndex}(${this.args()});`;
        break;
      case "async":
        code += `_fn${tapIndex}(${this.args({
          after: `
            function(){
              ${onDone()}
            }
            `,
        })});`;
        break;
      case "promise":
        code += `var _promise${tapIndex} = _fn${tapIndex}(${this.args()},
        _promise${tapIndex}).then((function(){
          if(--_counter ===0) _done();
        }));`;
        break;
    }
    return code;
  }

  create(options) {
    this.init(options);
    let fn;
    switch (this.options.type) {
      case "sync":
        fn = new Function(this.args(), this.header() + this.content());
        break;
      case "async":
        fn = new Function(
          this.args({ after: "_callback" }),
          this.header() +
            this.content({
              onDone: () => `_callback();\n`,
            })
        );
        break;
      case "promise":
        let tapsContent = this.content({
          onDone: () => `_resolve();\n`,
        });
        let content = `
        return new Promise((function(_resolve,_reject){
          ${tapsContent}
        }));
        `;
        fn = new Function(this.args(), this.header() + content);
        break;
    }
    return fn;
  }
}

module.exports = HookCodeFactory;
