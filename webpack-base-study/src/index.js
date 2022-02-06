import './index.css';
import './01.less';
import './02.scss';
let title = require('./title');
const content = require('./content.txt');
console.log('🚀 ~ file: index.js ~ line 4 ~ content', content);
console.log('helow', title);

console.log('🚀 ~ file: index.js ~ line 7 ~ process.env.NODE_ENV', process.env.NODE_ENV);
console.log('🚀 ~ file: index.js ~ line 7 ~ NODE_ENV', NODE_ENV);

// let imageUrl = require('./image/Snipaste_2022-02-06_23-05-41.png');
// let img = new Image();
// img.src = imageUrl.default;
// document.body.appendChild(img);

function readonly(target, key, descriptors) {
  descriptors.writable = false;
}
class Person {
  @readonly Pi = 3.14;
}

let p = new Person();
p.Pi = 3.15;
console.log("🚀 ~ file: index.js ~ line 25 ~ p", p)
