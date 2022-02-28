class DonePlugin {
  apply(compiler) {
    compiler.hooks.run.tap('DonePlugin', () => {
      console.log('挂载  DonePlugin');
    });
  }
}

module.exports = DonePlugin;
