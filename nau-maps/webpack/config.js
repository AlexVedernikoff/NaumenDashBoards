'use strict';

const {development, dist, mode} = require('./define');
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
	devtool: development ? 'source-map' : false,
	entry: {
		'index': ['babel-polyfill', './src/index.js']
	},
	mode: mode,
	module: loaders,
	optimization,
	output: {
		filename: '[name].[contenthash].js',
		path: dist
	},
	plugins,
	resolve
};
