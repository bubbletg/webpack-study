
function toUnixPath(path) {
  return path.replace(/\\/g, '/');
}


exports.toUnixPath = toUnixPath;