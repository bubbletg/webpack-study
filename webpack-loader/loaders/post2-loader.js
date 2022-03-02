function loader(source) {
  console.log(this.data);

  let callback = this.async();

  console.log('post2');

  setTimeout(() => {
    callback(null, source + '//------post2');
  }, 3000);
  // return source + '//------post2';
}

loader.pitch = function (remainingRequest, previousRequest, data) {
  data.age = 1000;
  console.log('post2-pitch');
};

module.exports = loader;
