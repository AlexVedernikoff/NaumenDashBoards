'use strict';

const define = require('./define');
const loaders = require('./loaders');
const localIp = require('my-local-ip');
const optimization = require('./optimization');
const plugins = require('./plugins');
const resolve = require('./resolve');

module.exports = {
	devServer: {
		host: localIp()
	},
	entry: {
		'index': ['babel-polyfill', './src/index.js']
	},
	mode: define.mode,
	module: loaders,
	optimization,
	output: {
		filename: '[name].[contenthash].js',
		path: define.dist
	},
	plugins,
	resolve
};
