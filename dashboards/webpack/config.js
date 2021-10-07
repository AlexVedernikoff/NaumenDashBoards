'use strict';
require('dotenv').config();
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
			'/sd/services/earest/*': {
				changeOrigin: true,
				target: process.env.API_URL
			}
		}
	},
	devtool: development ? 'source-map' : false,
	entry: {
		'index': ['babel-polyfill', './src/index.jsx']
	},
	mode: mode,
	module: loaders,
	optimization,
	output: {
		chunkFilename: development ? '[name].js' : '[name].[contenthash].js',
		filename: development ? 'bundle.js' : 'bundle.[contenthash].js',
		path: dist
	},
	plugins,
	resolve
};
