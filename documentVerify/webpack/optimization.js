'use strict';

const define = require('./define');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const optimization = define.production
	? {
		minimizer: [
			new UglifyJsPlugin({
				cache: false
			})
		]
	}
	: {};

module.exports = optimization;
