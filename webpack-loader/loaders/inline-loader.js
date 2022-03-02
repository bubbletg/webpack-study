function loader(source) {
  console.log('inline');
  return source + '//------inline';
}

loader.pitch = function () {
  console.log('inline-pitch');
};

module.exports = loader;
