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
			'/sd/services/earest/*': {
				changeOrigin: true,
				target: process.env.API_URL
			}
		}
	},
	devtool: define.development ? 'source-map' : false,
	entry: {
		'index': ['babel-polyfill', './src/index.js']
	},
	mode: define.mode,
	module: loaders,
	optimization,
	output: {
		chunkFilename: '[name].[contenthash].js',
		filename: 'bundle.[contenthash].js',
		path: define.dist
	},
	plugins,
	resolve
};
