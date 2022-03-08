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
    return code;
  }

  callTapsSeries() {
    let { taps } = this.options;
    if (taps.length === 0) return "";
    let code = "";

    for (let j = 0; j < taps.length; j++) {
      const content = this.callTap(j);
      code += content;
    }
    return code;
  }
  callTapParallel({ onDone }) {
    let { taps } = this.options;
    if (taps.length === 0) return;
    let code = `var _counter = ${taps.length}\n`;
    code + `var _done = (function(){ \n ${onDone()}; \n});`;
    for (let j = 0; j < taps.length; j++) {
      const content = this.callTap(j);
      code += content;
    }

    return code;
  }

  callTap(tapIndex) {
    let code = "";
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case "sync":
        code += `_fn${tapIndex}(${this.args()});`;
        break;
      case "async":
        code += `_fn${tapIndex}(${this.args()},function(){
          if(--_counter ===0) _done();
        });`;
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
              oneDone: () => `_callback();\n`,
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
