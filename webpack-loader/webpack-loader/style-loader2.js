function loader(css) {
  console.log("🚀 ~ file: style-loader2.js ~ line 2 ~ loader ~ css", css)
  let script = `
  let style = document.createElement('style');
  style.innerHTML = ${JSON.stringify(css)}
  document.head.appendChild(style);
  `;
  return script;
}
module.exports = loader;
