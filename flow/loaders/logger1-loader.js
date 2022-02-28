
function loader(source) {
  console.log('logger1-loader.js');
  return source + '//logger1';

}

module.exports =loader