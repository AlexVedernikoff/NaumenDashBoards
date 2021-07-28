'use strict';
require('dotenv').config();
const {development, dist, mode} = require('./define');
const loaders = require('./loaders');
const optimization = require('./optimization');
const plugins = require('./plugins');
const resolve = require('./resolve');

module.exports = {
	devtool: development ? 'source-map' : false,
	entry: {
		'index': ['@babel/polyfill', './src/index.js']
	},
	mode,
	module: loaders,
	optimization,
	output: {
		filename: 'index.js',
		library: 'naumen-common-components',
		libraryTarget: 'umd',
		path: dist
	},
	plugins,
	resolve
};
