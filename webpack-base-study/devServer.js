let express = require('express');
let app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const config = require('./webpack.config.js')();

const compiler = webpack(config);


app.use(webpackDevMiddleware(compiler));
app.listen(3000);
