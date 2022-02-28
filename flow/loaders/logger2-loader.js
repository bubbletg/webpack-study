
function loader(source) {
  console.log('logger2-loader.js');
  return source + '//logger2';

}

module.exports =loader