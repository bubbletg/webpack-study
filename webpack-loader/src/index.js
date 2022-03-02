import './index.less'

let logo = require('./images/BBLMrjp.jpeg');
let images = new Image();
images.src = logo;
document.body.appendChild(images);


let arrow = (aaaa) => {
  console.log(aaaa);
};

arrow('11111');
