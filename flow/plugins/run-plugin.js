class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('挂载  RunPlugin');
    });
  }
}

module.exports = RunPlugin;
