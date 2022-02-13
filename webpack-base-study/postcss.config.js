let postcssPresetEnv = require('postcss-preset-env');
module.exports = {
  plugin: [
    postcssPresetEnv({
      browsers: 'last 5 version',
    }),
  ],

};
