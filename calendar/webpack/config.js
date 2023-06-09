// @flow
'use strict';

const define = require('./define');
const loaders = require('./loaders');
const localIp = require('my-local-ip');
const optimization = require('./optimization');
const plugins = require('./plugins');
const resolve = require('./resolve');
const config = require('../config/dev.json');

module.exports = {
	devServer: {
		host: localIp(),
		proxy: {
			'/sd/services/rest/*': {
				changeOrigin: true,
				target: config.apiUrl
			}
		}
	},
	entry: {
		'index': ['core-js/stable', './src/index.js']
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
