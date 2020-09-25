// @flow
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
		host: localIp(),
		proxy: {
			'/sd/services/rest/*': {
				changeOrigin: true,
				target: process.env.API_URL
			}
		}
	},
	devtool: 'source-map',
	entry: {
		'index': ['babel-polyfill', './src/index.js']
	},
	mode: define.mode,
	module: loaders,
	optimization,
	output: {
		filename: 'bundle.js',
		path: define.dist
	},
	plugins,
	resolve
};
