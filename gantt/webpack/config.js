'use strict';
require('dotenv').config();
const define = require('./define');
const loaders = require('./loaders');
const localIp = require('my-local-ip');
const optimization = require('./optimization');
const plugins = require('./plugins');
const resolve = require('./resolve');

module.exports = {
	devServer: {
		historyApiFallback: true,
		host: localIp()
	},
	devtool: 'source-map',
	entry: {
		'index': ['babel-polyfill', './src/index.js']
	},
	mode: define.mode,
	module: loaders,
	optimization,
	// optimization: {
	// 	minimize: false
	// },
	output: {
		filename: 'bundle.js',
		path: define.dist
	},
	plugins,
	resolve
};
