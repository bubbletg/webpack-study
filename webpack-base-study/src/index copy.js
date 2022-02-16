import './index.css';
import './01.less';
import './02.scss';
import 'lib-flexible';

// import _ from 'lodash'
// require('lodash');
// import join from 'lodash/join';
// console.log("🚀 ~ file: index.js ~ line 7 ~ _", join(['a','b','c'],'@'))



fetch('/api/users').then(res => res.json()).then(res => {
console.log("🚀 ~ file: index.js ~ line 14 ~ fetch ~ res", res)
})

